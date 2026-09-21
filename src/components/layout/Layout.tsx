import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />
      {/* Main content - offset by sidebar width on desktop */}
      <main className="md:ml-sidebar min-h-screen pb-16 md:pb-0">
        {/*
          key={pathname}：换页时重播一次入场动画。

          为什么放在这里而不是每个页面自己写：页面有 19 个，
          往里加动画等于同一段代码抄 19 遍，而且以后新增页面一定会漏。
          包一层 + key 让 React 在路径变化时重建这棵子树 —— 副作用正好是
          「重新挂载 → CSS animation 从头跑一遍」，不引 framer-motion 也能做到。

          ⚠️ 代价要清楚：这会让**整个页面**重新挂载，页面内的局部 state
             （比如「哪一个 tab 展开着」）在切换路由时会丢。
             对本项目是合理的 —— 各页面本来就没有跨路由要保留的局部状态，
             而进度、笔记、收藏、勾选都在 zustand store / localStorage 里，不受影响。
        */}
        <div key={pathname} className="anim-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
