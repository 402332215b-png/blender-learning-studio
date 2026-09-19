import { Link } from 'react-router-dom'
import {
  Repeat,
  CheckCircle2,
  Calendar,
  Flame,
  Star,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { Card, PageHeader, ProgressBar, Metric, EmptyState, Tag, BulletList } from '../components/ui'
import { useProgressStore } from '../stores'
import {
  lessonById,
  allLessons,
  lessonsOf,
  routes,
  weekOfLesson,
  phaseName,
  practiceLevels,
  allShortcuts,
} from '../lib/content'

// ---------------------------------------------------------------------------
// 复习
// ---------------------------------------------------------------------------

export function Review() {
  const progress = useProgressStore((s) => s.progress)
  const setLessonStatus = useProgressStore((s) => s.setLessonStatus)

  const list = Object.values(progress)
    .filter((p) => p.status === 'needs_review')
    .sort((a, b) => (a.lastStudiedAt ?? '').localeCompare(b.lastStudiedAt ?? ''))

  // 顺带推荐「学过但没标记完成」的课，帮用户清理积压
  const stale = Object.values(progress)
    .filter((p) => p.status === 'learning' && (p.progress ?? 0) > 0)
    .slice(0, 6)

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="REVIEW"
        title="需要复习"
        description="你在课时页标记「需要复习」的内容会集中在这里。按最近学习时间排序，越久没碰的排越前。"
      />

      {list.length === 0 ? (
        <EmptyState
          title="当前没有待复习的课时"
          description="在任意课时详情页点「需要复习」，它就会出现在这里。掌握之后点「已掌握」即可移出。"
          action={
            <Link to="/today" className="btn btn-primary inline-flex items-center gap-2">
              去今日学习
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Metric value={list.length} label="待复习课时" tone="on" />
            <Metric
              value={list.reduce((n, p) => n + p.reviewCount, 0)}
              label="累计复习次数"
            />
            <Metric value={stale.length} label="学习中未完成" />
            <Metric
              value={Object.values(progress).filter((p) => p.status === 'mastered').length}
              label="已掌握"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              const lesson = lessonById[p.lessonId]
              const week = lesson ? weekOfLesson(lesson) : undefined
              return (
                <Card key={p.lessonId} eyebrow={p.lessonId} title={lesson?.title ?? p.lessonId}>
                  {lesson && (
                    <>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {lesson.objective}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Tag tone="accent">路线 {lesson.routeId}</Tag>
                        <Tag>第 {lesson.week} 周</Tag>
                        {week && <Tag tone="info">{phaseName(lesson.routeId, week.phase)}</Tag>}
                      </div>
                    </>
                  )}
                  <div className="mt-3 pt-3 border-t border-dark-border space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">最近学习</span>
                      <span className="text-text-secondary">
                        {fmtDate(p.lastStudiedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">复习次数</span>
                      <span className="text-status-needs-review">
                        {p.reviewCount} 次
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      to={`/lessons/${p.lessonId}`}
                      className="btn btn-primary flex-1 inline-flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      开始复习
                    </Link>
                    <button
                      onClick={() =>
                        lesson &&
                        setLessonStatus(lesson, 'mastered', {
                          reviewed: true,
                          progress: 100,
                        })
                      }
                      className="btn btn-secondary inline-flex items-center gap-1.5 text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      已掌握
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* 学习中未完成 */}
      {stale.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            学了一半的课（可以顺手收个尾）
          </h2>
          <div className="space-y-2">
            {stale.map((p) => {
              const lesson = lessonById[p.lessonId]
              if (!lesson) return null
              return (
                <Link
                  key={p.lessonId}
                  to={`/lessons/${p.lessonId}`}
                  className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-surface px-4 py-2.5 hover:border-blender-orange/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {lesson.title}
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                      {p.lessonId} · {lesson.routeId} 路线
                    </p>
                  </div>
                  <div className="w-24 shrink-0">
                    <ProgressBar value={p.progress} />
                  </div>
                  <span className="text-[11px] text-blender-orange w-9 text-right shrink-0">
                    {p.progress}%
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 我的成长
// ---------------------------------------------------------------------------

export function Growth() {
  const progress = useProgressStore((s) => s.progress)
  const sessions = useProgressStore((s) => s.sessions)
  const favorites = useProgressStore((s) => s.favorites)
  const stats = useProgressStore((s) => s.stats)()

  const list = Object.values(progress)
  const done = list.filter(
    (p) => p.status === 'completed' || p.status === 'mastered',
  )
  const mastered = list.filter((p) => p.status === 'mastered')
  const learning = list.filter((p) => p.status === 'learning')

  const routeProgress = routes.map((r) => ({
    route: r,
    total: lessonsOf(r.id).length,
    done: done.filter((p) => p.routeId === r.id).length,
    pct: stats.routePercent(
      r.id,
      Math.max(1, lessonsOf(r.id).length),
    ),
  }))

  // 分类完成情况（按阶段）
  const phaseProgress = routes.flatMap((r) =>
    r.phases.map((ph) => {
      const phaseLessons = lessonsOf(r.id).filter((l) => {
        const w = weekOfLesson(l)
        return w?.phase === ph.id
      })
      const n = phaseLessons.filter(
        (l) =>
          progress[l.lessonId]?.status === 'completed' ||
          progress[l.lessonId]?.status === 'mastered',
      ).length
      return {
        key: `${r.id}-${ph.id}`,
        routeId: r.id,
        name: ph.name,
        weeks: ph.weeks,
        total: phaseLessons.length,
        done: n,
      }
    }),
  )

  const favByType = {
    lesson: favorites.filter((f) => f.itemType === 'lesson').length,
    shortcut: favorites.filter((f) => f.itemType === 'shortcut').length,
    material: favorites.filter((f) => f.itemType === 'material').length,
    lighting: favorites.filter((f) => f.itemType === 'lighting').length,
    camera: favorites.filter((f) => f.itemType === 'camera').length,
    animation: favorites.filter((f) => f.itemType === 'animation').length,
  }

  const recent = sessions.slice(0, 8)

  const totalLessons = allLessons.length
  const totalPracticeTasks = practiceLevels.reduce(
    (n, l) => n + l.tasks.length,
    0,
  )

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="MY GROWTH"
        title="我的成长"
        description="所有数据都来自你本机的学习记录，不上传、不外发。"
      />

      {/* 核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Metric value={stats.totalStudyDays} label="累计学习天数" tone="on" />
        <Metric value={stats.consecutiveDays} label="连续学习天数" />
        <Metric value={done.length} label="已完成课时" />
        <Metric value={mastered.length} label="已掌握" />
        <Metric value={favorites.length} label="收藏" />
      </div>

      {/* 总进度 */}
      <Card
        className="mb-6"
        eyebrow="OVERALL"
        title={`内容总进度 ${done.length} / ${totalLessons} 课`}
      >
        <ProgressBar
          value={totalLessons ? (done.length / totalLessons) * 100 : 0}
          label="全部课程"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <MiniStat label="学习中" value={learning.length} />
          <MiniStat label="待复习" value={stats.reviewCount} />
          <MiniStat label="练习任务" value={totalPracticeTasks} />
          <MiniStat label="学习流水" value={sessions.length} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        {/* 路线进度 */}
        <Card eyebrow="ROUTES" title="两条路线">
          <div className="space-y-4">
            {routeProgress.map(({ route, total, done: d, pct }) => (
              <div key={route.id}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-medium text-text-primary">
                    路线 {route.id} · {route.name}
                  </p>
                  <span className="text-[11px] text-text-tertiary">
                    {d}/{total}
                  </span>
                </div>
                <ProgressBar value={pct} tone={route.id === 'B' ? 'blue' : 'orange'} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-border">
            <Flame className="w-4 h-4 text-blender-orange" />
            <p className="text-[11px] text-text-tertiary">
              连续 {stats.consecutiveDays} 天 · 累计 {stats.totalStudyDays} 天
            </p>
          </div>
        </Card>

        {/* 阶段进度 */}
        <Card eyebrow="PHASES" title="阶段完成情况">
          <ul className="space-y-3">
            {phaseProgress.map((p) => (
              <li key={p.key}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[11px] text-text-secondary truncate">
                    <span className="text-blender-orange font-mono mr-1.5">
                      {p.routeId}
                    </span>
                    {p.name}
                  </p>
                  <span className="text-[10px] text-text-tertiary whitespace-nowrap">
                    {p.done}/{p.total}
                  </span>
                </div>
                <ProgressBar
                  value={p.total ? (p.done / p.total) * 100 : 0}
                  tone={p.routeId === 'B' ? 'blue' : 'orange'}
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 最近学习 */}
        <Card eyebrow="RECENT" title="最近学习" action={<Calendar className="w-4 h-4 text-text-tertiary" />}>
          {recent.length === 0 ? (
            <p className="text-[11px] text-text-tertiary leading-relaxed">
              还没有学习记录。去「今日学习」开始第一课吧。
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((s) => {
                const lesson = lessonById[s.lessonId]
                return (
                  <li key={s.id}>
                    <Link
                      to={`/lessons/${s.lessonId}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2 hover:border-blender-orange/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] text-text-primary truncate">
                          {lesson?.title ?? s.lessonId}
                        </p>
                        <p className="text-[10px] text-text-tertiary mt-0.5">
                          {fmtDateTime(s.date)}
                        </p>
                      </div>
                      <Tag
                        tone={
                          s.action === 'complete'
                            ? 'accent'
                            : s.action === 'review'
                              ? 'warn'
                              : 'info'
                        }
                      >
                        {s.action === 'complete'
                          ? '完成'
                          : s.action === 'review'
                            ? '复习'
                            : '开始'}
                      </Tag>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* 收藏汇总 */}
        <Card eyebrow="FAVORITES" title={`收藏汇总 (${favorites.length})`} action={<Star className="w-4 h-4 text-blender-orange" />}>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="课程" value={favByType.lesson} />
            <MiniStat label="快捷键" value={favByType.shortcut} />
            <MiniStat label="材质" value={favByType.material} />
            <MiniStat label="灯光" value={favByType.lighting} />
            <MiniStat label="相机" value={favByType.camera} />
            <MiniStat label="动画" value={favByType.animation} />
          </div>

          {favorites.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-[11px] text-text-tertiary mb-2">最近收藏</p>
              <ul className="space-y-1.5">
                {favorites.slice(0, 5).map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-2 text-[11px] text-text-secondary"
                  >
                    <Star className="w-3 h-3 text-blender-orange shrink-0" />
                    <span className="truncate">{f.title ?? f.itemId}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      {/* 内容统计 */}
      <div className="mt-6">
        <Card eyebrow="CONTENT" title="可学内容总量" action={<TrendingUp className="w-4 h-4 text-text-tertiary" />}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStat label="课时" value={totalLessons} />
            <MiniStat label="快捷键" value={allShortcuts.length} />
            <MiniStat label="练习任务" value={totalPracticeTasks} />
            <MiniStat label="阶段" value={phaseProgress.length} />
          </div>
          <div className="mt-4">
            <BulletList
              items={[
                `已掌握 ${mastered.length} 课，占已完成课时的 ${
                  done.length ? Math.round((mastered.length / done.length) * 100) : 0
                }%`,
                `还有 ${totalLessons - done.length} 课没完成，其中 ${learning.length} 课正在进行中`,
                `已完成 ${done.length} 课，约占全部内容的 ${
                  totalLessons ? Math.round((done.length / totalLessons) * 100) : 0
                }%`,
              ]}
              tone="info"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
      <p className="text-base font-bold text-text-primary leading-none">{value}</p>
      <p className="text-[10px] text-text-tertiary mt-1.5">{label}</p>
    </div>
  )
}

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function fmtDateTime(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
