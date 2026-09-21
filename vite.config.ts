import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readFileSync } from 'fs'

/**
 * 部署到在线域名时的两条硬要求（否则线上会直接打不开）：
 *   1. 监听 `PORT` 环境变量，并绑定 `0.0.0.0`（线上只暴露一个公网端口）
 *   2. 放行反代域名 —— 不设的话 Vite 会以
 *      "Blocked request. This host is not allowed." 拒绝请求
 *
 * 本地开发照旧：不传 PORT 就落在 5173。
 */
const PORT = Number(process.env.PORT) || 5173

/**
 * 把 `package.json` 的 version 注入成一个编译期常量 `__APP_VERSION__`。
 *
 * 为什么要这么做（2026-09-20）：侧栏底部原来**手写**了一句
 *   「v0.5.0 · 三语界面 · 云端同步」
 * 发 v1.0.0 时改了 package.json，却没人记得去改这句话 —— 界面右下角
 * 还在对外宣称自己是 v0.5.0。这种"同一个版本号抄在两个地方"的写法，
 * 迟早会跟真实版本对不上，而它偏偏是**用户判断自己装的是哪一版**的依据。
 * 现在版本号只有一个来源（package.json），界面读它，改不动歪。
 */
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')) as {
  version: string
}

const shared = {
  host: '0.0.0.0' as const,
  port: PORT,
  // 允许任意 Host（线上由平台反代进来，域名不可预知）
  allowedHosts: true as const,
}

export default defineConfig({
  plugins: [react()],
  // 版本号注入见上方 pkg 的注释：界面里的版本永远等于 package.json 的 version
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@data': resolve(__dirname, 'data'),
    },
  },
  server: { ...shared, open: false },
  preview: shared,
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
