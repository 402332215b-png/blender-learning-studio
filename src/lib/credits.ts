/**
 * 学分 —— 解锁皮肤与色彩的通行货币。
 *
 * 为什么要分两个来源：
 *   老板一句话点破了要害 ——「学会没学会都可以自己点，时间长短可以挂机」。
 *   也就是说，单纯靠用户自报的学习进度发奖励，激励的是「点按钮」而不是「学会」。
 *   所以学分刻意拆成两部分，并且在界面上**分开显示**，让用户自己看得见区别：
 *
 *     course   课程学分 —— 来自学习进度（自报，能刷，所以权重低）
 *     practice 实操学分 —— 来自 Blender 插件记录的真实操作（刷不了，权重高）
 *
 * 现在插件还没接进软件，practice 恒为 0；等桌面版打通后它会自动变成主要来源。
 */

import type { UserProgress } from '../types'
import { STORAGE_KEYS } from './storage-keys'
import {
  COLOR_UNLOCK_AT,
  isPickedSkin,
  skinUnlockAt,
  type SkinId,
} from './skins'
import { desktopBridge } from './desktop'

/** 完成一课时 */
export const CREDIT_PER_LESSON = 10
/** 标记为「已掌握」，在已完成之上额外加 */
export const CREDIT_PER_MASTERY = 5
/** 复习一次 */
export const CREDIT_PER_REVIEW = 3
/** Blender 真实动手满一分钟 */
export const CREDIT_PER_PRACTICE_MIN = 2

export interface PracticeData {
  /** 真实动手分钟数（插件按操作间隔剔除空闲后累计） */
  minutes: number
  /** 记录到的操作次数 */
  ops: number
  updatedAt?: string
}

export interface Credits {
  /** 课程学分（自报） */
  course: number
  /** 实操学分（Blender 插件，真实操作） */
  practice: number
  /** 总学分 */
  total: number
  /** 后门：全部解锁 */
  allUnlocked: boolean
}

/** 读后门开关。localStorage 不可用时一律当作关闭。 */
export function isAllUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.unlockAll) === '1'
  } catch {
    return false
  }
}

export function setAllUnlocked(on: boolean): void {
  try {
    if (on) localStorage.setItem(STORAGE_KEYS.unlockAll, '1')
    else localStorage.removeItem(STORAGE_KEYS.unlockAll)
  } catch {
    /* 忽略：隐私模式下写不进去也不该崩 */
  }
}

/** 读 Blender 实操数据。没有（网页版 / 没装插件）就是 0。 */
export function readPractice(): PracticeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.practice)
    if (!raw) return { minutes: 0, ops: 0 }
    const parsed = JSON.parse(raw) as Partial<PracticeData>
    return {
      minutes: Number(parsed.minutes) || 0,
      ops: Number(parsed.ops) || 0,
      updatedAt: parsed.updatedAt,
    }
  } catch {
    return { minutes: 0, ops: 0 }
  }
}

/**
 * 由学习进度派生学分。
 *
 * 注意这里是**纯函数**：不读 store、不订阅状态，谁调用谁传 progress 进来。
 * 这样组件里想算就算，不会因为漏订阅而拿到过期数字。
 */
export function computeCredits(progress: Record<string, UserProgress>): Credits {
  const list = Object.values(progress)
  const done = list.filter(
    (p) => p.status === 'completed' || p.status === 'mastered',
  ).length
  const mastered = list.filter((p) => p.status === 'mastered').length
  const reviews = list.reduce((sum, p) => sum + (p.reviewCount || 0), 0)

  const course =
    done * CREDIT_PER_LESSON +
    mastered * CREDIT_PER_MASTERY +
    reviews * CREDIT_PER_REVIEW

  const practice = Math.floor(readPractice().minutes * CREDIT_PER_PRACTICE_MIN)

  return {
    course,
    practice,
    total: course + practice,
    allUnlocked: isAllUnlocked(),
  }
}

/**
 * 订阅桌面版推来的实操数据，落到 localStorage。
 *
 * 网页版（浏览器直开）没有桥接，调了直接返回空函数，不会报错。
 * 桌面版会：启动时先取一次，之后主进程每 30 秒推一次。
 *
 * @param onUpdate 数据变了要干什么（一般是让组件重渲染，好重新算学分）
 * @returns 取消订阅的函数
 */
export function startPracticeSync(onUpdate?: () => void): () => void {
  const bridge = desktopBridge()
  if (!bridge) return () => {}

  const apply = (data: { minutes?: number; ops?: number }) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.practice,
        JSON.stringify({
          minutes: Number(data?.minutes) || 0,
          ops: Number(data?.ops) || 0,
          updatedAt: new Date().toISOString(),
        }),
      )
    } catch {
      /* 隐私模式写不进去也不该崩 */
    }
    onUpdate?.()
  }

  bridge.getPractice().then(apply).catch(() => {})
  return bridge.onPractice(apply)
}

/**
 * 某套皮肤现在能不能用。
 *
 * 三条通路，任意一条成立就能用：
 *   1. 作者后门全开
 *   2. **开局自己挑的那两套** —— 永久可用，不看学分（v1.3.0 起没有赠送皮肤了）
 *   3. 学分达到门槛
 *
 * ⚠️ 不再有「默认皮肤兜底」这一条。以前留它是怕门槛表写错把人锁在门外，
 *    现在这条底线由**开局自选**承担 —— 用户手里那两套是他自己挑的，
 *    跟配置对不对无关，比写在代码里的兜底更靠得住。
 */
export function isSkinUnlocked(id: SkinId, credits: Credits): boolean {
  if (credits.allUnlocked) return true
  if (isPickedSkin(id)) return true
  const unlockAt = skinUnlockAt(id)
  if (unlockAt <= 0) return true
  return credits.total >= unlockAt
}

/** 色彩调节（色相 / 明暗）现在能不能用 —— 成长线的最后一项。 */
export function isColorUnlocked(credits: Credits): boolean {
  if (credits.allUnlocked) return true
  return credits.total >= COLOR_UNLOCK_AT
}
