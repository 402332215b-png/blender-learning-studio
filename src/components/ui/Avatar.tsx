/**
 * 头像组件
 * ========
 *
 * 有自定义头像就显示图片，没有就退回「昵称首字母」的色块。
 * 之所以做成组件：项目里有三处要画头像（首页、侧边栏、设置页），
 * 以前各写各的首字母块，加了上传功能之后必须三处行为一致。
 */

import { tr } from '../../i18n'

export function Avatar({
  name,
  avatarUrl,
  size = 32,
  className = 'bg-blender-orange text-white',
  alt = '',
}: {
  /** 昵称，用来取首字母 */
  name?: string | null
  /** 头像 data URL（没有就用首字母） */
  avatarUrl?: string | null
  /** 边长（px） */
  size?: number
  /** 底色/文字色，直接给 Tailwind 类 */
  className?: string
  alt?: string
}) {
  const letter = name?.[0]?.toUpperCase() || 'U'

  /* 首字母字号按边长比例算，但不低于 14px。
     ⚠️ 原来是 size × 0.42：侧栏那个 32px 的头像 → 13px 的字，
        比 v1.0.0 新定的最小档（text-3xs = 13.5px）还小一格 ——
        用户这次就是抱怨"到处字都小"，答案是一个都不能漏，
        所以这里改用 0.46 并兜一个 14px 的下限（32px → 15px、88px → 40px）。
        比例仍受边长约束，改大会溢出圆形，所以不能无脑调大。 */
  const fontSize = Math.max(14, Math.round(size * 0.46))

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center font-medium shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={alt || name || tr('头像')}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        letter
      )}
    </div>
  )
}
