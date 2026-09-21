import type { Config } from 'tailwindcss'

/**
 * 颜色全部走 CSS 变量（定义在 src/styles/globals.css），这样：
 *   - 配色调整 → 直接改 `<html>` 上的 CSS 变量
 *   - 主色切换 → 同一套变量里换掉 accent 三个值
 * 一次切换全站生效，不需要重新编译 CSS，也不需要给每个组件传主题 prop。
 *
 * 用 `rgb(var(--x) / <alpha-value>)` 而不是直接 `var(--x)`：
 * 后者会让 `bg-blender-orange/10` 这类透明度写法失效。
 *
 * ⚠️ `dark-bg / dark-surface / dark-elevated / dark-border` 是历史遗留名，
 *    现在表示「页面底 / 卡片 / 浮起层 / 描边」四个语义槽位，取值随配色变。
 *    详见 globals.css 顶部说明。语义别名：surface / surface-card / surface-raised / hairline。
 *
 * ══════════════════════════════════════════════════════════════════════════
 * v1.0.0 字号基准（用户 2026-09-20 明确要求：整体偏小、看着不方便）
 * ══════════════════════════════════════════════════════════════════════════
 * 旧版全项目 325 处字号声明里 **241 处 ≤ 14px**（12px×117、11px×93、10px×31），
 * ≥18px 的只有 18 处 —— 不是"某几处小"，是整套基准偏小一号。
 *
 * 所以这里**直接覆写 Tailwind 默认字号阶梯**（而不是逐处打补丁）：
 * 所有 `text-xs / text-sm / text-base` 一次性整体上移，动静最小、改得最彻底。
 * 同时把两个任意值 `text-[10px]` / `text-[11px]` 收敛成 `text-3xs`。
 *
 *   旧            新           用途
 *   10px/11px  →  3xs 13.5px   微标注（时间戳、计数、字段名）
 *   12px (xs)  →  xs  15px     次要说明
 *   14px (sm)  →  sm  16px     正文小一号
 *   16px (base)→  base 17px    正文
 *   18px (lg)  →  lg  19px     小标题
 *   20px (xl)  →  xl  22px     区块标题
 *   24px (2xl) →  2xl 27px     页标题
 *   30px (3xl) →  3xl 32px     大标题
 *   48px (5xl) →  5xl 50px     欢迎语
 *
 * ⚠️ 自定义字号必须**带上 lineHeight**：只给 px 会落回 Tailwind 的
 *    `line-height: 1`（继承自 fontSize 默认），中文行距立刻挤成一团。
 *    每一档的行距都按"中文正文 1.6–1.7、标题 1.15–1.35"单独给。
 */
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 强调色（可切换的主色）
        'blender-orange': {
          DEFAULT: v('--accent'),
          light: v('--accent-light'),
          dark: v('--accent-dark'),
        },
        /* 压在 accent 实底色上的字色（由 theme.ts 按对比度算，别写死 white） */
        'accent-ink': v('--accent-ink'),

        // ---- 语义槽位（推荐新代码使用）----
        surface: v('--bg'),
        'surface-card': v('--surface'),
        'surface-raised': v('--raised'),
        hairline: v('--hairline'),

        // ---- 历史遗留名，值同上（保留是为了不动那 ~165 处引用）----
        'dark-bg': v('--bg'),
        'dark-surface': v('--surface'),
        'dark-elevated': v('--raised'),
        'dark-border': v('--hairline'),

        // 暖灰（滚动条等）
        'warm-gray': {
          DEFAULT: v('--warm'),
          light: v('--warm-light'),
          dark: v('--warm-dark'),
        },

        // 文字三级
        'text-primary': v('--fg1'),
        'text-secondary': v('--fg2'),
        'text-tertiary': v('--fg3'),

        // 状态色
        'status-not-started': v('--st-none'),
        'status-learning': v('--st-learn'),
        'status-completed': v('--st-done'),
        'status-needs-review': v('--st-review'),
        // 「已掌握」跟随主色 —— 它本来就是「最好」的那个状态，跟强调色走更合理
        'status-mastered': v('--accent'),
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Microsoft YaHei',
          'PingFang SC',
          'Hiragino Sans GB',
          'Noto Sans CJK SC',
          'sans-serif',
        ],
        mono: ['Consolas', 'Cascadia Mono', 'Menlo', 'monospace'],
      },

      /* ---- 字号阶梯：整表上移（见文件头说明）---- */
      fontSize: {
        '3xs': ['13.5px', { lineHeight: '1.55' }],
        xs: ['15px', { lineHeight: '1.6' }],
        sm: ['16px', { lineHeight: '1.65' }],
        base: ['17px', { lineHeight: '1.7' }],
        lg: ['19px', { lineHeight: '1.6' }],
        xl: ['22px', { lineHeight: '1.45' }],
        '2xl': ['27px', { lineHeight: '1.35' }],
        '3xl': ['32px', { lineHeight: '1.25' }],
        '4xl': ['40px', { lineHeight: '1.15' }],
        '5xl': ['50px', { lineHeight: '1.1' }],
      },

      /* ---- 圆角：改为引用 CSS 变量，让皮肤能整体切换圆角风格 ----
         皮肤定义 --radius-ctl（控件）/ --radius-card（卡片）/ --radius-btn（按钮）。
         这里把 Tailwind 的圆角阶梯映射到变量：控件级（md/lg）跟 --radius-ctl，
         卡片级（xl/2xl/3xl）跟 --radius-card。经典印刷/极简黑白这类"方正"皮肤
         变量值小，界面整体变方；苹果极简/圆润可爱变量值大，整体变圆。 */
      borderRadius: {
        md: 'var(--radius-ctl)',
        lg: 'var(--radius-ctl)',
        xl: 'var(--radius-card)',
        '2xl': 'var(--radius-card)',
        '3xl': 'var(--radius-card)',
      },

      /* ---- 阴影：卡片靠"浮起"分层，而不是靠描边 ---- */
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.20), 0 4px 12px rgb(0 0 0 / 0.12)',
        'card-hover':
          '0 2px 4px rgb(0 0 0 / 0.24), 0 10px 24px rgb(0 0 0 / 0.18)',
        float: '0 18px 44px rgb(0 0 0 / 0.34)',
      },

      spacing: {
        /* 侧栏：240 → 264（方案 C 的取值；余下的宽度让给课程列与正文列） */
        sidebar: '264px',
        /* 课程列（方案 C 的中间栏） */
        'course-col': '320px',
      },
      maxWidth: {
        /* 正文列上限：单行 ~660px 是中文最舒服的阅读宽度 */
        reading: '660px',
        /* 内容区上限：1200 → 1440（窗口大时不再"内容缩在中间一小块"） */
        content: '1440px',
      },
    },
  },
  plugins: [],
}

export default config
