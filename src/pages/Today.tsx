import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Zap, Repeat, CalendarCheck } from 'lucide-react'
import { Card, PageHeader, ProgressBar, Metric, Tag } from '../components/ui'
import { useProgressStore } from '../stores'
import {
  allLessons,
  lessonsOf,
  routes,
  allShortcuts,
  weekOfLesson,
  phaseName,
  lessonById,
} from '../lib/content'

/**
 * 今日学习
 *
 * 结构：一个主要知识点 + 一个快捷键 + 一个短练习 + 待复习提醒。
 */
export function Today() {
  const progress = useProgressStore((s) => s.progress)
  const sessions = useProgressStore((s) => s.sessions)
  const stats = useProgressStore((s) => s.stats)()

  const doneSet = new Set(
    Object.values(progress)
      .filter((p) => p.status === 'completed' || p.status === 'mastered')
      .map((p) => p.lessonId),
  )

  // 主推：接下来该学的一课（按路线 A → B 顺序找第一个未完成）
  const main =
    lessonsOf('A').find((l) => !doneSet.has(l.lessonId)) ??
    lessonsOf('B').find((l) => !doneSet.has(l.lessonId)) ??
    allLessons[0]

  // 待复习：优先展示
  const reviewItems = Object.values(progress)
    .filter((p) => p.status === 'needs_review')
    .slice(0, 4)

  // 每日一个快捷键（按日期轮换，保证当天固定）
  const dayIndex = new Date().getDate()
  const shortcut = allShortcuts[dayIndex % allShortcuts.length]

  // 今日学习记录
  const todayStr = new Date().toDateString()
  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === todayStr,
  )

  const mainWeek = main ? weekOfLesson(main) : undefined

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="TODAY"
        title="今日学习"
        description="一个主要知识点、一个快捷键、一个短练习。每天推进一点，长期就是很大的距离。"
      />

      {/* 今日概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Metric value={todaySessions.length} label="今日学习记录" tone="on" />
        <Metric value={stats.completed} label="累计完成课时" />
        <Metric value={stats.reviewCount} label="待复习" />
        <Metric value={stats.consecutiveDays} label="连续学习天数" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 主要知识点 */}
        <Card
          className="lg:col-span-2"
          eyebrow="MAIN · 今日主课"
          title={main?.title ?? '暂无课程'}
          action={<Tag tone="accent">{main?.lessonId}</Tag>}
        >
          {main && (
            <>
              <p className="text-sm text-text-secondary leading-relaxed">
                {main.objective}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Tag>路线 {main.routeId}</Tag>
                <Tag>第 {main.week} 周</Tag>
                {mainWeek && <Tag tone="info">{phaseName(main.routeId, mainWeek.phase)}</Tag>}
                <Tag>{main.shortcut}</Tag>
              </div>
              <ProgressBar
                value={progress[main.lessonId]?.progress ?? 0}
                label="本课完成度"
              />
              <Link
                to={`/lessons/${main.lessonId}`}
                className="btn btn-primary mt-5 inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                开始学习
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </Card>

        {/* 每日快捷键 */}
        <Card
          eyebrow="SHORTCUT · 每日一记"
          title={shortcut ? `${shortcut.keys} · ${shortcut.nameCn}` : '暂无'}
        >
          {shortcut && (
            <>
              <p className="text-xs text-text-secondary leading-relaxed">
                {shortcut.function}
              </p>
              <div className="mt-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
                <p className="text-[11px] text-text-tertiary mb-1">室内设计用法</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {shortcut.interiorUse}
                </p>
              </div>
              {shortcut.suRef && shortcut.suRef !== '—（无）' && (
                <p className="text-[11px] text-text-tertiary mt-3">
                  对应 SketchUp：{shortcut.suRef}
                </p>
              )}
              <Link
                to="/shortcuts"
                className="text-xs text-blender-orange hover:text-blender-orange-light mt-4 inline-flex items-center gap-1"
              >
                快捷键中心
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          )}
        </Card>

        {/* 待复习提醒 */}
        <Card
          className="lg:col-span-2"
          eyebrow="REVIEW · 待复习"
          title={reviewItems.length > 0 ? `${reviewItems.length} 项需要复习` : '暂无待复习内容'}
          action={
            reviewItems.length > 0 ? (
              <Link
                to="/review"
                className="text-xs text-blender-orange hover:text-blender-orange-light inline-flex items-center gap-1"
              >
                全部
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : undefined
          }
        >
          {reviewItems.length === 0 ? (
            <p className="text-xs text-text-tertiary leading-relaxed">
              在课时详情页点「需要复习」，内容会集中出现在这里。
            </p>
          ) : (
            <ul className="space-y-2">
              {reviewItems.map((p) => {
                const lesson = lessonById[p.lessonId]
                return (
                  <li key={p.lessonId}>
                    <Link
                      to={`/lessons/${p.lessonId}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-dark-border bg-dark-elevated px-3 py-2 hover:border-blender-orange/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {lesson?.title ?? p.lessonId}
                        </p>
                        <p className="text-[11px] text-text-tertiary mt-0.5">
                          {p.lessonId} · 复习 {p.reviewCount} 次
                        </p>
                      </div>
                      <Repeat className="w-4 h-4 text-status-needs-review shrink-0" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* 路线快捷入口 */}
        <Card eyebrow="ROUTES · 路线" title="按计划推进">
          <ul className="space-y-3">
            {routes.map((r) => {
              const total = lessonsOf(r.id).length
              const pct = stats.routePercent(r.id, total)
              return (
                <li key={r.id}>
                  <Link
                    to={`/learn/route-${r.id.toLowerCase()}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-text-primary group-hover:text-blender-orange transition-colors">
                        路线 {r.id} · {r.name}
                      </p>
                      <span className="text-[11px] text-text-tertiary">{pct}%</span>
                    </div>
                    <ProgressBar
                      value={pct}
                      tone={r.id === 'B' ? 'blue' : 'orange'}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-border">
            <CalendarCheck className="w-4 h-4 text-text-tertiary" />
            <p className="text-[11px] text-text-tertiary">
              已坚持 {stats.totalStudyDays} 天，连续 {stats.consecutiveDays} 天
            </p>
          </div>
        </Card>
      </div>

      {/* 轻量学习入口 */}
      <div className="mt-6">
        <Card eyebrow="LIGHT MODE · 轻量学习" title="没有 Blender 的时候也能看">
          <p className="text-xs text-text-secondary leading-relaxed">
            出差、通勤或手边没有电脑时，可以从这里挑一节课，只看讲义部分。
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {allLessons
              .filter((l) => l.routeId === 'A')
              .slice(0, 6)
              .map((l) => (
                <Link
                  key={l.lessonId}
                  to={`/lessons/${l.lessonId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dark-border bg-dark-elevated px-3 py-1.5 text-[11px] text-text-secondary hover:text-blender-orange hover:border-blender-orange/50 transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  {l.title}
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
