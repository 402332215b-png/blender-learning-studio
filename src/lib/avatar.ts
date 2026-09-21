/**
 * 头像处理
 * ========
 *
 * 头像是**纯本机图片**：用户从电脑里挑一张 → 在浏览器里压成小图 → 存成 data URL。
 * 全程不经过任何服务器，也不做上传。
 *
 * 为什么要先压再存：
 *   头像会跟着学习快照一起同步到云端（和进度在同一个 payload 里）。
 *   原图动辄几百 KB 到几 MB，base64 之后体积还要再涨约 1/3 ——
 *   既容易撑爆 localStorage 的 5MB 配额，也让每次同步白白多传几百 KB。
 *   压成 256×256 的 JPEG 之后通常在 20–40KB，在界面上完全看不出差别
 *   （界面上最大的头像位置只有 72px）。
 *
 * ⚠️ v1.0.0 改动（用户 2026-09-20：「上传头像增加一个图片选择区域的功能，
 *    这样可以自动减小图片」）：
 *    1. 入口从「一个小按钮弹系统文件框」改成**一块能拖能点能粘贴的选择区**
 *       （见 components/ui/AvatarPicker.tsx）—— 用户能看见"我要往哪放图"。
 *    2. 原来的上限 2 MB **太紧了**：手机随手拍一张就是 3–8 MB，
 *       直接拦掉等于把"自动减小图片"这个功能本身否了。
 *       现在放到 12 MB，超出的仍然拦掉（避免拿一张 200MB 的 TIFF 把内存吃光）。
 *    3. 新增 `prepareAvatar()`，一次性把「压缩前」和「压缩后」的尺寸与体积
 *       都算出来 —— 界面上要把这两个数字摆给用户看，
 *       否则"自动减小"是句空话，用户只能选择相信。
 */

import { tr, tpl } from '../i18n'

/**
 * 原图大小上限。
 * ⚠️ 从 2 MB 放宽到 12 MB：手机照片普遍 3–8 MB，卡在 2 MB 会让
 *    绝大多数"从手机传过来的头像"直接被拒 —— 而这个功能的目的
 *    恰恰就是"你把大图丢进来，我帮你压小"。
 */
export const AVATAR_MAX_BYTES = 12 * 1024 * 1024

/** 压缩后的边长（正方形，cover 裁切） */
export const AVATAR_SIZE = 256

/** JPEG 质量。0.86 是实测"再高看不出差别、再低开始有块状噪点"的拐点 */
const AVATAR_QUALITY = 0.86

/** 弹出系统文件选择框，返回用户选的文件（取消则 null） */
export function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.click()
  })
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error(tr('读不到这个文件')))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(tr('这个文件不是能识别的图片')))
    img.src = src
  })
}

/** data URL 的「真实字节数」（base64 去掉头部后按 3/4 折算） */
export function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(',')
  if (i < 0) return dataUrl.length
  const b64 = dataUrl.slice(i + 1)
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0
  return Math.round((b64.length * 3) / 4) - padding
}

export interface ImageInfo {
  width: number
  height: number
  bytes: number
}

export interface PreparedAvatar {
  /** 压缩后的 data URL，直接可以存进 profile */
  dataUrl: string
  /** 原图信息（宽高 + 字节数），用来给用户看"省了多少" */
  original: ImageInfo
  /** 压缩后信息 */
  result: ImageInfo
}

/** 人类可读的体积：<1MB 用 KB，否则用 MB */
export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

/**
 * 文件 → 正方形小图（JPEG data URL）+ 压缩前后对比数据
 *
 * 两个细节：
 *   - 用 cover 裁切：短边铺满、长边居中裁掉，头像不会被拉变形。
 *   - 先铺白底再画图：JPEG 没有透明通道，透明 PNG 不铺白底会变成黑块。
 */
export async function prepareAvatar(file: File): Promise<PreparedAvatar> {
  if (!file.type.startsWith('image/')) {
    throw new Error(tr('请选择图片文件（jpg / png / webp 等）'))
  }
  if (file.size > AVATAR_MAX_BYTES) {
    throw new Error(
      tpl('图片太大了（{mb} MB），请选 12 MB 以内的', {
        mb: (file.size / 1024 / 1024).toFixed(1),
      }),
    )
  }

  const img = await loadImage(await readAsDataUrl(file))

  const canvas = document.createElement('canvas')
  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error(tr('这台电脑的浏览器不支持处理图片'))

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE)

  const side = Math.min(img.width, img.height)
  const sx = (img.width - side) / 2
  const sy = (img.height - side) / 2
  ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)

  const dataUrl = canvas.toDataURL('image/jpeg', AVATAR_QUALITY)

  return {
    dataUrl,
    original: { width: img.naturalWidth, height: img.naturalHeight, bytes: file.size },
    result: { width: AVATAR_SIZE, height: AVATAR_SIZE, bytes: dataUrlBytes(dataUrl) },
  }
}

/**
 * 兼容旧调用：只要 data URL。
 * 保留它是因为登录页/其它地方可能只想要结果，不关心"省了多少"。
 */
export async function fileToAvatarDataUrl(
  file: File,
  size: number = AVATAR_SIZE,
): Promise<string> {
  if (size === AVATAR_SIZE) return (await prepareAvatar(file)).dataUrl

  // 非默认尺寸（目前没有调用方用到，留着是为了不破坏签名）
  const img = await loadImage(await readAsDataUrl(file))
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error(tr('这台电脑的浏览器不支持处理图片'))
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  const side = Math.min(img.width, img.height)
  ctx.drawImage(
    img,
    (img.width - side) / 2,
    (img.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  )
  return canvas.toDataURL('image/jpeg', AVATAR_QUALITY)
}
