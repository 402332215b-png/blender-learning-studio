import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { tr, useLocaleStore } from './i18n'
import { Layout } from './components/layout/Layout'
import { RequireLogin } from './components/layout/RequireLogin'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkinOnboarding } from './components/ui/SkinOnboarding'
import { useAuthStore } from './stores'
import { Today } from './pages/Today'
import { Learn, RouteDetail } from './pages/Learn'
import { Lesson } from './pages/Lesson'
import { Materials, Lighting, CameraLab, Animation, LabsHome } from './pages/Labs'
import { Shortcuts, Practice } from './pages/Practice'
import { SuToBlender, LibraryHome } from './pages/Workflow'
import { Review, Growth } from './pages/Growth'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'

/**
 * 未登录时的内页保护。
 *
 * v1.0.0 起行为变了：**不再显示「请先登录」占位页，而是直接跳登录页**
 * （用户原话：「点开软件或者退出需要自动跳到登录界面」）。
 * 会把用户原本要去的地址记下来，登录完送回去。
 * 实现见 components/layout/RequireLogin.tsx。
 */
const guarded = (el: React.ReactNode) => <RequireLogin>{el}</RequireLogin>

/** 登录成功后的落点 */
function useAfterLogin() {
  const location = useLocation()
  const navigate = useNavigate()
  return () => {
    const from = (location.state as { from?: string } | null)?.from
    navigate(from && from !== '/login' ? from : '/growth', { replace: true })
  }
}

/** 登录页包装：登录成功后回到「用户原本想去的那一页」 */
function LoginRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authReady = useAuthStore((s) => s.authReady)
  const after = useAfterLogin()

  // 已经登录了还跑到登录页（比如手敲地址），直接送进去，别让人再登一次
  if (authReady && isAuthenticated) return <Navigate to="/growth" replace />

  return <Login onDone={after} />
}

/**
 * 根路径 `/` 现在的角色：**跳转入口**
 *
 * ⚠️ 这个路由**必须存在**，不能因为「首页并进我的成长了」就整条删掉。
 *    原因：登录门（RequireLogin）把未登录用户全部弹到 `/login`，
 *    而 `/login` 自己不能再弹自己 —— 所以才需要一条「谁都能进、
 *    进去之后按状态分流」的路由。删掉它就等于未登录用户无处可去，死锁。
 *
 * 另外它还兜住了老书签和外部的旧链接（`/` 是最容易被记住的地址）。
 *
 * 分流：
 *   已登录   → /growth（原来的首页内容已经并进「我的成长」）
 *   未登录   → /login
 *   判定中   → 中性过渡态（不闪、不误导）
 */
function HomeRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authReady = useAuthStore((s) => s.authReady)

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg px-6">
        <p className="text-sm text-text-tertiary">{tr('正在恢复登录状态…')}</p>
      </div>
    )
  }

  return isAuthenticated ? (
    <Navigate to="/growth" replace />
  ) : (
    <Navigate to="/login" replace />
  )
}

/**
 * 路由表
 *
 * v1.0.0 的两处结构调整（用户 2026-09-20 决定）：
 *
 *   1. **「首页」并入「我的成长」** —— 原来两页有 4 个板块是真重复的
 *      （核心指标 / 路线进度 / 最近学习流水 / 待复习），口径还打架。
 *      现在合并成一个页面，导航从 10 项变 9 项。
 *      `/` 保留为跳转入口（见 HomeRedirect 上方说明）。
 *
 *   2. **`/login` 移出 Layout** —— 登录页现在是整窗的欢迎屏，
 *      不带左侧栏。此刻导航里没有一项是能用的，显示一个点了就跳走的
 *      侧栏只会让人困惑。
 *
 * 未登录时：`/` → `/login`；任何内页 → 也弹到 `/login`（RequireLogin），
 * 但会记住原本想去哪，登录完送回去。
 */
export default function App() {
  // 语言一变就让整棵路由树重新挂载。
  // 课程数据是模块级常量，页面只在挂载时读一次；
  // 用 key 强制重挂载是最省事也最不容易出错的做法
  // （进设置改语言本来就会离开当前页面，重挂载的代价看不出来）。
  const locale = useLocaleStore((s) => s.locale)

  return (
    /*
     * ErrorBoundary 包在 Routes **外面**，不是逐页包：
     * 一次兜住所有页面，也兜住 Layout 本身 —— 白屏最可能的来源是
     * 「本机存的数据形状不对」这类全局问题，按页包只会漏掉侧栏那半边。
     * 理由与实测过程见 components/ErrorBoundary.tsx 的文件头。
     */
    <ErrorBoundary>
      {/*
        开局挑皮肤：没挑过就盖在最上面，挑满两套才放人进去。
        挂在 Routes **外面**，所以在哪一页都会挡住 —— 它是"第一次用软件"
        的第一步，不该依赖用户当时站在哪个路由上。
      */}
      <SkinOnboarding />
      <Routes key={locale}>
        {/* 登录页独立在最外层：整窗、无侧栏 */}
        <Route path="/login" element={<LoginRoute />} />

        <Route element={<Layout />}>
          {/* 根路径 = 分流入口（已登录去成长页，未登录去登录页） */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/today" element={guarded(<Today />)} />

          {/* 成长路线 */}
          <Route path="/learn" element={guarded(<Learn />)} />
          <Route path="/learn/route-a" element={guarded(<RouteDetail routeId="A" />)} />
          <Route path="/learn/route-b" element={guarded(<RouteDetail routeId="B" />)} />
          <Route path="/lessons/:lessonId" element={guarded(<Lesson />)} />

          {/* 复习 */}
          <Route path="/review" element={guarded(<Review />)} />

          {/* 快捷键 / 练习 */}
          <Route path="/library/shortcuts" element={guarded(<Shortcuts />)} />
          <Route path="/shortcuts" element={guarded(<Shortcuts />)} />
          <Route path="/practice" element={guarded(<Practice />)} />

          {/* 知识实验室 */}
          <Route path="/labs" element={guarded(<LabsHome />)} />
          <Route path="/materials" element={guarded(<Materials />)} />
          <Route path="/lighting" element={guarded(<Lighting />)} />
          <Route path="/camera" element={guarded(<CameraLab />)} />
          <Route path="/animation" element={guarded(<Animation />)} />

          {/* 实际工作 / 资源库 */}
          <Route path="/su-to-blender" element={guarded(<SuToBlender />)} />
          <Route path="/library" element={guarded(<LibraryHome />)} />

          {/* 我的成长（吸收原「首页」的全部内容） */}
          <Route path="/growth" element={guarded(<Growth />)} />

          {/* 账号与设置 */}
          <Route path="/settings" element={guarded(<Settings />)} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
