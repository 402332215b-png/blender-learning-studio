import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, MOBILE_NAV } from '../../config/navigation'
import { Box, Lock } from 'lucide-react'
import { UserMenu, LoginPrompt } from './UserMenu'
import { tr, tpl } from '../../i18n'
import { useAuthStore, useProgressStore } from '../../stores'
import { workflowUnlockState, unlockPhaseName, unlockWeeks } from '../../lib/gate'

/**
 * 分组标题。
 *
 * ⚠️ 这里**只能存中文原文**，翻译必须放到渲染时做。
 *
 * 原来写的是 `main: tr('学习')` —— 那会在模块加载时求值一次并把结果**冻住**：
 *   - 用户点「设置 → English」时不会重新 import 模块，侧边栏分组标题
 *     就还停在旧语言（整页只有这几处不跟着切）。
 *   - 之所以一直没被发现，是因为手动刷新页面后模块会重新求值 ——
 *     也就是说这个 bug **只在应用内切换语言时出现**，
 *     凡是"改 localStorage 再 reload"的测试方式都照不出来。
 * 这和 config/navigation.ts 里 NAV_RAW 踩的是同一个坑，改法也一致：
 * 数据层存原文，视图层翻译。
 */
const GROUP_LABELS: Record<string, string> = {
  main: '学习',
  lab: '工具',
  me: '我的',
  sys: '',
}

export function Sidebar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authReady = useAuthStore((s) => s.authReady)
  const progress = useProgressStore((s) => s.progress)

  /**
   * 未登录不显示左侧分项（用户 2026-09-19 的要求），只留 Logo + 登录入口。
   *
   * ⚠️ 这里判的是 `authReady`，**不是** `isLoading`：
   *   `isLoading` 只在「点登录、正在请求」时为 true，启动恢复会话时压根不动它。
   *   所以真正要看的信号是「登录态判定完了没有」。
   *   判定完成前照常显示导航（未判定 ≠ 未登录），否则已登录用户
   *   每次开程序都会先闪一下空侧边栏。
   */
  const showNav = isAuthenticated || !authReady

  // SU 工作流要等路线 B「建模」阶段学完才解锁（判定见 lib/gate.ts）
  const unlock = workflowUnlockState(progress)
  const weeks = unlockWeeks()
  const lockHint = tpl('完成 {phase} 阶段（第 {a}–{b} 周）解锁', {
    phase: unlockPhaseName(),
    a: weeks[0],
    b: weeks[weeks.length - 1],
  })

  // 按分组切片，让 10 个导航项不至于挤成一坨
  const groups = ['main', 'lab', 'me', 'sys'] as const

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-sidebar bg-dark-surface border-r border-dark-border flex-col z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-dark-border shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blender-orange flex items-center justify-center shrink-0">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-text-primary leading-tight">
              Blender Learning
            </h1>
            <p className="text-xs text-text-tertiary leading-tight">Studio</p>
          </div>
        </div>

        {/* User Info —— 可点击，未登录时跳转登录页 */}
        <UserMenu />

        {/* Navigation —— 未登录时整块不显示分项 */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {!showNav && (
            <p className="px-2 py-3 text-xs leading-relaxed text-text-tertiary">
              {tr('登录后显示学习内容')}
            </p>
          )}

          {showNav &&
            groups.map((g) => {
              const items = NAV_ITEMS.filter((i) => i.group === g)
              if (items.length === 0) return null
              const label = tr(GROUP_LABELS[g])
              return (
                <div key={g} className="mb-3 last:mb-0">
                  {label && (
                    <p className="px-2 mb-1.5 text-3xs font-semibold tracking-wider text-text-tertiary uppercase">
                      {label}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      // SU 工作流：未解锁时保留入口 + 挂锁标记（不隐藏、不置灰 ——
                      // 用户明确要「显示但锁住」，好知道还差什么）
                      const locked =
                        item.path === '/su-to-blender' && !unlock.unlocked
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === '/'}
                          title={locked ? lockHint : undefined}
                          className={({ isActive }) =>
                            `nav-item ${isActive ? 'nav-item-active' : ''}`
                          }
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span className="text-sm flex-1">{item.label}</span>
                          {locked && (
                            <Lock
                              className="w-3.5 h-3.5 shrink-0 text-text-tertiary"
                              aria-label={tr('未解锁')}
                            />
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-dark-border space-y-2 shrink-0">
          <LoginPrompt />
          <p className="text-xs text-text-tertiary px-2">
            {/*
              版本号**不再手写**。原来这里是一句字面量 'v0.5.0 · 三语界面 · 云端同步'，
              发 v1.0.0 时 package.json 改了、这句忘了改，界面右下角就一直在
              宣称自己是 v0.5.0 —— 而它恰好是用户判断"我装的是哪一版"的依据。
              现在版本来自 vite.config.ts 注入的 __APP_VERSION__（源头是
              package.json），只改一处就不会再对不上。
              后面那句卖点描述照旧走 tr()，三语都能翻。
            */}
            {tpl('v{ver} · 三语界面 · 云端同步', { ver: __APP_VERSION__ })}
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Nav —— 未登录同样不显示分项 */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border flex items-center justify-around z-30 pb-safe">
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-3 ${
                  isActive ? 'text-blender-orange' : 'text-text-tertiary'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  )
}
