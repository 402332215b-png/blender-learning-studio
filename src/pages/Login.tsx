import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Box,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import { useAuthStore } from '../stores'
import { auth } from '../lib/auth'
import { tr, tpl } from '../i18n'

/**
 * 登录页（v1.0.0「欢迎引导版」）
 * ============================
 *
 * 用户 2026-09-20 的要求，原话：
 *   「点开软件或者退出需要自动跳到登录界面，然后将上边的图标和文字
 *     变大 2.5 倍差不多，设计一句欢迎学习Blender」
 *
 * 所以这一版和旧版最大的不同是**多了一个欢迎态**：
 *
 *   欢迎态   超大 Logo（156px，旧的 56px ×2.8）+「欢迎学习Blender」56px
 *            + 三个大按钮（登录 / 注册 / 验证码登录）
 *   表单态   点按钮才滑出来 —— 打开软件第一眼是"欢迎"，
 *            而不是先甩两个空输入框给用户。
 *
 * 为什么值得多这一层：用户打开一个学习工具，第一件要确认的事是
 * 「这是干什么的、我要怎么进去」，不是「我的邮箱是什么」。
 *
 * 四种进入方式（逻辑沿用旧版，一行没改）：
 *   login    邮箱 + 密码
 *   otp      邮箱验证码（免密码）
 *   register 邮箱 + 密码 + 验证码
 *   reset    忘记密码（验证码 + 新密码）
 *
 * 注册与「验证码登录」共用同一段逻辑，区别只在**要不要带密码**：
 * 服务端返回 `isExistingUser` 决定这次是登录还是注册，界面照单执行即可。
 * 这样刻意避免了「先试登录、失败再注册」那种把真实错误吞掉的做法；
 * 也避免向用户暴露「这个邮箱注册过没有」。
 *
 * ⚠️ 这个页面**不在 Layout 里面**（见 App.tsx）——
 *    它是整窗的，没有左侧栏。因为此刻导航里没有任何一项是能点的，
 *    显示一个点了就跳走的侧栏只会让人困惑。
 */
