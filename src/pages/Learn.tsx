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
import { tr, tpl } from '../i18n'

/** 路线总览（/learn） */
export function Learn() {
  const progress = useProgressStore((s) => s.progress)
  const stats = useProgressStore((s) => s.stats)()

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="ROADMAP"
        title={tr('成长路线')}
        description={tr('主推路线 B —— 先把 Blender 系统学明白；路线 A 是把 Blender 接回 SketchUp 真实项目的双线打法。建议先走 B 打底，再用 A 落地到客户项目。')}
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
              eyebrow={
                r.recommended
                  ? tpl('ROUTE {id} · 主推', { id: r.id })
                  : tpl('ROUTE {id}', { id: r.id })
              }
              title={r.name}
              action={
                <div className="flex items-center gap-1.5">
                  {r.recommended && <Tag tone="accent">{tr('先学这条')}</Tag>}
                  <Tag tone={r.recommended ? 'info' : 'default'}>{tpl('{n} 周', { n: r.duration })}</Tag>
                </div>
              }
            >
              <p className="text-xs font-medium mb-2" style={{ color: r.color }}>
                {r.subtitle}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {r.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <Tag>{tpl('共 {n} 课', { n: total })}</Tag>
                <Tag>{tpl('已完成 {n}', { n: doneN })}</Tag>
                <Tag tone="info">{tpl('{n} 个阶段', { n: r.phases.length })}</Tag>
              </div>

              <ProgressBar
                value={pct}
                label={tr('路线进度')}
                tone={r.recommended ? 'blue' : 'orange'}
              />

              <div className="mt-4 rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
                <p className="text-3xs text-text-tertiary mb-1">
                  <Target className="w-3 h-3 inline mr-1" />
                  {tr('目标')}
                </p>
                <p className="text-xs text-text-secondary">{r.target}</p>
              </div>

              <Link
                to={`/learn/route-${r.id.toLowerCase()}`}
                className="btn btn-primary mt-5 inline-flex items-center gap-2"
              >
                {tr('查看详细计划')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          )
        })}
      </div>

      {/* 路线对比 */}
      <div className="mt-6">
        <Card eyebrow={tr('COMPARE · 怎么选')} title={tr('两条路线的差别')}>
          <div className="grid gap-4 md:grid-cols-2 mt-2">
            <div>
              <p className="text-xs font-semibold text-status-learning mb-2">
                {tr('先选路线 B（主推），如果……')}
              </p>
              <BulletList
                items={[
                  tr('第一优先目标是把 Blender 自己学明白，而不是「够用就行」'),
                  tr('时间相对宽松，愿意按 24 周的节奏一点点搭起完整框架'),
                  tr('建模、Modifier、UV、节点、Geometry Nodes 这些底层能力也想搞懂'),
                  tr('希望以后不只做室内，Blender 能迁移到别的方向'),
                ]}
                tone="info"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-blender-orange mb-2">
                {tr('再叠加路线 A（双线交付），如果……')}
              </p>
              <BulletList
                items={[
                  tr('同时手上有正在做的室内设计项目，不能停下来专门学'),
                  tr('SketchUp 已经很熟，需要把 Blender 接回真实项目出图'),
                  tr('想在 12 周内就产出能拿给客户看的效果图和漫游视频'),
                  tr('希望每学一步都能立刻用在当前项目上'),
                ]}
              />
            </div>
          </div>
          <p className="text-3xs text-text-tertiary mt-4 pt-4 border-t border-dark-border">
            {tr('两条路线不冲突，而是互相喂养：路线 B 在单独的练习文件里系统学、允许犯错；路线 A')}
            {tr('把已经熟练的部分搬进真实客户项目、不影响交付。推荐先走 B 打底，再用 A 落地。')}
          </p>
        </Card>
      </div>
    </div>
  )
}

/** 单条路线详情（/learn/route-a · /learn/route-b） */
export function RouteDetail({ routeId: routeIdProp }: { routeId?: string } = {}) {
  const params = useParams<{ routeId?: string }>()
  const progress = useProgressStore((s) => s.progress)

  /**
   * ⚠️ 这里必须两者都认 —— 这是一个真实踩过的坑。
   *
   * 路由表里写的是**写死的** `/learn/route-a`、`/learn/route-b`（不是 `/learn/:routeId`），
   * 所以 `useParams()` 什么也取不到 → `id` 变成空串 → `routeById['']` 是 undefined
   * → 下面那句 `<Navigate to="/learn" replace />` 会让你**点了「查看详细计划」立刻弹回列表**。
   * 用户看到的现象就是「成长路线里没有详细学习计划」。
   *
   * 现在改为：优先用路由表传下来的 `routeId`，取不到再退回 `useParams`
   * —— 这样将来若改成 `/learn/:routeId` 的动态路由也照样成立。
   */
  const routeId = routeIdProp ?? params.routeId

  const id = (routeId ?? '').replace('route-', '').toUpperCase()
  const route = routeById[id]
  if (!route) return <Navigate to="/learn" replace />

  const weeks = weeksOf(id)
  const total = lessonsOf(id).length
  const doneN = Object.values(progress).filter(
    (p) =>
      p.routeId === id && (p.status === 'completed' || p.status === 'mastered'),
  ).length

  // 主推路线用蓝色进度条（路线 B = Blender 系统成长）
  const isPrimary = !!route.recommended

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
                {tpl('{id} · {n} 周', { id: r.id, n: r.duration })}
              </Link>
            ))}
          </div>
        }
      />

      {/* 概览 */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card eyebrow="PROGRESS" title={tpl('{a} / {b} 课完成', { a: doneN, b: total })}>
          <ProgressBar
            value={total ? (doneN / total) * 100 : 0}
            label={tr('路线进度')}
            tone={isPrimary ? 'blue' : 'orange'}
          />
        </Card>
        <Card eyebrow="TARGET" title={tr('这条路线要达到什么')}>
          <p className="text-xs text-text-secondary leading-relaxed">{route.target}</p>
        </Card>
        <Card eyebrow="WORKFLOW" title={tr('整体工作流')}>
          <p className="text-xs text-text-secondary leading-relaxed">
            {route.workflow}
          </p>
        </Card>
      </div>

      {/* 阶段划分 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">{tr('阶段划分')}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {route.phases.map((p, i) => (
            <div
              key={p.id}
              className="rounded-lg border border-dark-border bg-dark-surface px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-md bg-blender-orange text-white text-3xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-xs font-semibold text-text-primary">{p.name}</p>
              </div>
              <p className="text-3xs text-text-tertiary mb-2">
                {tpl('第 {n} 周', { n: p.weeks.join(' / ') })}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 按周列课程 */}
      <h2 className="text-sm font-semibold text-text-primary mb-3">{tr('逐周课程')}</h2>
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
                <span className="text-3xs text-text-tertiary whitespace-nowrap">
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
        <p className="text-3xs text-text-tertiary truncate mt-0.5">
          {lesson.objective}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {lesson.shortcut && lesson.shortcut !== '—' && (
          <span className="text-3xs font-mono text-text-tertiary border border-dark-border rounded px-1.5 py-0.5">
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
