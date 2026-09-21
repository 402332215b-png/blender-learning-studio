import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User as UserIcon,
  Cloud,
  HardDrive,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  ShieldCheck,
  LogIn,
  Palette,
  Languages,
} from 'lucide-react'
import { useAuthStore, useProgressStore } from '../stores'
import { STORAGE_KEYS } from '../lib/auth'
import { AvatarPicker } from '../components/ui/AvatarPicker'
import { ColorTuner } from '../components/ui/ColorTuner'
import { SkinPicker } from '../components/ui/SkinPicker'
import { BlenderSetup } from '../components/ui/BlenderSetup'
import { isAllUnlocked, setAllUnlocked, computeCredits } from '../lib/credits'
import { COLOR_UNLOCK_AT, clearPickedSkins } from '../lib/skins'
import { SKIN_PICKS_RESET_EVENT } from '../components/ui/SkinOnboarding'
import { tr, tpl, useLocaleStore, LOCALES, EN_ENTRY_COUNT } from '../i18n'

/** 与登录页保持一致的输入框样式 */
const inputCls =
  'w-full px-3 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-blender-orange transition-colors'

/**
 * 设置页
 *
 * 包含：账号（头像 / 昵称）、云同步面板、数据导出/导入、清空数据。
 * 同步已接入云端账号：登录后自动同步，这里给出手动触发与状态展示。
 */
