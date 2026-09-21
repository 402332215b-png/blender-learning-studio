/**
 * 多语言（简体中文 / 繁體中文（台灣）/ English）
 * =============================================
 *
 * 设计上有三个刻意的选择，都跟「这套数据长什么样」直接相关：
 *
 * 1) **以简体中文原文当 key，不另造 key。**
 *    课程数据有 1300+ 条不同的句子。给每条都编一个 `lesson.a01.principle` 这样的
 *    key，等于把整套中文重抄一遍，维护时还要两处同步。
 *    直接用中文原文当 key：`tr('不直接影响出图效率')`。
 *    代价是原文改字会导致译文失配 —— 但译文缺失时**自动回落到中文**，
 *    界面上不会出现空白或 key 泄漏，是安全降级。
 *
 * 2) **繁體不写词典，靠机械转换。**
 *    简→繁是确定性的，而且 1300 条译文手写必然出错、漏字。
 *    交给 src/lib/zh-tw.ts 的字符表 + 台灣用語表，**天然 100% 覆盖**。
 *
 * 3) **英文缺译就回落中文。**
 *    这样词典可以分批补，任何时候打包出来的软件都是可用的 ——
 *    不会出现「半句英文半句中文把界面撑破」的情况（要么整条英文，要么整条中文）。
 */

import { create } from 'zustand'
import { tw } from '../lib/zh-tw'
import { EN_UI } from './en-ui'
import { EN_CONTENT } from './en-content'

export type Locale = 'zh-CN' | 'zh-TW' | 'en'

export const LOCALE_KEY = 'bls_locale'
export const DEFAULT_LOCALE: Locale = 'zh-CN'

/**
 * 语言列表。
 *
 * label 用**各自的母语**书写，且刻意不参与翻译 ——
 * 界面已经是英文时，把「繁體中文（台灣）」翻成 "Traditional Chinese"
 * 反而让台湾用户在列表里找不到自己的语言。这是通行做法。
 * note 是给鼠标悬停看的说明，会走 tr()。
 */
export const LOCALES: { id: Locale; label: string; note: string }[] = [
  { id: 'zh-CN', label: '简体中文', note: '默认界面语言' },
  { id: 'zh-TW', label: '繁體中文（台灣）', note: '台湾用语，简繁自动转换' },
  { id: 'en', label: 'English', note: '英文界面，译文持续补充中' },
]

export function isLocale(v: unknown): v is Locale {
  return v === 'zh-CN' || v === 'zh-TW' || v === 'en'
}

/**
 * 给 `Intl` / `toLocaleString` / `toLocaleDateString` 用的语言标签。
 *
 * 为什么单独一个函数：日期星期名是**运行时按 locale 出的**，
 * 跟词典无关。写死 'zh-CN' 的话，英文界面上会出现
 * 「Saturday, 9月 19, 2026」这种半中半英的日期。
 */
export function intlTag(): string {
  return current === 'en' ? 'en-US' : current === 'zh-TW' ? 'zh-TW' : 'zh-CN'
}

/** 英文词典 = 界面词 + 内容词。分开两个文件只是为了好维护，运行期合并。 */
const EN: Record<string, string> = { ...EN_UI, ...EN_CONTENT }

/**
 * 模板句规则。
 *
 * 课程数据里有两类句子各有一百多个变体，只有中间一小段不同：
 *
 *   目标：{X}。先在独立练习文件中完成，不直接修改正式项目。      （119 条）
 *   验收：结果满足“{X}”的相关要求，并保存一个可回退版本。        （36 条）
 *
 * 给每条都写一遍译文纯属浪费，而且以后数据再生成还会漏。
 * 所以这里按模式匹配，把 {X} 摘出来交给词典翻 —— 词典里本来就有
 * 这些 {X}（它们是课时标题和周产出）。
 */
const TEMPLATE_RULES: { re: RegExp; out: (x: string) => string }[] = [
  {
    re: /^目标：(.+?)。先在独立练习文件中完成，不直接修改正式项目。$/,
    out: (x) =>
      `Goal: ${x}. Do it in a separate practice file; do not modify the official project.`,
  },
  {
    re: /^验收：结果满足“(.+?)”的相关要求，并保存一个可回退版本。$/,
    out: (x) =>
      `Acceptance: the result meets the requirements for “${x}”, and a rollback-ready version is saved.`,
  },
]

function trTemplate(source: string): string | undefined {
  for (const r of TEMPLATE_RULES) {
    const m = r.re.exec(source)
    if (m) {
      // 中间的 {X} 自己也走一遍词典（查不到就保留中文）
      return r.out(EN[m[1]] ?? m[1])
    }
  }
  return undefined
}

export function readLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_KEY)
    return isLocale(raw) ? raw : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/**
 * 当前语言放在模块变量里，而不是只放 store。
 * 因为 `content.ts` 这类非 React 模块也要能调 `tr()`，
 * 它拿不到 hook，只能读模块变量。
 */
let current: Locale = readLocale()

export function currentLocale(): Locale {
  return current
}

/** 翻译一条文案。这就是全应用唯一需要记住的 API。 */
export function tr(source: string): string {
  if (!source) return source
  if (current === 'zh-CN') return source
  if (current === 'zh-TW') return tw(source)
  // 英文：先查词典，再试模板句，都没有就回落中文
  //（安全降级，界面不会出现空白或 key 泄漏）
  return EN[source] ?? EN[source.trim()] ?? trTemplate(source) ?? source
}

/**
 * 带变量的文案。
 *
 * 为什么要单独一个函数：英文和中文的**语序不同**
 * （「已完成 3 课」vs「3 lessons completed」），
 * 所以模板里用 `{n}` 占位，由各语言自己决定放哪，
 * 不能靠字符串拼接。用法：
 *
 *   tpl('已完成 {n} 课', { n: 3 })
 *   tpl 在 en 词典里是 'Completed {n} lessons'
 */
export function tpl(source: string, vars: Record<string, string | number>): string {
  let out = tr(source)
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(String(v))
  }
  return out
}

/** 是否已经有人工英文译文（用来在界面上标注「翻译中」） */
export function hasEnglish(source: string): boolean {
  return Object.prototype.hasOwnProperty.call(EN, source)
}

/** 英文词典里已收录的条目数（设置页展示进度用） */
export const EN_ENTRY_COUNT = Object.keys(EN).length

// ---------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------

interface LocaleState {
  locale: Locale
  setLocale: (l: Locale) => void
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: current,
  setLocale: (l) => {
    current = l
    try {
      localStorage.setItem(LOCALE_KEY, l)
    } catch {
      /* 隐私模式写不进去也不该崩 */
    }
    set({ locale: l })
  },
}))
