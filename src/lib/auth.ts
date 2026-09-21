/**
 * 认证服务层（云端账号版）
 * ========================
 *
 * 从 v0.3.0 的「本机账号」升级为 **WorkBuddy 云服务账号**：
 *
 *   - 账号体系：邮箱 + 密码登录 / 邮箱验证码登录 / 邮箱验证码注册 / 忘记密码
 *   - 数据归属：服务端按 `auth.uid()` 做行级隔离，**每个人只看得见自己的进度**
 *   - 密码安全：加盐哈希与校验**全部在服务端完成**，客户端拿不到也存不了任何口令哈希
 *
 * 三个必须说清楚的点：
 *
 * 1. **不做匿名登录、不做 localStorage 假账号。** 未登录就是未登录，
 *    界面该引导登录就引导登录，不能造一个「看起来能用」的本地身份。
 * 2. **认证只在应用的发布域名上有效。** 服务端按 Origin 精确匹配，
 *    localhost / 预览域名都拿不到会话 —— 所以本地开发调试登录会有障碍，
 *    这是平台的安全设计，不是 bug。
 * 3. 会话凭据由 SDK 自己管（它写在 localStorage，且每次读取都重读、不留内存副本）。
 *    这一层不碰 token，只转发结果。
 */

import type { CloudError, CloudSession, CloudUser } from '@tencent-ai/workbuddy-cloud-sdk'
import { cloud } from './cloud'
import { STORAGE_KEYS, SCHEMA_VERSION } from './storage-keys'
import type { UserProfile } from '../types'
import { tr } from '../i18n'

export { STORAGE_KEYS, SCHEMA_VERSION }
export type { CloudError, CloudSession }

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

/** 同步状态 */
export type SyncStatus = 'syncing' | 'synced' | 'offline' | 'error'

/** 认证结果 */
export interface AuthResult {
  ok: boolean
  user?: UserProfile
  error?: string
}

/** 发码结果 */
export interface OtpSendResult {
  ok: boolean
  verificationId?: string
  /** 该邮箱是否已注册 —— 由服务端给出，客户端不猜 */
  isExistingUser?: boolean
  error?: string
}

/** 忘记密码：拿到 challenge 后用验证码换新密码 */
export interface ResetChallenge {
  updateUser: (u: { nonce: string; password: string }) => Promise<AuthResult>
}

// ---------------------------------------------------------------------------
// 错误文案
// ---------------------------------------------------------------------------

/**
 * 把 SDK 归一后的错误翻成用户能看懂的话。
 *
 * SDK 的约定是：`kind` 是稳定的编程契约，`message` 只供展示。
 * 所以这里按 `kind` 分支，不按 message 文本匹配。
 */
export function friendlyError(e: unknown): string {
  const err = e as Partial<CloudError> | undefined
  switch (err?.kind) {
    case 'network':
      return tr('网络连不上，检查一下网络再试')
    case 'unauthenticated':
      return tr('邮箱或密码不对，再试一次')
    case 'permission-denied':
      return tr('这个账号没有权限做这个操作')
    case 'invalid-request':
      return err.message || tr('填写的内容不合法')
    case 'rate-limited':
      return tr('操作太频繁了，等一分钟再试')
    case 'credits-exhausted':
      return tr('云端额度用完了，稍后再试')
    case 'backend-unavailable':
      return tr('云端服务暂时不可用，稍后再试')
    case 'not-found':
      return tr('没有找到对应的账号或数据')
    default:
      return err?.message || tr('出错了，稍后再试')
  }
}

// ---------------------------------------------------------------------------
// 档案缓存
// ---------------------------------------------------------------------------

/** 读取本机缓存的档案（同一用户才复用，避免换账号读到上一个人的偏好） */
export function readCachedProfile(id: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    if (!raw) return null
    const p = JSON.parse(raw) as UserProfile
    return p && p.id === id ? p : null
  } catch {
    return null
  }
}

/** 写入/清除本机档案缓存 */
export function cacheProfile(p: UserProfile | null): void {
  if (p) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(p))
  else localStorage.removeItem(STORAGE_KEYS.user)
}

/**
 * 云端用户 → 应用内档案。
 *
 * `currentRoute` / `currentWeek` 这些是应用自己的学习状态，云端不给，
 * 所以优先复用本机缓存（同一用户），否则给一份默认值。
 * 真正权威的档案会随「进度快照」一起从云端拉回来覆盖。
 */
