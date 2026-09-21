/**
 * 全站皮肤定义。
 *
 * 色相与明暗仍由 theme.ts 计算；皮肤负责字体、圆角、线条、阴影、纹理和
 * 少量固定的设计锚点。这样既能保留 128 色调节，也能让每套皮肤真正呈现
 * 不同的设计语言，而不是只换一个颜色。
 */

import { STORAGE_KEYS } from './storage-keys'

export type SkinId =
  | 'apple'
  | 'mono'
  | 'candy'
  | 'glass'
  | 'print'
  | 'forest'
  | 'retro'
  | 'launch'
  | 'fashion'
  | 'trust'
  | 'brandbook'

export interface Skin {
  id: SkinId
  name: string
  desc: string
  vars: Record<string, string>
  /** 首次选择该风格时使用的代表性色相与明暗，之后仍可手动微调。 */
  preset?: { hue: number; light: number }
}

const SANS = `system-ui, -apple-system, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', sans-serif`
const SERIF = `Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif`
const ROUND = `'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', system-ui, sans-serif`
const CONDENSED = `'Arial Narrow', 'Aptos Narrow', 'Microsoft YaHei', sans-serif`
const HEAVY = `Impact, 'Arial Black', 'Microsoft YaHei', sans-serif`

const BASE = {
  'font-display': SANS,
  'title-letter-spacing': '-0.02em',
  'title-transform': 'none',
  'surface-shadow': '0 1px 2px rgb(0 0 0 / .20), 0 4px 12px rgb(0 0 0 / .12)',
  'surface-border-width': '0px',
  'surface-border-style': 'solid',
  'body-pattern': 'none',
  'glass-blur': '20px',
  'button-letter-spacing': '0',
} as const

