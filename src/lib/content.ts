/**
 * 内容数据访问层
 * ==============
 *
 * 把 `data/*.json` 里的内容统一在这里 import 并做类型化导出。
 * 页面只从这里取数据，不直接碰 JSON 文件 —— 以后换数据源（比如云端）
 * 只需要改这一个文件。
 *
 * ---------------------------------------------------------------------------
 * 多语言怎么接进来的
 * ---------------------------------------------------------------------------
 *
 * 课程内容是**嵌套结构**（路线 → 阶段 → 周 → 课时 → 知识点数组）。
 * 如果把 `tr()` 散布到 8 个页面的几十处渲染点，等于把「翻译」这件事
 * 复制了几十份，以后加字段还会漏。
 *
 * 所以这里做的是**在数据边界上一次性本地化**：
 *
 *   data/*.json（永远是中文原文，不动）
 *        │
 *        ├─ bundle()  按当前语言深拷贝一次并缓存
 *        │
 *        └─ live()    包一层代理，让页面照旧写 `routes.map(...)`
 *
 * 页面代码一行都不用改，`routes` / `lessonById` / `workflows` 还是原来的名字。
 * 语言切换时 `App.tsx` 会用 key 让路由树重新挂载，页面重新读一次数据。
 *
 * 为什么不每次渲染都翻译：1368 条文案 × 每次渲染 = 纯浪费。
 * 缓存按语言只失效一次，代价可以忽略。
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

import { currentLocale, tr } from '../i18n'
import { live } from './live'

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
// 本地化核心
// ---------------------------------------------------------------------------

/** 英文词典里没有的条目会原样回落中文，所以这里可以放心整树翻译 */
function locValue(v: unknown): unknown {
  if (typeof v === 'string') return tr(v)
  if (Array.isArray(v)) return v.map(locValue)
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(v as Record<string, unknown>)) {
      out[k] = locValue((v as Record<string, unknown>)[k])
    }
    return out
  }
  return v
}

interface Bundle {
  routes: Route[]
  courseFiles: CourseFile[]
  materials: MaterialItem[]
  lightingTypes: LightingType[]
  interiorScenes: InteriorScene[]
  cameraPresets: CameraPreset[]
  cameraTechniques: CameraTechnique[]
  animationCourses: AnimationCourse[]
  practiceLevels: PracticeLevel[]
  shortcutCategories: ShortcutCategory[]
  workflows: Workflow[]
}

/** 中文原文。简体下直接复用，不拷贝 —— 省掉启动时一次 300KB 的深拷贝。 */
const RAW: Bundle = {
  routes: (routesJson as { routes: Route[] }).routes,
  courseFiles: [coursesAJson as CourseFile, coursesBJson as CourseFile],
  materials: (materialsJson as { materials: MaterialItem[] }).materials,
  lightingTypes: (lightingJson as { lightingTypes: LightingType[] }).lightingTypes,
  interiorScenes: (lightingJson as { interiorScenes: InteriorScene[] }).interiorScenes,
  cameraPresets: (cameraJson as { cameraPresets: CameraPreset[] }).cameraPresets,
  cameraTechniques: (cameraJson as { cameraTechniques: CameraTechnique[] })
    .cameraTechniques,
  animationCourses: (animationJson as { animationCourses: AnimationCourse[] })
    .animationCourses,
  practiceLevels: (practiceJson as { levels: PracticeLevel[] }).levels,
  shortcutCategories: (shortcutsJson as { categories: ShortcutCategory[] }).categories,
  workflows: (suToBlenderJson as { workflows: Workflow[] }).workflows,
}

let cachedLocale: string | null = null
let cachedBundle: Bundle = RAW

/** 取当前语言的整套内容（按语言缓存一份） */
function bundle(): Bundle {
  const l = currentLocale()
  if (l === 'zh-CN') return RAW
  if (cachedLocale !== l) {
    cachedLocale = l
    cachedBundle = locValue(RAW) as Bundle
  }
  return cachedBundle
}

/**
 * 把「按语言取值」包成一个跟原对象长得一样的代理。
 *
 * 需要这层是因为模块顶层导出的常量只求值一次：
 * 语言变了，`routes` 这个引用不会变。代理每次访问属性时
 * 现取当前语言的数据，页面那边就感知不到区别。
 *
 * 实现细节见 src/lib/live.ts。
 */

// ---------------------------------------------------------------------------
// 路线与课程
// ---------------------------------------------------------------------------

export const routes: Route[] = live(() => bundle().routes)

