import { Link } from 'react-router-dom'
import { useAuthStore, useProgressStore } from '../stores'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  BookOpen,
  Palette,
  Lightbulb,
  Camera,
  Clapperboard,
  RefreshCw,
  ArrowRight,
  Zap,
  Clock,
  RotateCcw,
  Flame,
  CalendarCheck,
  Star,
  Boxes,
} from 'lucide-react'
import { Card, ProgressBar, Metric, Tag, BulletList } from '../components/ui'
import {
  allLessons,
  lessonsOf,
  routes,
  lessonById,
  weekOfLesson,
  phaseName,
  allShortcuts,
  contentStats,
  workflows,
} from '../lib/content'

/**
 * 首页 —— 「现在该做什么」
 *
 * 数据全部来自真实学习记录与 data/*.json，没有任何写死的假进度。
 */
export function Home() {
  const { user } = useAuthStore()
  const progress = useProgressStore((s) => s.progress)
  const sessions = useProgressStore((s) => s.sessions)
  const favorites = useProgressStore((s) => s.favorites)
  const stats = useProgressStore((s) => s.stats)()
  const today = format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })

  const doneList = Object.values(progress).filter(
    (p) => p.status === 'completed' || p.status === 'mastered',
  )
  const doneSet = new Set(doneList.map((p) => p.lessonId))

  // 接下来该学哪一课（路线 A 优先）
  const nextUp =
    lessonsOf('A').find((l) => !doneSet.has(l.lessonId)) ??
    lessonsOf('B').find((l) => !doneSet.has(l.lessonId))

  // 最近在学但没学完的（比「下一课」更贴近「继续上次」）
  const inProgress = Object.values(progress)
    .filter((p) => p.status === 'learning' && (p.progress ?? 0) > 0)
    .sort((a, b) => (b.lastStudiedAt ?? '').localeCompare(a.lastStudiedAt ?? ''))
  const resumeRecord = inProgress[0]
  const resumeLesson = resumeRecord ? lessonById[resumeRecord.lessonId] : undefined
  const continueLesson = resumeLesson ?? nextUp

  // 待复习
  const reviewList = Object.values(progress)
    .filter((p) => p.status === 'needs_review')
    .sort((a, b) => (a.lastStudiedAt ?? '').localeCompare(b.lastStudiedAt ?? ''))

  // 今日快捷键
  const shortcut = allShortcuts[new Date().getDate() % allShortcuts.length]

  // 最近学习流水
  const recent = sessions.slice(0, 4)

  // 今日是否已学
  const todayStr = new Date().toDateString()
  const studiedToday = sessions.some(
    (s) => new Date(s.date).toDateString() === todayStr,
  )

  const continueWeek = continueLesson ? weekOfLesson(continueLesson) : undefined

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* 头部 */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Blender 学习工作室
          </h1>
          <p className="text-sm text-text-tertiary mt-1">{today}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-dark-elevated flex items-center justify-center text-blender-orange font-medium shrink-0">
          {user?.displayName?.[0]?.toUpperCase() || 'U'}
        </div>
      </header>

      {/* 欢迎 + 连续天数 */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
          欢迎回来{user?.displayName ? `，${user.displayName}` : ''}
        </h2>
        <p className="text-sm text-text-secondary mt-2 flex items-center gap-2">
          <Flame className="w-4 h-4 text-blender-orange" />
          {stats.totalStudyDays === 0
            ? '还没有学习记录，今天开一个头吧'
            : `已连续学习 ${stats.consecutiveDays} 天 · 累计 ${stats.totalStudyDays} 天`}
          {studiedToday && (
            <Tag tone="accent">
              <CalendarCheck className="w-3 h-3 mr-1" />
              今天已打卡
            </Tag>
          )}
        </p>
      </div>

      {/* 四个核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Metric value={doneList.length} label={`已完成 / 共 ${allLessons.length} 课`} tone="on" />
        <Metric value={stats.mastered} label="已掌握" />
        <Metric value={reviewList.length} label="待复习" />
        <Metric value={favorites.length} label="收藏" />
      </div>

      {/* 继续上次学习 */}
      {continueLesson && (
        <Card
          className="mb-6"
          eyebrow="CONTINUE"
          title={
            resumeLesson
              ? '继续上次学习'
              : doneList.length === 0
                ? '从这里开始'
                : '接下来学这个'
          }
          action={<Clock className="w-4 h-4 text-blender-orange" />}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-text-tertiary mb-1">
                路线 {continueLesson.routeId} · 第 {continueLesson.week} 周
                {continueWeek && ` · ${phaseName(continueLesson.routeId, continueWeek.phase)}`}
              </p>
              <h4 className="text-lg font-semibold text-text-primary mb-1 truncate">
                {continueLesson.title}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {continueLesson.objective}
              </p>
              {resumeRecord && (
                <div className="mt-2 max-w-xs">
                  <ProgressBar value={resumeRecord.progress} />
                </div>
              )}
            </div>
            <Link
              to={`/lessons/${continueLesson.lessonId}`}
              className="btn btn-primary shrink-0 inline-flex items-center gap-2"
            >
              {resumeLesson ? '继续学习' : '开始第一课'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* 今日学习 & 待复习 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* 今日学习 */}
        <Card eyebrow="TODAY" title="今日学习" action={<Zap className="w-4 h-4 text-blender-orange" />}>
          <div className="space-y-3">
            <Link
              to="/today"
              className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5 hover:border-blender-orange/50 transition-colors"
            >
              <div className="w-8 h-8 rounded bg-dark-elevated flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-status-learning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-primary truncate">
                  {nextUp?.title ?? '全部完成'}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">
                  今日主课 · 路线 {nextUp?.routeId ?? '—'}
                </p>
              </div>
            </Link>

            <Link
              to="/library/shortcuts"
              className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5 hover:border-blender-orange/50 transition-colors"
            >
              <div className="w-8 h-8 rounded bg-dark-elevated flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-blender-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-primary truncate font-mono">
                  {shortcut?.keys ?? '—'}
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">
                  {shortcut?.nameCn ?? '快捷键'} · 每日一个
                </p>
              </div>
            </Link>

            <Link
              to="/practice"
              className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5 hover:border-blender-orange/50 transition-colors"
            >
              <div className="w-8 h-8 rounded bg-dark-elevated flex items-center justify-center shrink-0">
                <Boxes className="w-4 h-4 text-status-completed" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-primary">
                  {contentStats.practiceTaskCount} 个练习任务
                </p>
                <p className="text-[10px] text-text-tertiary mt-0.5">
                  {contentStats.practiceLevelCount} 个难度等级
                </p>
              </div>
            </Link>
          </div>
          <Link
            to="/today"
            className="btn btn-primary w-full mt-4 inline-flex items-center justify-center gap-2"
          >
            开始今日学习
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        {/* 待复习 */}
        <Card
          eyebrow="REVIEW"
          title={`待复习 (${reviewList.length})`}
          action={<RotateCcw className="w-4 h-4 text-status-needs-review" />}
        >
          {reviewList.length === 0 ? (
            <>
              <p className="text-xs text-text-secondary leading-relaxed">
                当前没有标记为「需要复习」的课时。
              </p>
              <BulletList
                items={[
                  `已掌握 ${stats.mastered} 课`,
                  `还有 ${allLessons.length - doneList.length} 课没完成`,
                  '在课时页点「需要复习」，内容就会出现在这里',
                ]}
                tone="info"
              />
            </>
          ) : (
            <div className="space-y-2">
              {reviewList.slice(0, 3).map((p) => {
                const l = lessonById[p.lessonId]
                return (
                  <div
                    key={p.lessonId}
                    className="flex items-center justify-between gap-3 p-3 bg-dark-elevated rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-text-primary truncate">
                        {l?.title ?? p.lessonId}
                      </p>
                      <p className="text-[10px] text-status-needs-review mt-0.5">
                        复习 {p.reviewCount} 次 · 最近 {fmtDate(p.lastStudiedAt)}
                      </p>
                    </div>
                    <Link
                      to={`/lessons/${p.lessonId}`}
                      className="btn btn-ghost text-xs shrink-0"
                    >
                      去复习
                    </Link>
                  </div>
                )
              })}
              {reviewList.length > 3 && (
                <Link
                  to="/review"
                  className="block text-center text-[11px] text-blender-orange hover:underline pt-1"
                >
                  查看全部 {reviewList.length} 条
                </Link>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* 学习路线进度 */}
      <Card
        className="mb-6"
        eyebrow="ROUTES"
        title="学习路线进度"
        action={
          <Link
            to="/learn"
            className="text-[11px] text-blender-orange hover:underline"
          >
            查看路线详情
          </Link>
        }
      >
        <div className="space-y-4">
          {routes.map((r) => {
            const total = lessonsOf(r.id).length
            const done = doneList.filter((p) => p.routeId === r.id).length
            const pct = total ? (done / total) * 100 : 0
            return (
              <div key={r.id}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <Link
                    to={`/learn/${r.id === 'A' ? 'route-a' : 'route-b'}`}
                    className="text-xs text-text-primary hover:text-blender-orange truncate transition-colors"
                  >
                    路线 {r.id} — {r.name}
                  </Link>
                  <span className="text-[11px] text-text-tertiary shrink-0">
                    {done}/{total} · {Math.round(pct)}%
                  </span>
                </div>
                <ProgressBar value={pct} tone={r.id === 'B' ? 'blue' : 'orange'} />
              </div>
            )
          })}
        </div>
      </Card>

      {/* 最近学习 */}
      <Card
        className="mb-6"
        eyebrow="RECENT"
        title="最近学习"
        action={<CalendarCheck className="w-4 h-4 text-text-tertiary" />}
      >
        {recent.length === 0 ? (
          <p className="text-xs text-text-tertiary leading-relaxed">
            还没有学习记录。点上面的「开始今日学习」，学完一课后这里就会有记录。
          </p>
        ) : (
          <div className="space-y-1">
            {recent.map((item) => {
              const l = lessonById[item.lessonId]
              return (
                <Link
                  key={item.id}
                  to={`/lessons/${item.lessonId}`}
                  className="flex items-center justify-between gap-3 py-2 border-b border-dark-border last:border-0 hover:bg-dark-elevated/40 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] text-text-tertiary w-10 shrink-0 font-mono">
                      {fmtShort(item.date)}
                    </span>
                    <span className="text-xs text-text-primary truncate">
                      {l?.title ?? item.lessonId}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] shrink-0 ${
                      item.action === 'complete'
                        ? 'text-status-completed'
                        : item.action === 'review'
                          ? 'text-status-needs-review'
                          : 'text-status-learning'
                    }`}
                  >
                    {item.action === 'complete'
                      ? '✓ 完成'
                      : item.action === 'review'
                        ? '↻ 复习'
                        : '▶ 开始'}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </Card>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Palette, label: '材质实验室', path: '/materials', n: contentStats.materialCount },
          { icon: Lightbulb, label: '灯光实验室', path: '/lighting', n: contentStats.lightingCount },
          { icon: Camera, label: '相机实验室', path: '/camera', n: contentStats.cameraCount },
          { icon: Clapperboard, label: '动画实验室', path: '/animation', n: contentStats.animationCount },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="card flex flex-col items-center gap-2 py-4 hover:border-blender-orange transition-colors"
          >
            <item.icon className="w-6 h-6 text-blender-orange" />
            <span className="text-xs text-text-secondary">{item.label}</span>
            <span className="text-[10px] text-text-tertiary">{item.n} 项</span>
          </Link>
        ))}
      </div>

      {/* 底部两个大入口 */}
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <Link
          to="/su-to-blender"
          className="card flex items-center gap-4 hover:border-blender-orange transition-colors"
        >
          <RefreshCw className="w-6 h-6 text-blender-orange shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">
              实际工作模块
            </p>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              {workflows.length} 条从 SU 到 Blender 的操作流程
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-tertiary shrink-0" />
        </Link>

        <Link
          to="/growth"
          className="card flex items-center gap-4 hover:border-blender-orange transition-colors"
        >
          <Star className="w-6 h-6 text-blender-orange shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">我的成长</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              学习数据与收藏汇总
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-tertiary shrink-0" />
        </Link>
      </div>
    </div>
  )
}

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function fmtShort(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getMonth() + 1}/${d.getDate()}`
}
