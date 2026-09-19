import { Routes, Route, useNavigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
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

/** 登录页包装：登录成功后回到首页 */
function LoginRoute() {
  const navigate = useNavigate()
  return <Login onClose={() => navigate('/', { replace: true })} />
}

/**
 * 路由表
 *
 * 结构对齐小程序版 8 个栏目：
 *   首页 / 今日学习 / 成长路线 / 复习 / 快捷键 / 知识实验室 / 实际工作 / 我的成长
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 首页 */}
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />

        {/* 成长路线 */}
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/route-a" element={<RouteDetail routeId="A" />} />
        <Route path="/learn/route-b" element={<RouteDetail routeId="B" />} />
        <Route path="/lessons/:lessonId" element={<Lesson />} />

        {/* 复习 */}
        <Route path="/review" element={<Review />} />

        {/* 快捷键 / 练习 */}
        <Route path="/library/shortcuts" element={<Shortcuts />} />
        <Route path="/shortcuts" element={<Shortcuts />} />
        <Route path="/practice" element={<Practice />} />

        {/* 知识实验室 */}
        <Route path="/labs" element={<LabsHome />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/lighting" element={<Lighting />} />
        <Route path="/camera" element={<CameraLab />} />
        <Route path="/animation" element={<Animation />} />

        {/* 实际工作 / 资源库 */}
        <Route path="/su-to-blender" element={<SuToBlender />} />
        <Route path="/library" element={<LibraryHome />} />

        {/* 我的成长 */}
        <Route path="/growth" element={<Growth />} />

        {/* 账号与设置 */}
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