export const courseFiles: CourseFile[] = live(() => bundle().courseFiles)

export const routeById: Record<string, Route> = live(() =>
  Object.fromEntries(bundle().routes.map((r) => [r.id, r])),
)

export const courseByRoute: Record<string, CourseFile> = live(() =>
  Object.fromEntries(bundle().courseFiles.map((c) => [c.routeId, c])),
)

/** 某条路线下的所有周 */
export function weeksOf(routeId: string): CourseWeek[] {
  return (
    bundle().courseFiles.find((c) => c.routeId === routeId)?.weeks ?? []
  )
}

/** 全部课时（两条路线合并） */
export const allLessons: Lesson[] = live(() =>
  bundle().courseFiles.flatMap((c) => c.weeks.flatMap((w) => w.lessons)),
)

export const lessonById: Record<string, Lesson> = live(() =>
  Object.fromEntries(
    bundle()
      .courseFiles.flatMap((c) => c.weeks.flatMap((w) => w.lessons))
      .map((l) => [l.lessonId, l]),
  ),
)

/** 某条路线下的所有课时 */
export function lessonsOf(routeId: string): Lesson[] {
  return bundle()
    .courseFiles.flatMap((c) => c.weeks.flatMap((w) => w.lessons))
    .filter((l) => l.routeId === routeId)
}

/** 某周下的所有课时 */
export function lessonsOfWeek(routeId: string, week: number): Lesson[] {
  return lessonsOf(routeId).filter((l) => l.week === week)
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
  const p = bundle().routes.find((r) => r.id === routeId)?.phases.find(
    (x) => x.id === phaseId,
  )
  return p?.name ?? phaseId
}

// ---------------------------------------------------------------------------
// 材质 / 灯光 / 相机 / 动画
// ---------------------------------------------------------------------------

export const materials: MaterialItem[] = live(() => bundle().materials)

export const materialCategories: string[] = live(() =>
  Array.from(new Set(bundle().materials.map((m) => m.category))),
)

export const lightingTypes: LightingType[] = live(() => bundle().lightingTypes)

export const interiorScenes: InteriorScene[] = live(() => bundle().interiorScenes)

export const cameraPresets: CameraPreset[] = live(() => bundle().cameraPresets)

export const cameraTechniques: CameraTechnique[] = live(
  () => bundle().cameraTechniques,
)

export const animationCourses: AnimationCourse[] = live(
  () => bundle().animationCourses,
)

// ---------------------------------------------------------------------------
// 练习
// ---------------------------------------------------------------------------

export const practiceLevels: PracticeLevel[] = live(() => bundle().practiceLevels)

// ---------------------------------------------------------------------------
// 快捷键
// ---------------------------------------------------------------------------

export const shortcutCategories: ShortcutCategory[] = live(
  () => bundle().shortcutCategories,
)

export const allShortcuts: Shortcut[] = live(() =>
  bundle().shortcutCategories.flatMap((c) => c.shortcuts.map((s) => ({ ...s }))),
)

/** 快捷键所属分类（反查） */
export function categoryOfShortcut(id: string): ShortcutCategory | undefined {
  return bundle().shortcutCategories.find((c) =>
    c.shortcuts.some((s) => s.id === id),
  )
}

// ---------------------------------------------------------------------------
// SU → Blender 工作流
// ---------------------------------------------------------------------------

export const workflows: Workflow[] = live(() => bundle().workflows)

// ---------------------------------------------------------------------------
// 统计信息（给首页 / 关于页展示用）
// ---------------------------------------------------------------------------
//
// 纯数字，没有中文，跟语言无关，所以走原始数据、不进 bundle。

export const contentStats = {
  routeCount: RAW.routes.length,
  weekCount: RAW.courseFiles.reduce((n, c) => n + c.weeks.length, 0),
  lessonCount: RAW.courseFiles.reduce(
    (n, c) => n + c.weeks.reduce((m, w) => m + w.lessons.length, 0),
    0,
  ),
  materialCount: RAW.materials.length,
  lightingCount: RAW.lightingTypes.length,
  cameraCount: RAW.cameraPresets.length,
  animationCount: RAW.animationCourses.length,
  practiceLevelCount: RAW.practiceLevels.length,
  practiceTaskCount: RAW.practiceLevels.reduce((n, l) => n + l.tasks.length, 0),
  shortcutCount: RAW.shortcutCategories.reduce((n, c) => n + c.shortcuts.length, 0),
  workflowCount: RAW.workflows.length,
}
