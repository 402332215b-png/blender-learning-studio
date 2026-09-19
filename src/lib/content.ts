/**
 * 内容数据访问层
 * ==============
 *
 * 把 `data/*.json` 里的内容统一在这里 import 并做类型化导出。
 * 页面只从这里取数据，不直接碰 JSON 文件 —— 以后换数据源（比如云端）
 * 只需要改这一个文件。
 */

import routesJson from '@data/routes.json'
import coursesAJson from '@data/courses-a.json'
import coursesBJson from '@data/courses-b.json'
import materialsJson from '@data/materials.json'
import lightingJson from '@data/lighting.json'
import cameraJson from '@data/camera.json'
import animationJson from '@data/animation.json'
import practiceJson from '@data/practice.json'
import shortcutsJson from '@data/shortcuts.json'
import suToBlenderJson from '@data/su-to-blender.json'

import type {
  Route,
  CourseFile,
  CourseWeek,
  Lesson,
  MaterialItem,
  LightingType,
  InteriorScene,
  CameraPreset,
  CameraTechnique,
  AnimationCourse,
  PracticeLevel,
  ShortcutCategory,
  Shortcut,
  Workflow,
} from '../types'

// ---------------------------------------------------------------------------
// 路线与课程
// ---------------------------------------------------------------------------

export const routes = (routesJson as { routes: Route[] }).routes

export const courseFiles: CourseFile[] = [
  coursesAJson as CourseFile,
  coursesBJson as CourseFile,
]

export const routeById: Record<string, Route> = Object.fromEntries(
  routes.map((r) => [r.id, r]),
)

export const courseByRoute: Record<string, CourseFile> = Object.fromEntries(
  courseFiles.map((c) => [c.routeId, c]),
)

/** 某条路线下的所有周 */
export function weeksOf(routeId: string): CourseWeek[] {
  return courseByRoute[routeId]?.weeks ?? []
}

/** 全部课时（两条路线合并） */
export const allLessons: Lesson[] = courseFiles.flatMap((c) =>
  c.weeks.flatMap((w) => w.lessons),
)

export const lessonById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((l) => [l.lessonId, l]),
)

/** 某条路线下的所有课时 */
export function lessonsOf(routeId: string): Lesson[] {
  return allLessons.filter((l) => l.routeId === routeId)
}

/** 某周下的所有课时 */
export function lessonsOfWeek(routeId: string, week: number): Lesson[] {
  return lessonById
    ? allLessons.filter((l) => l.routeId === routeId && l.week === week)
    : []
}

/** 找到某课时的所属周信息 */
export function weekOfLesson(lesson: Lesson): CourseWeek | undefined {
  return weeksOf(lesson.routeId).find((w) => w.week === lesson.week)
}

/** 某课时的上一课 / 下一课（用于详情页翻页） */
export function neighborsOf(lesson: Lesson): {
  prev?: Lesson
  next?: Lesson
} {
  const list = lessonsOf(lesson.routeId)
  const i = list.findIndex((l) => l.lessonId === lesson.lessonId)
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  }
}

/** 阶段（phase）名称查询 */
export function phaseName(routeId: string, phaseId: string): string {
  const p = routeById[routeId]?.phases.find((x) => x.id === phaseId)
  return p?.name ?? phaseId
}

// ---------------------------------------------------------------------------
// 材质 / 灯光 / 相机 / 动画
// ---------------------------------------------------------------------------

export const materials = (materialsJson as { materials: MaterialItem[] }).materials

export const materialCategories = Array.from(
  new Set(materials.map((m) => m.category)),
)

export const lightingTypes = (lightingJson as { lightingTypes: LightingType[] })
  .lightingTypes

export const interiorScenes = (lightingJson as { interiorScenes: InteriorScene[] })
  .interiorScenes

export const cameraPresets = (cameraJson as { cameraPresets: CameraPreset[] })
  .cameraPresets

export const cameraTechniques = (
  cameraJson as { cameraTechniques: CameraTechnique[] }
).cameraTechniques

export const animationCourses = (
  animationJson as { animationCourses: AnimationCourse[] }
).animationCourses

// ---------------------------------------------------------------------------
// 练习
// ---------------------------------------------------------------------------

export const practiceLevels = (practiceJson as { levels: PracticeLevel[] }).levels

// ---------------------------------------------------------------------------
// 快捷键
// ---------------------------------------------------------------------------

export const shortcutCategories = (
  shortcutsJson as { categories: ShortcutCategory[] }
).categories

export const allShortcuts: Shortcut[] = shortcutCategories.flatMap((c) =>
  c.shortcuts.map((s) => ({ ...s })),
)

/** 快捷键所属分类（反查） */
export function categoryOfShortcut(id: string): ShortcutCategory | undefined {
  return shortcutCategories.find((c) => c.shortcuts.some((s) => s.id === id))
}

// ---------------------------------------------------------------------------
// SU → Blender 工作流
// ---------------------------------------------------------------------------

export const workflows = (suToBlenderJson as { workflows: Workflow[] }).workflows

// ---------------------------------------------------------------------------
// 统计信息（给首页 / 关于页展示用）
// ---------------------------------------------------------------------------

export const contentStats = {
  routeCount: routes.length,
  weekCount: courseFiles.reduce((n, c) => n + c.weeks.length, 0),
  lessonCount: allLessons.length,
  materialCount: materials.length,
  lightingCount: lightingTypes.length,
  cameraCount: cameraPresets.length,
  animationCount: animationCourses.length,
  practiceLevelCount: practiceLevels.length,
  practiceTaskCount: practiceLevels.reduce((n, l) => n + l.tasks.length, 0),
  shortcutCount: allShortcuts.length,
  workflowCount: workflows.length,
}
