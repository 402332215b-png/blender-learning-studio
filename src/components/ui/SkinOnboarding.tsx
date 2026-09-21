/**
 * 「第一次用，先挑两套皮肤」引导
 *
 * 为什么要有这一步（老板 2026-09-20 定的规则）：
 *   以前开局**送**一套默认皮肤。老板的判断是 ——
 *   「免得客户拿到的是默认皮肤，默认皮肤就对这个软件不感兴趣。」
 *
 *   送一套 = 替用户做了第一个审美决定，他只是**接受**，看完就走；
 *   让他自己挑两套 = 他的第一个动作是**选择**。人对自己选过的东西
 *   会多看两眼，这两套从此是"他的"，其余 9 套也才有"想要"的价值。
 *
 * 三条设计约束：
 *   1. **必须挑满 2 套才能进软件** —— 不给"跳过"。可以跳过的一步等于不存在。
 *   2. **两套之外全部锁死**，靠学分一套一套开（门槛见 lib/skins.ts 的 SKIN_UNLOCK_AT）。
 *   3. 老用户升级上来时，**把他正在用的那套预选上**，
 *      免得挑完发现"我原来那套不见了"。
 */

import { useEffect, useState } from 'react'
import { tr, tpl } from '../../i18n'
import {
  SKINS,
  SKIN_PICKS_COUNT,
  hasPickedSkins,
  readPickedSkins,
  savePickedSkins,
  type SkinId,
} from '../../lib/skins'
import { readSkin } from '../../lib/theme'
import { useAuthStore, useThemeStore } from '../../stores'
import { SkinPreviewCard } from './SkinPicker'

/**
 * 想重新走一遍这个流程时派发这个事件（作者自用：设置页的「重新挑开局皮肤」）。
 *
 * 用事件而不是塞 props，是因为这个组件挂在 App 根节点上，
 * 而触发它的按钮在设置页深处 —— 为了一个按钮把状态提到根再透传下来不值当。
 */
export const SKIN_PICKS_RESET_EVENT = 'bls:skin-picks-reset'

export function SkinOnboarding() {
  const setSkin = useThemeStore((s) => s.setSkin)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authReady = useAuthStore((s) => s.authReady)

  const [done, setDone] = useState(() => hasPickedSkins())
  const [picks, setPicks] = useState<SkinId[]>(() => {
    const saved = readPickedSkins()
    if (saved.length) return saved
    // 没挑过但已经在用某套（老用户升级）→ 预选上，别让他原来那套凭空消失
    const current = readSkin()
    return [current]
  })

  // 作者在设置里清掉了开局选择 → 再弹一次
  useEffect(() => {
    const reopen = () => {
      setPicks(() => {
        const current = readSkin()
        return [current]
      })
      setDone(false)
    }
    window.addEventListener(SKIN_PICKS_RESET_EVENT, reopen)
    return () => window.removeEventListener(SKIN_PICKS_RESET_EVENT, reopen)
  }, [])

  // 登录态还没判出来时不弹 —— 否则已登录用户每次开程序都会闪一下这个窗
  if (done || !authReady || !isAuthenticated) return null

  /** 点一套：已选就取消；没满就加进去；满了就替换最早选的那套（不至于走进死路） */
  function toggle(id: SkinId) {
    setPicks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length < SKIN_PICKS_COUNT) return [...prev, id]
      return [...prev.slice(1), id]
    })
  }

  function confirm() {
    if (picks.length < SKIN_PICKS_COUNT) return
    savePickedSkins(picks)
    // 立即用上挑的第一套，并连带套用它的预设色
    setSkin(picks[0])
    setDone(true)
  }

  const full = picks.length >= SKIN_PICKS_COUNT

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.62)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={tr('挑两套皮肤')}
    >
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-dark-bg border border-dark-border overflow-hidden">
        {/* 标题区 */}
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-text-primary">
            {tr('挑两套你喜欢的皮肤')}
          </h2>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            {tpl('这两套从现在起就归你，随时互相切换。剩下的 {n} 套会在学习过程中一套一套解锁 —— 攒学分就能拿到。', {
              n: SKINS.length - SKIN_PICKS_COUNT,
            })}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-text-tertiary">
              {tpl('已选 {a}/{b}', { a: picks.length, b: SKIN_PICKS_COUNT })}
            </span>
            {full && (
              <span className="text-3xs text-text-tertiary">
                {tr('再点一套会替换最早选的那套')}
              </span>
            )}
          </div>
        </div>

        {/* 卡片区（可滚动，小屏也放得下 11 套） */}
        <div className="px-5 pb-2 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SKINS.map((item) => {
              const order = picks.indexOf(item.id)
              const selected = order !== -1
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={selected}
                  title={tr(item.desc)}
                  className={`relative overflow-hidden rounded-xl border text-left transition-colors ${
                    selected
                      ? 'border-blender-orange'
                      : 'border-dark-border hover:border-text-tertiary'
                  }`}
                >
                  <SkinPreviewCard skin={item} />
                  <div
                    className="px-2 py-1.5 border-t"
                    style={{ borderColor: 'rgb(var(--hairline))' }}
                  >
                    <p className="text-xs font-medium text-text-primary truncate">
                      {tr(item.name)}
                    </p>
                    <p className="text-[10px] text-text-tertiary truncate mt-0.5">
                      {tr(item.desc)}
                    </p>
                  </div>

                  {selected && (
                    <span
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold"
                      style={{
                        background: 'rgb(var(--accent))',
                        color: 'rgb(var(--accent-ink))',
                      }}
                    >
                      {order + 1}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 动作区 */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'rgb(var(--hairline))' }}>
          <button
            type="button"
            onClick={confirm}
            disabled={!full}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-40"
            style={{ background: 'rgb(var(--accent))', color: 'rgb(var(--accent-ink))' }}
          >
            {full
              ? tr('就这两套，开始学习')
              : tpl('还要再挑 {n} 套', { n: SKIN_PICKS_COUNT - picks.length })}
          </button>
          <p className="text-3xs text-text-tertiary mt-2 leading-relaxed">
            {tr('以后在「设置 → 外观」里可以随时在这两套之间切换。')}
          </p>
        </div>
      </div>
    </div>
  )
}
