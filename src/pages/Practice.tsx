import { useMemo, useState } from 'react'
import { Search, Star, X, Target, Clock } from 'lucide-react'
import { Card, PageHeader, Tag, Kbd, EmptyState } from '../components/ui'
import { useProgressStore } from '../stores'
import {
  shortcutCategories,
  allShortcuts,
  practiceLevels,
} from '../lib/content'
import type { Shortcut } from '../types'
import { tr, tpl } from '../i18n'

// ---------------------------------------------------------------------------
// 快捷键中心
// ---------------------------------------------------------------------------

export function Shortcuts() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<string>('all')
  const favorites = useProgressStore((s) => s.favorites)
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list: Shortcut[] = allShortcuts
    if (cat !== 'all') {
      list = shortcutCategories.find((c) => c.id === cat)?.shortcuts ?? []
    }
    if (!q) return list
    return list.filter((s) =>
      [s.keys, s.nameCn, s.nameEn, s.function, s.interiorUse, s.suRef]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [query, cat])

  const favShortcuts = favorites.filter((f) => f.itemType === 'shortcut')

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="SHORTCUT LIBRARY"
        title={tr('快捷键中心')}
        description={tpl('{a} 个室内设计常用快捷键，含功能说明、室内用法和 SketchUp 对照。', {
          a: allShortcuts.length,
        })}
      />

      {/* 搜索框 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr('搜索按键、命令或分类，例如：移动 / G / 建模')}
          aria-label={tr('搜索快捷键')}
          className="w-full rounded-lg border border-dark-border bg-dark-surface pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blender-orange"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            aria-label={tr('清空搜索')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 分类 */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setCat('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            cat === 'all'
              ? 'bg-blender-orange text-white border-blender-orange'
              : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
          }`}
        >
          {tr('全部')}
          <span className="ml-1.5 text-3xs opacity-70">{allShortcuts.length}</span>
        </button>
        {shortcutCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              cat === c.id
                ? 'bg-blender-orange text-white border-blender-orange'
                : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
            }`}
          >
            {c.name}
            <span className="ml-1.5 text-3xs opacity-70">
              {c.shortcuts.length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px] items-start">
        {/* 列表 */}
        <div>
          {rows.length === 0 ? (
            <EmptyState
              title={tr('没有匹配的快捷键')}
              description={tr('换个关键词试试，比如「移动」「渲染」「相机」。')}
            />
          ) : (
            <div className="space-y-2">
              {rows.map((s) => {
                const isFav = favShortcuts.some((f) => f.itemId === s.id)
                return (
                  <div
                    key={s.id}
                    className="rounded-lg border border-dark-border bg-dark-surface px-4 py-3 hover:border-warm-gray transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Kbd>{s.keys}</Kbd>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-text-primary">
                            {s.nameCn}
                          </p>
                          <span className="text-3xs text-text-tertiary">
                            {s.nameEn}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                          {s.function}
                        </p>
                        {s.interiorUse && (
                          <p className="text-3xs text-text-tertiary mt-1.5">
                            <span className="text-blender-orange">{tr('室内用法')}</span>
                            {' · '}
                            {s.interiorUse}
                          </p>
                        )}
                        {s.suRef && s.suRef !== tr('—（无）') && (
                          <p className="text-3xs text-text-tertiary mt-1">
                            <span className="text-status-learning">{tr('SU 对应')}</span>
                            {' · '}
                            {s.suRef}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          toggleFavorite({
                            id: `${s.id}-fav`,
                            itemType: 'shortcut',
                            itemId: s.id,
                            title: `${s.keys} · ${s.nameCn}`,
                            createdAt: new Date().toISOString(),
                          })
                        }
                        aria-label={tpl('收藏 {n}', { n: s.nameCn })}
                        className={`shrink-0 p-1.5 rounded-md transition-colors ${
                          isFav
                            ? 'text-blender-orange'
                            : 'text-text-tertiary hover:text-text-primary'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 侧栏：我的收藏 */}
        <Card eyebrow="FAVORITES" title={tpl('我的收藏 ({n})', { n: favShortcuts.length })}>
          {favShortcuts.length === 0 ? (
            <p className="text-3xs text-text-tertiary leading-relaxed">
              {tr('点右侧的星标，把常用快捷键收藏起来，方便随时查。')}
            </p>
          ) : (
            <ul className="space-y-2">
              {favShortcuts.map((f) => {
                const s = allShortcuts.find((x) => x.id === f.itemId)
                if (!s) return null
                return (
                  <li
                    key={f.id}
                    className="flex items-center gap-2 rounded-md border border-dark-border bg-dark-bg px-2.5 py-2"
                  >
                    <Kbd>{s.keys}</Kbd>
                    <span className="text-3xs text-text-secondary truncate">
                      {s.nameCn}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="text-3xs text-text-tertiary leading-relaxed">
              {tpl('共 {a} 个分类 · {b} 条快捷键', {
                a: shortcutCategories.length,
                b: allShortcuts.length,
              })}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 练习
// ---------------------------------------------------------------------------

export function Practice() {
  const [active, setActive] = useState(practiceLevels[0]?.id)
  const current = practiceLevels.find((l) => l.id === active) ?? practiceLevels[0]

  const totalTasks = practiceLevels.reduce((n, l) => n + l.tasks.length, 0)

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="PRACTICE"
        title={tr('练习体系')}
        description={tpl('{a} 个难度等级、{b} 个练习任务 —— 从最基础的操作到完整的室内漫游视频。', {
          a: practiceLevels.length,
          b: totalTasks,
        })}
      />

      {/* 等级切换 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {practiceLevels.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              active === l.id
                ? 'bg-blender-orange text-white border-blender-orange'
                : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
            }`}
          >
            <span className="font-mono mr-1.5">L{l.level}</span>
            {l.name}
          </button>
        ))}
      </div>

      {current && (
        <div className="grid gap-4 lg:grid-cols-[1fr_300px] items-start">
          <div className="space-y-3">
            {current.tasks.map((t, i) => (
              <div
                key={t.taskId}
                className="rounded-lg border border-dark-border bg-dark-surface px-4 py-3 hover:border-blender-orange/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-dark-elevated border border-dark-border text-3xs font-mono text-blender-orange flex items-center justify-center">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-text-primary">
                        {t.title}
                      </p>
                      <span className="inline-flex items-center gap-1 text-3xs text-text-tertiary">
                        <Clock className="w-3 h-3" />
                        {t.estimatedTime}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                      {t.description}
                    </p>
                    <p className="text-3xs text-text-tertiary mt-2 font-mono">
                      {t.taskId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card
            eyebrow={`LEVEL ${current.level}`}
            title={current.name}
            action={<Target className="w-4 h-4 text-blender-orange" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              {current.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Tag tone="accent">{tpl('{n} 个任务', { n: current.tasks.length })}</Tag>
              <Tag>{current.nameEn}</Tag>
            </div>

            <div className="mt-4 pt-4 border-t border-dark-border">
              <p className="text-3xs text-text-tertiary mb-3">{tr('全部等级')}</p>
              <ul className="space-y-1.5">
                {practiceLevels.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => setActive(l.id)}
                      className={`w-full text-left text-3xs px-2 py-1.5 rounded transition-colors ${
                        l.id === active
                          ? 'bg-blender-orange/15 text-blender-orange'
                          : 'text-text-tertiary hover:text-text-primary hover:bg-dark-elevated'
                      }`}
                    >
                      L{l.level} · {l.name}
                      <span className="float-right opacity-60">
                        {l.tasks.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
