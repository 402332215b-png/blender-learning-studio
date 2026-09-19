import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

/** 404 —— 兜底页面，防止用户点到失效链接后看到空白 */
export function NotFound() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <p className="text-5xl font-bold text-blender-orange/30 font-mono">404</p>
        <h1 className="text-lg font-semibold text-text-primary mt-4">
          这个页面不存在
        </h1>
        <p className="text-xs text-text-tertiary mt-2 max-w-sm leading-relaxed">
          链接可能已经失效，或者地址打错了。回到首页重新找一下吧。
        </p>
        <div className="flex items-center gap-2 mt-6">
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            回到首页
          </Link>
          <button
            onClick={() => history.back()}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上一页
          </button>
        </div>
      </div>
    </div>
  )
}
