import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RefreshCw,
  Boxes,
  CheckCircle2,
  ArrowRight,
  Star,
  BookOpen,
  Zap,
  Palette,
  Lightbulb,
  Camera,
  Clapperboard,
  Play,
  Lock,
} from 'lucide-react'
import {
  Card,
  PageHeader,
  Metric,
  BulletList,
  EmptyState,
  ProgressBar,
} from '../components/ui'
import { useAuthStore, useProgressStore } from '../stores'
import { STORAGE_KEYS } from '../lib/auth'
import { markLocalChanged } from '../lib/sync'
import {
  workflows,
  allLessons,
  allShortcuts,
  materials,
  lightingTypes,
  cameraPresets,
  animationCourses,
  practiceLevels,
  routes,
  contentStats,
} from '../lib/content'
import { tr, tpl } from '../i18n'
import {
  workflowUnlockState,
  unlockPhaseName,
  unlockWeeks,
} from '../lib/gate'

// ---------------------------------------------------------------------------
// SU → Blender 工作流
// ---------------------------------------------------------------------------

/** 读本机的勾选状态。坏值一律当空表，不让用户卡在坏数据里 */
function readChecks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.wfChecks)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

/**
 * 「实际工作模块」——把 SketchUp 建模 → Blender 出图的全流程拆成可勾选的清单。
 *
 * 定位和「学习路线」不同：路线是「按周推进的学习计划」，这里是
 * 「接了个项目、今天就要干活」时的操作手册。所以它不按周分，按工作任务分。
 */
