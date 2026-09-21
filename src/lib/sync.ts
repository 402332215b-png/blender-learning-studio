/**
 * 云端同步层
 * ==========
 *
 * 职责边界很清楚：
 *   - 这一层只负责「把本机这份快照 ⇄ 云端那一行」搬运，以及判断谁更新。
 *   - **它不认识 zustand store**（否则会和 stores 形成循环依赖），
 *     所以「拉回来之后怎么刷新界面」由调用方（stores）决定。
 *
 * 数据模型：**每人一行、整份快照**（不是逐条增量）。
 * 理由：学习进度本来就小（几十条记录 + 笔记 + 收藏），
 * 整份覆盖语义最简单、永远不会出现「合并出一堆幽灵记录」；
 * 代价是并发编辑同一账号时后写的赢 —— 单人学习场景完全够用。
 *
 * 冲突策略：**最后写入者获胜**（比较本地 `bls_dirty_at` 与云端 `client_updated_at`）。
 * 不做字段级合并：那需要一个真正的 CRDT，收益远小于复杂度。
 */

import { cloud, PROGRESS_TABLE } from './cloud'
import { STORAGE_KEYS, SCHEMA_VERSION } from './storage-keys'

// ---------------------------------------------------------------------------
// 快照结构
// ---------------------------------------------------------------------------

export interface SyncPayload {
  schemaVersion: number
  /** 这份快照产生的时刻（ISO），冲突比较就靠它 */
  clientUpdatedAt: string
  user: unknown
  progress: unknown
  notes: unknown
  favorites: unknown
  sessions: unknown
  /** SU → Blender 工作流勾选状态（`workflowId:stepId` -> true） */
  wfChecks: unknown
}

const LOCAL_DATA_KEYS: Array<
  keyof Pick<SyncPayload, 'progress' | 'notes' | 'favorites' | 'sessions' | 'wfChecks'>
> = ['progress', 'notes', 'favorites', 'sessions', 'wfChecks']

function readJSON(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return undefined
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

function writeJSON(key: string, value: unknown): void {
  if (value === undefined || value === null) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 配额满等情况静默跳过，不影响其它键 */
  }
}

// ---------------------------------------------------------------------------
// 本机 → 快照
// ---------------------------------------------------------------------------

/**
 * 本机快照的时间戳。
 *
 * 为什么要单独算，而不是直接读 `dirtyAt`：
 *   `dirtyAt` 是「本机数据变了」时才写的。有两种情况它会是空的 ——
 *     1) v0.3.0 及更早：那时根本没有云同步，老用户本机已有进度但没有这个键；
 *     2) 升级后还没登录过：变更标记在某些路径下没来得及写。
 *   一旦是空串，`remoteIsNewer()` 里 `'2026-…' > ''` 恒成立，
 *   于是**登录那一刻会把本机已有的进度整份判为「旧数据」并覆盖掉** ——
 *   这正是用户反馈的「已经完成的课会自动跳回来」。
 *
 * 所以这里兜底：从已有数据里挑出最近的时间戳当本机版本号。
 * 宁可判成本机较新（会让云端让位），也不能把用户本机的东西判没了。
 */
function localStamp(): string {
  const dirty = localStorage.getItem(STORAGE_KEYS.dirtyAt)
  if (dirty) return dirty

  let max = ''
  const visit = (v: unknown): void => {
    if (Array.isArray(v)) {
      v.forEach(visit)
      return
    }
    if (!v || typeof v !== 'object') return
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === 'string' && (/At$/.test(k) || k === 'date')) {
        if (val > max) max = val
      } else {
        visit(val)
      }
    }
  }
  visit(readJSON(STORAGE_KEYS.progress))
  visit(readJSON(STORAGE_KEYS.notes))
  visit(readJSON(STORAGE_KEYS.sessions))

  if (max) return max

  // 实在推不出来（本机确实是空的）→ 用纪元起点，让云端赢，这是对的
  return new Date(0).toISOString()
}

/** 打包本机当前的全部学习数据 */
export function collectLocal(): SyncPayload {
  return {
    schemaVersion: SCHEMA_VERSION,
    clientUpdatedAt: localStamp(),
    user: readJSON(STORAGE_KEYS.user) ?? null,
    progress: readJSON(STORAGE_KEYS.progress) ?? {},
    notes: readJSON(STORAGE_KEYS.notes) ?? {},
    favorites: readJSON(STORAGE_KEYS.favorites) ?? [],
    sessions: readJSON(STORAGE_KEYS.sessions) ?? [],
    wfChecks: readJSON(STORAGE_KEYS.wfChecks) ?? {},
  }
}

/** 标记「本机数据刚变了」，并返回这一刻的时间戳 */
export function markLocalChanged(): string {
  const at = new Date().toISOString()
  localStorage.setItem(STORAGE_KEYS.dirtyAt, at)
  return at
}

/*
 * 这里原本有一个 `clearLocalDirty()`（拉取云端后清掉变更标记），
 * 但它在整个项目里**一次都没被调用过** —— 而且不该被调用：
 * `applyLocal()` 会把 `dirtyAt` 对齐成云端那份的时间戳，
 * 那正是我们想要的「我现在的版本 = 云端那一版」；
 * 若再清成空串，下一次同步又会因为空串比不过云端而重复拉取。
 * 为避免后来人误用，直接删掉。
 */

// ---------------------------------------------------------------------------
// 快照 → 本机
// ---------------------------------------------------------------------------

