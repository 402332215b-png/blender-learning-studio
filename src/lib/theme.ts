/**
 * 配色系统（v1.0.0 重做）
 * ======================
 *
 * ⚠️ v1.0.0 之前这里是「深色 / 浅色 / 跟随系统」三选一 + 5 套固定主色。
 *    用户 2026-09-20 明确要求：**深色和浅色取消**，改成
 *    「色彩手动调节，采用 128 色的过渡原理」。
 *
 * 现在只有**两个连续维度**，没有"模式"这个概念：
 *
 *   色相带   0–127 级    每级 360/128 = 2.8125°
 *   明暗带   0–10 档     0 = 墨黑（≈ 现在的深色），10 = 雪白
 *
 * 为什么是 128：色相环 360° 均分 128 份后每份 2.8°，**比人眼能分辨的
 * 最小色差还小**，所以拖动时是顺滑过渡而不是"一格一格跳"；
 * 同时又是一个整数索引，存进 localStorage 干净、不用存浮点数。
 *
 * 这一层只做三件事：
 *   1. 把 (色相级, 明暗档) 算成**一整套调色板**（页面底 / 卡片 / 浮起层 /
 *      描边 / 三级文字 / 主色三档 / 状态色 / 主色上的字色）
 *   2. 把调色板写进 `<html>` 的 CSS 变量（唯一真正改变外观的动作）
 *   3. 存回 localStorage
 *
 * 两个刻意的设计决定（沿用旧版，理由不变）：
 *
 * 1. **不跟着账号同步。** 配色是「设备偏好」——白天在教室投影、晚上在家
 *    看，本来就该不一样。更重要的是：首屏就得套上，等云端返回再套会先闪一下。
 *
 * 2. **必须能在 React 之前跑。** `index.html` 里有一段同步的内联脚本，
 *    在浏览器绘制第一帧之前就把变量写好。代价是**同一套推导逻辑存在两份**
 *    （这里 + index.html），改公式时两边都要改 —— 用 `_palette_v1` 这个
 *    版本号标记，两边不一致就说明漏改了。
 */

import { tr } from '../i18n'
import { live } from './live'
import { isSkinId, skinById, DEFAULT_SKIN, type SkinId } from './skins'

/* ---------------------------------------------------------------------------
   常量与存储键
   --------------------------------------------------------------------------- */

/** 色相级数：0–127 */
export const HUE_STEPS = 128
/** 明暗档数：0–10 */
export const LIGHT_STEPS = 11

/** 推导公式的版本号。index.html 里那份必须与此一致（见文件头说明） */
export const PALETTE_VERSION = 1

export const HUE_KEY = 'bls_hue'
export const LIGHT_KEY = 'bls_light'
export const SKIN_KEY = 'bls_skin'

/** 旧版键 —— **只读**，用来把老用户的设置迁移过来，不再写入 */
const LEGACY_THEME_KEY = 'bls_theme'
const LEGACY_ACCENT_KEY = 'bls_accent'

/** 默认 = 色相第 10 级（品牌橙 #F5792A 落在这一级）+ 明暗第 1 档（最深） */
export const DEFAULT_HUE = 9
export const DEFAULT_LIGHT = 0

/** 主色饱和度。88% 时第 10 级 ≈ #F5792A，和旧版的品牌橙几乎一致 */
const ACCENT_SAT = 88

/** 明暗档的可读名字（设置页显示用） */
const LIGHT_LABELS = [
  '最深',
  '很深',
  '深',
  '偏深',
  '中偏深',
  '中',
  '中偏浅',
  '浅',
  '很浅',
  '极浅',
  '雪白',
]

export const LIGHT_NAMES = live<string[]>(() => LIGHT_LABELS.map((x) => tr(x)))

/* ---------------------------------------------------------------------------
   色值工具（纯函数，无副作用）
   --------------------------------------------------------------------------- */

type RGB = [number, number, number]

