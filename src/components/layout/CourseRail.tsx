import { Link } from 'react-router-dom'
import { Check, Circle, Dot, Loader } from 'lucide-react'
import { useProgressStore } from '../../stores'
import { lessonsOfWeek, weekOfLesson, phaseName, courseByRoute } from '../../lib/content'
import { tr, tpl } from '../../i18n'
import type { LearningStatus } from '../../types'

/**
 * 课程列（方案 C「双栏阅读版」的核心结构）
 * ==========================================
 *
 * 用户 2026-09-20 选定「方案 C 的结构 + 方案 E 的 Apple 观感」，
 * 这一列就是方案 C 那个「左看目录、右看正文」里的**左边**。
 *
 * 为什么值得单独占一列：
 *   原来学一课时，要退回目录才能点下一课，来回跳。
 *   现在把「本周这几课」固定在左侧（sticky），
 *   一屏同时看到「我在哪一课」和「这一课讲什么」——
 *   刷进度的时候基本不用再离开当前页面。
 *
 * 三个实现细节：
 *   1. **只显示当前这一周**，不是整门课。整门课 121 课铺出来，
 *      "我在哪"反而要找半天。周是天然的分段。
 *      ⚠️ 一周的课数**不是固定值**：路线 B 每周 3 课、路线 A 每周 4 课
 *         （data/courses-*.json 实测）。所以这里一律用 `lessons.length`
 *         算，任何地方都不要写死"12 课"——「12」是 B 路线「建模」阶段
 *         4 周的总和（3 课 × 4 周），不是一周。
 *   2. **sticky 而不是 fixed**：让它跟着正文滚到顶就停住，
 *      而不是永远浮着 —— 正文很长时，用户偶尔需要整屏宽度。
 *   3. **窄屏隐藏**（lg 以下）。640px 的窗口再切出 320px 的列，
 *      正文只剩 320px，那是灾难。小屏就回到单栏。
 */

const STATUS_ICON: Record<LearningStatus, React.ReactNode> = {
  mastered: <Check className="w-3.5 h-3.5" />,
  completed: <Check className="w-3.5 h-3.5" />,
  learning: <Dot className="w-3.5 h-3.5" />,
  needs_review: <Loader className="w-3.5 h-3.5" />,
  not_started: <Circle className="w-3.5 h-3.5" />,
}

export function CourseRail({
  routeId,
  week,
  currentLessonId,
}: {
  routeId: string
  week: number
  currentLessonId: string
}) {
  const progress = useProgressStore((s) => s.progress)
  const course = courseByRoute[routeId]
  const lessons = lessonsOfWeek(routeId, week)
  const weekMeta = weekOfLesson(
    lessons.find((l) => l.lessonId === currentLessonId) ?? lessons[0],
  )

  const doneCount = lessons.filter((l) => {
    const s = progress[l.lessonId]?.status
    return s === 'completed' || s === 'mastered'
  }).length

  return (
    <aside className="hidden lg:block sticky top-8">
      <div className="rounded-2xl bg-dark-surface shadow-card p-5">
        <p className="text-3xs text-text-tertiary">
          {tpl('{name} · 第 {n} 周', {
            name: course?.routeName ?? '',
            n: week,
          })}
        </p>
        {weekMeta && (
          <p className="text-sm font-semibold text-text-primary mt-1">
            {phaseName(routeId, weekMeta.phase)}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 mb-4">
          <span className="text-3xs text-text-tertiary">
            {tpl('{a} / {b} 课', { a: doneCount, b: lessons.length })}
          </span>
          <Link
            to={`/learn/route-${routeId.toLowerCase()}`}
            className="text-3xs text-blender-orange hover:underline"
          >
            {tr('看全周安排')}
          </Link>
        </div>

        <nav className="space-y-0.5">
          {lessons.map((l) => {
            const status: LearningStatus = progress[l.lessonId]?.status ?? 'not_started'
            const active = l.lessonId === currentLessonId
            const finished = status === 'completed' || status === 'mastered'
            return (
              <Link
                key={l.lessonId}
                to={`/lessons/${l.lessonId}`}
                aria-current={active ? 'page' : undefined}
                className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
                  active
                    ? 'bg-blender-orange/15 text-blender-orange'
                    : 'text-text-secondary hover:bg-dark-elevated hover:text-text-primary'
                }`}
                style={
                  active
                    ? {
                        background: 'rgb(var(--accent) / 0.15)',
                        color: 'rgb(var(--accent))',
                        boxShadow: 'inset 0 0 0 1px rgb(var(--accent) / 0.28)',
                      }
                    : undefined
                }
              >
                <span
                  className={`mt-0.5 shrink-0 ${
                    finished ? 'text-status-completed' : 'text-text-tertiary'
                  }`}
                >
                  {STATUS_ICON[status]}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm leading-snug ${
                      active ? 'font-semibold' : ''
                    }`}
                  >
                    {l.title}
                  </span>
                  <span className="block text-3xs text-text-tertiary mt-0.5 font-mono">
                    {l.lessonId}
                  </span>
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
