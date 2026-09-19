/**
 * 认证与数据同步服务层
 * ====================
 *
 * 设计目标：**本地可用，云端可插**
 *
 * - 当前实现：LocalAuthProvider —— 账号存本机，离线可用，零成本
 * - 未来扩展：CloudAuthProvider —— 只需实现同一个 AuthProvider 接口，
 *   把 API_BASE 指向你的服务器即可，界面层完全不用改。
 *
 * 为什么这么设计：
 * 账号密码 + 云端同步需要一台持续在线的服务器（有费用）。
 * 先做本地版保证软件立刻可用，同时把接口留好 —— 以后想上云时，
 * 只需要新增一个 Provider，不必重写 UI。
 */

import type { UserProfile } from '../types'

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 登录凭据 */
export interface Credentials {
  email: string
  password: string
  displayName?: string
}

/** 认证结果 */
export interface AuthResult {
  ok: boolean
  user?: UserProfile
  error?: string
}

/** 同步状态 */
export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error' | 'offline'

/**
 * 认证服务提供者接口 —— 这是「本地/云端」的统一契约。
 * 想接云同步时，实现这个接口即可。
 */
export interface AuthProvider {
  readonly kind: 'local' | 'cloud'
  readonly label: string

  /** 注册新账号 */
  register(cred: Credentials): Promise<AuthResult>
  /** 登录 */
  login(cred: Credentials): Promise<AuthResult>
  /** 退出登录 */
  logout(): Promise<void>
  /** 尝试用已保存的会话自动登录 */
  restore(): Promise<UserProfile | null>
  /** 把本地数据推到远端（本地 Provider 为空实现） */
  push(localData: SyncPayload): Promise<boolean>
  /** 从远端拉取数据（本地 Provider 为空实现） */
  pull(): Promise<SyncPayload | null>
}

/** 需要同步的数据集合 */
export interface SyncPayload {
  user: UserProfile | null
  progress: Record<string, unknown>
  notes: Record<string, unknown>
  schemaVersion: number
}

// ---------------------------------------------------------------------------
// 存储键（集中管理，避免散落各处）
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  user: 'bls_user',
  accounts: 'bls_accounts',
  session: 'bls_session',
  progress: 'bls_progress',
  notes: 'bls_notes',
  syncMeta: 'bls_sync_meta',
} as const
const SCHEMA_VERSION = 1

// ---------------------------------------------------------------------------
// 密码处理
// ---------------------------------------------------------------------------

/**
 * 口令加盐哈希（本机存储用）。
 *
 * 说明：这是**本地账号**，安全性要求与联网服务不同 —— 它只防「别人随手翻看
 * 你的本地文件」，防不住拿到整机控制权的人。真正联网的账号认证必须放到服务端，
 * 由服务端加盐哈希 + 传输加密（HTTPS）完成。
 *
 * 用 Web Crypto 的 SHA-256 + 随机盐，纯本地零依赖。
 */
async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}::${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function makeSalt(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ---------------------------------------------------------------------------
// 本地存储的账号表
// ---------------------------------------------------------------------------

interface StoredAccount {
  id: string
  email: string
  displayName: string
  salt: string
  passwordHash: string
  createdAt: string
  profile: UserProfile
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.accounts)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function writeAccounts(list: StoredAccount[]): void {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(list))
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// ---------------------------------------------------------------------------
// 本地实现
// ---------------------------------------------------------------------------

export class LocalAuthProvider implements AuthProvider {
  readonly kind = 'local' as const
  readonly label = '本机账号'

  async register({ email, password, displayName }: Credentials): Promise<AuthResult> {
    const mail = normalizeEmail(email)
    if (!mail) return { ok: false, error: '请填写邮箱或用户名' }
    if (!password || password.length < 4) return { ok: false, error: '密码至少 4 位' }

    const accounts = readAccounts()
    if (accounts.some((a) => a.email === mail)) {
      return { ok: false, error: '这个邮箱已经注册过了，直接登录吧' }
    }

    const salt = makeSalt()
    const passwordHash = await hashPassword(password, salt)
    const id = makeId()
    const name = (displayName || '').trim() || mail.split('@')[0]

    const profile: UserProfile = {
      id,
      email: mail,
      displayName: name,
      currentRoute: 'B',
      currentWeek: 1,
      totalStudyDays: 0,
      consecutiveStudyDays: 0,
    }

    accounts.push({
      id,
      email: mail,
      displayName: name,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
      profile,
    })
    writeAccounts(accounts)
    this.saveSession(id)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(profile))
    return { ok: true, user: profile }
  }

  async login({ email, password }: Credentials): Promise<AuthResult> {
    const mail = normalizeEmail(email)
    if (!mail) return { ok: false, error: '请填写邮箱或用户名' }

    const accounts = readAccounts()
    const acc = accounts.find((a) => a.email === mail)
    if (!acc) return { ok: false, error: '没有找到这个账号，可以先注册' }

    const hash = await hashPassword(password, acc.salt)
    if (hash !== acc.passwordHash) return { ok: false, error: '密码不对，再试一次' }

    this.saveSession(acc.id)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(acc.profile))
    return { ok: true, user: acc.profile }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.session)
    // 注意：退出登录**只清除登录状态**，不删学习数据 ——
    // 这样重新登录后进度还在。
  }

  async restore(): Promise<UserProfile | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.session)
      if (!raw) return null
      const { accountId } = JSON.parse(raw)
      const acc = readAccounts().find((a) => a.id === accountId)
      if (!acc) return null
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(acc.profile))
      return acc.profile
    } catch {
      return null
    }
  }

  private saveSession(accountId: string): void {
    localStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({ accountId, at: new Date().toISOString() }),
    )
  }

  /** 本地模式无需推送 */
  async push(_data: SyncPayload): Promise<boolean> {
    return true
  }

  /** 本地模式无需拉取 */
  async pull(): Promise<SyncPayload | null> {
    return null
  }
}