export function Settings() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, syncStatus, lastSyncAt, syncNow, updateProfile } =
    useAuthStore()
  const { progress, notes, loadFromStorage } = useProgressStore()
  const { locale, setLocale } = useLocaleStore()
  const [msg, setMsg] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  // 点了锁住的皮肤 / 色彩条 → 弹「先开 Blender、自动装插件」的引导
  const [blenderOpen, setBlenderOpen] = useState(false)
  const [lockedTarget, setLockedTarget] = useState<string | undefined>()
  const [lockedLack, setLockedLack] = useState<number | undefined>()
  // 作者自用后门：勾上就全解锁，免得自己被自己的锁定机制挡住
  const [unlockAll, setUnlockAllState] = useState(() => isAllUnlocked())
  const [nameDraft, setNameDraft] = useState('')

  const lessonCount = Object.keys(progress).length
  const noteCount = Object.keys(notes).length

  // 昵称输入框跟随当前档案（换账号 / 云端拉回新名字时自动同步）
  useEffect(() => {
    setNameDraft(user?.displayName ?? '')
  }, [user?.id, user?.displayName])

  const nameDirty =
    nameDraft.trim() !== '' && nameDraft.trim() !== (user?.displayName ?? '')

  /** 保存昵称 */
  function saveName() {
    const v = nameDraft.trim()
    if (!v) return
    updateProfile({ displayName: v })
    setMsg(tpl('名称已改为「{v}」，会自动同步到你的账号', { v }))
  }

  /** 导出全部数据为 JSON 文件 */
  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: tr('Blender Learning Studio 国内版'),
      schemaVersion: 1,
      user,
      accounts: localStorage.getItem(STORAGE_KEYS.accounts),
      progress,
      notes,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bls-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg(tr('已导出备份文件，可在另一台电脑用「导入备份」恢复'))
  }

  /** 从 JSON 文件导入 */
  function importData() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (data.progress) localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(data.progress))
        if (data.notes) localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(data.notes))
        if (data.accounts) localStorage.setItem(STORAGE_KEYS.accounts, data.accounts)
        if (data.user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))
        loadFromStorage()
        setMsg(tr('导入成功，数据已恢复'))
      } catch (e) {
        setMsg(tr('导入失败：文件格式不对（') + (e as Error).message + '）')
      }
    }
    input.click()
  }

  /** 清空学习数据（保留账号） */
  function clearData() {
    localStorage.removeItem(STORAGE_KEYS.progress)
    localStorage.removeItem(STORAGE_KEYS.notes)
    loadFromStorage()
    setConfirmClear(false)
    setMsg(tr('学习进度与笔记已清空'))
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">{tr('设置')}</h1>
        <p className="text-sm text-text-tertiary mt-1">{tr('账号、同步与数据管理')}</p>
      </div>

      {msg && (
        <div className="px-4 py-3 rounded-lg bg-blender-orange/10 border border-blender-orange/30 text-sm text-blender-orange">
          {msg}
        </div>
      )}

      {/* ---- 账号 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="w-4 h-4 text-blender-orange" />
          <h2 className="text-sm font-semibold text-text-primary">{tr('账号')}</h2>
        </div>

        {isAuthenticated ? (
          <div className="space-y-5">
            {/* 头像选择区
                ⚠️ v1.0.0 改版：原来只是一个「上传头像」小按钮弹系统文件框，
                   用户看不见"要往哪放图"。现在整块可拖 / 可点 / 可粘贴，
                   并且把**压缩前后的尺寸与体积**摆出来给用户验证。 */}
            <AvatarPicker
              name={user?.displayName}
              currentUrl={user?.avatarUrl}
              onSave={(dataUrl) => {
                updateProfile({ avatarUrl: dataUrl })
                setMsg(tr('头像已更新，会自动同步到你的账号'))
              }}
              onRemove={() => {
                updateProfile({ avatarUrl: undefined })
                setMsg(tr('头像已移除'))
              }}
              onMessage={setMsg}
            />

            <div className="flex-1 min-w-0 w-full space-y-3">
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">
                  {tr('显示名称')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && nameDirty) saveName()
                    }}
                    maxLength={20}
                    placeholder={tr('给自己起个名字')}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={saveName}
                    disabled={!nameDirty}
                    className="btn btn-primary text-sm shrink-0 disabled:opacity-50"
                  >
                    {tr('保存')}
                  </button>
                </div>
                <p className="text-3xs text-text-tertiary mt-1.5">
                  {tr('最多 20 个字。改名后会自动同步到你的账号。')}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-tertiary">{tr('登录邮箱')}</span>
                <span className="text-text-secondary truncate">{user?.email}</span>
              </div>
            </div>

            {/* ⚠️ 原来这里还有一段「头像是一张压到 256×256 的小图…」的说明。
                v1.0.0 起删掉了 —— AvatarPicker 自己已经把
                「压缩前后尺寸 / 体积 / 原图不上传」都摆在选择区里，
                同一件事在同一屏说两遍只会稀释信息。 */}

            <button
              onClick={async () => {
                await logout()
                // ⚠️ v1.0.0：退出登录后**直接落到登录页**（用户要求
                //    「点开软件或者退出需要自动跳到登录界面」）。
                //    走 replace，免得用户按返回键又回到设置页 —— 那时
                //    已经没有登录态了，会被登录门再弹一次，来回闪。
                navigate('/login', { replace: true })
              }}
              className="btn btn-secondary text-sm"
            >
              {tr('退出登录')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">{tr('还没有登录。登录后你的昵称和学习进度会关联到账号。')}</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary text-sm flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              {tr('去登录 / 注册')}
            </button>
          </div>
        )}
      </section>

      {/* ---- 同步 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="w-4 h-4 text-green-400" />
          <h2 className="text-sm font-semibold text-text-primary">{tr('数据同步')}</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-dark-elevated">
            <span className="text-sm text-text-secondary">{tr('当前模式')}</span>
            <span className="text-sm font-medium text-text-primary">
              {/* ⚠️ 两个分支都必须过 tr()。原来真分支是裸字符串 '云端同步（自动）'，
                  结果：英文界面回落中文、繁体界面还留着简体字形（云/动）。
                  这条直到 2026-09-19 修好扫描器（造登录态）才暴露出来 ——
                  未登录时设置页被登录门挡住，扫到的只是占位页，一直是假通过。 */}
              {isAuthenticated ? tr('云端同步（自动）') : tr('仅本机（未登录）')}
            </span>
          </div>

          {isAuthenticated && (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-dark-elevated">
              <span className="text-sm text-text-secondary">{tr('状态')}</span>
              <span className="text-sm text-text-primary">
                {syncStatus === 'syncing'
                  ? tr('同步中…')
                  : syncStatus === 'synced'
                    ? tr('已同步')
                    : syncStatus === 'error'
                      ? tr('同步失败，稍后会自动重试')
                      : tr('未连接')}
              </span>
            </div>
          )}

          {lastSyncAt && (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-dark-elevated">
              <span className="text-sm text-text-secondary">{tr('上次同步')}</span>
              <span className="text-sm text-text-primary">
                {new Date(lastSyncAt).toLocaleString('zh-CN', { hour12: false })}
              </span>
            </div>
          )}

          <button
            onClick={() => syncNow()}
            disabled={syncStatus === 'syncing' || !isAuthenticated}
            className="btn btn-secondary text-sm flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {tr('立即同步')}
          </button>

          <div className="flex items-start gap-2 px-3 py-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            <div className="text-xs text-text-secondary leading-relaxed">
              <p className="mb-1.5">
                {tr('登录后，学习进度会在')}
                <b className="text-text-primary">{tr('后台自动同步')}</b>
                {tr('，学完一节课大约 2 秒内就会存到云端，不需要手动点。')}
              </p>
              <p className="mb-1.5">
                {tr('每个账号的数据')}
                <b className="text-text-primary">{tr('只有你自己能看到')}</b>
                {tr('（服务端按账号做了行级隔离）。换电脑或重装系统，登录同一账号即可自动恢复。')}
              </p>
              <p className="text-text-tertiary">
                {tr('没登录时依旧可以正常学习，进度只存在本机、不会同步；登录后会以较新的那份为准合并。')}
                {tr('「导出备份」仍然保留，用于离线留底。')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 语言 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <Languages className="w-4 h-4 text-blender-orange" />
          <h2 className="text-sm font-semibold text-text-primary">{tr('语言')}</h2>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs text-text-tertiary mb-2">{tr('界面语言')}</p>
            <div className="grid grid-cols-3 gap-2">
              {LOCALES.map((l) => {
                const active = locale === l.id
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLocale(l.id)}
                    title={tr(l.note)}
                    className={`px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                      active
                        ? 'border-blender-orange bg-blender-orange/10 text-blender-orange font-medium'
                        : 'border-dark-border bg-dark-elevated text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {l.label}
                  </button>
                )
              })}
            </div>
            {/*
              语言名用各自的母语书写（不做翻译）—— 界面已经是英文时，
              把「繁體中文（台灣）」翻成 "Traditional Chinese" 反而让台湾用户
              在列表里找不着自己的语言。
            */}
            <p className="text-3xs text-text-tertiary mt-2">
              {tpl(
                '界面可切换简体中文、繁體中文（台灣）和 English。英文译文目前已收录 {n} 条，缺译处会自动回落到中文。',
                { n: EN_ENTRY_COUNT },
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ---- 外观 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-blender-orange" />
          <h2 className="text-sm font-semibold text-text-primary">{tr('外观')}</h2>
        </div>

        {/* 皮肤：先选一套整体视觉语言（字体/圆角/图标/小符号一起变） */}
        <div className="space-y-5">
          <SkinPicker
            onLockedClick={(info) => {
              setLockedTarget(info.skin.name)
              setLockedLack(Math.max(0, info.unlockAt - info.credits.total))
              setBlenderOpen(true)
            }}
          />

          {/* 选好皮肤后，还能在其内部微调色彩 + 明暗 —— 色彩是最后解锁的一项 */}
          <div className="pt-4 border-t" style={{ borderColor: 'rgb(var(--hairline))' }}>
            <ColorTuner
              onLockedClick={() => {
                setLockedTarget(undefined)
                setLockedLack(
                  Math.max(0, COLOR_UNLOCK_AT - computeCredits(progress).total),
                )
                setBlenderOpen(true)
              }}
            />
          </div>

          {/* 作者自用后门 */}
          <div className="pt-4 border-t" style={{ borderColor: 'rgb(var(--hairline))' }}>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={unlockAll}
                onChange={(e) => {
                  setAllUnlocked(e.target.checked)
                  setUnlockAllState(e.target.checked)
                }}
                className="w-4 h-4"
                style={{ accentColor: 'rgb(var(--accent))' }}
              />
              <span className="text-xs text-text-secondary">{tr('全部解锁（作者自用）')}</span>
            </label>
            <p className="text-3xs text-text-tertiary mt-1.5 leading-relaxed">
              {tr('勾上后所有皮肤与色彩调节直接开放，不受学分限制。开发调试和演示时用。')}
            </p>

            {/* 重走一遍「开局挑两套」。
                作者自己演示时要反复看这个引导，也用来救「手滑挑错两套」的场。 */}
            <button
              type="button"
              onClick={() => {
                clearPickedSkins()
                window.dispatchEvent(new Event(SKIN_PICKS_RESET_EVENT))
              }}
              className="mt-3 px-3 py-1.5 rounded-lg border border-dark-border text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              {tr('重新挑开局的两套皮肤')}
            </button>
            <p className="text-3xs text-text-tertiary mt-1.5 leading-relaxed">
              {tr('清掉开局选择，会立刻再弹一次「挑两套」的引导。')}
            </p>
          </div>
        </div>

        <BlenderSetup
          open={blenderOpen}
          onClose={() => setBlenderOpen(false)}
          targetName={lockedTarget}
          lack={lockedLack}
        />
      </section>

      {/* ---- 数据管理 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-4 h-4 text-blender-orange" />
          <h2 className="text-sm font-semibold text-text-primary">{tr('数据管理')}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="px-3 py-3 rounded-lg bg-dark-elevated">
            <p className="text-xl font-semibold text-text-primary">{lessonCount}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{tr('已记录课时')}</p>
          </div>
          <div className="px-3 py-3 rounded-lg bg-dark-elevated">
            <p className="text-xl font-semibold text-text-primary">{noteCount}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{tr('笔记条数')}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={exportData} className="btn btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            {tr('导出备份')}
          </button>
          <button onClick={importData} className="btn btn-secondary text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {tr('导入备份')}
          </button>
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="btn btn-ghost text-sm flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
              {tr('清空学习数据')}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="text-xs text-red-400">{tr('确定清空吗？此操作不可撤销')}</span>
              <button onClick={clearData} className="text-xs font-medium text-red-400 hover:text-red-300">
                {tr('确定')}
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-xs text-text-tertiary hover:text-text-secondary"
              >
                {tr('取消')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---- 关于数据安全 ---- */}
      <section className="card">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
          <div className="text-xs text-text-secondary leading-relaxed">
            <p className="font-medium text-text-primary mb-1">{tr('你的数据只属于你')}</p>
            <p className="mb-1.5">
              {tr('本软件不采集、不统计、不分享任何个人信息。学习数据同步到云端时按账号做了行级隔离，')}
              <b className="text-text-primary">{tr('任何人（包括其他用户）都读不到你的进度')}</b>。
            </p>
            <p>
              {tr('退出登录或卸载软件都不会删除云端数据；想彻底删掉，可以在设置里清空学习数据后同步一次。')}
              {tr('导出的备份文件保存在你自己的电脑上，由你保管。')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
