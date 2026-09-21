/**
 * 配色调节器
 * ==========
 *
 * 用户 2026-09-20 的要求，原话：「界面颜色，深色和浅色取消，
 * 帮我设计一个色彩手动调节的采用 128 色的过度原理」。
 *
 * 所以这里**没有**「深色 / 浅色」两个按钮，只有两根可以点的带子：
 *
 *   色相带   0–127 级，每级 2.8125°
 *   明暗带   0–10 档，从墨黑到雪白
 *
 * 为什么色相要 128 级而不是直接给个取色器：
 *   取色器（H/S/L 三个滑块 或 系统色盘）对普通用户来说是折磨 ——
 *   能调出"毒"的颜色，还说不清自己想要什么。
 *   128 级色相带把可选项收敛成"一根彩虹"，点哪儿是哪儿；
 *   明暗单独一根，管"多亮"。两根加起来 1408 种组合，
 *   已经远超实际需要，而且**每一种都保证文字读得清**
 *   （对比度由 lib/theme.ts 的 fillPair 兜底）。
 */

import { useEffect, useState } from 'react'
import { useThemeStore, useProgressStore } from '../../stores'
import {
  HUE_STEPS,
  LIGHT_STEPS,
  LIGHT_NAMES,
  hueOf,
  hueToHex,
  palette,
} from '../../lib/theme'
import { tr, tpl } from '../../i18n'
import { computeCredits, isColorUnlocked, startPracticeSync } from '../../lib/credits'
import { COLOR_UNLOCK_AT } from '../../lib/skins'

function LockIcon({ size = 11 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" />
    </svg>
  )
}

export function ColorTuner({
  onLockedClick,
}: {
  /** 点了锁住的色彩区。色彩是成长线最后一项，所以门槛最高。 */
  onLockedClick?: () => void
} = {}) {
  const hue = useThemeStore((s) => s.hue)
  const light = useThemeStore((s) => s.light)
  const setHue = useThemeStore((s) => s.setHue)
  const setLight = useThemeStore((s) => s.setLight)
  const progress = useProgressStore((s) => s.progress)

  // 桌面版推来新的实操数据时重渲染一次，让学分跟着涨（见 SkinPicker 里的同类说明）
  const [, setPracticeTick] = useState(0)
  useEffect(() => startPracticeSync(() => setPracticeTick((n) => n + 1)), [])

  const credits = computeCredits(progress)
  const colorLocked = !isColorUnlocked(credits)
  const lack = Math.max(0, COLOR_UNLOCK_AT - credits.total)

  const cur = palette(hue, light)
  const lightNames = LIGHT_NAMES

  return (
    <div className="space-y-5">
      {/* ---------- 色相带 ---------- */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-xs text-text-tertiary flex items-center gap-1.5">
            {tr('色彩')}
            {colorLocked && (
              <span className="flex items-center gap-1 text-text-tertiary">
                <LockIcon />
                {tr('未解锁')}
              </span>
            )}
          </p>
          <p className="text-3xs text-text-tertiary">
            {tpl('第 {n} / {total} 级 · {deg}°', {
              n: hue + 1,
              total: HUE_STEPS,
              deg: Math.round(hueOf(hue)),
            })}
          </p>
        </div>

        <div
          className="grid h-7 rounded-lg overflow-hidden border border-dark-border"
          style={{
            gridTemplateColumns: `repeat(${HUE_STEPS}, minmax(0, 1fr))`,
            filter: colorLocked ? 'grayscale(1) opacity(.45)' : undefined,
            pointerEvents: colorLocked ? 'none' : undefined,
          }}
          role="group"
          aria-label={tr('色彩')}
        >
          {Array.from({ length: HUE_STEPS }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setHue(i)}
              title={`${i + 1} · ${Math.round(hueOf(i))}°`}
              aria-label={tpl('第 {n} 级', { n: i + 1 })}
              aria-pressed={i === hue}
              className="relative h-full w-full p-0 border-0"
              style={{ backgroundColor: hueToHex(i) }}
            >
              {/* 当前项标记：上下各一小段白/黑描边，在任何色相上都看得见 */}
              {i === hue && (
                <span
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full"
                  style={{
                    background: '#fff',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.45)',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- 明暗带 ---------- */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-xs text-text-tertiary">{tr('明暗')}</p>
          <p className="text-3xs text-text-tertiary">
            {lightNames[light]}
          </p>
        </div>

        <div
          className="grid grid-cols-11 gap-1.5"
          role="group"
          aria-label={tr('明暗')}
          style={{
            filter: colorLocked ? 'grayscale(1) opacity(.45)' : undefined,
            pointerEvents: colorLocked ? 'none' : undefined,
          }}
        >
          {Array.from({ length: LIGHT_STEPS }, (_, i) => {
            const swatch = palette(hue, i)
            const active = i === light
            return (
              <button
                key={i}
                type="button"
                onClick={() => setLight(i)}
                title={lightNames[i]}
                aria-label={lightNames[i]}
                aria-pressed={active}
                className="h-10 rounded-lg transition-transform"
                style={{
                  background: `rgb(${swatch.vars.surface})`,
                  boxShadow: active
                    ? '0 0 0 2px rgb(var(--bg)), 0 0 0 4px rgb(var(--accent))'
                    : 'inset 0 0 0 1px rgb(var(--hairline))',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* ---------- 读数 ---------- */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 rounded-xl bg-dark-elevated">
        <span className="text-3xs text-text-tertiary">
          {tr('当前主色')}{' '}
          <b className="text-xs text-text-primary font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {cur.accentHex}
          </b>
        </span>
        <span className="flex items-center gap-2 text-3xs text-text-tertiary">
          {tr('实底色上的字')}
          <span
            className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-3xs font-medium"
            style={{ background: `rgb(${cur.vars.accent})`, color: cur.accentInk }}
          >
            {tr('示例')}
          </span>
        </span>
      </div>

      {colorLocked && (
        <button
          type="button"
          onClick={onLockedClick}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-elevated text-left transition-colors hover:bg-dark-bg"
        >
          <LockIcon size={14} />
          <span className="text-xs text-text-primary">
            {tr('自己挑颜色是最后一项奖励')}
          </span>
          <span className="text-3xs text-text-tertiary ml-auto shrink-0">
            {tpl('还差 {n} 学分', { n: lack })}
          </span>
        </button>
      )}

      <p className="text-3xs text-text-tertiary leading-relaxed">
        {tr(
          '这两根带子会同时改变页面底、卡片、描边、文字和强调色，整套一起变。设置只保存在这台电脑上。',
        )}
      </p>
    </div>
  )
}
