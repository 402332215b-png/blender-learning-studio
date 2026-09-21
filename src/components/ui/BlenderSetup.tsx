/**
 * 「连接 Blender」引导弹窗
 *
 * 什么时候弹：用户点了锁住的皮肤 / 锁住的色彩条。
 *
 * 要讲清楚三件事，缺一个用户就会懵：
 *   1. 为什么拿不到 —— 皮肤不是白送的，是在 Blender 里真做出东西换来的；
 *   2. 现在要做什么 —— 先开 Blender，再自动装插件；
 *   3. 装完会怎样 —— 以后在 Blender 里干活，学分自动涨，皮肤自己开。
 *
 * 浏览器直开（没有桌面版桥接）时不能装，这种情况也如实说清楚，
 * 不给一个点了没反应的按钮。
 */

import { useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { tr, tpl } from '../../i18n'
import { desktopBridge, type AddonInstallResult } from '../../lib/desktop'

type Stage = 'idle' | 'installing' | 'ok' | 'error'

export function BlenderSetup({
  open,
  onClose,
  targetName,
  lack,
}: {
  open: boolean
  onClose: () => void
  /** 用户想解锁的那套皮肤名（没有就传 undefined，比如点的是色彩条） */
  targetName?: string
  /** 还差多少学分 */
  lack?: number
}) {
  const [stage, setStage] = useState<Stage>('idle')
  const [result, setResult] = useState<AddonInstallResult | null>(null)
  const bridge = desktopBridge()

  // 每次重新打开都回到初始态，避免残留上一次的成功/失败提示
  useEffect(() => {
    if (open) {
      setStage('idle')
      setResult(null)
    }
  }, [open])

  if (!open) return null

  const install = async () => {
    if (!bridge) return
    setStage('installing')
    try {
      const r = await bridge.installBlenderAddon()
      setResult(r)
      setStage(r.ok ? 'ok' : 'error')
    } catch (e) {
      setResult({ ok: false, message: String(e) })
      setStage('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.55)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={tr('连接 Blender')}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-dark-bg border border-dark-border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题行 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary">{tr('连接 Blender')}</h3>
            <p className="text-3xs text-text-tertiary mt-1">
              {targetName
                ? tpl('「{n}」要在 Blender 里真做出东西才拿得到', { n: targetName })
                : tr('自己挑颜色是走完整条路线后的最后一项奖励')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr('关闭')}
            className="shrink-0 p-1 rounded-lg text-text-tertiary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 说明 */}
        <div className="rounded-xl bg-dark-elevated p-4 mb-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            {tr('皮肤不是签到送的。插件会记录你在 Blender 里真实做过的操作，攒够学分才解锁 —— 在点按钮骗不了这一点上，它和「课程进度」不一样。')}
          </p>
          {typeof lack === 'number' && lack > 0 && (
            <p className="text-3xs text-text-tertiary mt-2">
              {tpl('当前还差 {n} 学分', { n: lack })}
            </p>
          )}
        </div>

        {/* 步骤 */}
        <ol className="space-y-2 mb-4">
          <Step n={1} text={tr('先打开你的 Blender（5.2 或 4.5）')} />
          <Step n={2} text={tr('点下面的按钮，插件会自动装进去并启用')} />
          <Step n={3} text={tr('之后在 Blender 里正常干活，学分自己涨')} />
        </ol>

        {/* 动作区 */}
        {!bridge ? (
          <div className="rounded-xl border border-dark-border p-4">
            <p className="text-xs text-text-primary mb-1">{tr('当前是网页版，装不了插件')}</p>
            <p className="text-3xs text-text-tertiary leading-relaxed">
              {tr('浏览器里的页面碰不到你电脑上的文件，所以只有桌面版（安装包装出来的那个）才有这个能力。')}
            </p>
          </div>
        ) : stage === 'ok' ? (
          <div className="rounded-xl bg-dark-elevated p-4">
            <p className="text-xs text-text-primary">{tr('装好了')}</p>
            {result?.path && (
              <p className="text-3xs text-text-tertiary mt-1 break-all">{result.path}</p>
            )}
            <p className="text-3xs text-text-tertiary mt-2 leading-relaxed">
              {tr('回到 Blender 干一会儿活，再回这里看，学分已经开始涨了。')}
            </p>
          </div>
        ) : stage === 'error' ? (
          <div className="rounded-xl bg-dark-elevated p-4">
            <p className="text-xs text-text-primary">{tr('没装上')}</p>
            <p className="text-3xs text-text-tertiary mt-1 break-all">{result?.message}</p>
            <button
              type="button"
              onClick={install}
              className="mt-3 px-3 py-1.5 rounded-lg border border-dark-border text-xs text-text-primary"
            >
              {tr('再试一次')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={install}
            disabled={stage === 'installing'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: 'rgb(var(--accent))', color: 'rgb(var(--accent-ink))' }}
          >
            {stage === 'installing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {tr('正在安装')}
              </>
            ) : (
              tr('自动安装插件到 Blender')
            )}
          </button>
        )}

        {bridge && stage === 'idle' && (
          <p className="text-3xs text-text-tertiary mt-2 leading-relaxed">
            {tr('插件只连你这台电脑上的 127.0.0.1，不联网、不上传、也不改你的场景。')}
          </p>
        )}
      </div>
    </div>
  )
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold mt-0.5"
        style={{ background: 'rgb(var(--accent))', color: 'rgb(var(--accent-ink))' }}
      >
        {n}
      </span>
      <span className="text-xs text-text-secondary leading-relaxed">{text}</span>
    </li>
  )
}