export function SuToBlender() {
  const [activeId, setActiveId] = useState(workflows[0]?.id ?? '')

  /**
   * 步骤勾选状态。
   *
   * 两点要注意：
   *  1) 键名走 STORAGE_KEYS.wfChecks（不是裸写 'bls_wf_checks'）——
   *     它现在是**同步快照的一部分**，键名散落两处迟早会写歪一个。
   *  2) 每次变更都要 markLocalChanged()。原因和 updateProfile 那个坑一模一样：
   *     快照版本号取自 localStamp()，而它只看 progress / notes / sessions 的
   *     时间戳。只勾清单不学习时，版本号压根不动 → 推送被判成「本机不比云端新」
   *     而静默丢弃，勾选永远同步不上去。
   *
   * 顺带记一下：这个状态本来只写在 localStorage 里、压根没进同步负载，
   * 换台电脑勾选记录就全没了 —— 对一个「接项目当天要对着用的操作清单」来说
   * 挺致命的，所以并进了快照（schemaVersion 3）。
   */
  const [checked, setChecked] = useState<Record<string, boolean>>(readChecks)
  const lastSyncAt = useAuthStore((s) => s.lastSyncAt)

  /**
   * SU 工作流的解锁状态（门槛 = 路线 B「建模」阶段第 5–8 周全部学完）。
   *
   * 订阅 progress 而不是「挂载时算一次」：用户可能开着这个页面去学习，
   * 学完最后一节再回到这里，应该立刻是解锁后的样子，不该还显示「未解锁」。
   */
  const progress = useProgressStore((s) => s.progress)
  const unlock = workflowUnlockState(progress)

  // 同步拉回新数据后重新读一遍（否则本页还显示同步前那一份，
  // 用户会以为「同步没生效」）
  useEffect(() => {
    setChecked(readChecks())
  }, [lastSyncAt])

  const active = workflows.find((w) => w.id === activeId) ?? workflows[0]

  const save = (next: Record<string, boolean>) => {
    localStorage.setItem(STORAGE_KEYS.wfChecks, JSON.stringify(next))
    markLocalChanged()
    return next
  }

  const toggle = (key: string) => {
    setChecked((prev) => save({ ...prev, [key]: !prev[key] }))
  }

  const resetActive = () => {
    setChecked((prev) => {
      const next = { ...prev }
      active?.steps.forEach((s) => delete next[`${active.id}:${s.id}`])
      return save(next)
    })
  }

  // ---- 未解锁：只给解锁条件，不渲染工作流内容 ----
  // 用户 2026-09-19 的要求：学完路线 B 的「建模」部分再解锁 SU 工作流。
  // 注意是**显示但锁住**，不是隐藏 —— 让人看得见目标、也知道还差多少。
  if (!unlock.unlocked) {
    return <WorkflowLocked unlock={unlock} />
  }

  if (!active) {
    return (
      <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
        <EmptyState title={tr('没有可用的工作流数据')} />
      </div>
    )
  }

  const doneCount = active.steps.filter(
    (s) => checked[`${active.id}:${s.id}`],
  ).length

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="SU → BLENDER"
        title={tr('实际工作模块')}
        description={tr('这不是学习计划，是干活时对着用的操作清单。按工作类型选一条流程，从 SketchUp 模型检查一路走到 Blender 出图，每一步都标注了具体操作。')}
      />

      {/* 概况 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Metric value={workflows.length} label={tr('工作流程')} tone="on" />
        <Metric
          value={workflows.reduce((n, w) => n + w.steps.length, 0)}
          label={tr('操作步骤总数')}
        />
        <Metric value={contentStats.lessonCount} label={tr('配套课时')} />
        <Metric value={allShortcuts.length} label={tr('快捷键可查')} />
      </div>

      {/* 工作流选择 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          {tr('选择你的工作类型')}
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((w) => {
            const isActive = w.id === active.id
            const n = w.steps.filter((s) => checked[`${w.id}:${s.id}`]).length
            const pct = w.steps.length ? (n / w.steps.length) * 100 : 0
            return (
              <button
                key={w.id}
                onClick={() => setActiveId(w.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  isActive
                    ? 'border-blender-orange bg-blender-orange/5 shadow-lg shadow-blender-orange/5'
                    : 'border-dark-border bg-dark-surface hover:border-blender-orange/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-blender-orange text-white'
                        : 'bg-dark-elevated text-text-tertiary'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {w.name}
                    </p>
                    <p className="text-3xs text-text-tertiary mt-0.5 font-mono">
                      {w.nameEn}
                    </p>
                  </div>
                </div>
                <p className="text-3xs text-text-secondary mt-2.5 leading-relaxed">
                  {w.description}
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-3xs mb-1">
                    <span className="text-text-tertiary">
                      {tpl('{n} 步', { n: w.steps.length })}
                    </span>
                    <span className="text-blender-orange">
                      {n}/{w.steps.length}
                    </span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 步骤清单 */}
      <Card
        eyebrow={active.nameEn.toUpperCase()}
        title={tpl('{name} · {n} 步', { name: active.name, n: active.steps.length })}
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-blender-orange font-medium">
              {doneCount}/{active.steps.length}
            </span>
            {doneCount > 0 && (
              <button
                onClick={resetActive}
                className="text-3xs text-text-tertiary hover:text-text-primary transition-colors"
              >
                {tr('重置')}
              </button>
            )}
          </div>
        }
      >
        <p className="text-xs text-text-secondary leading-relaxed mb-1">
          {active.description}
        </p>
        <ProgressBar
          value={active.steps.length ? (doneCount / active.steps.length) * 100 : 0}
        />

        <ol className="mt-5 space-y-2">
          {active.steps.map((s, i) => {
            const key = `${active.id}:${s.id}`
            const on = !!checked[key]
            return (
              <li key={s.id}>
                <button
                  onClick={() => toggle(key)}
                  className={`w-full text-left flex items-start gap-3 rounded-lg border px-4 py-3 transition-all ${
                    on
                      ? 'border-status-completed/40 bg-status-completed/5'
                      : 'border-dark-border bg-dark-bg hover:border-blender-orange/40'
                  }`}
                >
                  <span
                    className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center text-3xs font-mono transition-colors ${
                      on
                        ? 'border-status-completed bg-status-completed text-white'
                        : 'border-dark-border bg-dark-elevated text-blender-orange'
                    }`}
                  >
                    {on ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span
                        className={`text-xs font-medium ${
                          on
                            ? 'text-text-tertiary line-through'
                            : 'text-text-primary'
                        }`}
                      >
                        {s.name}
                      </span>
                      <span className="text-3xs text-text-tertiary font-mono">
                        {s.nameEn}
                      </span>
                    </div>
                    <p className="text-3xs text-text-secondary mt-1 leading-relaxed">
                      {s.detail}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </Card>

      {/* 相关资源 */}
      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <Card eyebrow="GO DEEPER" title={tr('做这条流程卡住时，去这些地方')}>
          <ul className="space-y-2">
            <ResLink
              to="/learn/route-a"
              icon={BookOpen}
              title={tr('路线 A — SU + Blender 工作路线')}
              desc={tr('12 周工作型计划，和这套流程一一对应')}
            />
            <ResLink
              to="/library/shortcuts"
              icon={Zap}
              title={tr('快捷键中心')}
              desc={tpl('{n} 个快捷键，含 SU 对照', { n: allShortcuts.length })}
            />
            <ResLink
              to="/materials"
              icon={Palette}
              title={tr('材质实验室')}
              desc={tpl('{n} 个室内常用材质的参数', { n: materials.length })}
            />
            <ResLink
              to="/lighting"
              icon={Lightbulb}
              title={tr('灯光实验室')}
              desc={tpl('{n} 种灯光 + 室内布光方案', { n: lightingTypes.length })}
            />
            <ResLink
              to="/camera"
              icon={Camera}
              title={tr('相机实验室')}
              desc={tr('焦距选择与构图技巧')}
            />
            <ResLink
              to="/animation"
              icon={Clapperboard}
              title={tr('动画实验室')}
              desc={tpl('{n} 节漫游视频课', { n: animationCourses.length })}
            />
          </ul>
        </Card>

        <Card eyebrow="CHECKLIST NOTES" title={tr('用之前先看这几条')}>
          <BulletList
            items={[
              tr('清单状态只存在你本机，不上传。关掉软件再打开，勾选还在。'),
              tr('「重置」只清空当前这条流程，其他流程的勾选不受影响。'),
              tr('SU 导出前一定要清 Tag —— 这一步省下来，后面在 Blender 里要花三倍时间。'),
              tr('单位（Units）和缩放（Scale）是最容易被忽略的两步，出问题往往就出在这里。'),
              tr('Eevee 先出低质量预览确认构图，确认没问题再上 Cycles，能省掉大量等待时间。'),
            ]}
            tone="info"
          />
        </Card>
      </div>
    </div>
  )
}

/**
 * SU 工作流未解锁时的页面。
 *
 * 只讲两件事：**为什么进不来** 和 **还差多少**。
 * 刻意不提供「跳过 / 仍然进入」的入口 —— 这道门槛是用户特意要求的，
 * 留个后门等于把需求做没了。
 */
function WorkflowLocked({
  unlock,
}: {
  unlock: { unlocked: boolean; done: number; total: number; remaining: number }
}) {
  const weeks = unlockWeeks()
  const phase = unlockPhaseName()
  const first = weeks[0]
  const last = weeks[weeks.length - 1]
  const pct = unlock.total ? (unlock.done / unlock.total) * 100 : 0

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="SU → BLENDER"
        title={tr('实际工作模块')}
        description={tr(
          '这不是学习计划，是干活时对着用的操作清单。按工作类型选一条流程，从 SketchUp 模型检查一路走到 Blender 出图，每一步都标注了具体操作。',
        )}
      />

      <Card className="max-w-2xl" title={tr('还没有解锁')}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blender-orange/30 bg-blender-orange/10">
            <Lock className="h-5 w-5 text-blender-orange" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-text-secondary">
              {tpl('完成 {phase} 阶段（第 {a}–{b} 周）的全部课时后解锁。', {
                phase,
                a: first,
                b: last,
              })}
            </p>

            <div className="mt-4 flex items-center justify-between text-xs text-text-tertiary">
              <span>
                {tpl('已完成 {d} / {t} 节', { d: unlock.done, t: unlock.total })}
              </span>
              <span>{tpl('还差 {n} 节', { n: unlock.remaining })}</span>
            </div>
            <ProgressBar value={pct} />

            <Link
              to="/learn/route-b"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blender-orange px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {tpl('去学路线 B 第 {a}–{b} 周', { a: first, b: last })}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ResLink({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string
  icon: typeof BookOpen
  title: string
  desc: string
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5 hover:border-blender-orange/50 transition-colors group"
      >
        <div className="w-7 h-7 rounded-md bg-dark-elevated flex items-center justify-center shrink-0 group-hover:bg-blender-orange/15 transition-colors">
          <Icon className="w-3.5 h-3.5 text-blender-orange" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-text-primary truncate">{title}</p>
          <p className="text-3xs text-text-tertiary mt-0.5 truncate">{desc}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-text-tertiary shrink-0 group-hover:text-blender-orange transition-colors" />
      </Link>
    </li>
  )
}

// ---------------------------------------------------------------------------
// 资源库
// ---------------------------------------------------------------------------

/**
 * 资源库 —— 把散在各处的可查内容集中到一个入口。
 *
 * 定位：主页是「今天学什么」，这里是「我想找某个东西」。
 */
export function LibraryHome() {
  const favorites = useProgressStore((s) => s.favorites)
  const progress = useProgressStore((s) => s.progress)

  const done = Object.values(progress).filter(
    (p) => p.status === 'completed' || p.status === 'mastered',
  ).length

  const groups: {
    key: string
    title: string
    desc: string
    icon: typeof BookOpen
    items: { label: string; value: number | string; to: string }[]
  }[] = [
    {
      key: 'learn',
      title: tr('课程与路线'),
      desc: tr('系统学习的主体内容'),
      icon: BookOpen,
      items: [
        { label: tr('学习路线'), value: routes.length, to: '/learn' },
        { label: tr('课时总数'), value: allLessons.length, to: '/learn/route-a' },
        { label: tr('已学完'), value: done, to: '/growth' },
      ],
    },
    {
      key: 'shortcut',
      title: tr('快捷键'),
      desc: tr('按键速查，含 SU 对照'),
      icon: Zap,
      items: [
        { label: tr('快捷键总数'), value: allShortcuts.length, to: '/library/shortcuts' },
        {
          label: tr('已收藏'),
          value: favorites.filter((f) => f.itemType === 'shortcut').length,
          to: '/library/shortcuts',
        },
      ],
    },
    {
      key: 'lab',
      title: tr('知识实验室'),
      desc: tr('材质 / 灯光 / 相机 / 动画'),
      icon: Palette,
      items: [
        { label: tr('材质'), value: materials.length, to: '/materials' },
        { label: tr('灯光类型'), value: lightingTypes.length, to: '/lighting' },
        { label: tr('相机预设'), value: cameraPresets.length, to: '/camera' },
        { label: tr('动画课程'), value: animationCourses.length, to: '/animation' },
      ],
    },
    {
      key: 'practice',
      title: tr('练习'),
      desc: tr('按难度递进的手上功夫'),
      icon: Play,
      items: [
        { label: tr('难度等级'), value: practiceLevels.length, to: '/practice' },
        {
          label: tr('任务总数'),
          value: practiceLevels.reduce((n, l) => n + l.tasks.length, 0),
          to: '/practice',
        },
      ],
    },
    {
      key: 'workflow',
      title: tr('实际工作'),
      desc: tr('干活时对着用的操作清单'),
      icon: Boxes,
      items: [
        { label: tr('工作流程'), value: workflows.length, to: '/su-to-blender' },
        {
          label: tr('步骤总数'),
          value: workflows.reduce((n, w) => n + w.steps.length, 0),
          to: '/su-to-blender',
        },
      ],
    },
    {
      key: 'fav',
      title: tr('我的收藏'),
      desc: tr('你标过星的内容都在这里'),
      icon: Star,
      items: [
        { label: tr('收藏总数'), value: favorites.length, to: '/growth' },
        {
          label: tr('待复习'),
          value: Object.values(progress).filter(
            (p) => p.status === 'needs_review',
          ).length,
          to: '/review',
        },
      ],
    },
  ]

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="LIBRARY"
        title={tr('资源库')}
        description={tr('不按学习顺序，按「我现在想要什么」。所有内容都在本机，随时可查。')}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.key} eyebrow={g.title.toUpperCase()} title={g.title}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blender-orange/10 flex items-center justify-center shrink-0">
                <g.icon className="w-4 h-4 text-blender-orange" />
              </div>
              <p className="text-3xs text-text-tertiary leading-relaxed pt-1">
                {g.desc}
              </p>
            </div>
            <ul className="mt-3 space-y-1.5">
              {g.items.map((it) => (
                <li key={it.label}>
                  <Link
                    to={it.to}
                    className="flex items-center justify-between gap-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2 hover:border-blender-orange/50 transition-colors group"
                  >
                    <span className="text-3xs text-text-secondary group-hover:text-text-primary transition-colors">
                      {it.label}
                    </span>
                    <span className="text-xs font-semibold text-blender-orange shrink-0">
                      {it.value}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card eyebrow="CONTENT OVERVIEW" title={tr('全部可查内容一览')}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStat label={tr('学习路线')} value={contentStats.routeCount} />
            <MiniStat label={tr('课时')} value={contentStats.lessonCount} />
            <MiniStat label={tr('周计划')} value={contentStats.weekCount} />
            <MiniStat label={tr('快捷键')} value={contentStats.shortcutCount} />
            <MiniStat label={tr('材质')} value={contentStats.materialCount} />
            <MiniStat label={tr('灯光类型')} value={contentStats.lightingCount} />
            <MiniStat label={tr('相机预设')} value={contentStats.cameraCount} />
            <MiniStat label={tr('动画课程')} value={contentStats.animationCount} />
            <MiniStat label={tr('练习等级')} value={contentStats.practiceLevelCount} />
            <MiniStat label={tr('练习任务')} value={contentStats.practiceTaskCount} />
            <MiniStat label={tr('工作流程')} value={contentStats.workflowCount} />
            <MiniStat label={tr('已收藏')} value={favorites.length} />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card eyebrow="ENTRY POINTS" title={tr('不知道从哪开始？')}>
          <div className="grid gap-2 md:grid-cols-3">
            <EntryBtn
              to="/today"
              icon={Zap}
              title={tr('今日学习')}
              desc={tr('不知道学什么就点这里')}
              primary
            />
            <EntryBtn
              to="/learn"
              icon={BookOpen}
              title={tr('看学习路线')}
              desc={tr('按周推进的完整计划')}
            />
            <EntryBtn
              to="/su-to-blender"
              icon={Boxes}
              title={tr('要干活了')}
              desc={tr('直接拿操作清单')}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

function EntryBtn({
  to,
  icon: Icon,
  title,
  desc,
  primary = false,
}: {
  to: string
  icon: typeof BookOpen
  title: string
  desc: string
  primary?: boolean
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all group ${
        primary
          ? 'border-blender-orange bg-blender-orange/5 hover:bg-blender-orange/10'
          : 'border-dark-border bg-dark-bg hover:border-blender-orange/50'
      }`}
    >
      <Icon className="w-4 h-4 text-blender-orange shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary">{title}</p>
        <p className="text-3xs text-text-tertiary mt-0.5 truncate">{desc}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-blender-orange transition-colors shrink-0" />
    </Link>
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