// ---------------------------------------------------------------------------
// 云端实现（预留骨架，等有服务器时填）
// ---------------------------------------------------------------------------

/**
 * 云端 Provider 骨架。
 *
 * 要启用云同步，只需要：
 *   1. 把 API_BASE 改成你的服务器地址
 *   2. 部署对应的接口（见下方注释里的接口约定）
 *   3. 把 services.auth 从 LocalAuthProvider 换成 new CloudAuthProvider(...)
 *
 * 接口约定（服务端需实现）：
 *   POST /api/auth/register  {email, password, displayName} → {token, user}
 *   POST /api/auth/login     {email, password}              → {token, user}
 *   POST /api/auth/logout    Header: Authorization          → {ok}
 *   GET  /api/sync/pull      Header: Authorization          → {progress, notes, ...}
 *   POST /api/sync/push      Header: Authorization, body    → {ok}
 *
 * ⚠️ 账号密码认证**必须**在服务端做哈希与校验，绝不能把哈希放在客户端。
 */
export class CloudAuthProvider implements AuthProvider {
  readonly kind = 'cloud' as const
  readonly label = '云端账号'
  private token: string | null = null

  constructor(private apiBase: string) {}

  private async call(path: string, body?: unknown): Promise<Record<string, unknown>> {
    const res = await fetch(this.apiBase.replace(/\/$/, '') + path, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  async register(cred: Credentials): Promise<AuthResult> {
    try {
      const r = await this.call('/api/auth/register', cred)
      this.token = r.token as string
      return { ok: true, user: r.user as UserProfile }
    } catch (e) {
      return { ok: false, error: '无法连接到服务器：' + (e as Error).message }
    }
  }

  async login(cred: Credentials): Promise<AuthResult> {
    try {
      const r = await this.call('/api/auth/login', { email: cred.email, password: cred.password })
      this.token = r.token as string
      return { ok: true, user: r.user as UserProfile }
    } catch (e) {
      return { ok: false, error: '无法连接到服务器：' + (e as Error).message }
    }
  }

  async logout(): Promise<void> {
    try {
      await this.call('/api/auth/logout', {})
    } catch {
      /* 忽略——本地照常登出 */
    }
    this.token = null
  }

  async restore(): Promise<UserProfile | null> {
    // 云端版可在此用 refresh token 自动续期
    return null
  }

  async push(data: SyncPayload): Promise<boolean> {
    try {
      await this.call('/api/sync/push', data)
      return true
    } catch {
      return false
    }
  }

  async pull(): Promise<SyncPayload | null> {
    try {
      return (await this.call('/api/sync/pull')) as unknown as SyncPayload
    } catch {
      return null
    }
  }
}

// ---------------------------------------------------------------------------
// 当前使用的 Provider
// ---------------------------------------------------------------------------

/**
 * 当前生效的认证服务。
 *
 * 现在：本地（零成本、离线可用）
 * 以后：把下面这行换成 `new CloudAuthProvider('https://你的服务器')` 即可，
 *       界面层完全不用动。
 */
export const auth: AuthProvider = new LocalAuthProvider()

// ---------------------------------------------------------------------------
// 同步元信息（给界面显示「上次同步时间」用）
// ---------------------------------------------------------------------------

export function readSyncMeta(): { lastSyncAt?: string; status: SyncStatus } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.syncMeta)
    if (!raw) return { status: auth.kind === 'local' ? 'local' : 'offline' }
    return JSON.parse(raw)
  } catch {
    return { status: 'local' }
  }
}

export function writeSyncMeta(meta: { lastSyncAt?: string; status: SyncStatus }): void {
  localStorage.setItem(STORAGE_KEYS.syncMeta, JSON.stringify(meta))
}

export { SCHEMA_VERSION }