export function Login({ onDone }: { onDone?: () => void }) {
  type Mode = 'login' | 'otp' | 'register' | 'reset'

  const [stage, setStage] = useState<'welcome' | 'form'>('welcome')
  const [mode, setMode] = useState<Mode>('login')
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // 发码后拿到的凭据（reset 模式拿的是 challenge）
  const verificationRef = useRef<{ id: string; isExistingUser: boolean } | null>(null)
  const resetChallengeRef = useRef<Awaited<
    ReturnType<typeof auth.requestPasswordReset>
  >['challenge'] | null>(null)

  const { loginWithPassword, completeSignIn, isLoading, authError } = useAuthStore()
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (stage === 'form') firstFieldRef.current?.focus()
  }, [stage, mode, step])

  const err = localError || authError
  const working = busy || isLoading

  function switchMode(next: Mode) {
    setStage('form')
    setMode(next)
    setStep('form')
    setCode('')
    setLocalError(null)
    setNotice(null)
    verificationRef.current = null
    resetChallengeRef.current = null
    useAuthStore.setState({ authError: null })
  }

  /** 第 1 步：发验证码（register / otp / reset 共用） */
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    setNotice(null)

    if (!email.includes('@')) {
      setLocalError(tr('请填写正确的邮箱'))
      return
    }
    if (mode === 'register' && password.length < 6) {
      setLocalError(tr('密码至少 6 位'))
      return
    }

    setBusy(true)
    try {
      if (mode === 'reset') {
        const r = await auth.requestPasswordReset(email)
        if (!r.ok) {
          setLocalError(r.error || tr('发码失败'))
          return
        }
        resetChallengeRef.current = r.challenge ?? null
      } else {
        const r = await auth.sendOtp(email)
        if (!r.ok) {
          setLocalError(r.error || tr('发码失败'))
          return
        }
        verificationRef.current = {
          id: r.verificationId!,
          isExistingUser: !!r.isExistingUser,
        }
      }
      setStep('code')
      setNotice(
        tpl('验证码已发到 {email}，去邮箱看一下（也在垃圾邮件里找找）', { email }),
      )
    } finally {
      setBusy(false)
    }
  }

  /** 第 2 步：验码 */
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (!code.trim()) {
      setLocalError(tr('请填写收到的验证码'))
      return
    }

    setBusy(true)
    try {
      if (mode === 'reset') {
        const challenge = resetChallengeRef.current
        if (!challenge) {
          setLocalError(tr('验证信息已失效，请重新获取验证码'))
          return
        }
        const r = await challenge.updateUser({ nonce: code.trim(), password })
        if (!r.ok || !r.user) {
          setLocalError(r.error || tr('重置失败'))
          return
        }
        await completeSignIn(r.user)
        onDone?.()
        return
      }

      const v = verificationRef.current
      if (!v) {
        setLocalError(tr('验证信息已失效，请重新获取验证码'))
        return
      }
      // 已存在的用户忽略 password；新用户带着它完成注册
      const r = await auth.verifyOtp({
        verificationId: v.id,
        code: code.trim(),
        email,
        isExistingUser: v.isExistingUser,
        password: mode === 'register' ? password : undefined,
        displayName: mode === 'register' ? displayName : undefined,
      })
      if (!r.ok || !r.user) {
        setLocalError(r.error || tr('验证失败'))
        return
      }
      await completeSignIn(r.user)
      onDone?.()
    } finally {
      setBusy(false)
    }
  }

  /** 密码直登 */
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!email.includes('@')) {
      setLocalError(tr('请填写正确的邮箱'))
      return
    }
    if (!password) {
      setLocalError(tr('请填写密码'))
      return
    }
    const ok = await loginWithPassword(email, password)
    if (ok) onDone?.()
  }

  const needsCode = mode === 'otp' || mode === 'register' || mode === 'reset'

  const title =
    mode === 'login'
      ? tr('登录后继续你的学习进度')
      : mode === 'register'
        ? tr('注册一个账号，进度自动上云')
        : mode === 'otp'
          ? tr('用邮箱验证码直接登录')
          : tr('重设你的登录密码')

  const inputCls =
    'w-full px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border text-base text-text-primary placeholder:text-text-tertiary outline-none focus:border-blender-orange transition-colors'

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6 py-12">
      {stage === 'welcome' ? (
        <Welcome onPick={switchMode} />
      ) : (
        <div className="w-full max-w-lg">
          {/* 头部 —— 表单态用小一号的 Logo，把注意力让给输入框 */}
          <div className="flex flex-col items-center mb-8 relative">
            <button
              type="button"
              onClick={() => setStage('welcome')}
              className="absolute left-0 top-0 flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {tr('返回')}
            </button>
            <BrandMark size={88} />
            <h1 className="text-2xl font-bold text-text-primary mt-5 tracking-tight">
              {tr('欢迎学习Blender')}
            </h1>
            <p className="text-sm text-text-tertiary mt-2">{title}</p>
          </div>

          <div className="card !p-7">
            {/* 模式切换 */}
            <div className="flex gap-1 p-1 bg-dark-elevated rounded-xl mb-6">
              {(
                [
                  ['login', tr('登录'), LogIn],
                  ['otp', tr('验证码登录'), Mail],
                  ['register', tr('注册'), UserPlus],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchMode(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    mode === id
                      ? 'bg-dark-surface text-blender-orange shadow-card'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* 表单区 */}
            {mode === 'login' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    {tr('邮箱')}
                  </label>
                  <input
                    ref={firstFieldRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="username"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    {tr('密码')}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tr('输入密码')}
                    autoComplete="current-password"
                    className={inputCls}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-xs text-text-tertiary hover:text-blender-orange transition-colors cursor-pointer"
                  >
                    {tr('忘记密码？')}
                  </button>
                </div>

                <Messages err={err} notice={notice} />

                <button
                  type="submit"
                  disabled={working}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {working && <Loader2 className="w-4 h-4 animate-spin" />}
                  {tr('登录')}
                </button>
              </form>
            ) : needsCode && step === 'form' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    {tr('邮箱')}
                  </label>
                  <input
                    ref={firstFieldRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputCls}
                  />
                </div>

                {(mode === 'register' || mode === 'reset') && (
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      {/* 两个分支都要过 tr()（只包 false 分支会在英文界面回落中文） */}
                      {mode === 'reset' ? tr('新密码') : tr('设置密码')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={tr('至少 6 位')}
                      autoComplete="new-password"
                      className={inputCls}
                    />
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      {tr('昵称（可选）')}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={tr('例如：小张')}
                      className={inputCls}
                    />
                  </div>
                )}

                <Messages err={err} notice={notice} />

                <button
                  type="submit"
                  disabled={working}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {working && <Loader2 className="w-4 h-4 animate-spin" />}
                  {tr('发送验证码')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-elevated border border-dark-border">
                  <Mail className="w-4 h-4 text-text-tertiary shrink-0" />
                  <span className="text-sm text-text-secondary truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="ml-auto text-xs text-blender-orange shrink-0 cursor-pointer"
                  >
                    {tr('改一下')}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    {tr('邮箱验证码')}
                  </label>
                  <input
                    ref={firstFieldRef}
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={tr('6 位数字')}
                    autoComplete="one-time-code"
                    className={`${inputCls} tracking-[0.3em] text-center text-lg`}
                  />
                </div>

                <Messages err={err} notice={notice} />

                <button
                  type="submit"
                  disabled={working}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {working && <Loader2 className="w-4 h-4 animate-spin" />}
                  <KeyRound className="w-4 h-4" />
                  {/* 两个分支都要过 tr()（只包 false 分支会在英文界面回落中文） */}
                  {mode === 'reset' ? tr('重设密码并登录') : tr('验证并进入')}
                </button>

                <button
                  type="button"
                  disabled={working}
                  onClick={handleSendCode}
                  className="w-full btn btn-ghost text-sm text-center disabled:opacity-60"
                >
                  {tr('没收到？重新发送')}
                </button>
              </form>
            )}
          </div>

          {/* 隐私说明 —— 数据会上云这件事必须让用户看得见 */}
          <div className="flex items-start gap-2 mt-5 px-2">
            <ShieldCheck className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
            <p className="text-xs text-text-tertiary leading-relaxed">
              <b className="text-text-secondary">
                {tr('账号与学习进度会加密同步到云端，换电脑登录同一账号即可自动恢复。')}
              </b>
              {tr('每个账号只能看到自己的数据；登录后才能进入学习内容。')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 欢迎态
 *
 * 三个大按钮横排 —— 图标 + 主标题 + 一句说明。
 * 为什么不做成"一个登录按钮 + 一个小字注册链接"：
 * 打开软件的人里有一半是第一次来，"注册"和"登录"应该是**同等显眼**的，
 * 把它藏成灰色小字，第一次用的人会卡在登录表单里找不到注册入口。
 */
function Welcome({ onPick }: { onPick: (m: 'login' | 'otp' | 'register') => void }) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center anim-in">
      {/* 图标放大：旧的登录页 Logo 是 56px（w-14）→ 140px，正好 **2.5 倍** */}
      <BrandMark size={140} pulse />

      {/* 文字放大：旧标题 text-xl = 20px → text-5xl = 50px，也是 **2.5 倍** */}
      <h1 className="text-5xl font-bold text-text-primary tracking-tight mt-8 text-center">
        {tr('欢迎学习Blender')}
      </h1>
      <p className="text-xl text-text-secondary mt-4 text-center">
        {tr('从这里开始，把 SketchUp 的手感迁移到 Blender')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14 w-full">
        <BigChoice
          primary
          icon={<LogIn className="w-6 h-6" />}
          title={tr('登录')}
          note={tr('已有账号，接着学')}
          onClick={() => onPick('login')}
        />
        <BigChoice
          icon={<UserPlus className="w-6 h-6" />}
          title={tr('注册')}
          note={tr('邮箱验证码，30 秒搞定')}
          onClick={() => onPick('register')}
        />
        <BigChoice
          icon={<KeyRound className="w-6 h-6" />}
          title={tr('验证码登录')}
          note={tr('不记密码也能进')}
          onClick={() => onPick('otp')}
        />
      </div>

      <div className="flex items-start gap-2 mt-12 max-w-2xl">
        <ShieldCheck className="w-4 h-4 text-text-tertiary shrink-0 mt-0.5" />
        <p className="text-xs text-text-tertiary leading-relaxed">
          {tr('账号与学习进度会加密同步到云端，换电脑登录同一账号即可自动恢复。')}
          {tr('每个账号只能看到自己的数据。')}
        </p>
      </div>
    </div>
  )
}

function BigChoice({
  icon,
  title,
  note,
  onClick,
  primary,
}: {
  icon: React.ReactNode
  title: string
  note: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl px-7 py-6 transition-all duration-200 cursor-pointer border ${
        primary
          ? 'bg-blender-orange border-transparent shadow-float hover:brightness-110'
          : 'bg-dark-surface border-dark-border shadow-card hover:border-blender-orange/45 hover:-translate-y-0.5'
      }`}
      /* ⚠️ 主色是可调的（128 级色相），所以**不能写死 text-white** ——
         浅黄那几级上白字会糊掉。--accent-ink 由 theme.ts 按对比度算。 */
      style={primary ? { color: 'rgb(var(--accent-ink))' } : undefined}
    >
      <span
        className="inline-flex w-11 h-11 items-center justify-center rounded-xl mb-4"
        style={
          primary
            ? { background: 'rgb(0 0 0 / 0.16)' }
            : { background: 'rgb(var(--accent) / 0.12)', color: 'rgb(var(--accent))' }
        }
      >
        {icon}
      </span>
      <span className="block text-2xl font-semibold mb-1.5">{title}</span>
      <span className={`block text-sm ${primary ? 'opacity-85' : 'text-text-secondary'}`}>
        {note}
      </span>
    </button>
  )
}

/**
 * 品牌标记
 *
 * size 直接是像素 —— 用户要的是"顶部图标放大 2.5 倍"，
 * 拿 Tailwind 的 w-14（56px）凑不出 2.5 倍，所以这里用内联尺寸，
 * 让"放大多少"是**一眼可查的具体数字**。
 * ⚠️ 图标颜色用 currentColor 继承父元素，不写死 text-white ——
 *    主色可调，浅色相上白图标会看不见。
 */
function BrandMark({ size, pulse }: { size: number; pulse?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${pulse ? 'anim-float' : ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background:
          'linear-gradient(145deg, rgb(var(--accent-light)), rgb(var(--accent-dark)))',
        boxShadow: '0 18px 44px rgb(var(--accent) / 0.32)',
        color: 'rgb(var(--accent-ink))',
      }}
    >
      <Box style={{ width: size * 0.46, height: size * 0.46 }} />
    </div>
  )
}

function Messages({ err, notice }: { err: string | null; notice: string | null }) {
  return (
    <>
      {err && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {err}
        </div>
      )}
      {!err && notice && (
        <div className="px-4 py-3 rounded-xl bg-blender-orange/10 border border-blender-orange/30 text-xs text-blender-orange">
          {notice}
        </div>
      )}
    </>
  )
}