export const SKINS: Skin[] = [
  {
    id: 'apple',
    name: '苹果极简',
    desc: '清爽留白、轻盈阴影与大圆角',
    preset: { hue: 75, light: 0 },
    vars: { ...BASE, 'font-sans': SANS, 'radius-card': '18px', 'radius-ctl': '12px', 'radius-btn': '999px', 'icon-stroke': '1.5', 'icon-cap': 'round', 'sym-dot': '50%', 'sym-ink': 'round' },
  },
  {
    id: 'mono',
    name: '极简黑白',
    desc: '高对比黑白、锐利细线与克制排版',
    preset: { hue: 0, light: 1 },
    vars: { ...BASE, 'font-sans': SANS, 'radius-card': '6px', 'radius-ctl': '4px', 'radius-btn': '2px', 'icon-stroke': '1.5', 'icon-cap': 'square', 'sym-dot': '0', 'sym-ink': 'square', 'surface-shadow': 'none', 'surface-border-width': '1px' },
  },
  {
    id: 'candy',
    name: '圆润可爱',
    desc: '柔和圆体、饱满按钮与超大圆角',
    preset: { hue: 119, light: 9 },
    vars: { ...BASE, 'font-sans': ROUND, 'font-display': ROUND, 'radius-card': '24px', 'radius-ctl': '16px', 'radius-btn': '999px', 'icon-stroke': '2.5', 'icon-cap': 'round', 'sym-dot': '50%', 'sym-ink': 'round', 'surface-shadow': '0 8px 24px rgb(0 0 0 / .10)' },
  },
  {
    id: 'glass',
    name: '未来玻璃',
    desc: '通透层次、细线图标与悬浮质感',
    preset: { hue: 70, light: 9 },
    vars: { ...BASE, 'font-sans': SANS, 'radius-card': '20px', 'radius-ctl': '14px', 'radius-btn': '999px', 'icon-stroke': '2', 'icon-cap': 'round', 'sym-dot': '50%', 'sym-ink': 'ring', 'glass': '1', 'body-pattern': 'radial-gradient(circle at 10% 10%, rgb(var(--accent) / .12), transparent 34%), radial-gradient(circle at 92% 88%, rgb(var(--accent-light) / .10), transparent 30%)' },
  },
  {
    id: 'print',
    name: '经典印刷',
    desc: '衬线字体、实心方块与书本气质',
    preset: { hue: 9, light: 9 },
    vars: { ...BASE, 'font-sans': SERIF, 'font-display': SERIF, 'radius-card': '2px', 'radius-ctl': '2px', 'radius-btn': '2px', 'icon-stroke': '1.5', 'icon-cap': 'square', 'sym-dot': '0', 'sym-ink': 'square', 'surface-shadow': 'none', 'surface-border-width': '1px' },
  },
  {
    id: 'forest',
    name: '森林静谧',
    desc: '低饱和自然气息、柔和描边与留白',
    preset: { hue: 38, light: 9 },
    vars: { ...BASE, 'font-sans': SANS, 'font-display': SERIF, 'radius-card': '16px', 'radius-ctl': '12px', 'radius-btn': '999px', 'icon-stroke': '2', 'icon-cap': 'round', 'sym-dot': '50%', 'sym-ink': 'ring', 'body-pattern': 'radial-gradient(ellipse at top right, rgb(var(--accent) / .08), transparent 42%)' },
  },
  {
    id: 'retro',
    name: '复古编辑',
    desc: '焦糖暖调、粗黑分隔与杂志式标题',
    preset: { hue: 9, light: 8 },
    vars: { ...BASE, 'font-sans': CONDENSED, 'font-display': SERIF, 'radius-card': '0px', 'radius-ctl': '0px', 'radius-btn': '0px', 'icon-stroke': '2', 'icon-cap': 'square', 'sym-dot': '0', 'sym-ink': 'square', 'surface-shadow': '6px 6px 0 rgb(var(--fg1) / .15)', 'surface-border-width': '2px', 'title-letter-spacing': '-0.045em', 'body-pattern': 'repeating-linear-gradient(0deg, transparent 0 46px, rgb(var(--fg1) / .035) 46px 47px)', 'button-letter-spacing': '.08em' },
  },
  {
    id: 'launch',
    name: '自然发布',
    desc: '柔和鼠尾草绿、宽松留白与产品画册感',
    preset: { hue: 45, light: 9 },
    vars: { ...BASE, 'font-sans': SANS, 'font-display': SERIF, 'radius-card': '28px', 'radius-ctl': '18px', 'radius-btn': '999px', 'icon-stroke': '1.5', 'icon-cap': 'round', 'sym-dot': '50%', 'sym-ink': 'ring', 'surface-shadow': '0 16px 40px rgb(20 38 24 / .10)', 'surface-border-width': '1px', 'body-pattern': 'radial-gradient(circle at 88% 8%, rgb(var(--accent) / .10), transparent 34%)', 'title-letter-spacing': '-0.035em' },
  },
  {
    id: 'fashion',
    name: '潮流拼贴',
    desc: '强烈黑白、错落色块与街头杂志网格',
    preset: { hue: 90, light: 1 },
    vars: { ...BASE, 'font-sans': SANS, 'font-display': HEAVY, 'radius-card': '0px', 'radius-ctl': '0px', 'radius-btn': '0px', 'icon-stroke': '2.5', 'icon-cap': 'square', 'sym-dot': '0', 'sym-ink': 'square', 'surface-shadow': '4px 4px 0 rgb(var(--fg1) / .28)', 'surface-border-width': '2px', 'body-pattern': 'linear-gradient(135deg, rgb(var(--accent) / .07) 0 12%, transparent 12% 88%, rgb(var(--fg1) / .04) 88%)', 'title-letter-spacing': '-0.055em', 'title-transform': 'uppercase', 'button-letter-spacing': '.12em' },
  },
  {
    id: 'trust',
    name: '可信科技',
    desc: '深绿科技底、荧光提示与数据仪表风格',
    preset: { hue: 48, light: 1 },
    vars: { ...BASE, 'font-sans': SANS, 'font-display': SANS, 'radius-card': '12px', 'radius-ctl': '8px', 'radius-btn': '8px', 'icon-stroke': '2', 'icon-cap': 'square', 'sym-dot': '2px', 'sym-ink': 'square', 'surface-shadow': '0 10px 30px rgb(0 20 10 / .18)', 'surface-border-width': '1px', 'body-pattern': 'linear-gradient(rgb(var(--accent) / .035) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--accent) / .035) 1px, transparent 1px)', 'button-letter-spacing': '.04em' },
  },
  {
    id: 'brandbook',
    name: '品牌手册',
    desc: '橙红渐变、清晰网格与系统化品牌排版',
    preset: { hue: 2, light: 9 },
    vars: { ...BASE, 'font-sans': SANS, 'font-display': SANS, 'radius-card': '16px', 'radius-ctl': '10px', 'radius-btn': '10px', 'icon-stroke': '2', 'icon-cap': 'round', 'sym-dot': '4px', 'sym-ink': 'square', 'surface-shadow': '0 12px 34px rgb(24 28 48 / .14)', 'surface-border-width': '1px', 'body-pattern': 'radial-gradient(circle at 96% 2%, rgb(var(--accent-light) / .18), transparent 28%), linear-gradient(145deg, transparent 0 78%, rgb(var(--accent) / .07) 78%)', 'title-letter-spacing': '-0.03em', 'button-letter-spacing': '.02em' },
  },
]

