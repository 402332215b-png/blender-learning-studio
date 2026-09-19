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
  STORAGE_KEYS,
  readSyncMeta,
  writeSyncMeta,
  type Credentials,
  type SyncStatus,
} from '../lib/auth'

// ============================================================================
// 认证
// ============================================================================

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  authError: string | null
  syncStatus: SyncStatus
  lastSyncAt: string | null

  setUser: (user: UserProfile | null) => void
  login: (cred: Credentials) => Promise<boolean>
  register: (cred: Credentials) => Promise<boolean>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
  syncNow: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,
  syncStatus: auth.kind === 'local' ? 'local' : 'offline',
  lastSyncAt: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (cred) => {
    set({ isLoading: true, authError: null })
    try {
      const r = await auth.login(cred)
      if (!r.ok || !r.user) {
        set({ isLoading: false, authError: r.error || '登录失败' })
        return false
      }
      set({
        user: r.user,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
        syncStatus: auth.kind === 'local' ? 'local' : 'synced',
        lastSyncAt: new Date().toISOString(),
      })
      return true
    } catch (e) {
      set({ isLoading: false, authError: '出错了：' + (e as Error).message })
      return false
    }
  },

  register: async (cred) => {
    set({ isLoading: true, authError: null })
    try {
      const r = await auth.register(cred)
      if (!r.ok || !r.user) {
        set({ isLoading: false, authError: r.error || '注册失败' })
        return false
      }
      set({
        user: r.user,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
        syncStatus: auth.kind === 'local' ? 'local' : 'synced',
        lastSyncAt: new Date().toISOString(),
      })
      return true
    } catch (e) {
      set({ isLoading: false, authError: '出错了：' + (e as Error).message })
      return false
    }
  },

  logout: async () => {
    await auth.logout()
    set({ user: null, isAuthenticated: false, authError: null })
  },

  restoreSession: async () => {
    try {
      const user = await auth.restore()
      if (user) set({ user, isAuthenticated: true })
      const meta = readSyncMeta()
      set({ lastSyncAt: meta.lastSyncAt ?? null })
    } catch {
      /* 恢复失败按未登录处理 */
    }
  },

  syncNow: async () => {
    set({ syncStatus: 'syncing' })
    try {
      const ok = await auth.push({
        user: get().user,
        progress: {},
        notes: {},
        schemaVersion: 1,
      })
      const now = new Date().toISOString()
      if (ok) {
        set({
          syncStatus: auth.kind === 'local' ? 'local' : 'synced',
          lastSyncAt: now,
        })
        writeSyncMeta({
          lastSyncAt: now,
          status: auth.kind === 'local' ? 'local' : 'synced',
        })
      } else {
        set({ syncStatus: 'error' })
        writeSyncMeta({ status: 'error' })
      }
    } catch {
      set({ syncStatus: 'error' })
    }
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
      const reviewCount =
        opts?.reviewed ? base.reviewCount + 1 : base.reviewCount

      const updated: UserProgress = {
        ...base,
        status,
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
    const progress = readJSON<Record<string, UserProgress>>(
      STORAGE_KEYS.progress,
      {},
    )
    const notes = readJSON<Record<string, Note>>(STORAGE_KEYS.notes, {})
    const favorites = readJSON<FavoriteItem[]>(FAVORITES_KEY, [])
    const sessions = readJSON<LearningSession[]>(SESSIONS_KEY, [])

    set({ progress, notes, favorites, sessions })

    // 用 auth 服务恢复会话（比直接读 user 更可靠：会校验账号是否还在）
    void useAuthStore.getState().restoreSession()
  },
}))

export type { FavoriteType }
