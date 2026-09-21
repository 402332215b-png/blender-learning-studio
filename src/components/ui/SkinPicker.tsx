import { useEffect, useState } from 'react'
import {
  SKINS,
  SKIN_PICKS_COUNT,
  readPickedSkins,
  skinUnlockAt,
  type SkinId,
  type Skin,
} from '../../lib/skins'
import { tr, tpl } from '../../i18n'
import { useThemeStore, useProgressStore } from '../../stores'
import {
  computeCredits,
  isSkinUnlocked,
  startPracticeSync,
  type Credits,
} from '../../lib/credits'

interface PreviewSpec {
  bg: string
  fg: string
  accent: string
  accentInk: string
  sub: string
  cardBg: string
  block: string
  motif: 'clean' | 'line' | 'bubble' | 'glass' | 'print' | 'leaf' | 'editorial' | 'product' | 'collage' | 'metric' | 'swatch'
}

const PREVIEW: Record<SkinId, PreviewSpec> = {
  apple: { bg: '#f5f5f7', fg: '#1d1d1f', accent: '#0071e3', accentInk: '#fff', sub: '#86868b', cardBg: '#fff', block: '#e8e8ed', motif: 'clean' },
  mono: { bg: '#171717', fg: '#f5f5f5', accent: '#f5f5f5', accentInk: '#111', sub: '#8b8b8b', cardBg: '#222', block: '#343434', motif: 'line' },
  candy: { bg: '#fff0f7', fg: '#8a2a55', accent: '#e8509a', accentInk: '#fff', sub: '#c24a84', cardBg: '#fff', block: '#ffd2e8', motif: 'bubble' },
  glass: { bg: 'linear-gradient(135deg,#dbeafe,#e9d5ff)', fg: '#26384b', accent: '#3b82f6', accentInk: '#fff', sub: '#6685a3', cardBg: 'rgba(255,255,255,.75)', block: 'rgba(255,255,255,.55)', motif: 'glass' },
  print: { bg: '#faf8f2', fg: '#211c16', accent: '#211c16', accentInk: '#faf8f2', sub: '#74695e', cardBg: '#fff', block: '#e9e1d4', motif: 'print' },
  forest: { bg: '#eef4e9', fg: '#29412e', accent: '#4f7d52', accentInk: '#fff', sub: '#6f8970', cardBg: '#fff', block: '#d7e5d2', motif: 'leaf' },
  retro: { bg: '#d49b62', fg: '#16120f', accent: '#16120f', accentInk: '#f6e8d2', sub: '#784528', cardBg: '#f3dfc0', block: '#b96835', motif: 'editorial' },
  launch: { bg: '#edf0e7', fg: '#243226', accent: '#63734b', accentInk: '#fff', sub: '#7d8773', cardBg: '#fdfdf9', block: '#ccd5be', motif: 'product' },
  fashion: { bg: '#ece9df', fg: '#101010', accent: '#101010', accentInk: '#fff', sub: '#5d6255', cardBg: '#f7f4ec', block: '#a8b398', motif: 'collage' },
  trust: { bg: '#183d2a', fg: '#f3f7ef', accent: '#c7ff48', accentInk: '#173120', sub: '#8fb69d', cardBg: '#245039', block: '#326448', motif: 'metric' },
  brandbook: { bg: 'linear-gradient(145deg,#ff7a39,#ff4968)', fg: '#17203d', accent: '#17203d', accentInk: '#fff', sub: '#7e3246', cardBg: '#f5f7fb', block: '#c9d7ef', motif: 'swatch' },
}

function Motif({ spec }: { spec: PreviewSpec }) {
  const common = { background: spec.block }
  switch (spec.motif) {
    case 'editorial':
      return <div className="absolute left-3 top-3 bottom-3 w-7 border-2" style={{ borderColor: spec.fg, background: spec.block }} />
    case 'product':
      return <div className="absolute right-3 top-3 w-10 h-10 rounded-full" style={common} />
    case 'collage':
      return <><div className="absolute left-2 top-2 w-9 h-7" style={common} /><div className="absolute right-2 bottom-2 w-7 h-8" style={{ background: '#a95f52' }} /></>
    case 'metric':
      return <div className="absolute right-3 top-2 text-[19px] font-black" style={{ color: spec.accent }}>73%</div>
    case 'swatch':
      return <div className="absolute right-2 top-2 flex gap-1"><i className="w-3 h-3 rounded-full bg-[#ff7043]" /><i className="w-3 h-3 rounded-full bg-[#17203d]" /><i className="w-3 h-3 rounded-full bg-[#c9d7ef]" /></div>
    case 'leaf':
      return <div className="absolute right-4 top-3 w-6 h-9 rounded-[70%_10%_70%_10%] rotate-12" style={common} />
    case 'bubble':
      return <div className="absolute right-3 top-3 w-9 h-9 rounded-full" style={common} />
    case 'glass':
      return <div className="absolute right-3 top-3 w-10 h-8 rounded-lg border border-white/70 backdrop-blur" style={common} />
    case 'print':
      return <div className="absolute inset-x-3 top-3 h-px" style={{ background: spec.fg }} />
    case 'line':
      return <div className="absolute right-3 top-3 w-8 h-px" style={{ background: spec.fg }} />
    default:
      return null
  }
}