export const SKIN_MAP: Record<SkinId, Skin> = Object.fromEntries(
  SKINS.map((skin) => [skin.id, skin]),
) as Record<SkinId, Skin>

// ---------------------------------------------------------------------------
// 开局自选 + 解锁门槛
// ---------------------------------------------------------------------------
//
// v1.3.0 起规则变了（老板 2026-09-20 定）：
//
//   · **不再赠送默认皮肤**。第一次用软件，用户自己从全部 11 套里挑 **2 套**，
//     这两套永久归他、随时互相切换。
//   · 其余 **9 套全部锁死**，按学分一套一套解开。
//
// 为什么改成这样（老板原话）：
//   「免得客户拿到的是默认皮肤，默认皮肤就对这个软件不感兴趣。」
//   给一套默认外观 = 替用户做了第一个审美决定，他只是**接受**；
//   让他自己挑两套 = 他的第一个动作是**选择**，投入感从第一秒就建立起来。
//
// 解锁规则刻意**不写进上面的 SKINS 数组**，单独放一张表，理由：
//   1. 皮肤定义（长什么样）和解锁规则（什么时候给）是两件事，改一个不该动另一个；
//   2. 以后要调门槛、或者临时全放开，只动这张表就行。
//
// 门槛数字不是拍脑袋定的，来自课程体量：
//   路线 B（主推）6 个阶段 × 12 课时 = 73 课时；完成一课时 10 学分
//   → 一个阶段约 120 学分。11 套铺成 60 → 700 的阶梯，
//     扣掉开局自选的 2 套，大约每 6 课时拿到一套新的，反馈不缺席。
//
// ⚠️ **每一套都必须有数字**：空着 = 0 = 免费送，那就又变回"默认皮肤"了。
export const SKIN_UNLOCK_AT: Record<SkinId, number> = {
  glass: 60,
  candy: 120,
  print: 180,
  trust: 240,
  forest: 300,
  retro: 360,
  apple: 420,
  launch: 480,
  mono: 540,
  fashion: 600,
  brandbook: 700,
}

/** 开局能自选几套 */
export const SKIN_PICKS_COUNT = 2

/**
 * 色彩调节（色相 / 明暗）的解锁门槛 —— **最后一项**。
 *
 * 老板明确要求「色彩最后最后才给解开」，所以它是整个成长线的终点：
 * 走完整条路线（约 720+ 学分）才拿得到自己调色的权利。
 */
export const COLOR_UNLOCK_AT = 730

/** 取某套皮肤的解锁门槛（学分）。开局自选的那两套会绕过它。 */
export function skinUnlockAt(id: SkinId): number {
  return SKIN_UNLOCK_AT[id] ?? 0
}

/**
 * 兜底外观 id。
 *
 * ⚠️ 它**不是赠送的皮肤**，只是「用户还没做出开局选择时，用什么把界面画出来」。
 *    正规流程里这个状态只会持续到第一次挑完那 2 套为止。
 */
export const DEFAULT_SKIN: SkinId = 'apple'

// ---------------------------------------------------------------------------
// 开局自选的两套（读写 localStorage）
// ---------------------------------------------------------------------------
//
// 存成数组而不是两个单独的键：顺序有意义（第 1 个 = 挑完立即生效的那套），
// 而且以后要改成 3 套只动 SKIN_PICKS_COUNT 一处。

/** 读开局自选的皮肤。没挑过就是空数组。 */
export function readPickedSkins(): SkinId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.skinPicks)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // 过滤：老数据里可能有已经删掉的皮肤 id，留着会让后面的判断静默失效
    return parsed.filter(isSkinId).slice(0, SKIN_PICKS_COUNT)
  } catch {
    return []
  }
}

/** 写入开局自选的两套。 */
export function savePickedSkins(ids: SkinId[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.skinPicks,
      JSON.stringify(ids.slice(0, SKIN_PICKS_COUNT)),
    )
  } catch {
    /* 隐私模式写不进去也不该崩 */
  }
}

/** 是否已经做过开局选择。 */
export function hasPickedSkins(): boolean {
  return readPickedSkins().length > 0
}

/** 清掉开局选择（作者自用：想重新走一遍挑皮肤的流程时用）。 */
export function clearPickedSkins(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.skinPicks)
  } catch {
    /* 忽略 */
  }
}

/** 这套是不是开局自己挑的（挑的永远可用）。 */
export function isPickedSkin(id: SkinId): boolean {
  return readPickedSkins().includes(id)
}

export function isSkinId(value: unknown): value is SkinId {
  return typeof value === 'string' && value in SKIN_MAP
}

export function skinById(id: SkinId): Skin {
  return SKIN_MAP[id] ?? SKIN_MAP[DEFAULT_SKIN]
}
