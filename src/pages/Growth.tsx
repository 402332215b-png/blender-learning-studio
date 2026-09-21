import { Link } from 'react-router-dom'
import {
  Repeat,
  CheckCircle2,
  Calendar,
  CalendarCheck,
  Flame,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  BookOpen,
  Boxes,
  RotateCcw,
  Palette,
  Lightbulb,
  Camera,
  Clapperboard,
  RefreshCw,
} from 'lucide-react'
import { Card, PageHeader, ProgressBar, Metric, EmptyState, Tag, BulletList } from '../components/ui'
import { useAuthStore, useProgressStore } from '../stores'
import {
  lessonById,
  allLessons,
  lessonsOf,
  routes,
  weekOfLesson,
  phaseName,
  practiceLevels,
  allShortcuts,
  contentStats,
  workflows,
} from '../lib/content'
import { tr, tpl, intlTag } from '../i18n'

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
        title={tr('需要复习')}
        description={tr('你在课时页标记「需要复习」的内容会集中在这里。按最近学习时间排序，越久没碰的排越前。')}
      />

      {list.length === 0 ? (
        <EmptyState
          title={tr('当前没有待复习的课时')}
          description={tr('在任意课时详情页点「需要复习」，它就会出现在这里。掌握之后点「已掌握」即可移出。')}
          action={
            <Link to="/today" className="btn btn-primary inline-flex items-center gap-2">
              {tr('去今日学习')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Metric value={list.length} label={tr('待复习课时')} tone="on" />
            <Metric
              value={list.reduce((n, p) => n + p.reviewCount, 0)}
              label={tr('累计复习次数')}
            />
            <Metric value={stale.length} label={tr('学习中未完成')} />
            <Metric
              value={Object.values(progress).filter((p) => p.status === 'mastered').length}
              label={tr('已掌握')}
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
                        <Tag tone="accent">{tpl('路线 {r}', { r: lesson.routeId })}</Tag>
                        <Tag>{tpl('第 {n} 周', { n: lesson.week })}</Tag>
                        {week && <Tag tone="info">{phaseName(lesson.routeId, week.phase)}</Tag>}
                      </div>
                    </>
                  )}
                  <div className="mt-3 pt-3 border-t border-dark-border space-y-1.5 text-3xs">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">{tr('最近学习')}</span>
                      <span className="text-text-secondary">
                        {fmtDate(p.lastStudiedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">{tr('复习次数')}</span>
                      <span className="text-status-needs-review">
                        {tpl('{n} 次', { n: p.reviewCount })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      to={`/lessons/${p.lessonId}`}
                      className="btn btn-primary flex-1 inline-flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      {tr('开始复习')}
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
                      {tr('已掌握')}
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
            {tr('学了一半的课（可以顺手收个尾）')}
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
                    <p className="text-3xs text-text-tertiary mt-0.5">
                      {tpl('{id} · 路线 {r}', { id: p.lessonId, r: lesson.routeId })}
                    </p>
                  </div>
                  <div className="w-24 shrink-0">
                    <ProgressBar value={p.progress} />
                  </div>
                  <span className="text-3xs text-blender-orange w-9 text-right shrink-0">
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

/**
 * 我的成长（v1.0.0 起吸收原「首页」）
 * ==================================
 *
 * ⚠️ 为什么把首页并进来（用户 2026-09-20 决定）：
 *    原来两页有 **4 个板块是真重复的** —— 核心指标卡 / 路线进度 /
 *    最近学习流水 / 待复习。同一种数据、同一种卡片各写了一遍，
 *    而且**口径还打架**：首页的「待复习」是 `reviewList.length`，
 *    成长页的「待复习」走的是 `stats.reviewCount`（好在实测两者同源同值，
 *    但这种"两处各算一遍"迟早会漂）。并掉之后口径只剩一处。
 *
 * 合并顺序（从上到下就是使用频率从高到低）：
 *   ① 现在该做什么   —— 从首页搬来，**放在最上面**
 *   ② 核心指标       —— 统一口径的 6 个数字
 *   ③ 路线 / 阶段进度
 *   ④ 明细（最近学习 / 收藏汇总）
 *   ⑤ 内容统计 + 快捷入口
 *
 * 首页没有丢东西：它独有的「下一课推荐 / 继续上次 / 今日入口 /
 * 今日快捷键 / 快捷入口 / 实际工作模块」全部保留在这里。
 */
export function Growth() {
  const { user } = useAuthStore()
  const progress = useProgressStore((s) => s.progress)
  const sessions = useProgressStore((s) => s.sessions)
  const favorites = useProgressStore((s) => s.favorites)
  const stats = useProgressStore((s) => s.stats)()

  // 星期名由 Intl 按当前语言出，不走词典（词典翻不了运行时生成的星期名）
  const today = new Intl.DateTimeFormat(intlTag(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())

  const list = Object.values(progress)
  const done = list.filter(
    (p) => p.status === 'completed' || p.status === 'mastered',
  )
  const mastered = list.filter((p) => p.status === 'mastered')
  const learning = list.filter((p) => p.status === 'learning')

  // ---- ① 现在该做什么 ----
  const doneSet = new Set(done.map((p) => p.lessonId))
  // 路线 B（Blender 系统成长）为主推，推完再接着推路线 A（SU 双线）
  const nextUp =
    lessonsOf('B').find((l) => !doneSet.has(l.lessonId)) ??
    lessonsOf('A').find((l) => !doneSet.has(l.lessonId))
  const inProgress = list
    .filter((p) => p.status === 'learning' && (p.progress ?? 0) > 0)
    .sort((a, b) => (b.lastStudiedAt ?? '').localeCompare(a.lastStudiedAt ?? ''))
  const resumeRecord = inProgress[0]
  const resumeLesson = resumeRecord ? lessonById[resumeRecord.lessonId] : undefined
  const continueLesson = resumeLesson ?? nextUp
  const continueWeek = continueLesson ? weekOfLesson(continueLesson) : undefined

  const reviewList = list
    .filter((p) => p.status === 'needs_review')
    .sort((a, b) => (a.lastStudiedAt ?? '').localeCompare(b.lastStudiedAt ?? ''))

  const shortcut = allShortcuts[new Date().getDate() % allShortcuts.length]

  const todayStr = new Date().toDateString()
  const studiedToday = sessions.some(
    (s) => new Date(s.date).toDateString() === todayStr,
  )

  // ---- ② 进度 ----
  const routeProgress = routes.map((r) => ({
    route: r,
    total: lessonsOf(r.id).length,
    done: done.filter((p) => p.routeId === r.id).length,
    pct: stats.routePercent(r.id, Math.max(1, lessonsOf(r.id).length)),
  }))

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

  // ---- ④ 明细 ----
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
  const totalPracticeTasks = practiceLevels.reduce((n, l) => n + l.tasks.length, 0)

  return (
    <div className="max-w-content mx-auto px-5 md:px-10 py-7 md:py-10">
      {/* ================= 头部：欢迎 + 连续天数 ================= */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              {user?.displayName
                ? tpl('欢迎回来，{name}', { name: user.displayName })
                : tr('欢迎回来')}
            </h1>
            <p className="text-sm text-text-tertiary mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span>{today}</span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-blender-orange" />
                {stats.totalStudyDays === 0
                  ? tr('还没有学习记录，今天开一个头吧')
                  : tpl('已连续学习 {a} 天 · 累计 {b} 天', {
                      a: stats.consecutiveDays,
                      b: stats.totalStudyDays,
                    })}
              </span>
              {studiedToday && (
                <Tag tone="accent">
                  <CalendarCheck className="w-3 h-3 mr-1" />
                  {tr('今天已打卡')}
                </Tag>
              )}
            </p>
          </div>
        </div>

        {/* 隐私说明 —— 数据上云这件事必须让用户看得见。
            ⚠️ 旧文案写的是「未登录也能用，只是进度仅存在本机」，
               v1.0.0 加了登录门之后这句不成立了，已改。 */}
        <p className="text-xs text-text-tertiary mt-4 leading-relaxed max-w-3xl">
          {tr('登录后学习进度会自动同步到你的云端账号（数据按账号行级隔离，只有你能读到）。')}
        </p>
      </header>

      {/* ================= ① 现在该做什么 ================= */}
      {continueLesson && (
        <Card
          className="mb-6"
          eyebrow="CONTINUE"
          title={
            resumeLesson
              ? tr('继续上次学习')
              : done.length === 0
                ? tr('从这里开始')
                : tr('接下来学这个')
          }
          action={<Clock className="w-4 h-4 text-blender-orange" />}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1 min-w-0">
              <p className="text-3xs text-text-tertiary mb-1">
                {tpl('路线 {r} · 第 {n} 周', {
                  r: continueLesson.routeId,
                  n: continueLesson.week,
                })}
                {continueWeek &&
                  ` · ${phaseName(continueLesson.routeId, continueWeek.phase)}`}
              </p>
              <h4 className="text-lg font-semibold text-text-primary mb-1 truncate">
                {continueLesson.title}
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed max-w-reading">
                {continueLesson.objective}
              </p>
              {resumeRecord && (
                <div className="mt-3 max-w-sm">
                  <ProgressBar value={resumeRecord.progress} />
                </div>
              )}
            </div>
            <Link
              to={`/lessons/${continueLesson.lessonId}`}
              className="btn btn-primary shrink-0 inline-flex items-center gap-2"
            >
              {resumeLesson ? tr('继续学习') : tr('开始第一课')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* 今日学习 & 待复习 —— 与首页原样保留（首页独有，且最常点） */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <Card
          eyebrow="TODAY"
          title={tr('今日学习')}
          action={<Zap className="w-4 h-4 text-blender-orange" />}
        >
          <div className="space-y-3">
            <Link
              to="/today"
              className="flex items-center gap-3 rounded-xl bg-dark-bg px-4 py-3 hover:bg-dark-elevated transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-dark-elevated flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-status-learning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary truncate">
                  {nextUp?.title ?? tr('全部完成')}
                </p>
                <p className="text-3xs text-text-tertiary mt-0.5">
                  {tpl('今日主课 · 路线 {r}', { r: nextUp?.routeId ?? '—' })}
                </p>
              </div>
            </Link>

            <Link
              to="/library/shortcuts"
              className="flex items-center gap-3 rounded-xl bg-dark-bg px-4 py-3 hover:bg-dark-elevated transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-dark-elevated flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-blender-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary truncate font-mono">
                  {shortcut?.keys ?? '—'}
                </p>
                <p className="text-3xs text-text-tertiary mt-0.5">
                  {tpl('{name} · 每日一个', { name: shortcut?.nameCn ?? tr('快捷键') })}
                </p>
              </div>
            </Link>

            <Link
              to="/practice"
              className="flex items-center gap-3 rounded-xl bg-dark-bg px-4 py-3 hover:bg-dark-elevated transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-dark-elevated flex items-center justify-center shrink-0">
                <Boxes className="w-4 h-4 text-status-completed" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary">
                  {tpl('{n} 个练习任务', { n: contentStats.practiceTaskCount })}
                </p>
                <p className="text-3xs text-text-tertiary mt-0.5">
                  {tpl('{n} 个难度等级', { n: contentStats.practiceLevelCount })}
                </p>
              </div>
            </Link>
          </div>
          <Link
            to="/today"
            className="btn btn-primary w-full mt-4 inline-flex items-center justify-center gap-2"
          >
            {tr('开始今日学习')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card
          eyebrow="REVIEW"
          title={tpl('待复习 ({n})', { n: reviewList.length })}
          action={<RotateCcw className="w-4 h-4 text-status-needs-review" />}
        >
          {reviewList.length === 0 ? (
            <>
              <p className="text-sm text-text-secondary leading-relaxed">
                {tr('当前没有标记为「需要复习」的课时。')}
              </p>
              <BulletList
                items={[
                  tpl('已掌握 {n} 课', { n: stats.mastered }),
                  tpl('还有 {n} 课没完成', { n: allLessons.length - done.length }),
                  tr('在课时页点「需要复习」，内容就会出现在这里'),
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
                    className="flex items-center justify-between gap-3 p-3.5 bg-dark-elevated rounded-xl"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {l?.title ?? p.lessonId}
                      </p>
                      <p className="text-3xs text-status-needs-review mt-0.5">
                        {tpl('复习 {n} 次 · 最近 {t}', {
                          n: p.reviewCount,
                          t: fmtDate(p.lastStudiedAt),
                        })}
                      </p>
                    </div>
                    <Link
                      to={`/lessons/${p.lessonId}`}
                      className="btn btn-ghost text-xs shrink-0"
                    >
                      {tr('去复习')}
                    </Link>
                  </div>
                )
              })}
              {reviewList.length > 3 && (
                <Link
                  to="/review"
                  className="block text-center text-3xs text-blender-orange hover:underline pt-1"
                >
                  {tpl('查看全部 {n} 条', { n: reviewList.length })}
                </Link>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ================= ② 核心指标（统一口径，唯一一处） ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <Metric value={stats.totalStudyDays} label={tr('累计学习天数')} tone="on" />
        <Metric value={stats.consecutiveDays} label={tr('连续学习天数')} />
        <Metric value={done.length} label={tr('已完成课时')} />
        <Metric value={mastered.length} label={tr('已掌握')} />
        <Metric value={reviewList.length} label={tr('待复习')} />
        <Metric value={favorites.length} label={tr('收藏')} />
      </div>

      {/* 总进度 */}
      <Card
        className="mb-6"
        eyebrow="OVERALL"
        title={tpl('内容总进度 {a} / {b} 课', { a: done.length, b: totalLessons })}
      >
        <ProgressBar
          value={totalLessons ? (done.length / totalLessons) * 100 : 0}
          label={tr('全部课程')}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <MiniStat label={tr('学习中')} value={learning.length} />
          <MiniStat label={tr('练习任务')} value={totalPracticeTasks} />
          <MiniStat label={tr('学习流水')} value={sessions.length} />
          <MiniStat label={tr('阶段')} value={phaseProgress.length} />
        </div>
      </Card>

      {/* ================= ③ 路线与阶段 ================= */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <Card eyebrow="ROUTES" title={tr('两条路线')}>
          <div className="space-y-4">
            {routeProgress.map(({ route, total, done: d, pct }) => (
              <div key={route.id}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Link
                    to={`/learn/${route.id === 'A' ? 'route-a' : 'route-b'}`}
                    className="text-sm font-medium text-text-primary hover:text-blender-orange transition-colors truncate"
                  >
                    {tpl('路线 {r} — {name}', { r: route.id, name: route.name })}
                  </Link>
                  <span className="text-3xs text-text-tertiary shrink-0">
                    {d}/{total} · {pct}%
                  </span>
                </div>
                <ProgressBar value={pct} tone={route.id === 'B' ? 'blue' : 'orange'} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-border">
            <Flame className="w-4 h-4 text-blender-orange" />
            <p className="text-3xs text-text-tertiary">
              {tpl('连续 {a} 天 · 累计 {b} 天', {
                a: stats.consecutiveDays,
                b: stats.totalStudyDays,
              })}
            </p>
          </div>
        </Card>

        <Card eyebrow="PHASES" title={tr('阶段完成情况')}>
          <ul className="space-y-3">
            {phaseProgress.map((p) => (
              <li key={p.key}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-3xs text-text-secondary truncate">
                    <span className="text-blender-orange font-mono mr-1.5">
                      {p.routeId}
                    </span>
                    {p.name}
                  </p>
                  <span className="text-3xs text-text-tertiary whitespace-nowrap">
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

      {/* ================= ④ 明细 ================= */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <Card
          eyebrow="RECENT"
          title={tr('最近学习')}
          action={<Calendar className="w-4 h-4 text-text-tertiary" />}
        >
          {recent.length === 0 ? (
            <p className="text-sm text-text-tertiary leading-relaxed">
              {tr('还没有学习记录。点上面的「开始今日学习」，学完一课后这里就会有记录。')}
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((s) => {
                const lesson = lessonById[s.lessonId]
                return (
                  <li key={s.id}>
                    <Link
                      to={`/lessons/${s.lessonId}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-dark-bg px-4 py-2.5 hover:bg-dark-elevated transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-text-primary truncate">
                          {lesson?.title ?? s.lessonId}
                        </p>
                        <p className="text-3xs text-text-tertiary mt-0.5">
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
                          ? tr('完成')
                          : s.action === 'review'
                            ? tr('复习')
                            : tr('开始')}
                      </Tag>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card
          eyebrow="FAVORITES"
          title={tpl('收藏汇总 ({n})', { n: favorites.length })}
          action={<Star className="w-4 h-4 text-blender-orange" />}
        >
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label={tr('课程')} value={favByType.lesson} />
            <MiniStat label={tr('快捷键')} value={favByType.shortcut} />
            <MiniStat label={tr('材质')} value={favByType.material} />
            <MiniStat label={tr('灯光')} value={favByType.lighting} />
            <MiniStat label={tr('相机')} value={favByType.camera} />
            <MiniStat label={tr('动画')} value={favByType.animation} />
          </div>

          {favorites.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-3xs text-text-tertiary mb-2">{tr('最近收藏')}</p>
              <ul className="space-y-1.5">
                {favorites.slice(0, 5).map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-2 text-3xs text-text-secondary"
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

      {/* ================= ⑤ 内容统计 + 快捷入口 ================= */}
      <Card
        eyebrow="CONTENT"
        title={tr('可学内容总量')}
        action={<TrendingUp className="w-4 h-4 text-text-tertiary" />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat label={tr('课时')} value={totalLessons} />
          <MiniStat label={tr('快捷键')} value={allShortcuts.length} />
          <MiniStat label={tr('练习任务')} value={totalPracticeTasks} />
          <MiniStat label={tr('阶段')} value={phaseProgress.length} />
        </div>
        <div className="mt-4">
          <BulletList
            items={[
              tpl('已掌握 {a} 课，占已完成课时的 {b}%', {
                a: mastered.length,
                b: done.length ? Math.round((mastered.length / done.length) * 100) : 0,
              }),
              tpl('还有 {a} 课没完成，其中 {b} 课正在进行中', {
                a: totalLessons - done.length,
                b: learning.length,
              }),
              tpl('已完成 {a} 课，约占全部内容的 {b}%', {
                a: done.length,
                b: totalLessons ? Math.round((done.length / totalLessons) * 100) : 0,
              }),
            ]}
            tone="info"
          />
        </div>
      </Card>

      {/* 快捷入口（从首页搬来） */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: Palette, label: tr('材质实验室'), path: '/materials', n: contentStats.materialCount },
          { icon: Lightbulb, label: tr('灯光实验室'), path: '/lighting', n: contentStats.lightingCount },
          { icon: Camera, label: tr('相机实验室'), path: '/camera', n: contentStats.cameraCount },
          { icon: Clapperboard, label: tr('动画实验室'), path: '/animation', n: contentStats.animationCount },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="card flex flex-col items-center gap-2 py-5 hover:border-blender-orange transition-colors"
          >
            <item.icon className="w-6 h-6 text-blender-orange" />
            <span className="text-sm text-text-secondary">{item.label}</span>
            <span className="text-3xs text-text-tertiary">{tpl('{n} 项', { n: item.n })}</span>
          </Link>
        ))}
      </div>

      <Link
        to="/su-to-blender"
        className="card flex items-center gap-4 mt-3 hover:border-blender-orange transition-colors"
      >
        <RefreshCw className="w-6 h-6 text-blender-orange shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-text-primary">
            {tr('实际工作模块')}
          </p>
          <p className="text-3xs text-text-tertiary mt-0.5">
            {tpl('{n} 条从 SU 到 Blender 的操作流程', { n: workflows.length })}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-text-tertiary shrink-0" />
      </Link>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
      <p className="text-base font-bold text-text-primary leading-none">{value}</p>
      <p className="text-3xs text-text-tertiary mt-1.5">{label}</p>
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
