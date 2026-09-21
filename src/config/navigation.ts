import {
  CalendarCheck,
  BookOpen,
  RotateCcw,
  Zap,
  FlaskConical,
  RefreshCw,
  TrendingUp,
  Library,
  Settings,
  type LucideIcon,
} from 'lucide-react'

import { tr } from '../i18n'
import { live } from '../lib/live'

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  /** 归属的分组，用于侧边栏视觉分隔 */
  group: 'main' | 'lab' | 'me' | 'sys'
}

/**
 * 侧边栏导航
 *
 * ⚠️ v1.0.0 起**去掉了「首页」**（用户 2026-09-20 决定）。
 *
 * 为什么能去掉：首页和「我的成长」原来有 **4 个板块是真重复的**
 * （核心指标卡 / 路线进度 / 最近学习流水 / 待复习）—— 同一种数据、
 * 同一种卡片各写了一遍，而且口径还打架（首页算"待复习"，成长页算"累计天数"）。
 * 现在把这 4 块在成长页里合并、统一口径，首页独有的「现在该做什么」
 * （下一课推荐 / 继续上次 / 今日入口 / 今日快捷键）搬到成长页最上面。
 * 导航从 10 项变成 9 项。
 *
 * ⚠️ 但 `/` 这个路由**必须保留**（见 App.tsx 的 HomeRedirect）：
 *    登录门刻意只放行 `/` 与 `/login`，直接删掉会让未登录用户**无处可去**，
 *    也就是死锁。所以 `/` 现在是个跳转入口。
 *
 * label 存中文原文，对外用 live() 包一层：这样语言切换后
 * `NAV_ITEMS.map(...)` 拿到的就是译文，而调用方一行都不用改。
 */
const NAV_RAW: NavItem[] = [
  { path: '/growth', label: '我的成长', icon: TrendingUp, group: 'main' },
  { path: '/today', label: '今日学习', icon: CalendarCheck, group: 'main' },
  { path: '/learn', label: '成长路线', icon: BookOpen, group: 'main' },
  { path: '/review', label: '复习', icon: RotateCcw, group: 'main' },
  { path: '/library/shortcuts', label: '快捷键', icon: Zap, group: 'main' },

  { path: '/labs', label: '知识实验室', icon: FlaskConical, group: 'lab' },
  { path: '/su-to-blender', label: '实际工作模块', icon: RefreshCw, group: 'lab' },

  { path: '/library', label: '资源库', icon: Library, group: 'me' },

  { path: '/settings', label: '设置', icon: Settings, group: 'sys' },
]

/** 移动端底栏只放最高频的 4 个 */
const MOBILE_RAW: NavItem[] = [
  { path: '/growth', label: '成长', icon: TrendingUp, group: 'main' },
  { path: '/today', label: '今日', icon: CalendarCheck, group: 'main' },
  { path: '/learn', label: '路线', icon: BookOpen, group: 'main' },
  { path: '/library/shortcuts', label: '快捷键', icon: Zap, group: 'main' },
]

/** 知识实验室的四个子页（供 /labs 导航页与侧边栏二级菜单共用） */
const LAB_RAW: NavItem[] = [
  { path: '/materials', label: '材质实验室', icon: FlaskConical, group: 'lab' },
  { path: '/lighting', label: '灯光实验室', icon: FlaskConical, group: 'lab' },
  { path: '/camera', label: '相机实验室', icon: FlaskConical, group: 'lab' },
  { path: '/animation', label: '动画实验室', icon: FlaskConical, group: 'lab' },
]

function localized(raw: NavItem[]): NavItem[] {
  return raw.map((x) => ({ ...x, label: tr(x.label) }))
}

export const NAV_ITEMS: NavItem[] = live(() => localized(NAV_RAW))
export const MOBILE_NAV: NavItem[] = live(() => localized(MOBILE_RAW))
export const LAB_ITEMS: NavItem[] = live(() => localized(LAB_RAW))