/** HSL → RGB（0–255 整数）。h 用度，s / l 用百分数 */
function hsl(h: number, s: number, l: number): RGB {
  const hh = ((h % 360) + 360) % 360
  const ss = clamp(s, 0, 100) / 100
  const ll = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * ll - 1)) * ss
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1))
  const m = ll - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (hh < 60) [r, g, b] = [c, x, 0]
  else if (hh < 120) [r, g, b] = [x, c, 0]
  else if (hh < 180) [r, g, b] = [0, c, x]
  else if (hh < 240) [r, g, b] = [0, x, c]
  else if (hh < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ]
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v))
}

/** WCAG 相对亮度 */
function relLum([r, g, b]: RGB): number {
  const f = (v: number) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** WCAG 对比度（1–21） */
function contrast(a: RGB, b: RGB): number {
  const la = relLum(a)
  const lb = relLum(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** 存进 CSS 变量的格式：「R G B」三元组（配 rgb(var(--x) / a) 用） */
function triplet(c: RGB): string {
  return `${c[0]} ${c[1]} ${c[2]}`
}

/** 给走界面 / 文档用（设置页要显示"你调出来的是什么颜色"） */
export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hsl(h, s, l)
  const p = (v: number) => v.toString(16).padStart(2, '0')
  return `#${p(r)}${p(g)}${p(b)}`
}

export function hueToHex(hueStep: number): string {
  return hslToHex(hueOf(hueStep), ACCENT_SAT, 52)
}

/* ---------------------------------------------------------------------------
   两个维度的换算
   --------------------------------------------------------------------------- */

/** 色相级 → 角度 */
export function hueOf(step: number): number {
  return (step * 360) / HUE_STEPS
}

/** 明暗档 → 0–1 的比例 */
export function ratioOf(step: number): number {
  return step / (LIGHT_STEPS - 1)
}

export function isHueStep(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < HUE_STEPS
}

export function isLightStep(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < LIGHT_STEPS
}

/* ---------------------------------------------------------------------------
   主色实底上的字色：不写死 white，按对比度算
   ---------------------------------------------------------------------------
   为什么必须算：主色现在能被拖到 128 个色相中的任意一个。
   浅黄 / 浅青这类色相上白字只有 2:1 出头，完全糊掉。
   做法：
     1. 先看这个实底更适合白字还是近黑字（取对比度高的那个）
     2. 若仍不足 3:1（WCAG 对大号/粗体 UI 文字的门槛），
        就把实底**逐级压深**直到达标 —— 最多压到 26% 为止。
   ⚠️ 门槛取 3:1 而不是 4.5:1 是**刻意的**：按钮上的字是 17px 半粗，
      按 WCAG 属于"大号"，且 macOS 系统蓝 + 白字的对比度本来也只有 3.5:1。
      强行 4.5:1 会把橙色按钮压成暗褐色 —— 与用户选定的观感不符。
   --------------------------------------------------------------------------- */

const NEAR_BLACK: RGB = [18, 16, 14]
const PURE_WHITE: RGB = [255, 255, 255]

interface FillPair {
  fill: RGB
  ink: RGB
}

function fillPair(h: number, s: number, targetL: number): FillPair {
  for (let l = targetL; l >= 26; l -= 1) {
    const fill = hsl(h, s, l)
    const order = relLum(fill) > 0.35 ? [NEAR_BLACK, PURE_WHITE] : [PURE_WHITE, NEAR_BLACK]
    for (const ink of order) {
      if (contrast(ink, fill) >= 3) return { fill, ink }
    }
  }
  const fill = hsl(h, s, 26)
  return { fill, ink: relLum(fill) > 0.35 ? NEAR_BLACK : PURE_WHITE }
}

/* ---------------------------------------------------------------------------
   调色板推导
   --------------------------------------------------------------------------- */

export interface Palette {
  /** 深底还是亮底 —— 只用来切 color-scheme 和状态色两组取值 */
  dark: boolean
  /** 主色实底上的字色（hex，给设置页预览用） */
  accentInk: string
  /** 主色本身（hex，给色带显示用） */
  accentHex: string
  /** CSS 变量表：键名不带 `--` */
  vars: Record<string, string>
}

/**
 * (色相级, 明暗档, 皮肤) → 整套调色板
 *
 * 明暗的走法：比例 t 从 0 到 1，页面底色亮度 10% → 96% **线性**过渡。
 * 刻意不用缓动曲线 —— 线性意味着"拖到哪一档，亮度就是那一档"，
 * 用户拖动时的预期和结果一致。中间几档会经过一段中灰，
 * 看起来不那么好看，但那是用户自己拖过去的，不是我们替他做的选择。
 *
 * 皮肤：在色彩推导之上，**叠加**皮肤专属的覆盖变量（字体栈、圆角、
 * 图标描边、小符号造型、渐变、毛玻璃等）。皮肤变量不参与色彩推导，
 * 是「这套语言长什么样」的固定描述 —— 所以直接 Object.assign 盖上去。
 */
export function palette(
  hueStep: number,
  lightStep: number,
  skin: SkinId = DEFAULT_SKIN,
): Palette {
  const h = hueOf(clamp(hueStep, 0, HUE_STEPS - 1))
  const t = ratioOf(clamp(lightStep, 0, LIGHT_STEPS - 1))
  const dark = t < 0.5

  const bgL = 10 + t * 86
  const surfaceL = dark ? bgL + 5 : Math.min(100, bgL + 4)
  const raisedL = dark ? bgL + 10 : Math.max(0, bgL - 4)
  const hairlineL = dark ? bgL + 14 : Math.max(0, bgL - 9)

  /* 文字三级。取值不是"看着差不多"，而是按对比度定的：
       深底：fg3 = 54% → 对底色 ≈ 4.8:1（旧版是 102 灰，只有 3.4:1，偏糊）
       亮底：fg3 = 44% → 对底色 ≈ 4.6:1
     用户抱怨的"看着不方便"，一半来自字号，另一半来自这种"灰得刚好读不清"。 */
  const fg1 = dark ? hsl(h, 6, 93) : hsl(h, 8, 12)
  const fg2 = dark ? hsl(h, 6, 68) : hsl(h, 8, 32)
  const fg3 = dark ? hsl(h, 6, 54) : hsl(h, 8, 44)

  /* 主色：
       --accent        页面底色上的主色（当**文字/图标**用）
       --accent-light  悬停、更亮的一档
       --accent-dark   按下、更深的一档
       --accent-fill   当**实底**用（按钮底），已保证与 --accent-ink 的对比度
     实底目标亮度比文字档稍低一点，是为了让白字站得住。 */
  const textAccentL = dark ? 56 : 44
  const pair = fillPair(h, ACCENT_SAT, textAccentL)

  const st = dark
    ? {
        none: hsl(h, 6, 54),
        learn: hsl(210, 62, 62),
        done: hsl(145, 52, 58),
        review: hsl(2, 74, 68),
      }
    : {
        none: hsl(h, 8, 44),
        learn: hsl(214, 68, 38),
        done: hsl(148, 62, 30),
        review: hsl(2, 68, 44),
      }

  const warm = dark ? hsl(h, 6, 68) : hsl(h, 8, 32)

  const vars: Record<string, string> = {
    bg: triplet(hsl(h, 6, bgL)),
    surface: triplet(hsl(h, 7, surfaceL)),
    raised: triplet(hsl(h, 8, raisedL)),
    hairline: triplet(hsl(h, 9, hairlineL)),

    fg1: triplet(fg1),
    fg2: triplet(fg2),
    fg3: triplet(fg3),

    'warm': triplet(warm),
    'warm-light': triplet(dark ? hsl(h, 8, 74) : hsl(h, 9, 44)),
    'warm-dark': triplet(dark ? hsl(h, 8, 46) : hsl(h, 9, 24)),

    accent: triplet(hsl(h, ACCENT_SAT, textAccentL)),
    'accent-light': triplet(hsl(h, ACCENT_SAT, dark ? 64 : 52)),
    'accent-dark': triplet(hsl(h, ACCENT_SAT, dark ? 46 : 34)),
    'accent-ink': triplet(pair.ink),

    'st-none': triplet(st.none),
    'st-learn': triplet(st.learn),
    'st-done': triplet(st.done),
    'st-review': triplet(st.review),
  }

  /* 叠加皮肤专属变量：字体栈、圆角、图标描边、小符号造型等。
     皮肤变量不参与色彩推导，是「这套语言长什么样」的固定描述，
     直接 Object.assign 盖到 vars 上（键名一致则覆盖，不一致则新增）。 */
  const skinDef = skinById(skin)
  Object.assign(vars, skinDef.vars)

  return {
    dark,
    accentInk: `rgb(${pair.ink.join(',')})`,
    accentHex: hslToHex(h, ACCENT_SAT, textAccentL),
    vars,
  }
}

/* ---------------------------------------------------------------------------
   读写偏好（带迁移）
   --------------------------------------------------------------------------- */

function readInt(key: string): number | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    const n = Number(raw)
    return Number.isFinite(n) ? Math.round(n) : null
  } catch {
    return null
  }
}

