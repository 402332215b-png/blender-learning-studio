import { create } from 'zustand'
import type {
  UserProfile,
  UserProgress,
  LearningStatus,
  Note,
  FavoriteItem,
  FavoriteType,
  LearningSession,
  Lesson,
} from '../types'
import {
  auth,
  cacheProfile,
  readCachedProfile,
  STORAGE_KEYS,
  readSyncMeta,
  writeSyncMeta,
  type SyncStatus,
} from '../lib/auth'
import {
  applyLocal,
  collectLocal,
  isEmptyPayload,
  markLocalChanged,
  pullPayload,
  pushPayload,
  remoteIsNewer,
} from '../lib/sync'
import { readHue, readLight, readSkin, saveAndApply } from '../lib/theme'
import { skinById, type SkinId } from '../lib/skins'
import { tr } from '../i18n'

// ============================================================================
// 认证 + 云端同步
// ============================================================================

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  /**
   * 启动时「登录态到底恢复出来没有」是否已经**判定完成**。
   *
   * 为什么需要它：
   *   store 初始 `isAuthenticated = false`，要等 `initSync()` 里的
   *   `auth.restore()` 回来才可能变 true。在那之前 `isAuthenticated`
   *   并不代表「未登录」，只代表「还不知道」。
   *   界面如果拿它当结论，已登录用户每次开程序都会先闪一下
   *   「请先登录 / 侧边栏空白」。
   *
   * 默认取 `false`（即「尚未判定」）——**失败时偏向放行**：
   *   万一 initSync 中途抛错没走到 finally，界面按「未判定」处理，
   *   也就是照旧显示内容，而不是把用户关在登录门外面。
   */
  authReady: boolean
  authError: string | null
  syncStatus: SyncStatus
  lastSyncAt: string | null

  setUser: (user: UserProfile | null) => void
  /**
   * 改自己的档案（昵称 / 头像 / 当前路线…）。
   *
   * 为什么不能只 set 一下就完事：
   *   档案（`STORAGE_KEYS.user`）是同步快照的一部分，但快照的版本号
   *   `clientUpdatedAt` 取自 `localStamp()` —— 而它只看 progress / notes / sessions
   *   的最近时间戳。**只改昵称、不学习**的时候，这个版本号压根没动，
   *   推送会被判定成「本机不比云端新」而静默丢弃，改名永远同步不上去。
   *   所以这里必须显式 `markLocalChanged()` 把版本号顶到「现在」。
   */
  updateProfile: (patch: Partial<UserProfile>) => void
  /** 登录成功后统一入口：缓存档案 → 拉取云端进度 */
  completeSignIn: (user: UserProfile) => Promise<void>
  /** 邮箱 + 密码登录 */
  loginWithPassword: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  /** 应用启动时调用一次：恢复登录态 + 挂上自动同步 */
  initSync: () => Promise<void>
  syncNow: () => Promise<void>
}

/**
 * 自动同步的三个模块级开关。
 *
 * 放在模块作用域而不是 store 里，是因为它们**不该触发 React 重渲染**，
 * 也不该成为界面状态的一部分。
 */
let suppressAutoPush = false
let pushTimer: ReturnType<typeof setTimeout> | null = null
let listenersAttached = false

/** 本地连续操作（比如连点几节课）合并成一次推送，别把云端当靶子打 */
const PUSH_DEBOUNCE_MS = 1800

/**
 * 一次完整同步：拉云端 → 比时间戳 → 决定推还是拉。
 *
 * 冲突策略是「最后写入者获胜」，见 lib/sync.ts 的说明。
 *
 * ⚠️ 这里必须防重入：`syncNow()` 会被多个来源同时触发 ——
 *    防抖定时器、网络恢复事件、启动时的 initSync、用户手动点「立即同步」。
 *    两次 runSync 重叠时，**先发起的那次手里拿的是过期快照**，
 *    可能在后面才完成写库，把云端改回旧数据 → 另一端再拉走 → 进度看起来"跳回去"。
 *    所以同一时刻只允许一次同步在跑，后来者复用同一个 Promise。
 */
let syncInFlight: Promise<'pulled' | 'pushed' | 'offline' | 'error'> | null = null

function runSync(): Promise<'pulled' | 'pushed' | 'offline' | 'error'> {
  if (syncInFlight) return syncInFlight
  const p = doSync().finally(() => {
    if (syncInFlight === p) syncInFlight = null
  })
  syncInFlight = p
  return p
}

