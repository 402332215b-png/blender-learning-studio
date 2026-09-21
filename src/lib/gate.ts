/**
 * 访问规则（登录门 + 解锁门）
 * ==========================
 *
 * 这里集中放「什么条件下能看什么」的判定，**只出数据、不出文案** ——
 * 文案留在视图层用 tr()/tpl() 写，否则拼出来的句子进不了词典，
 * 英文界面会掉回中文（这条在 content.ts 顶部也踩过，见那里的说明）。
 *
 * 两条规则：
 *   1. 登录门：未登录时不显示左侧导航项，内页显示「请先登录」占位页。
 *      判定直接用 useAuthStore().isAuthenticated，不在这里包一层 ——
 *      那是 store 的既有事实，包一层只会多一个可能不同步的真源。
 *   2. 解锁门：SU 工作流（/su-to-blender）要等路线 B 的「建模」阶段学完。
 *
 * 为什么门槛定在「路线 B 的建模阶段」：
 *   路线 A（SU + Blender 工作路线）的阶段是「操作与导入 / 材质 / 灯光 /
 *   效果图 / 动画与漫游 / 真实项目」，**根本没有「建模」阶段**；
 *   只有路线 B 有「建模」。所以「学完 Blender 建模的部分」只能指向 B。
 */

import { lessonsOf, routeById } from './content'
import type { LearningStatus, Lesson, UserProgress } from '../types'

/** 与 stores/index.ts 里的 isDone 判定保持一致：completed / mastered 都算学完 */
const DONE_STATUS: LearningStatus[] = ['completed', 'mastered']

/** 解锁门槛所在：路线 B 的「建模」阶段（B-P2），即第 5–8 周 */
export const UNLOCK_ROUTE_ID = 'B'
export const UNLOCK_PHASE_ID = 'B-P2'

/**
 * 门槛周次。
 *
 * 刻意**从数据里取**（routeById → B-P2.weeks），而不是写死 [5,6,7,8]：
 * 课程数据以后再拆并周次时，这里会自动跟着走，不用回来改代码。
 * 取不到就退回 [5,6,7,8]（数据坏了也不能让整个页面崩）。
 */
export function unlockWeeks(): number[] {
  const phase = routeById[UNLOCK_ROUTE_ID]?.phases?.find(
    (p) => p.id === UNLOCK_PHASE_ID,
  )
  return phase?.weeks?.length ? [...phase.weeks].sort((a, b) => a - b) : [5, 6, 7, 8]
}

/** 门槛阶段的名字（已按当前语言本地化；取自数据，避免文案和课程脱节） */
export function unlockPhaseName(): string {
  const phase = routeById[UNLOCK_ROUTE_ID]?.phases?.find(
    (p) => p.id === UNLOCK_PHASE_ID,
  )
  return phase?.name ?? '建模'
}

/** 门槛涉及的课时（路线 B 第 5–8 周的全部课时） */
export function unlockLessons(): Lesson[] {
  const weeks = unlockWeeks()
  return lessonsOf(UNLOCK_ROUTE_ID).filter((l) => weeks.includes(l.week))
}

export interface UnlockState {
  unlocked: boolean
  /** 门槛内已学完的课时数 */
  done: number
  /** 门槛内的总课时数 */
  total: number
  /** 还差几节 */
  remaining: number
}

/**
 * 算 SU 工作流的解锁状态。
 *
 * 入参传 progress 表而不是让这里去读 store，是为了让组件能自然地
 * `useProgressStore((s) => s.progress)` —— store 一变就重算，不用手动订阅。
 */
export function workflowUnlockState(
  progress: Record<string, UserProgress>,
): UnlockState {
  const list = unlockLessons()
  const total = list.length
  const done = list.filter((l) =>
    DONE_STATUS.includes(progress[l.lessonId]?.status as LearningStatus),
  ).length
  // total 为 0（数据缺失）时不锁，避免把用户永久关在门外
  return {
    unlocked: total === 0 || done >= total,
    done,
    total,
    remaining: Math.max(0, total - done),
  }
}
