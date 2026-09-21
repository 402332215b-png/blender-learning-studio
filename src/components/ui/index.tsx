import type { CSSProperties, ReactNode } from 'react'
import type { LearningStatus } from '../../types'
import { LEARNING_STATUS_LABELS } from '../../types'

/** 把序号塞进 CSS 变量，交给 .anim-stagger 算延迟 */
function staggerIndex(i: number): CSSProperties {
  return { '--i': i } as CSSProperties
}

// ---------------------------------------------------------------------------
// 通用卡片
// ---------------------------------------------------------------------------

export function Card({
  eyebrow,
  title,
  children,
  className = '',
  action,
}: {
  eyebrow?: string
  title?: string
  children?: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <div className={`card ${className}`}>
      {(eyebrow || title || action) && (
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-3xs font-medium tracking-wider text-blender-orange uppercase mb-1">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="text-base font-semibold text-text-primary leading-snug">
                {title}
              </h3>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 页头
// ---------------------------------------------------------------------------

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        {kicker && (
          <p className="text-3xs font-semibold tracking-[0.14em] text-blender-orange uppercase mb-2">
            {kicker}
          </p>
        )}
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="text-sm text-text-secondary mt-2 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

// ---------------------------------------------------------------------------
// 进度条
// ---------------------------------------------------------------------------

export function ProgressBar({
  value,
  label,
  tone = 'orange',
}: {
  value: number
  label?: string
  tone?: 'orange' | 'blue' | 'green'
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  const barTone =
    tone === 'blue'
      ? 'bg-status-learning'
      : tone === 'green'
        ? 'bg-status-completed'
        : 'bg-blender-orange'
  return (
    <div className="mt-3">
      <div className="h-1.5 w-full rounded-full bg-dark-border overflow-hidden">
        <div
          className={`h-full rounded-full ${barTone} transition-all duration-500 ${
            // 只给「进行中」的进度条挂高光：满了就没有"还在动"的语义，
            // 0% 则根本看不见；给这两种挂上纯属噪声。
            v > 0 && v < 100 ? 'shimmer' : ''
          }`}
          style={{ width: `${v}%` }}
        />
      </div>
      {label && (
        <p className="text-xs text-text-tertiary mt-2">
          {label} · {v}%
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 状态徽章
// ---------------------------------------------------------------------------

const STATUS_TONE: Record<LearningStatus, string> = {
  not_started: 'text-text-tertiary border-dark-border bg-dark-elevated',
  learning: 'text-status-learning border-status-learning/40 bg-status-learning/10',
  completed: 'text-status-completed border-status-completed/40 bg-status-completed/10',
  mastered: 'text-blender-orange border-blender-orange/40 bg-blender-orange/10',
  needs_review: 'text-status-needs-review border-status-needs-review/40 bg-status-needs-review/10',
}

export function StatusBadge({ status }: { status: LearningStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-3xs font-medium ${STATUS_TONE[status]}`}
    >
      {LEARNING_STATUS_LABELS[status]}
    </span>
  )
}

// ---------------------------------------------------------------------------
// 信息徽章（中性）
// ---------------------------------------------------------------------------

export function Tag({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'accent' | 'info' | 'warn'
}) {
  const tones = {
    default: 'text-text-secondary border-dark-border bg-dark-elevated',
    accent: 'text-blender-orange border-blender-orange/40 bg-blender-orange/10',
    info: 'text-status-learning border-status-learning/40 bg-status-learning/10',
    warn: 'text-status-needs-review border-status-needs-review/40 bg-status-needs-review/10',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-3xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// 快捷键键帽
// ---------------------------------------------------------------------------

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-2 py-1 rounded-md border border-dark-border bg-dark-bg font-mono text-xs text-text-primary">
      {children}
    </kbd>
  )
}

// ---------------------------------------------------------------------------
// 空状态
// ---------------------------------------------------------------------------

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="card flex flex-col items-center justify-center py-14 text-center">
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description && (
        <p className="text-xs text-text-tertiary mt-2 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 指标块（成长页 / 首页概览用）
// ---------------------------------------------------------------------------

export function Metric({
  value,
  label,
  tone = 'on',
}: {
  value: string | number
  label: string
  tone?: 'on' | 'off'
}) {
  return (
    <div className="rounded-lg border border-dark-border bg-dark-elevated px-3 py-3">
      <p
        className={`text-xl font-bold leading-none ${
          tone === 'on' ? 'text-blender-orange' : 'text-text-primary'
        }`}
      >
        {value}
      </p>
      <p className="text-3xs text-text-tertiary mt-2">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 参数表（材质 / 灯光参数展示）
// ---------------------------------------------------------------------------

export function ParameterList({
  params,
}: {
  params: Record<string, string | number | undefined>
}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '',
  )
  if (entries.length === 0) return null
  return (
    <dl className="mt-3 space-y-1.5">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-start gap-3 text-xs">
          <dt className="w-28 shrink-0 text-text-tertiary font-mono">{k}</dt>
          <dd className="text-text-secondary break-all">{String(v)}</dd>
        </div>
      ))}
    </dl>
  )
}

// ---------------------------------------------------------------------------
// 无序列表（常见错误 / 要点）
// ---------------------------------------------------------------------------

export function BulletList({
  items,
  tone = 'default',
}: {
  items: string[]
  tone?: 'default' | 'warn' | 'info'
}) {
  const dot =
    tone === 'warn'
      ? 'bg-status-needs-review'
      : tone === 'info'
        ? 'bg-status-learning'
        : 'bg-blender-orange'
  return (
    <ul className="mt-3 space-y-2">
      {items.map((t, i) => (
        <li
          key={t}
          className="anim-stagger flex gap-2.5 text-xs leading-relaxed"
          style={staggerIndex(i)}
        >
          {/* 小符号：圆点/方点随皮肤 --sym-dot（50% = 圆，0 = 方） */}
          <span
            className={`mt-1.5 w-1.5 h-1.5 shrink-0 ${dot}`}
            style={{ borderRadius: 'var(--sym-dot)' }}
          />
          <span className="text-text-secondary">{t}</span>
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// 有序步骤
// ---------------------------------------------------------------------------

export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-3 space-y-2.5">
      {steps.map((s, i) => (
        <li
          key={s}
          className="anim-stagger flex gap-3 text-xs leading-relaxed"
          style={staggerIndex(i)}
        >
          {/* 步骤序号方块：圆角随皮肤 --radius-ctl（圆润皮肤更圆，方正皮肤更方） */}
          <span
            className="w-5 h-5 shrink-0 bg-dark-elevated border border-dark-border text-3xs font-mono text-blender-orange flex items-center justify-center"
            style={{ borderRadius: 'var(--radius-ctl)' }}
          >
            {i + 1}
          </span>
          <span className="text-text-secondary pt-0.5">{s}</span>
        </li>
      ))}
    </ol>
  )
}
