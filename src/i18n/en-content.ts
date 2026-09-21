/**
 * 英文词典 —— 内容部分（合并入口）
 * ==============================
 *
 * 拆成三个文件只是为了每份都能读得动：
 *
 *   en-courses.ts    路线 / 阶段 / 周计划 / 课时（含知识点、讲义、常见错误）
 *   en-library.ts    材质 / 灯光 / 相机 / 动画实验室 + SU→Blender 工作流
 *   en-shortcuts.ts  快捷键、分步操作串、以及上面两份漏掉的零散条目
 *
 * 键都是简体中文原文，重复的键后面覆盖前面（内容一致，无所谓顺序）。
 */

import { EN_COURSES } from './en-courses'
import { EN_LIBRARY } from './en-library'
import { EN_SHORTCUTS } from './en-shortcuts'

export const EN_CONTENT: Record<string, string> = {
  ...EN_LIBRARY,
  ...EN_SHORTCUTS,
  ...EN_COURSES,
}