async function doSync(): Promise<'pulled' | 'pushed' | 'offline' | 'error'> {
  // 先确认已登录：未登录时数据库请求会以匿名身份发出，
  // 行级安全策略会把它过滤成空，读到的「空」不代表云端真没数据。
  const session = await auth.getSession()
  if (!session) return 'offline'

  const local = collectLocal()
  const remote = await pullPayload()
  if (!remote.ok) return 'offline'

  // 云端还没有这一行 —— 把本机这份推上去（老用户本机有进度，正好借此上云）
  if (remote.empty || !remote.payload) {
    const r = await pushPayload(local)
    return r.ok ? 'pushed' : 'error'
  }

  // 云端更新（或本机是全新的）→ 以云端为准
  if (remoteIsNewer(remote.payload, local) || (isEmptyPayload(local) && !isEmptyPayload(remote.payload))) {
    suppressAutoPush = true
    try {
      applyLocal(remote.payload)
      useProgressStore.getState().loadFromStorage()
      const signedInUser = useAuthStore.getState().user
      if (signedInUser) {
        const syncedProfile = readCachedProfile(signedInUser.id)
        if (syncedProfile) useAuthStore.setState({ user: syncedProfile })
      }
    } finally {
      suppressAutoPush = false
    }
    return 'pulled'
  }

  // 本机更新 → 推上去
  const r = await pushPayload(local)
  return r.ok ? 'pushed' : 'error'
}

/** 排队推送（防抖） */
function schedulePush(): void {
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushTimer = null
    void useAuthStore.getState().syncNow()
  }, PUSH_DEBOUNCE_MS)
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authReady: false,
  authError: null,
  syncStatus: 'offline',
  lastSyncAt: null,

  setUser: (user) => set({ user, isAuthenticated: !!user, authReady: true }),

  updateProfile: (patch) => {
    const current = get().user
    if (!current) return
    const next: UserProfile = { ...current, ...patch }
    cacheProfile(next) // 落本机，刷新后还在
    set({ user: next })
    markLocalChanged() // 顶高版本号，否则改名推不上去（见接口注释）
    if (get().isAuthenticated) schedulePush()
  },

  completeSignIn: async (user) => {
    cacheProfile(user)
    set({
      user,
      isAuthenticated: true,
      authReady: true,
      authError: null,
      syncStatus: 'syncing',
    })
    await get().syncNow()
  },

  loginWithPassword: async (email, password) => {
    set({ isLoading: true, authError: null })
    const r = await auth.signInWithPassword(email, password)
    if (!r.ok || !r.user) {
      set({ isLoading: false, authError: r.error || tr('登录失败') })
      return false
    }
    set({ isLoading: false })
    await get().completeSignIn(r.user)
    return true
  },

  logout: async () => {
    await auth.logout()
    // 只清登录态与同步状态；本机学习数据保留，下次登录还在
    set({
      user: null,
      isAuthenticated: false,
      authReady: true,
      authError: null,
      syncStatus: 'offline',
      lastSyncAt: null,
    })
  },

  initSync: async () => {
    // 1) 恢复登录态
    //
    // ⚠️ 无论成功、失败还是没登录，结束都必须打上 `authReady` ——
    //    否则界面会一直停在「未判定」，或者反过来拿初始的
    //    `isAuthenticated = false` 当结论（已登录用户会先闪一下
    //    「请先登录」，等 restore() 回来才跳成正常页面）。
    //    放 finally 里，保证任何路径都会打上。
    try {
      const user = await auth.restore()
      if (user) set({ user, isAuthenticated: true })
    } catch {
      /* 恢复失败按未登录处理 */
    } finally {
      set({ authReady: true })
    }

    const meta = readSyncMeta()
    set({ lastSyncAt: meta.lastSyncAt ?? null })

    // 2) 只挂一次：登录态变化（在别的标签页登出、token 失效）
    if (!listenersAttached) {
      listenersAttached = true

      auth.onAuthStateChange((signedIn) => {
        if (!signedIn) {
          set({ user: null, isAuthenticated: false, syncStatus: 'offline' })
        }
      })

      // 3) 本机数据一变就排队推送
      //
      // ⚠️ 顺序很关键：**先打时间戳，再判断要不要推**。
      //    以前是先 `if (!isAuthenticated) return` 再 `markLocalChanged()`，
      //    于是「未登录期间学的进度」时间戳一直是空的 —— 登录那一刻空串
      //    比不过云端任何时间戳，本机进度会被整份判为旧数据覆盖掉。
      //    这就是用户反馈的「已完成会自动跳回来」。
      useProgressStore.subscribe(() => {
        if (suppressAutoPush) return
        markLocalChanged()
        // 没登录就只记本地时间戳，不碰网络
        if (!get().isAuthenticated) return
        schedulePush()
      })

      // 4) 断网/恢复网络
      window.addEventListener('offline', () => set({ syncStatus: 'offline' }))
      window.addEventListener('online', () => {
        if (get().isAuthenticated) void get().syncNow()
      })
    }

    // 5) 已登录就直接同步一次
    if (get().isAuthenticated) await get().syncNow()
  },

  syncNow: async () => {
    if (!get().isAuthenticated) {
      set({ syncStatus: 'offline' })
      return
    }
    set({ syncStatus: 'syncing' })
    const outcome = await runSync()
    const now = new Date().toISOString()

    if (outcome === 'error') {
      set({ syncStatus: 'error' })
      writeSyncMeta({ status: 'error' })
      return
    }
    if (outcome === 'offline') {
      set({ syncStatus: 'offline' })
      writeSyncMeta({ status: 'offline' })
      return
    }
    set({ syncStatus: 'synced', lastSyncAt: now })
    writeSyncMeta({ lastSyncAt: now, status: 'synced' })
  },
}))