/**
 * 把云端快照写回本机。
 *
 * `user` 只写 displayName / currentRoute 这类学习偏好，
 * **不覆盖本机档案的 id 与 email** —— 身份以当前登录会话为准。
 */
export function applyLocal(p: SyncPayload): void {
  const keyMap: Record<string, string> = {
    progress: STORAGE_KEYS.progress,
    notes: STORAGE_KEYS.notes,
    favorites: STORAGE_KEYS.favorites,
    sessions: STORAGE_KEYS.sessions,
    wfChecks: STORAGE_KEYS.wfChecks,
  }
  for (const name of LOCAL_DATA_KEYS) {
    writeJSON(keyMap[name], p[name])
  }

  if (p.user && typeof p.user === 'object') {
    const local = readJSON(STORAGE_KEYS.user) as Record<string, unknown> | undefined
    const remote = p.user as Record<string, unknown>
    if (local && local.id === remote.id) {
      // 只合并学习偏好，身份字段保持本机（本机是刚登录的那份）
      writeJSON(STORAGE_KEYS.user, {
        ...local,
        ...remote,
        id: local.id,
        email: local.email,
      })
    }
  }

  localStorage.setItem(STORAGE_KEYS.dirtyAt, p.clientUpdatedAt || new Date().toISOString())
}

// ---------------------------------------------------------------------------
// 与云端交互
// ---------------------------------------------------------------------------

export interface PushResult {
  ok: boolean
  error?: string
}

/**
 * 给进度表补一个最小显式类型。
 *
 * 为什么不直接用 SDK 的链式返回值：`createWorkBuddyCloud()` 没传 Database 泛型时，
 * 表名是运行时字符串，查询构造器推不出行类型，写库那一步会被 TS 判成 `never[]`。
 * 与其硬塞 `as any` 把类型安全整个丢掉，不如把**我们真正用到的那两个方法**
 * 的形状写清楚 —— 既过类型检查，也把「这张表长什么样」记在代码里。
 */
interface ProgressTable {
  upsert(
    row: Record<string, unknown>,
    options?: { onConflict?: string },
  ): Promise<{ error: { message: string } | null }>
  select(columns: string): {
    maybeSingle(): Promise<{
      data: { payload?: SyncPayload; client_updated_at?: string } | null
      error: { message: string } | null
    }>
  }
}

function progressTable(): ProgressTable {
  return cloud.database.from(PROGRESS_TABLE) as unknown as ProgressTable
}

/**
 * 推送快照到云端。
 *
 * 用的是 upsert + `onConflict: 'owner_id'` —— 表上有 owner_id 唯一约束，
 * 所以每人恒定一行。**刻意不传 owner_id**：它由 `DEFAULT auth.uid()` 在服务端填，
 * 行级安全策略还会校验它必须等于当前登录用户；自己传是多余的，传错会被直接拒。
 */
export async function pushPayload(p: SyncPayload): Promise<PushResult> {
  const profile = readJSON(STORAGE_KEYS.user) as { email?: string; displayName?: string } | undefined
  const row: Record<string, unknown> = {
    payload: p,
    schema_version: SCHEMA_VERSION,
    client_updated_at: p.clientUpdatedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  if (profile?.email) row.owner_email = profile.email
  if (profile?.displayName) row.owner_name = profile.displayName

  try {
    const { error } = await progressTable().upsert(row, { onConflict: 'owner_id' })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export interface PullResult {
  ok: boolean
  empty?: boolean
  payload?: SyncPayload
  error?: string
}

/**
 * 拉取云端快照。
 *
 * 不写 `owner_id` 过滤条件 —— 行级安全策略已经把可见范围限定成「自己那一行」，
 * 在 JS 里再过滤一次只是自我安慰，不构成安全边界。
 * 没登录时这里会返回空，调用方应先确保已登录。
 */
export async function pullPayload(): Promise<PullResult> {
  try {
    const { data, error } = await progressTable().select('payload, client_updated_at').maybeSingle()
    if (error) return { ok: false, error: error.message }
    if (!data) return { ok: true, empty: true }
    const payload = data.payload
    if (!payload) return { ok: true, empty: true }
    if (!payload.clientUpdatedAt) payload.clientUpdatedAt = data.client_updated_at || ''
    return { ok: true, payload }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

// ---------------------------------------------------------------------------
// 比较
// ---------------------------------------------------------------------------

/** 云端是否比本机新（时间戳都是 ISO 字符串，可直接比较） */
export function remoteIsNewer(remote: SyncPayload, local: SyncPayload): boolean {
  const r = remote.clientUpdatedAt || ''
  const l = local.clientUpdatedAt || ''
  return r > l
}

/**
 * 本机这份快照是不是「空的」（没登录过、没学过任何东西）。
 *
 * ⚠️ 只看 progress / notes / sessions，**刻意不看 favorites 和 wfChecks**。
 *    这里判「空」的用途是 `stores` 里那一句「本机全新但云端有数据 → 让云端赢」。
 *    如果把勾选状态也算进来，就会出现这种事故：
 *    新电脑上随手勾了一条操作清单 → 本机被判成「非空」→ 登录时反而把
 *    云端真正学过几个月的进度整份覆盖掉。
 *    宁可让勾选/收藏这类辅助数据跟随主体数据走，也不能让它们把主数据顶掉。
 */
export function isEmptyPayload(p: SyncPayload): boolean {
  const n = (v: unknown) =>
    v === undefined || v === null || (typeof v === 'object' && Object.keys(v as object).length === 0)
  return n(p.progress) && n(p.notes) && n(p.sessions)
}