/** 旧版主题 id → 新色相级（保证老用户升级后颜色不变） */
const LEGACY_ACCENT_HUE: Record<string, number> = {
  orange: 9, // ≈ 24°
  blue: 75, // ≈ 211°
  green: 52, // ≈ 146°
  violet: 92, // ≈ 259°
  rose: 126, // ≈ 354°
}

/**
 * 读色相级。没有新键时**从旧键迁移**：
 * bls_accent=orange → 第 10 级。这样老用户升级后看到的就是原来那个橙色，
 * 不会"更新完颜色变了"。
 */
export function readHue(): number {
  const v = readInt(HUE_KEY)
  if (isHueStep(v)) return v
  try {
    const legacy = localStorage.getItem(LEGACY_ACCENT_KEY)
    if (legacy && legacy in LEGACY_ACCENT_HUE) return LEGACY_ACCENT_HUE[legacy]
  } catch {
    /* 读不到就用默认 */
  }
  return DEFAULT_HUE
}

/**
 * 读明暗档。旧版 `bls_theme` 映射：
 *   dark → 档 0（最深，和现在的观感一致）
 *   light → 档 8（很浅，接近旧浅色主题）
 *   system → 按系统偏好落到 0 或 8
 */
export function readLight(): number {
  const v = readInt(LIGHT_KEY)
  if (isLightStep(v)) return v
  try {
    let legacy = localStorage.getItem(LEGACY_THEME_KEY)
    if (legacy === 'system') {
      legacy = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
    }
    if (legacy === 'light') return 8
    if (legacy === 'dark') return 0
  } catch {
    /* 读不到就用默认 */
  }
  return DEFAULT_LIGHT
}

