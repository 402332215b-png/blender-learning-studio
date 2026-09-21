import { tr } from '../i18n'
import { live } from '../lib/live'

// ============================================================================
// 内容数据类型 —— 对应 data/ 目录下的 JSON 文件
// ============================================================================

// ---------------------------------------------------------------------------
// 路线 / 课程 / 课时（courses-a.json · courses-b.json · routes.json）
// ---------------------------------------------------------------------------

export interface Phase {
  id: string
  name: string
  weeks: number[]
  description: string
}

export interface Route {
  id: string
  name: string
  subtitle: string
  duration: number
  description: string
  target: string
  color: string
  workflow: string
  phases: Phase[]
  /**
   * 是否为主推路线。
   * 用户明确要求「第一优先是 Blender，其次才是结合 SU 的工作路线」，
   * 所以路线 B 为 true —— 界面据此打「主推」标记并排在前面。
   * 用数据字段而不是散落的 `id === 'B'` 判断，方便以后调整。
   */
  recommended?: boolean
}

export interface PracticeTask {
  taskId: string
  title: string
  description: string
  difficultyLevel: number
  estimatedTime: string
}

export interface Lesson {
  lessonId: string
  routeId: 'A' | 'B' | string
  week: number
  lessonNumber: string
  title: string
  englishName: string
  shortcut: string
  objective: string
  principle: string
  blenderOperations: string[]
  interiorDesignUse: string
  sketchupReference: string
  commonMistakes: string[]
  practiceTasks: PracticeTask[]
  knowledgePoints: string[]
}

export interface CourseWeek {
  week: number
  phase: string
  title: string
  objective: string
  lessons: Lesson[]
}

export interface CourseFile {
  routeId: string
  routeName: string
  weeks: CourseWeek[]
}

// ---------------------------------------------------------------------------
// 材质（materials.json）
// ---------------------------------------------------------------------------

export interface MaterialParameters {
  baseColor?: string
  roughness?: number
  metallic?: number
  ior?: number
  normal?: string
  bump?: string
  texture?: string
  uvScale?: string
  [key: string]: string | number | undefined
}

export interface MaterialItem {
  id: string
  name: string
  nameEn: string
  category: string
  description: string
  parameters: MaterialParameters
  interiorUse: string
  commonMistakes: string[]
  practiceTask: string
}

// ---------------------------------------------------------------------------
// 灯光（lighting.json）
// ---------------------------------------------------------------------------

export interface LightParameters {
  type?: string
  strength?: string
  color?: string
  angle?: string
  shadowType?: string
  notes?: string
  [key: string]: string | number | undefined
}

export interface LightingType {
  id: string
  name: string
  nameEn: string
  description: string
  parameters: LightParameters
  interiorUse: string
  commonMistakes: string[]
  practiceScene: string
  practiceTask: string
}

export interface InteriorScene {
  id: string
  name: string
  nameEn: string
  lightingSetup: string
  description: string
  tips: string
}

// ---------------------------------------------------------------------------
// 相机（camera.json）
// ---------------------------------------------------------------------------

export interface CameraPreset {
  id: string
  focalLength: string
  name: string
  nameEn: string
  sensorWidth: string
  description: string
  characteristics: string[]
  interiorUse: string
  compositionTips: string[]
  commonMistakes: string[]
  practiceTask: string
}

export interface CameraTechnique {
  id: string
  name: string
  nameEn: string
  description: string
  tips: string[]
}

// ---------------------------------------------------------------------------
// 动画（animation.json）
// ---------------------------------------------------------------------------

/** 镜头运动类型（anim-009 专用，结构与普通动画课不同） */
export interface ShotType {
  name: string
  nameEn: string
  description: string
  use: string
}

/**
 * 动画课程
 *
 * 注意：`animation.json` 里的条目**并非同构** ——
 *  - 多数条目（anim-001~008, 010）是「概念 + 操作步骤」型，
 *    字段为 concepts / operations / interiorUse / practiceTask；
 *  - anim-009「镜头运动类型」是「镜头清单」型，只有 shots。
 * 这两类都必须容忍缺省，所以除 id/name/nameEn/description 外的字段全部可选。
 */
export interface AnimationCourse {
  id: string
  name: string
  nameEn: string
  description: string
  /** 「概念 + 操作」型条目才有 */
  concepts?: string[]
  operations?: string[]
  interiorUse?: string
  /** 部分条目没有练习任务（如 anim-002~008）*/
  practiceTask?: string
  /** 「镜头清单」型条目才有（anim-009）*/
  shots?: ShotType[]
}

// ---------------------------------------------------------------------------
// 练习（practice.json）
// ---------------------------------------------------------------------------

export interface PracticeLevelTask {
  taskId: string
  title: string
  description: string
  estimatedTime: string
}

export interface PracticeLevel {
  id: string
  level: number
  name: string
  nameEn: string
  description: string
  tasks: PracticeLevelTask[]
}

// ---------------------------------------------------------------------------
// 快捷键（shortcuts.json）
// ---------------------------------------------------------------------------

export interface Shortcut {
  id: string
  nameEn: string
  nameCn: string
  keys: string
  function: string
  interiorUse: string
  suRef: string
}

export interface ShortcutCategory {
  id: string
  name: string
  nameEn: string
  shortcuts: Shortcut[]
}

// ---------------------------------------------------------------------------
// SU → Blender 工作流（su-to-blender.json）
// ---------------------------------------------------------------------------

export interface WorkflowStep {
  id: string
  name: string
  nameEn: string
  detail: string
}

export interface Workflow {
  id: string
  name: string
  nameEn: string
  description: string
  steps: WorkflowStep[]
}

// ============================================================================
// 学习进度 / 用户状态
// ============================================================================

export type LearningStatus =
  | 'not_started'
  | 'learning'
  | 'completed'
  | 'mastered'
  | 'needs_review'

export const LEARNING_STATUS_LABELS = live<Record<LearningStatus, string>>(() => ({
  not_started: tr('未开始'),
  learning: tr('学习中'),
  completed: tr('已完成'),
  mastered: tr('已掌握'),
  needs_review: tr('需要复习'),
}))

export interface UserProgress {
  lessonId: string
  routeId: string
  status: LearningStatus
  /** 完成度 0-100 */
  progress: number
  startedAt?: string
  completedAt?: string
  lastReviewedAt?: string
  lastStudiedAt?: string
  /** 复习次数 */
  reviewCount: number
  /** 掌握度 0-100 */
  masteryScore: number
}

export interface Note {
  lessonId: string
  content: string
  updatedAt: string
}

export type FavoriteType = 'lesson' | 'shortcut' | 'material' | 'lighting' | 'camera' | 'animation'

export interface FavoriteItem {
  id: string
  itemType: FavoriteType
  itemId: string
  /** 标题快照，便于在「我的成长」里直接展示 */
  title?: string
  createdAt: string
}

export interface LearningSession {
  id: string
  lessonId: string
  date: string
  action: 'start' | 'complete' | 'review'
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  currentRoute: 'A' | 'B'
  currentWeek: number
  currentLessonId?: string
  totalStudyDays: number
  consecutiveStudyDays: number
  lastStudyDate?: string
}
