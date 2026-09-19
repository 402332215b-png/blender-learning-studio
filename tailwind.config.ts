import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Blender Orange - 强调色
        'blender-orange': {
          DEFAULT: '#F5792A',
          light: '#F7892A',
          dark: '#E06515',
        },
        // 深灰系 - 主背景
        'dark-bg': '#1A1A1A',
        'dark-surface': '#242424',
        'dark-elevated': '#2E2E2E',
        'dark-border': '#3A3A3A',
        // 暖灰系
        'warm-gray': {
          DEFAULT: '#8B8580',
          light: '#A8A29A',
          dark: '#6B6560',
        },
        // 浅色系 (light theme support)
        'light-bg': '#FAFAFA',
        'light-surface': '#FFFFFF',
        'light-elevated': '#F5F5F5',
        'light-border': '#E0E0E0',
        // 文字
        'text-primary': '#E8E8E8',
        'text-secondary': '#999999',
        'text-tertiary': '#666666',
        'text-inverse': '#1A1A1A',
        // 状态色
        'status-not-started': '#666666',
        'status-learning': '#4A90D9',
        'status-completed': '#50C878',
        'status-mastered': '#F5792A',
        'status-needs-review': '#FF6B6B',
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
      spacing: {
        'sidebar': '240px',
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}

export default config