// ============================================================================
// 学习进度 / 笔记 / 收藏 / 学习记录
// ============================================================================

const SESSIONS_KEY = 'bls_sessions'
const FAVORITES_KEY = 'bls_favorites'

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/**
 * 读一个「必须是数组」的键。
 *
 * ⚠️ 为什么 readJSON 不够：JSON.parse 只保证「是合法 JSON」，
 *    **不保证形状对**。localStorage 里的值可能来自旧版本、可能被手工改过、
 *    也可能是同步回来的半成品。一旦 `bls_favorites` 读到的是对象而不是数组，
 *    页面里的 `favorites.filter(...)` 会直接抛 TypeError ——
 *    React 卸载整棵树，用户看到全白。
 *
 *    2026-09-20 验收 v1.0.0 时，本机写了一份 `{ 'B05-01': true }` 形态的
 *    favorites，精确复现了这个白屏（`r.filter is not a function`，
 *    诊断脚本 05_环境缓存/_diag_blank.js）。
 *    形状不对就**丢掉落回默认值**：宁可这一屏少显示几条收藏，
 *    也不能整片白（第二道防线见 components/ErrorBoundary.tsx）。
 */
function readArray<T>(key: string): T[] {
  const v = readJSON<unknown>(key, null)
  return Array.isArray(v) ? (v as T[]) : []
}

/** 读一个「必须是普通对象」的键（数组 / null / 数字都算形状不对） */
function readRecord<T>(key: string): Record<string, T> {
  const v = readJSON<unknown>(key, null)
  return v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, T>)
    : {}
}

function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

interface ProgressState {
  progress: Record<string, UserProgress>
  notes: Record<string, Note>
  favorites: FavoriteItem[]
  sessions: LearningSession[]

  /** 设置课时状态（同时维护完成度 / 复习次数 / 时间戳） */
  setLessonStatus: (
    lesson: Pick<Lesson, 'lessonId' | 'routeId'>,
    status: LearningStatus,
    opts?: { progress?: number; masteryScore?: number; reviewed?: boolean },
  ) => void
  /** 直接设置完成度 */
  setLessonProgress: (
    lesson: Pick<Lesson, 'lessonId' | 'routeId'>,
    progress: number,
  ) => void
  setNote: (lessonId: string, content: string) => void
  toggleFavorite: (item: FavoriteItem) => void
  isFavorite: (itemId: string) => boolean
  getLessonStatus: (lessonId: string) => LearningStatus
  getProgress: (lessonId: string) => UserProgress | undefined
  getNote: (lessonId: string) => string
  /** 待复习列表 */
  reviewList: () => UserProgress[]
  /** 完成课时统计 */
  stats: () => {
    completed: number
    mastered: number
    reviewCount: number
    totalStudyDays: number
    consecutiveDays: number
    routePercent: (routeId: string, total: number) => number
  }
  clearLearningData: () => void
  loadFromStorage: () => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: {},
  notes: {},
  favorites: [],
  sessions: [],

