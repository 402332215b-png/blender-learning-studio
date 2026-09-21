/**
 * WorkBuddy 云服务客户端
 * ======================
 *
 * 这一层只做一件事：把云服务客户端建好，并且**全应用只建一次**。
 * 认证（auth）与数据库（database）共用这一个实例 —— 登录之后，
 * 数据库请求会自动带上身份，业务层不需要手动传任何 token。
 *
 * publicConfig 是开通云服务时下发的**公开配置**：
 *   - endpoint       数据面基址（就是这个应用的发布域名）
 *   - publishableKey 只标识「哪个应用」，本身不携带任何权限；
 *                    安全性由服务端「Origin 精确匹配」保证
 *
 * 注意两条纪律：
 *   1. 这两个值可以打进前端产物，但**不要写进日志**。
 *   2. **不要自己写 fetch 去打 `/.cloud/**`** —— publishableKey 注入、
 *      会话续期、超时策略 SDK 都在唯一的 fetch 出口里实现好了，自己拼会绕开这些。
 */

import { createWorkBuddyCloud } from '@tencent-ai/workbuddy-cloud-sdk'

/** 开通云服务时下发的公开配置（不含任何密钥，只有应用标识） */
export const publicConfig = {
  endpoint: 'https://blender-learning-studio.app.workbuddy.host',
  publishableKey: 'wbpk_CiofF51A3SuyFOa0CIT0bo_6FI5gxlY6s6lFYIEmz0pHnG9D8pxKiHZ',
} as const

/** 云服务客户端（auth / database / storage / llm 四模块共用） */
export const cloud = createWorkBuddyCloud({
  endpoint: publicConfig.endpoint,
  publishableKey: publicConfig.publishableKey,
})

/** 学习进度表：每个账号一行，payload 存整份进度的 JSON 快照 */
export const PROGRESS_TABLE = 'bls_progress'