/* ---------------------------------------------------------------------------
   应用到 DOM
   --------------------------------------------------------------------------- */

/** 读皮肤 id。没有或值非法就回默认（老用户升级后就是「苹果极简」） */
export function readSkin(): SkinId {
  try {
    const raw = localStorage.getItem(SKIN_KEY)
    if (isSkinId(raw)) return raw
  } catch {
    /* 读不到就用默认 */
  }
  return DEFAULT_SKIN
}

/** 把整套调色板写进 `<html>`（唯一真正改变外观的动作） */
export function applyToDom(hue: number, light: number, skin: SkinId = DEFAULT_SKIN): Palette {
  const p = palette(hue, light, skin)
  const root = document.documentElement

  for (const [k, val] of Object.entries(p.vars)) {
    root.style.setProperty(`--${k}`, val)
  }
  /* data-ink 只影响 color-scheme（原生滚动条 / 表单控件 / 输入光标），
     不再决定任何颜色 —— 颜色全在上面这些变量里 */
  root.setAttribute('data-ink', p.dark ? 'dark' : 'light')
  /* 皮肤 id 也写到 data 属性，方便 CSS 针对特定皮肤微调（如霓虹光晕） */
  root.setAttribute('data-skin', skin)

  // 浏览器/手机地址栏底色跟着走
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', `rgb(${p.vars.bg.split(' ').join(',')})`)

  return p
}

/** 存偏好并立刻生效 */
export function saveAndApply(hue: number, light: number, skin: SkinId = DEFAULT_SKIN): void {
  try {
    localStorage.setItem(HUE_KEY, String(hue))
    localStorage.setItem(LIGHT_KEY, String(light))
    localStorage.setItem(SKIN_KEY, skin)
  } catch {
    /* 隐私模式写不进去也不该崩，至少让当前这次生效 */
  }
  applyToDom(hue, light, skin)
}