/**
 * 一张皮肤的预览小卡。
 *
 * 导出是为了让「开局挑两套」的引导（SkinOnboarding）复用同一张预览，
 * 免得同一套皮肤在两个地方画出两种样子。
 */
export function SkinPreviewCard({ skin }: { skin: Skin }) {
  const spec = PREVIEW[skin.id]
  const square = skin.vars['sym-ink'] === 'square'
  return (
    <div className="relative w-full h-[70px] overflow-hidden" style={{ background: spec.bg, color: spec.fg, fontFamily: skin.vars['font-sans'] }}>
      <Motif spec={spec} />
      <div className="absolute left-2.5 right-2.5 bottom-2.5">
        <p className="truncate leading-none" style={{ fontFamily: skin.vars['font-display'], fontSize: skin.id === 'fashion' ? 14 : 11.5, fontWeight: skin.id === 'fashion' ? 900 : 700, letterSpacing: skin.vars['title-letter-spacing'] }}>{skin.name}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-semibold" style={{ borderRadius: skin.vars['radius-btn'], background: spec.accent, color: spec.accentInk, letterSpacing: skin.vars['button-letter-spacing'] }}>{tr('开始学习')}</span>
          <span className="grow h-[3px]" style={{ borderRadius: square ? 0 : 999, background: spec.sub, opacity: .45 }}><i className="block w-1/2 h-full" style={{ borderRadius: 'inherit', background: spec.accent }} /></span>
        </div>
      </div>
    </div>
  )
}

/** 锁标。不用 emoji —— 不同系统画出来的差别太大，SVG 才能保证一致。 */
function LockIcon({ size = 11 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" />
    </svg>
  )
}

export interface LockedSkinInfo {
  skin: Skin
  unlockAt: number
  credits: Credits
}

export function SkinPicker({
  onLockedClick,
}: {
  /** 点了锁住的皮肤。由外层决定怎么引导（一般是弹「先开 Blender」）。 */
  onLockedClick?: (info: LockedSkinInfo) => void
}) {
  const skin = useThemeStore((state) => state.skin)
  const setSkin = useThemeStore((state) => state.setSkin)
  const progress = useProgressStore((state) => state.progress)

  // 桌面版会不定时把 Blender 实操数据推过来。收到就让自己重渲染一次，
  // 学分随之更新 —— 否则用户得刷新页面才能看到刚做出来的一课。
  const [, setPracticeTick] = useState(0)
  useEffect(
    () => startPracticeSync(() => setPracticeTick((n) => n + 1)),
    [],
  )

  const credits = computeCredits(progress)
  const picked = readPickedSkins()

  // 排个序：**开局自己挑的两套排最前**（那是他的东西，一眼要看得到），
  // 其余按解锁门槛从低到高 —— 一眼能看出「再攒一点就能拿到下一个」，比乱序有盼头。
  const ordered = [...SKINS].sort((a, b) => {
    const pa = picked.indexOf(a.id)
    const pb = picked.indexOf(b.id)
    if (pa !== -1 || pb !== -1) {
      // 没挑过的排后面（indexOf 为 -1，加个大数即可）
      return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb)
    }
    return skinUnlockAt(a.id) - skinUnlockAt(b.id)
  })

  return (
    <div>
      <p className="text-xs text-text-tertiary mb-2">{tr('皮肤风格')}</p>
      <p className="text-3xs text-text-tertiary mb-2 leading-relaxed">
        {tpl('开局你挑的 {n} 套随时可切换，其余的靠学分一套一套解锁。', {
          n: SKIN_PICKS_COUNT,
        })}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {ordered.map((item) => {
          const active = item.id === skin
          const unlockAt = skinUnlockAt(item.id)
          const isPicked = picked.includes(item.id)
          const locked = !isSkinUnlocked(item.id, credits)
          const lack = Math.max(0, unlockAt - credits.total)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (locked) onLockedClick?.({ skin: item, unlockAt, credits })
                else setSkin(item.id)
              }}
              aria-pressed={active}
              aria-disabled={locked}
              title={locked ? tr('还没解锁') : tr(item.desc)}
              className={`relative overflow-hidden rounded-xl border text-left transition-colors ${
                active
                  ? 'border-blender-orange'
                  : locked
                    ? 'border-dark-border cursor-pointer'
                    : 'border-dark-border hover:border-text-tertiary'
              }`}
              style={{ background: PREVIEW[item.id].cardBg }}
            >
              <div style={locked ? { filter: 'grayscale(1) opacity(.45)' } : undefined}>
                <SkinPreviewCard skin={item} />
              </div>
              <div className="px-2 py-1.5 border-t" style={{ borderColor: 'rgb(var(--hairline))' }}>
                <p className={`text-xs font-medium truncate flex items-center gap-1 ${locked ? 'text-text-tertiary' : 'text-text-primary'}`}>
                  {locked && <LockIcon />}
                  {tr(item.name)}
                </p>
                {/* 三种状态各给一句话：开局自选 / 还差学分 / 已解锁（不说话） */}
                {isPicked ? (
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgb(var(--accent))' }}>
                    {tr('开局所选')}
                  </p>
                ) : locked ? (
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    {tpl('还差 {n} 学分', { n: lack })}
                  </p>
                ) : null}
              </div>
              {active && <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold" style={{ background: 'rgb(var(--accent))', color: 'rgb(var(--accent-ink))' }}>✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
