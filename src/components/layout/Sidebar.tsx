import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, MOBILE_NAV } from '../../config/navigation'
import { Box } from 'lucide-react'
import { UserMenu, LoginPrompt } from './UserMenu'

/** 分组标题（仅在有内容时显示） */
const GROUP_LABELS: Record<string, string> = {
  main: '学习',
  lab: '工具',
  me: '我的',
  sys: '',
}

export function Sidebar() {
  // 按分组切片，让 9 个导航项不至于挤成一坨
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {groups.map((g) => {
            const items = NAV_ITEMS.filter((i) => i.group === g)
            if (items.length === 0) return null
            const label = GROUP_LABELS[g]
            return (
              <div key={g} className="mb-3 last:mb-0">
                {label && (
                  <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-wider text-text-tertiary uppercase">
                    {label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `nav-item ${isActive ? 'nav-item-active' : ''}`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-dark-border space-y-2 shrink-0">
          <LoginPrompt />
          <p className="text-xs text-text-tertiary px-2">v0.3.0 · Phase 02</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
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
    </>
  )
}
