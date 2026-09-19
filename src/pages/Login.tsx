import { useEffect, useRef, useState } from 'react'
import { Box, Loader2, LogIn, UserPlus, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../stores'
import { auth } from '../lib/auth'

/**
 * 登录 / 注册页
 *
 * 当前为「本机账号」模式（零成本、离线可用）。
 * 若以后接入云端，只需把 lib/auth.ts 里的 auth 换成 CloudAuthProvider，
 * 这个页面完全不用改。
 */
export function Login({ onClose }: { onClose?: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const { login, register, isLoading, authError } = useAuthStore()
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [mode])

  const err = localError || authError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim()) {
      setLocalError('请填写邮箱或用户名')
      return
    }
    if (!password) {
      setLocalError('请填写密码')
      return
    }
    if (mode === 'register' && password.length < 4) {
      setLocalError('密码至少 4 位')
      return
    }

    const ok =
      mode === 'login'
        ? await login({ email, password })
        : await register({ email, password, displayName })

    if (ok) onClose?.()
  }

  function switchMode(next: 'login' | 'register') {
    setMode(next)
    setLocalError(null)
    useAuthStore.setState({ authError: null })
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* 头部 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blender-orange flex items-center justify-center mb-4">
            <Box className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Blender 学习工作室</h1>
          <p className="text-sm text-text-tertiary mt-1">
            {mode === 'login' ? '登录后继续你的学习进度' : '创建一个本机账号，开始学习'}
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="card !p-6">
          {/* 模式切换 */}
          <div className="flex gap-1 p-1 bg-dark-elevated rounded-lg mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-dark-surface text-blender-orange'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <LogIn className="w-4 h-4" />
              登录
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-dark-surface text-blender-orange'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  昵称（可选）
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="例如：小张"
                  className="w-full px-3 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-blender-orange transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                邮箱 / 用户名
              </label>
              <input
                ref={firstFieldRef}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                className="w-full px-3 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-blender-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? '至少 4 位' : '输入密码'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-blender-orange transition-colors"
              />
            </div>

            {err && (
              <div className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? '登录' : '创建账号'}
            </button>
          </form>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-3 btn btn-ghost text-sm text-center"
            >
              暂不登录，先看看
            </button>
          )}
        </div>

        {/* 隐私说明 —— 这是用户很在意的点，明说 */}
        <div className="flex items-start gap-2 mt-5 px-2">
          <ShieldCheck className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
          <p className="text-xs text-text-tertiary leading-relaxed">
            {auth.kind === 'local' ? (
              <>
                当前为<b className="text-text-secondary">本机账号</b>
                模式：账号与学习数据都只保存在你这台电脑上，不会上传到任何服务器，也不需要联网。
                换电脑时数据不会自动同步。
              </>
            ) : (
              <>账号与学习数据会同步到云端服务器。</>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
