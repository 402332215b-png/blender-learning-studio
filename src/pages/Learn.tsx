import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Clock, Target } from 'lucide-react'
import { Card, PageHeader, ProgressBar, StatusBadge, Tag, BulletList } from '../components/ui'
import { useProgressStore } from '../stores'
import {
  routes,
  routeById,
  weeksOf,
  lessonsOf,
  phaseName,
  lessonById,
} from '../lib/content'
import type { Lesson } from '../types'

/** 路线总览（/learn） */
export function Learn() {
  const progress = useProgressStore((s) => s.progress)
  const stats = useProgressStore((s) => s.stats)()

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="ROADMAP"
        title="成长路线"
        description="两条路线，按你的实际情况选。路线 A 侧重「马上能用」，路线 B 侧重「系统掌握」。"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {routes.map((r) => {
          const total = lessonsOf(r.id).length
          const pct = stats.routePercent(r.id, total)
          const doneN = Object.values(progress).filter(
            (p) =>
              p.routeId === r.id &&
              (p.status === 'completed' || p.status === 'mastered'),
          ).length

          return (
            <Card
              key={r.id}
              eyebrow={`ROUTE ${r.id}`}
              title={r.name}
              action={<Tag tone={r.id === 'B' ? 'info' : 'accent'}>{r.duration} 周</Tag>}
            >
              <p className="text-xs text-blender-orange font-medium mb-2">{r.subtitle}</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {r.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Tag>共 {total} 课</Tag>
                <Tag>已完成 {doneN}</Tag>
                <Tag tone="info">{r.phases.length} 个阶段</Tag>
              </div>

              <ProgressBar value={pct} label="路线进度" tone={r.id === 'B' ? 'blue' : 'orange'} />

              <div className="mt-4 rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
                <p className="text-[11px] text-text-tertiary mb-1">
                  <Target className="w-3 h-3 inline mr-1" />
                  目标
                </p>
                <p className="text-xs text-text-secondary">{r.target}</p>
              </div>

              <Link
                to={`/learn/route-${r.id.toLowerCase()}`}
                className="btn btn-primary mt-5 inline-flex items-center gap-2"
              >
                查看详细计划
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          )
        })}
      </div>

      {/* 路线对比 */}
      <div className="mt-6">
        <Card eyebrow="COMPARE · 怎么选" title="两条路线的差别">
          <div className="grid gap-4 md:grid-cols-2 mt-2">
            <div>
              <p className="text-xs font-semibold text-blender-orange mb-2">
                选路线 A，如果……
              </p>
              <BulletList
                items={[
                  '手上有正在做的室内设计项目，不能停下来专门学',
                  'SketchUp 已经用得很熟，只想补 Blender 的表现能力',
                  '想在 12 周内做出能拿给客户看的效果图和漫游视频',
                  '希望学的每一步都能直接用在当前项目上',
                ]}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-status-learning mb-2">
                选路线 B，如果……
              </p>
              <BulletList
                items={[
                  '想把 Blender 从头到尾系统学一遍，不满足于「够用」',
                  '时间比较宽松，能接受 24 周的节奏',
                  '对建模、UV、节点、合成等底层能力也感兴趣',
                  '希望以后不只做室内，还能扩展到别的方向',
                ]}
                tone="info"
              />
            </div>
          </div>
          <p className="text-[11px] text-text-tertiary mt-4 pt-4 border-t border-dark-border">
            两条路线的知识并不冲突：路线 A 的很多内容在路线 B 里会讲得更深。可以先用 A 跑通一遍，再回头用 B 补系统。
          </p>
        </Card>
      </div>
    </div>
  )
}

/** 单条路线详情（/learn/route-a · /learn/route-b） */
export function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>()
  const progress = useProgressStore((s) => s.progress)

  const id = (routeId ?? '').replace('route-', '').toUpperCase()
  const route = routeById[id]
  if (!route) return <Navigate to="/learn" replace />

  const weeks = weeksOf(id)
  const total = lessonsOf(id).length
  const doneN = Object.values(progress).filter(
    (p) =>
      p.routeId === id && (p.status === 'completed' || p.status === 'mastered'),
  ).length

  const isB = id === 'B'

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker={`ROUTE ${id}`}
        title={route.name}
        description={route.description}
        action={
          <div className="flex gap-2">
            {routes.map((r) => (
              <Link
                key={r.id}
                to={`/learn/route-${r.id.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  r.id === id
                    ? 'bg-blender-orange text-white border-blender-orange'
                    : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
                }`}
              >
                {r.id} · {r.duration} 周
              </Link>
            ))}
          </div>
        }
      />

      {/* 概览 */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card eyebrow="PROGRESS" title={`${doneN} / ${total} 课完成`}>
          <ProgressBar
            value={total ? (doneN / total) * 100 : 0}
            label="路线进度"
            tone={isB ? 'blue' : 'orange'}
          />
        </Card>
        <Card eyebrow="TARGET" title="这条路线要达到什么">
          <p className="text-xs text-text-secondary leading-relaxed">{route.target}</p>
        </Card>
        <Card eyebrow="WORKFLOW" title="整体工作流">
          <p className="text-xs text-text-secondary leading-relaxed">
            {route.workflow}
          </p>
        </Card>
      </div>

      {/* 阶段划分 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">阶段划分</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {route.phases.map((p, i) => (
            <div
              key={p.id}
              className="rounded-lg border border-dark-border bg-dark-surface px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-md bg-blender-orange text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-xs font-semibold text-text-primary">{p.name}</p>
              </div>
              <p className="text-[11px] text-text-tertiary mb-2">
                第 {p.weeks.join(' / ')} 周
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 按周列课程 */}
      <h2 className="text-sm font-semibold text-text-primary mb-3">逐周课程</h2>
      <div className="space-y-3">
        {weeks.map((w) => {
          const doneInWeek = w.lessons.filter((l) => {
            const st = progress[l.lessonId]?.status
            return st === 'completed' || st === 'mastered'
          }).length

          return (
            <Card
              key={w.week}
              eyebrow={`WEEK ${String(w.week).padStart(2, '0')} · ${phaseName(id, w.phase)}`}
              title={w.title}
              action={
                <span className="text-[11px] text-text-tertiary whitespace-nowrap">
                  {doneInWeek}/{w.lessons.length}
                </span>
              }
            >
              <p className="text-xs text-text-secondary leading-relaxed">
                {w.objective}
              </p>
              <div className="mt-3 space-y-1.5">
                {w.lessons.map((l) => (
                  <LessonRow key={l.lessonId} lesson={l} />
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  const record = useProgressStore((s) => s.progress[lesson.lessonId])
  const status = record?.status ?? 'not_started'
  const done = status === 'completed' || status === 'mastered'

  return (
    <Link
      to={`/lessons/${lesson.lessonId}`}
      className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-elevated px-3 py-2 hover:border-blender-orange/50 transition-colors group"
    >
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-status-completed shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-text-tertiary shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary truncate group-hover:text-blender-orange transition-colors">
          {lesson.lessonNumber} · {lesson.title}
        </p>
        <p className="text-[11px] text-text-tertiary truncate mt-0.5">
          {lesson.objective}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {lesson.shortcut && lesson.shortcut !== '—' && (
          <span className="text-[10px] font-mono text-text-tertiary border border-dark-border rounded px-1.5 py-0.5">
            {lesson.shortcut.length > 18
              ? lesson.shortcut.slice(0, 18) + '…'
              : lesson.shortcut}
          </span>
        )}
        <StatusBadge status={status} />
      </div>
    </Link>
  )
}

export { lessonById, Clock }