  setLessonStatus: (lesson, status, opts) => {
    set((state) => {
      const now = new Date().toISOString()
      const existing = state.progress[lesson.lessonId]
      const base: UserProgress = existing ?? {
        lessonId: lesson.lessonId,
        routeId: lesson.routeId,
        status: 'not_started',
        progress: 0,
        reviewCount: 0,
        masteryScore: 0,
      }

      const isDone = status === 'completed' || status === 'mastered'
      // 复习一次就 +1
      //
      // ⚠️ 这个值原来算出来了却没写进 updated，导致「复习次数」永远停在 0
      //    （课时页显示 0 次、复习页「累计复习次数」也是 0）。
      //    必须显式带上去 —— 它不在 opts 里，光靠 ...base 是带不动的。
      const reviewCount = opts?.reviewed
        ? base.reviewCount + 1
        : base.reviewCount

      const updated: UserProgress = {
        ...base,
        status,
        reviewCount,
        progress: opts?.progress ?? (isDone ? 100 : base.progress || 10),
        masteryScore:
          opts?.masteryScore ??
          (status === 'mastered' ? 100 : base.masteryScore),
        startedAt: status !== 'not_started' ? base.startedAt || now : base.startedAt,
        completedAt: isDone ? base.completedAt || now : base.completedAt,
        lastReviewedAt:
          opts?.reviewed || status === 'needs_review' ? now : base.lastReviewedAt,
        lastStudiedAt: now,
      }

      const newProgress = { ...state.progress, [lesson.lessonId]: updated }
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(newProgress))

      // 记录一条学习流水（用于成长页统计天数 / 最近记录）
      const sessions = [...state.sessions]
      sessions.unshift({
        id: `${lesson.lessonId}-${now}`,
        lessonId: lesson.lessonId,
        date: now,
        action: opts?.reviewed
          ? 'review'
          : status === 'completed' || status === 'mastered'
            ? 'complete'
            : 'start',
      })
      const trimmed = sessions.slice(0, 500)
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed))

