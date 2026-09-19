import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Home,
  GitCompare,
  AlertTriangle,
  Target,
  NotebookPen,
  ExternalLink,
  Star,
  Check,
} from 'lucide-react'
import {
  Card,
  PageHeader,
  StatusBadge,
  Tag,
  Kbd,
  StepList,
  BulletList,
  ProgressBar,
} from '../components/ui'
import { useProgressStore } from '../stores'
import {
  lessonById,
  weekOfLesson,
  courseByRoute,
  phaseName,
  neighborsOf,
} from '../lib/content'
import { LEARNING_STATUS_LABELS, type LearningStatus } from '../types'

const STATUS_ORDER: LearningStatus[] = [
  'learning',
  'completed',
  'mastered',
  'needs_review',
]

export function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = lessonId ? lessonById[lessonId] : undefined

  const record = useProgressStore((s) => (lessonId ? s.progress[lessonId] : undefined))
  const notes = useProgressStore((s) => s.notes)
  const favorites = useProgressStore((s) => s.favorites)
  const sessions = useProgressStore((s) => s.sessions)
  const setLessonStatus = useProgressStore((s) => s.setLessonStatus)
  const setLessonProgress = useProgressStore((s) => s.setLessonProgress)
  const setNote = useProgressStore((s) => s.setNote)
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite)

  const [noteDraft, setNoteDraft] = useState('')

  // 载入已有笔记
  useEffect(() => {
    setNoteDraft(lessonId ? (notes[lessonId]?.content ?? '') : '')
  }, [lessonId, notes])

  // 自动保存笔记（防抖 600ms）
  useEffect(() => {
    if (!lessonId) return
    const timer = window.setTimeout(() => {
      if (noteDraft !== (notes[lessonId]?.content ?? '')) {
        setNote(lessonId, noteDraft)
      }
    }, 600)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteDraft, lessonId])

  if (!lesson) return <Navigate to="/learn" replace />

  const week = weekOfLesson(lesson)
  const course = courseByRoute[lesson.routeId]
  const { prev, next } = neighborsOf(lesson)
  const status: LearningStatus = record?.status ?? 'not_started'
  const isFav = favorites.some((f) => f.itemId === lesson.lessonId)
  const studiedCount = sessions.filter((s) => s.lessonId === lesson.lessonId).length
  const practiceDone = (record?.progress ?? 0) >= 100

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* 面包屑 */}
      <Link
        to={`/learn/route-${lesson.routeId.toLowerCase()}`}
        className="inline-flex items-center gap-2 text-xs text-text-tertiary hover:text-blender-orange transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {course?.routeName} · 第 {lesson.week} 周
        {week ? ` · ${phaseName(lesson.routeId, week.phase)}` : ''}
      </Link>

      <PageHeader
        kicker={`${lesson.lessonId} · 第 ${lesson.lessonNumber} 课`}
        title={lesson.title}
        description={lesson.objective}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <button
              onClick={() =>
                toggleFavorite({
                  id: `${lesson.lessonId}-fav`,
                  itemType: 'lesson',
                  itemId: lesson.lessonId,
                  title: lesson.title,
                  createdAt: new Date().toISOString(),
                })
              }
              className={`btn ${
                isFav
                  ? 'btn-primary'
                  : 'btn-secondary'
              } inline-flex items-center gap-2 text-xs`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
              {isFav ? '已收藏' : '收藏'}
            </button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr] items-start">
        {/* 主内容 */}
        <div className="space-y-4">
          {/* 核心讲义 */}
          <Card eyebrow="CONCEPT · 核心讲义" title="原理">
            <p className="text-sm text-text-secondary leading-relaxed">
              {lesson.principle}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {lesson.shortcut && lesson.shortcut !== '—' && (
                <>
                  <span className="text-[11px] text-text-tertiary">快捷键</span>
                  {lesson.shortcut.split(/[·,，]/).map((k) => (
                    <Kbd key={k}>{k.trim()}</Kbd>
                  ))}
                </>
              )}
            </div>
            {lesson.englishName && (
              <p className="text-[11px] text-text-tertiary mt-3">
                English: {lesson.englishName}
              </p>
            )}
          </Card>

          {/* 操作步骤 */}
          <Card eyebrow="STEPS · 操作步骤" title="跟着做一遍">
            <StepList steps={lesson.blenderOperations} />
          </Card>

          {/* 室内应用 + SU 对比 */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card eyebrow="INTERIOR USE" title="室内设计里怎么用" action={<Home className="w-4 h-4 text-blender-orange" />}>
              <p className="text-xs text-text-secondary leading-relaxed">
                {lesson.interiorDesignUse}
              </p>
            </Card>
            <Card
              eyebrow="SU REFERENCE"
              title="SketchUp 对照"
              action={<GitCompare className="w-4 h-4 text-status-learning" />}
            >
              <p className="text-xs text-text-secondary leading-relaxed">
                {lesson.sketchupReference}
              </p>
            </Card>
          </div>

          {/* 常见错误 */}
          {lesson.commonMistakes.length > 0 && (
            <Card
              eyebrow="COMMON MISTAKES"
              title="容易踩的坑"
              action={<AlertTriangle className="w-4 h-4 text-status-needs-review" />}
            >
              <BulletList items={lesson.commonMistakes} tone="warn" />
            </Card>
          )}

          {/* 知识点 + 练习任务 */}
          <div className="grid gap-4 md:grid-cols-2">
            {lesson.knowledgePoints.length > 0 && (
              <Card eyebrow="KEY POINTS" title="本课知识点">
                <div className="flex flex-wrap gap-2 mt-3">
                  {lesson.knowledgePoints.map((k) => (
                    <Tag key={k}>{k}</Tag>
                  ))}
                </div>
              </Card>
            )}
            {lesson.practiceTasks.length > 0 && (
              <Card
                eyebrow="PRACTICE"
                title="动手练习"
                action={<Target className="w-4 h-4 text-status-completed" />}
              >
                <div className="space-y-3 mt-1">
                  {lesson.practiceTasks.map((t) => (
                    <div
                      key={t.taskId}
                      className="rounded-lg border border-dark-border bg-dark-bg px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-medium text-text-primary">
                          {t.title}
                        </p>
                        <span className="text-[10px] text-text-tertiary whitespace-nowrap">
                          {t.estimatedTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        {t.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-[10px] text-text-tertiary">难度</span>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < t.difficultyLevel
                                ? 'bg-blender-orange'
                                : 'bg-dark-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 参考来源 */}
          {lesson.shortcut === '—' && null}
          {(lesson as { sources?: { publisher: string; url: string }[] }).sources?.length ? (
            <Card eyebrow="SOURCES" title="参考来源">
              <ul className="space-y-2 mt-2">
                {(lesson as { sources: { publisher: string; url: string }[] }).sources.map(
                  (s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-status-learning hover:underline inline-flex items-center gap-1.5 break-all"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {s.publisher}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </Card>
          ) : null}

          {/* 上一课 / 下一课 */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {prev ? (
              <Link
                to={`/lessons/${prev.lessonId}`}
                className="btn btn-secondary inline-flex items-center gap-2 text-xs max-w-[45%]"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/lessons/${next.lessonId}`}
                className="btn btn-secondary inline-flex items-center gap-2 text-xs max-w-[45%] ml-auto"
              >
                <span className="truncate">{next.title}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* 侧栏 */}
        <aside className="space-y-4">
          {/* 学习状态 */}
          <Card eyebrow="STATUS · 学习状态" title="标记你的进度">
            <div className="grid grid-cols-2 gap-2 mt-1">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setLessonStatus(lesson, s, {
                      reviewed: s === 'needs_review' || s === 'mastered',
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    status === s
                      ? 'bg-blender-orange text-white border-blender-orange'
                      : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary hover:border-warm-gray'
                  }`}
                >
                  {LEARNING_STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-text-tertiary">完成度</span>
                <span className="font-mono text-blender-orange">
                  {record?.progress ?? 0}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={record?.progress ?? 0}
                onChange={(e) =>
                  setLessonProgress(lesson, Number(e.target.value))
                }
                className="w-full accent-blender-orange"
                aria-label="完成度"
              />
              <ProgressBar value={record?.progress ?? 0} />
            </div>

            <div className="mt-4 pt-4 border-t border-dark-border space-y-2 text-[11px]">
              <Row label="开始时间" value={fmtDate(record?.startedAt)} />
              <Row label="完成时间" value={fmtDate(record?.completedAt)} />
              <Row label="最近学习" value={fmtDate(record?.lastStudiedAt)} />
              <Row label="复习次数" value={`${record?.reviewCount ?? 0} 次`} />
              <Row label="学习记录" value={`${studiedCount} 条`} />
            </div>

            {practiceDone && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-status-completed/40 bg-status-completed/10 px-3 py-2">
                <Check className="w-4 h-4 text-status-completed shrink-0" />
                <p className="text-[11px] text-status-completed">
                  本课已标记完成
                </p>
              </div>
            )}
          </Card>

          {/* 学习笔记 */}
          <Card
            eyebrow="NOTES · 学习笔记"
            title="记点什么"
            action={<NotebookPen className="w-4 h-4 text-text-tertiary" />}
          >
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="记录你的理解、踩过的坑、或者项目里怎么用的……"
              rows={6}
              className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blender-orange resize-y"
            />
            <p className="text-[10px] text-text-tertiary mt-2">
              自动保存在本机，不联网。
            </p>
          </Card>

          {/* 本周目标 */}
          {week && (
            <Card eyebrow="THIS WEEK" title={week.title}>
              <p className="text-xs text-text-secondary leading-relaxed">
                {week.objective}
              </p>
              <div className="mt-3 pt-3 border-t border-dark-border">
                <p className="text-[11px] text-text-tertiary mb-2">
                  本周 {week.lessons.length} 课
                </p>
                <div className="space-y-1">
                  {week.lessons.map((l) => (
                    <Link
                      key={l.lessonId}
                      to={`/lessons/${l.lessonId}`}
                      className={`block text-[11px] px-2 py-1 rounded truncate transition-colors ${
                        l.lessonId === lesson.lessonId
                          ? 'bg-blender-orange/15 text-blender-orange'
                          : 'text-text-tertiary hover:text-text-primary hover:bg-dark-elevated'
                      }`}
                    >
                      {l.lessonNumber} {l.title}
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Link
            to="/today"
            className="btn btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            回到今日学习
          </Link>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-text-tertiary">{label}</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  )
}

function fmtDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export { Lightbulb }
