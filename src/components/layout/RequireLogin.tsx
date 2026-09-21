import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import { tr } from '../../i18n'

/**
 * 内页登录门
 * ==========
 *
 * ⚠️ v1.0.0 行为变了（用户 2026-09-20 要求）：
 *    以前是「未登录 → 显示『请先登录』占位页」，
 *    现在是「未登录 → **直接跳到登录页**」。
 *    用户的原话是「点开软件或者退出需要自动跳到登录界面」——
 *    占位页还要多点一次「去登录」，是多余的一步。
 *
 * 三条边界，都不能省：
 *
 *   1. `/login` 自己**不套这层** —— 套上就永远进不去，等于死锁。
 *      （见 App.tsx 里那条路由是裸的。）
 *
 *   2. **要记住用户原本想去哪**，登录成功后送回去。
 *      否则从通知里点开一条课时链接、被弹到登录页、登完却落在成长页，
 *      用户得自己再找一遍。所以把 `pathname + search` 放进 state.from。
 *
 *   3. `authReady` 为 false（登录态**还没判定出来**）时不能判「未登录」——
 *      store 初始 `isAuthenticated = false`，要等 `initSync()` 里
 *      `auth.restore()` 回来。判定前就跳登录页，已登录用户每次开程序
 *      都会先闪一下登录页再跳回来，很难看。
 *
 *      ⚠️ 这里**不能**用 `isLoading`：它只在「点登录、正在请求」时为 true，
 *      启动恢复会话时不会被置起。
 */
export function RequireLogin({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authReady = useAuthStore((s) => s.authReady)
  const location = useLocation()

  if (isAuthenticated) return <>{children}</>

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-sm text-text-tertiary">{tr('正在恢复登录状态…')}</p>
      </div>
    )
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  )
}
