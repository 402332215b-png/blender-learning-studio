/**
 * 本地存储键（集中管理，避免散落各处）
 *
 * ⚠️ 这些键名**与 v0.3.0 保持一致**，刻意的 ——
 *    升级到云同步版本后，老用户本机已有的学习进度仍然能被读到，
 *    登录后会作为「本地较新」的一方推到云端，不会丢。
 */

export const STORAGE_KEYS = {
  /** 当前登录用户的档案缓存（拉取/登录后写入） */
  user: 'bls_user',
  /** 旧版本机账号表（v0.3.0 遗留，保留键名以便清理） */
  accounts: 'bls_accounts',
  /** 旧版登录会话（同上） */
  session: 'bls_session',
  /** 学习进度：lessonId -> UserProgress */
  progress: 'bls_progress',
  /** 笔记：lessonId -> Note */
  notes: 'bls_notes',
  /** 收藏 */
  favorites: 'bls_favorites',
  /** 学习流水 */
  sessions: 'bls_sessions',
  /**
   * SU → Blender 工作流的勾选状态：`workflowId:stepId` -> true
   *
   * 和学习进度分开存，是为了不污染课时统计（勾一条操作清单不等于学完一课）。
   * 但它**仍然是用户的学习数据**，所以要跟着快照一起上云 ——
   * 只在 localStorage 里写的话，换台电脑勾选记录就没了。
   */
  wfChecks: 'bls_wf_checks',
  /**
   * Blender 实操数据（由桌面版写入，来自 Blender 插件记录的真实操作）。
   *
   * 它和「学习进度」是两回事：
   *   学习进度 = 用户自己点出来的（自报，可以刷）；
   *   实操数据 = 在 Blender 里真做过的（插件记录，刷不了）。
   * 分开存，学分才好把两种来源分开展示。
   * 网页版没有这个键（浏览器连不上本机 Blender），实操学分就是 0。
   */
  practice: 'bls_practice',
  /**
   * 「全部解锁」后门开关。值为 '1' 时所有皮肤与色彩调节直接开放。
   * 给软件的作者自己用，避免开发/演示时被自己的锁定机制挡住。
   */
  unlockAll: 'bls_unlock_all',
  /**
   * 开局自选的两套皮肤：`["apple","glass"]`
   *
   * v1.3.0 起**不再送默认皮肤** —— 第一次用软件时用户自己挑两套，
   * 这两套永久归他、可互相切换；其余全部锁死，靠学分一套套解锁。
   * 没这个键（或数组为空）= 还没挑过，要弹一次「挑两套」的引导。
   */
  skinPicks: 'bls_skin_picks',
  /** 同步元信息（上次同步时间 / 状态） */
  syncMeta: 'bls_sync_meta',
  /** 本地数据最后一次变更时间（ISO），用于「谁更新」的比较 */
  dirtyAt: 'bls_dirty_at',
} as const

/**
 * 数据快照的版本号。云端 payload 里带着它，将来改结构时用于迁移。
 *
 * 3：把「工作流勾选状态」（bls_wf_checks）并进快照。
 *    向后兼容：老客户端推上来的 payload 没有这个字段，
 *    applyLocal() 遇到 undefined 会**跳过写入**（不会把本机已有勾选清空），
 *    所以不需要数据迁移。
 */
export const SCHEMA_VERSION = 3
