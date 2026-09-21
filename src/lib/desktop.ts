/**
 * 桌面版桥接。
 *
 * 为什么要这一层：
 *   线上页面是从 https://blender-learning-studio.app.workbuddy.host 加载的，
 *   浏览器里的网页**碰不到**用户电脑上的文件系统，也就没法往 Blender 的
 *   插件目录里放文件。只有桌面版（Electron）有这个能力。
 *
 *   所以「自动安装 Blender 插件」这类本地能力，必须由 Electron 主进程做完，
 *   再通过 preload 把结果递给页面。这一层就是页面侧的入口：
 *   有桥接 = 桌面版，能用本地能力；没桥接 = 浏览器直开，用不了。
 *
 * ⚠️ 这里**只定义类型与取用方式**，不实现任何本地操作 ——
 *    真正干活的代码在桌面版 main.js / preload 里。
 */

export interface AddonInstallResult {
  ok: boolean
  /** 给人看的结果说明（成功写到哪 / 失败为什么） */
  message: string
  /** 成功时插件被写到了哪个目录 */
  path?: string
  /** 检测到的 Blender 版本，比如 "5.2" */
  blenderVersion?: string
}

/** 实操数据快照（来自 Blender 插件记录的真实操作） */
export interface PracticeSnapshot {
  /** 真实动手分钟数（已剔除走开的空档） */
  minutes: number
  /** 记录到的操作次数 */
  ops: number
}

export interface DesktopBridge {
  /** 把 Blender 插件复制到本机 Blender 的插件目录并设为自动启用 */
  installBlenderAddon: () => Promise<AddonInstallResult>
  /** 读一次实操数据 */
  getPractice: () => Promise<PracticeSnapshot>
  /** 订阅实操数据变化，返回取消订阅的函数 */
  onPractice: (callback: (data: PracticeSnapshot) => void) => () => void
  /** 桌面版版本号，用于「关于」与排障 */
  appVersion?: string
}

/** 拿到桥接；浏览器直开时返回 null。 */
export function desktopBridge(): DesktopBridge | null {
  if (typeof window === 'undefined') return null
  const b = (window as unknown as { blsDesktop?: DesktopBridge }).blsDesktop
  return b && typeof b.installBlenderAddon === 'function' ? b : null
}

/** 当前是不是桌面版。 */
export function isDesktop(): boolean {
  return desktopBridge() !== null
}
