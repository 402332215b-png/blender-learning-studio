import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { tr } from '../i18n'

/**
 * 全局兜底错误边界
 * ================
 *
 * 为什么桌面版必须有这一层（不是"防御性编程"式的可有可无）：
 *
 *   这个软件是**发给别人装在电脑里的**。没有错误边界时，render 里任何一次
 *   抛错都会让 React 卸载整棵树 —— 用户看到的是一片纯色，没有任何文字、
 *   没有任何按钮，连"清空数据"都点不到。对一个交给非技术用户使用的
 *   桌面软件来说，这是最糟的失败形态：**用户既不知道发生了什么，
 *   也没有任何自救的出口**，只能重装。
 *
 *   ⚠️ 这不是假设。2026-09-20 做 v1.0.0 界面验收时，本机 localStorage 里
 *      一份形状不对的 `bls_favorites`（写成对象而不是数组）就精确触发了
 *      这个白屏：`favorites.filter is not a function` → 整棵树卸载。
 *      （诊断脚本：05_环境缓存/_diag_blank.js）
 *      数据侧的形状防护见 stores/index.ts 的 readArray / readRecord，
 *      这个组件是**第二道**：万一还有别的地方抛，至少要让人能自己走出来。
 *
 * 两个刻意的取舍：
 *
 *   1. **把错误原文显示出来**，不做"出错了"这种黑话。
 *      这是给个人用户/朋友用的工具，用户可能就是开发者本人；
 *      一句 `favorites.filter is not a function` 比一百字安抚有用。
 *
 *   2. **给一个"清空本机数据并重载"的按钮**，并写清后果。
 *      绝大多数白屏来自本机存的数据坏了，清掉即好；但清掉会丢未同步的进度，
 *      所以措辞必须说清楚，不能含糊成"修复"。
 */
interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 桌面版没有远程上报（数据主权：不上传任何用户数据），
    // 所以只能落到本机控制台，供用户或开发者按 F12 自取。
    // eslint-disable-next-line no-console
    console.error('[BLS] 界面渲染出错：', error, info?.componentStack)
  }

  /** 只清"数据"键，不碰登录会话与语言/配色偏好 */
  private clearLocalData = () => {
    try {
      for (const k of [
        'bls_progress',
        'bls_notes',
        'bls_favorites',
        'bls_sessions',
        'bls_wf_checks',
        'bls_dirty_at',
        'bls_sync_meta',
      ]) {
        localStorage.removeItem(k)
      }
    } catch {
      /* 隐私模式写不进去也不该再崩一次 */
    }
    location.reload()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-dark-bg">
        <div className="w-full max-w-xl rounded-2xl bg-dark-surface shadow-card p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-status-needs-review shrink-0" />
            <h1 className="text-xl font-semibold text-text-primary">
              {tr('界面出了点问题')}
            </h1>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mt-4">
            {tr('你的学习数据还在，没有被删除。先试「重新加载」，多数情况一次就好。')}
          </p>

          <p className="mt-4 text-3xs text-text-tertiary font-mono break-all leading-relaxed px-3 py-2.5 rounded-xl bg-dark-elevated">
            {String(error.message || error)}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="button"
              onClick={() => location.reload()}
              className="btn btn-primary text-sm inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {tr('重新加载')}
            </button>
            <button
              type="button"
              onClick={this.clearLocalData}
              className="btn btn-secondary text-sm"
            >
              {tr('清空本机数据并重载')}
            </button>
          </div>

          <p className="text-3xs text-text-tertiary leading-relaxed mt-4">
            {tr('清空只会删掉这台电脑上的学习记录，云端账号里的进度不受影响，登录后会重新拉回来。')}
            {tr('本机上没来得及同步的那部分会丢。')}
          </p>
        </div>
      </div>
    )
  }
}