      return { progress: newProgress, sessions: trimmed }
    })
  },

  setLessonProgress: (lesson, value) => {
    set((state) => {
      const existing = state.progress[lesson.lessonId]
      const base: UserProgress = existing ?? {
        lessonId: lesson.lessonId,
        routeId: lesson.routeId,
        status: 'not_started',
        progress: 0,
        reviewCount: 0,
        masteryScore: 0,
      }
      const status: LearningStatus =
        value >= 100 ? 'completed' : value > 0 ? 'learning' : 'not_started'
      const updated: UserProgress = {
        ...base,
        status,
        progress: value,
        startedAt: value > 0 ? base.startedAt || new Date().toISOString() : base.startedAt,
        completedAt:
          value >= 100 ? base.completedAt || new Date().toISOString() : base.completedAt,
        lastStudiedAt: new Date().toISOString(),
      }
      const newProgress = { ...state.progress, [lesson.lessonId]: updated }
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(newProgress))
      return { progress: newProgress }
    })
  },

  setNote: (lessonId, content) => {
    set((state) => {
      const note: Note = {
        lessonId,
        content,
        updatedAt: new Date().toISOString(),
      }
      const newNotes = { ...state.notes, [lessonId]: note }
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(newNotes))
      return { notes: newNotes }
    })
  },

  toggleFavorite: (item) => {
    set((state) => {
      const exists = state.favorites.some(
        (f) => f.itemId === item.itemId && f.itemType === item.itemType,
      )
      const newFavorites = exists
        ? state.favorites.filter(
            (f) => !(f.itemId === item.itemId && f.itemType === item.itemType),
          )
        : [item, ...state.favorites]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      return { favorites: newFavorites }
    })
  },

  isFavorite: (itemId) =>
    get().favorites.some((f) => f.itemId === itemId),

  getLessonStatus: (lessonId) =>
    get().progress[lessonId]?.status ?? 'not_started',

  getProgress: (lessonId) => get().progress[lessonId],

  getNote: (lessonId) => get().notes[lessonId]?.content ?? '',

  reviewList: () =>
    Object.values(get().progress).filter(
      (p) => p.status === 'needs_review',
    ),

  stats: () => {
    const { progress, sessions } = get()
    const list = Object.values(progress)
    const done = list.filter(
      (p) => p.status === 'completed' || p.status === 'mastered',
    )

    // 学习天数：按「日期」去重
    const days = Array.from(
      new Set(sessions.map((s) => todayKey(new Date(s.date)))),
    ).sort()

    // 连续天数：从今天（或最近一天）往前推
    let consecutive = 0
    if (days.length > 0) {
      const set = new Set(days)
      const cursor = new Date()
      // 若今天没学，从昨天开始算，避免显示 0
      if (!set.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
      while (set.has(todayKey(cursor))) {
        consecutive++
        cursor.setDate(cursor.getDate() - 1)
      }
    }

    return {
      completed: done.length,
      mastered: list.filter((p) => p.status === 'mastered').length,
      reviewCount: list.filter((p) => p.status === 'needs_review').length,
      totalStudyDays: days.length,
      consecutiveDays: consecutive,
      routePercent: (routeId: string, total: number) => {
        if (total <= 0) return 0
        const n = done.filter((p) => p.routeId === routeId).length
        return Math.round((n / total) * 100)
      },
    }
  },

  clearLearningData: () => {
    localStorage.removeItem(STORAGE_KEYS.progress)
    localStorage.removeItem(STORAGE_KEYS.notes)
    localStorage.removeItem(FAVORITES_KEY)
    localStorage.removeItem(SESSIONS_KEY)
    set({ progress: {}, notes: {}, favorites: [], sessions: [] })
  },

  loadFromStorage: () => {
    // ⚠️ 这里全部走 readArray / readRecord（带形状校验），不用裸 readJSON：
    //    形状不对的值会在 render 里抛错、把整个界面变成白屏，
    //    而白屏时用户连"清空数据"都点不到。详见 readArray 上方说明。
    const progress = readRecord<UserProgress>(STORAGE_KEYS.progress)
    const notes = readRecord<Note>(STORAGE_KEYS.notes)
    const favorites = readArray<FavoriteItem>(FAVORITES_KEY)
    const sessions = readArray<LearningSession>(SESSIONS_KEY)

    set({ progress, notes, favorites, sessions })
    // 注意：这里**不**发起任何认证/网络动作。
    // 登录态恢复与云端同步由 useAuthStore.initSync() 统一负责（见 main.tsx），
    // 这样「读本机数据」与「连云端」两件事互不耦合。
  },
}))

export type { FavoriteType }

// ============================================================================
// 配色（色相级 + 明暗档 + 皮肤）
// ============================================================================
//
// ⚠️ v1.0.0 起**不再有「深色 / 浅色」模式**（用户 2026-09-20 明确取消），
//    改成两个连续维度：色相 0–127 级、明暗 0–10 档。见 lib/theme.ts。
//    2026-09-20 又新增「皮肤」维度：完整视觉语言包（字体/圆角/图标
//    描边/小符号造型/渐变/毛玻璃），见 lib/skins.ts。皮肤定义"这套语言
//    长什么样"，色相/明暗定义"在这套语言里当前什么颜色、多亮"。

interface ThemeState {
  /** 色相级 0–127（每级 2.8125°） */
  hue: number
  /** 明暗档 0–10（0 = 墨黑，10 = 雪白） */
  light: number
  /** 皮肤 id */
  skin: SkinId
  setHue: (hue: number) => void
  setLight: (light: number) => void
  setSkin: (skin: SkinId) => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // 初始值直接从 localStorage 读 —— index.html 里的内联脚本已经把
  // CSS 变量写好了，这里只是让 React 状态与之对齐，不再重复写 DOM。
  // read 函数内部都带**旧版键迁移**（bls_theme / bls_accent），
  // 所以老用户升级后看到的还是原来那个颜色，不会"更新完变了个样"。
  hue: readHue(),
  light: readLight(),
  skin: readSkin(),

  setHue: (hue) => {
    saveAndApply(hue, get().light, get().skin)
    set({ hue })
  },

  setLight: (light) => {
    saveAndApply(get().hue, light, get().skin)
    set({ light })
  },

  setSkin: (skin) => {
    const preset = skinById(skin).preset
    const hue = preset?.hue ?? get().hue
    const light = preset?.light ?? get().light
    saveAndApply(hue, light, skin)
    set({ skin, hue, light })
  },
}))
