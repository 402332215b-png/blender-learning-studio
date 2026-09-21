/// <reference types="vite/client" />

/**
 * 编译期注入的常量（来源：vite.config.ts 的 `define`）。
 *
 * `__APP_VERSION__` = package.json 的 version。
 * 界面上的版本号一律用它，不要再手写字符串 —— 手写的那次（v0.5.0）
 * 发新版时忘了改，界面就一直在对外宣称旧版本号，详见 vite.config.ts 的注释。
 */
declare const __APP_VERSION__: string
