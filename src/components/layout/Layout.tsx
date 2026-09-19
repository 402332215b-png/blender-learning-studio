import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />
      {/* Main content - offset by sidebar width on desktop */}
      <main className="md:ml-sidebar min-h-screen pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
