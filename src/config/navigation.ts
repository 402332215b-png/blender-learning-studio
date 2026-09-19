import {
  Home,
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

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  /** 归属的分组，用于侧边栏视觉分隔 */
  group: 'main' | 'lab' | 'me' | 'sys'
}

/**
 * 侧边栏导航 —— 对齐小程序版 8 个栏目
 *
 * 首页 / 今日学习 / 成长路线 / 复习 / 快捷键 / 知识实验室 / 实际工作 / 我的成长
 */
export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: '首页', icon: Home, group: 'main' },
  { path: '/today', label: '今日学习', icon: CalendarCheck, group: 'main' },
  { path: '/learn', label: '成长路线', icon: BookOpen, group: 'main' },
  { path: '/review', label: '复习', icon: RotateCcw, group: 'main' },
  { path: '/library/shortcuts', label: '快捷键', icon: Zap, group: 'main' },

  { path: '/labs', label: '知识实验室', icon: FlaskConical, group: 'lab' },
  { path: '/su-to-blender', label: '实际工作模块', icon: RefreshCw, group: 'lab' },

  { path: '/growth', label: '我的成长', icon: TrendingUp, group: 'me' },
  { path: '/library', label: '资源库', icon: Library, group: 'me' },

  { path: '/settings', label: '设置', icon: Settings, group: 'sys' },
]

/** 移动端底栏只放最高频的 4 个 */
export const MOBILE_NAV: NavItem[] = [
  { path: '/today', label: '今日', icon: CalendarCheck, group: 'main' },
  { path: '/learn', label: '路线', icon: BookOpen, group: 'main' },
  { path: '/library/shortcuts', label: '快捷键', icon: Zap, group: 'main' },
  { path: '/growth', label: '成长', icon: TrendingUp, group: 'me' },
]

/** 知识实验室的四个子页（供 /labs 导航页与侧边栏二级菜单共用） */
export const LAB_ITEMS: NavItem[] = [
  { path: '/materials', label: '材质实验室', icon: FlaskConical, group: 'lab' },
  { path: '/lighting', label: '灯光实验室', icon: FlaskConical, group: 'lab' },
  { path: '/camera', label: '相机实验室', icon: FlaskConical, group: 'lab' },
  { path: '/animation', label: '动画实验室', icon: FlaskConical, group: 'lab' },
]
