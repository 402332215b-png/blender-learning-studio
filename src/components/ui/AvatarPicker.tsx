import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { Avatar } from './Avatar'
import { AVATAR_SIZE, fmtBytes, prepareAvatar, type PreparedAvatar } from '../../lib/avatar'
import { tr, tpl } from '../../i18n'

/**
 * 头像选择区
 * ==========
 *
 * 用户 2026-09-20 的要求，原话：
 *   「上传头像增加一个图片选择区域的功能，这样可以自动减小图片」
 *
 * 所以这里不是一个「上传头像」的小按钮，而是一整块**看得见的选择区**：
 *   拖进来 / 点一下 / Ctrl+V 粘贴 —— 三种放图的方式都行。
 * 选完之后立刻在本地压成 256×256 的 JPEG，并把**压缩前后的尺寸与体积**
 * 并排摆出来（4.2 MB → 68 KB）。
 *
 * 为什么非要把数字摆出来："自动减小图片"如果不能被验证，就只是一句承诺。
 * 用户看一眼就知道省了多少，也就愿意相信那张大图可以直接拖进来。
 *
 * ⚠️ 全程本地完成，原图**不会**离开这台电脑：canvas 压缩 + data URL 存储，
 *    只有压缩后的那一小张会跟着学习进度同步到用户自己的云端账号。
 */
export function AvatarPicker({
  name,
  currentUrl,
  onSave,
  onRemove,
  onMessage,
}: {
  name?: string
  currentUrl?: string
  onSave: (dataUrl: string) => void
  onRemove: () => void
  onMessage: (msg: string) => void
}) {
  const [draft, setDraft] = useState<PreparedAvatar | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  /** 统一的入口：不管从拖拽 / 点击 / 粘贴来的，都走这里 */
  const accept = useCallback(async (file: File) => {
    setErr(null)
    setBusy(true)
    try {
      setDraft(await prepareAvatar(file))
    } catch (e) {
      setErr(e instanceof Error ? e.message : tr('这张图片处理失败了'))
    } finally {
      setBusy(false)
    }
  }, [])

  /* 粘贴：监听整篇文档的 paste，这样用户不需要先点中某个输入框。
     ⚠️ 只在「还没选出草稿」时才接管 —— 否则用户在昵称输入框里粘贴文字
        也会被当成图片处理（虽然型别不符会落到 err，但那是打扰）。 */
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (draft) return
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/'),
      )
      const file = item?.getAsFile()
      if (file) {
        e.preventDefault()
        void accept(file)
      }
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [accept, draft])

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void accept(file)
  }

  const shown = draft?.dataUrl ?? currentUrl
  const saved = draft
    ? Math.round((1 - draft.result.bytes / draft.original.bytes) * 100)
    : 0

  return (
    <div className="rounded-2xl bg-dark-bg p-5">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* 当前 / 待保存的头像 */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <Avatar name={name} avatarUrl={shown} size={60} />
          <p className="text-3xs text-text-tertiary">
            {draft ? tr('待保存') : currentUrl ? tr('当前头像') : tr('还没有头像')}
          </p>
        </div>

        {/* 选择区 + 对比数据 */}
        <div className="flex-1 min-w-0 w-full">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`w-full rounded-xl border-2 border-dashed px-4 py-4 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-blender-orange bg-blender-orange/10'
                : 'border-dark-border hover:border-blender-orange/60 hover:bg-dark-surface'
            }`}
          >
            {busy ? (
              <Loader2 className="w-6 h-6 mx-auto text-blender-orange animate-spin" />
            ) : (
              <ImagePlus className="w-6 h-6 mx-auto text-blender-orange" />
            )}
            <p className="text-sm text-text-primary mt-2">
              {tr('把图片拖到这里，或')}
              <b className="text-blender-orange">{tr('点这里选文件')}</b>
            </p>
            <p className="text-3xs text-text-tertiary mt-1.5">
              {tr('支持 JPG / PNG / WEBP · 也可以直接 Ctrl+V 粘贴截图')}
            </p>
            <p className="text-3xs text-text-tertiary mt-0.5">
              {tpl('自动裁成正方形 · 自动缩到 {n} × {n}', { n: AVATAR_SIZE })}
            </p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void accept(f)
              e.target.value = ''
            }}
          />

          {/* 压缩前后对比 —— 把"自动减小"变成看得见的数字 */}
          {draft && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs">
              <span>
                <span className="block text-3xs text-text-tertiary">{tr('原图')}</span>
                <b className="text-text-primary font-mono">
                  {draft.original.width} × {draft.original.height}
                </b>
                <span className="text-text-tertiary ml-2">
                  {fmtBytes(draft.original.bytes)}
                </span>
              </span>
              <span className="text-text-tertiary">→</span>
              <span>
                <span className="block text-3xs text-text-tertiary">{tr('压缩后')}</span>
                <b className="text-text-primary font-mono">
                  {draft.result.width} × {draft.result.height}
                </b>
                <span className="text-text-tertiary ml-2">
                  {fmtBytes(draft.result.bytes)}
                </span>
              </span>
              {saved > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-status-completed/12 text-status-completed text-3xs font-medium">
                  {tpl('省了 {n}%', { n: saved })}
                </span>
              )}
            </div>
          )}

          {err && (
            <p className="text-3xs text-status-needs-review mt-3">{err}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              type="button"
              disabled={!draft || busy}
              onClick={() => {
                if (!draft) return
                onSave(draft.dataUrl)
                setDraft(null)
                onMessage(tr('头像已更新'))
              }}
              className="btn btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-45"
            >
              <Upload className="w-4 h-4" />
              {tr('保存头像')}
            </button>
            <button
              type="button"
              disabled={!draft}
              onClick={() => {
                setDraft(null)
                setErr(null)
              }}
              className="btn btn-secondary text-sm disabled:opacity-45"
            >
              {tr('取消')}
            </button>
            {currentUrl && !draft && (
              <button
                type="button"
                onClick={onRemove}
                className="btn btn-ghost text-sm inline-flex items-center gap-2 text-text-tertiary hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                {tr('移除头像')}
              </button>
            )}
          </div>

          <p className="text-3xs text-text-tertiary mt-3 leading-relaxed">
            {tr('压缩在本地完成，原图不会上传服务器。')}
            {tpl('只有这张 {n}×{n} 的小图会跟着学习进度同步到你的账号。', {
              n: AVATAR_SIZE,
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