export function toProfile(u: CloudUser): UserProfile {
  const email = u.email ?? ''
  const cached = readCachedProfile(u.id)
  if (cached) {
    return { ...cached, id: u.id, email: email || cached.email }
  }
  return {
    id: u.id,
    email,
    displayName: u.name || email.split('@')[0] || tr('同学'),
    currentRoute: 'B',
    currentWeek: 1,
    totalStudyDays: 0,
    consecutiveStudyDays: 0,
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** 会话 → 档案（并顺手写入缓存） */
function sessionToProfile(s: CloudSession): UserProfile {
  const p = toProfile(s.user)
  cacheProfile(p)
  return p
}

// ---------------------------------------------------------------------------
// 认证服务
// ---------------------------------------------------------------------------

export const auth = {
  /** 后端类型标记（UI 用它决定文案） */
  kind: 'cloud' as const,

  /**
   * 账号来源的显示名。
   *
   * ⚠️ 必须写成 getter，不能写成普通属性。
   *    对象字面量是在**模块加载时**求值的 —— 写成 `label: tr('云端账号')`
   *    会把当时的语言结果冻死在这个对象上，用户切语言时它不会跟着变。
   *    同一类坑在 config/navigation.ts、Sidebar.tsx、pages/Labs.tsx 都踩过。
   *    getter 每次读都重新求值，从根上避免。
   */
  get label(): string {
    return tr('云端账号')
  },

  /** 取当前会话；未登录返回 null（不是错误） */
  async getSession(): Promise<CloudSession | null> {
    try {
      const { data, error } = await cloud.auth.getSession()
      if (error || !data) return null
      return data
    } catch {
      return null
    }
  },

  /** 用已保存的会话恢复登录态 */
  async restore(): Promise<UserProfile | null> {
    const s = await this.getSession()
    if (!s) return null
    return sessionToProfile(s)
  },

  /** 邮箱 + 密码登录 */
  async signInWithPassword(email: string, password: string): Promise<AuthResult> {
    if (!normalizeEmail(email)) return { ok: false, error: tr('请填写邮箱') }
    if (!password) return { ok: false, error: tr('请填写密码') }
    try {
      const { data, error } = await cloud.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      })
      if (error) return { ok: false, error: friendlyError(error) }
      return { ok: true, user: sessionToProfile(data) }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  },

  /**
   * 发邮箱验证码。
   *
   * 注册、验证码登录、忘记密码三条路都共用它 —— 差别只在拿到
   * `isExistingUser` 之后走哪一支。刻意不猜「这个邮箱注册过没有」。
   */
  async sendOtp(email: string): Promise<OtpSendResult> {
    const mail = normalizeEmail(email)
    if (!mail || !mail.includes('@')) return { ok: false, error: tr('请填写正确的邮箱') }
    try {
      const { data, error } = await cloud.auth.sendOtp({ email: mail })
      if (error) return { ok: false, error: friendlyError(error) }
      return {
        ok: true,
        verificationId: data.verificationId,
        isExistingUser: data.isExistingUser,
      }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  },

  /**
   * 验码。
   *
   * 走登录还是注册由调用方按 `isExistingUser` 决定：
   * 已存在 → 只验码；不存在 → 同时带上密码完成注册。
   * 不做「先试登录、失败再注册」的兜底，那会把真实错误掩盖掉。
   */
  async verifyOtp(params: {
    verificationId: string
    code: string
    email: string
    isExistingUser: boolean
    password?: string
    displayName?: string
  }): Promise<AuthResult> {
    const { verificationId, code, email, isExistingUser, password, displayName } = params
    if (!code.trim()) return { ok: false, error: tr('请填写收到的验证码') }
    if (!isExistingUser && (!password || password.length < 6)) {
      return { ok: false, error: tr('密码至少 6 位') }
    }
    try {
      const { data, error } = await cloud.auth.verifyOtp({
        verificationId,
        token: code.trim(),
        email: normalizeEmail(email),
        isExistingUser,
        password: isExistingUser ? undefined : password,
      })
      if (error) return { ok: false, error: friendlyError(error) }
      const user = sessionToProfile(data)
      const name = displayName?.trim()
      if (!isExistingUser && name) {
        const namedUser = { ...user, displayName: name }
        cacheProfile(namedUser)
        return { ok: true, user: namedUser }
      }
      return { ok: true, user }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  },

  /** 忘记密码第 1 步：发码 */
  async requestPasswordReset(email: string): Promise<{ ok: boolean; challenge?: ResetChallenge; error?: string }> {
    const mail = normalizeEmail(email)
    if (!mail || !mail.includes('@')) return { ok: false, error: tr('请填写正确的邮箱') }
    try {
      const { data, error } = await cloud.auth.resetPasswordForEmail(mail)
      if (error) return { ok: false, error: friendlyError(error) }
      return {
        ok: true,
        challenge: {
          updateUser: async ({ nonce, password }) => {
            if (!password || password.length < 6) return { ok: false, error: tr('密码至少 6 位') }
            try {
              const r = await data.updateUser({ nonce: nonce.trim(), password })
              if (r.error) return { ok: false, error: friendlyError(r.error) }
              return { ok: true, user: sessionToProfile(r.data) }
            } catch (e) {
              return { ok: false, error: friendlyError(e) }
            }
          },
        },
      }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  },

  /** 已登录状态下改密码（要用旧密码校验） */
  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResult> {
    if (!newPassword || newPassword.length < 6) return { ok: false, error: tr('新密码至少 6 位') }
    try {
      const { data, error } = await cloud.auth.resetPasswordForOld({ oldPassword, newPassword })
      if (error) return { ok: false, error: friendlyError(error) }
      return { ok: true, user: sessionToProfile(data) }
    } catch (e) {
      return { ok: false, error: friendlyError(e) }
    }
  },

  /** 退出登录。**只清登录态，不删本机学习数据**，重新登录后进度还在 */
  async logout(): Promise<void> {
    try {
      await cloud.auth.signOut()
    } catch {
      /* 网络不通也要能登出 */
    }
    cacheProfile(null)
  },

  /** 订阅登录态变化（登出 / 换账号时用来重置界面） */
  onAuthStateChange(cb: (signedIn: boolean) => void): () => void {
    return cloud.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') cb(false)
      else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
        cb(true)
      }
    })
  },
}

// ---------------------------------------------------------------------------
// 同步元信息（给界面显示「上次同步时间」用）
// ---------------------------------------------------------------------------

export function readSyncMeta(): { lastSyncAt?: string; status: SyncStatus } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.syncMeta)
    if (!raw) return { status: 'offline' }
    return JSON.parse(raw)
  } catch {
    return { status: 'offline' }
  }
}

export function writeSyncMeta(meta: { lastSyncAt?: string; status: SyncStatus }): void {
  localStorage.setItem(STORAGE_KEYS.syncMeta, JSON.stringify(meta))
}
