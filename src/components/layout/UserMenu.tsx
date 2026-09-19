import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogIn, LogOut, RefreshCw, User as UserIcon, Settings } from 'lucide-react'
import { useAuthStore } from '../../stores'
import { auth } from '../../lib/auth'

/**
 * 侧边栏用户区
 *
 * 未登录 → 显示「未登录 / 请登录」，整块可点击 → 跳登录页
 * 已登录 → 显示昵称/邮箱，点击展开菜单（同步、设置、退出登录）
 */
export function UserMenu() {
  const { user, isAuthenticated, logout, syncStatus, lastSyncAt, syncNow } = useAuthStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // 点击外部关闭菜单
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const syncLabel =
    syncStatus === 'local'
      ? '仅本机'
      : syncStatus === 'syncing'
        ? '同步中…'
        : syncStatus === 'synced'
          ? '已同步'
          : syncStatus === 'error'
            ? '同步失败'
            : '未连接'

  // ---- 未登录：整块可点击 ----
  if (!isAuthenticated) {
    return (
      <div className="px-3 py-3 border-b border-dark-border">
        <button
          type="button"
          onClick={() => navigate('/login')}
          title="点击登录"
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-dark-elevated transition-colors cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-dark-elevated flex items-center justify-center text-sm font-medium text-blender-orange shrink-0">
            U
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-text-primary truncate">未登录</p>
            <p className="text-xs text-blender-orange truncate">请登录 →</p>
          </div>
        </button>
      </div>
    )
  }

  // ---- 已登录：可展开菜单 ----
  return (
    <div className="px-3 py-3 border-b border-dark-border relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="账号菜单"
        className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-dark-elevated transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-full bg-blender-orange flex items-center justify-center text-sm font-medium text-white shrink-0">
          {user?.displayName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-primary truncate">{user?.displayName}</p>
          <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-tertiary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 z-50 bg-dark-surface border border-dark-border rounded-lg shadow-xl overflow-hidden">
          {/* 同步状态 */}
          <div className="px-3 py-2.5 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'local'
                    ? 'bg-blue-400'
                    : syncStatus === 'synced'
                      ? 'bg-green-400'
                      : syncStatus === 'syncing'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                }`}
              />
              <span className="text-xs text-text-secondary">{syncLabel}</span>
            </div>
            {lastSyncAt && (
              <p className="text-[11px] text-text-tertiary mt-1">
                上次同步 {new Date(lastSyncAt).toLocaleString('zh-CN', { hour12: false })}
              </p>
            )}
            {auth.kind === 'local' && (
              <p className="text-[11px] text-text-tertiary mt-1 leading-relaxed">
                账号与数据保存在本机，未上传服务器
              </p>
            )}
          </div>

          <MenuItem
            icon={<RefreshCw className="w-4 h-4" />}
            label="立即同步"
            onClick={async () => {
              await syncNow()
              setOpen(false)
            }}
          />
          <MenuItem
            icon={<UserIcon className="w-4 h-4" />}
            label="个人成长"
            onClick={() => {
              navigate('/growth')
              setOpen(false)
            }}
          />
          <MenuItem
            icon={<Settings className="w-4 h-4" />}
            label="设置"
            onClick={() => {
              navigate('/settings')
              setOpen(false)
            }}
          />
          <div className="border-t border-dark-border">
            <MenuItem
              icon={<LogOut className="w-4 h-4" />}
              label="退出登录"
              danger
              onClick={async () => {
                await logout()
                setOpen(false)
                navigate('/')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
        danger
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

/** 未登录时侧边栏底部的小提示（引导登录） */
export function LoginPrompt() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  if (isAuthenticated) return null
  return (
    <button
      type="button"
      onClick={() => navigate('/login')}
      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blender-orange/10 border border-blender-orange/30 text-blender-orange text-sm hover:bg-blender-orange/20 transition-colors cursor-pointer"
    >
      <LogIn className="w-4 h-4" />
      登录以保存学习进度
    </button>
  )
}
