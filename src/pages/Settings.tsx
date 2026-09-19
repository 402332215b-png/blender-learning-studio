import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User as UserIcon,
  Cloud,
  CloudOff,
  HardDrive,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  ShieldCheck,
  LogIn,
} from 'lucide-react'
import { useAuthStore, useProgressStore } from '../stores'
import { auth, STORAGE_KEYS } from '../lib/auth'

/**
 * 设置页
 *
 * 包含：账号状态、同步说明、数据导出/导入、清空数据。
 * 「同步」区现在是本机模式说明；接入云端后这里会变成真正的同步控制面板。
 */
export function Settings() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, syncStatus, lastSyncAt, syncNow } = useAuthStore()
  const { progress, notes, loadFromStorage } = useProgressStore()
  const [msg, setMsg] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const lessonCount = Object.keys(progress).length
  const noteCount = Object.keys(notes).length

  /** 导出全部数据为 JSON 文件 */
  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'Blender Learning Studio 国内版',
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
    setMsg('已导出备份文件，可在另一台电脑用「导入备份」恢复')
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
        setMsg('导入成功，数据已恢复')
      } catch (e) {
        setMsg('导入失败：文件格式不对（' + (e as Error).message + '）')
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
    setMsg('学习进度与笔记已清空')
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">设置</h1>
        <p className="text-sm text-text-tertiary mt-1">账号、同步与数据管理</p>
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
          <h2 className="text-sm font-semibold text-text-primary">账号</h2>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blender-orange flex items-center justify-center text-lg font-medium text-white">
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{user?.displayName}</p>
                <p className="text-xs text-text-tertiary">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await logout()
                navigate('/')
              }}
              className="btn btn-secondary text-sm"
            >
              退出登录
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">还没有登录。登录后你的昵称和学习进度会关联到账号。</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary text-sm flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              去登录 / 注册
            </button>
          </div>
        )}
      </section>

      {/* ---- 同步 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          {auth.kind === 'local' ? (
            <CloudOff className="w-4 h-4 text-blue-400" />
          ) : (
            <Cloud className="w-4 h-4 text-green-400" />
          )}
          <h2 className="text-sm font-semibold text-text-primary">数据同步</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-dark-elevated">
            <span className="text-sm text-text-secondary">当前模式</span>
            <span className="text-sm font-medium text-text-primary">
              {auth.kind === 'local' ? '仅本机（不上传）' : '云端同步'}
            </span>
          </div>

          {lastSyncAt && (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-dark-elevated">
              <span className="text-sm text-text-secondary">上次同步</span>
              <span className="text-sm text-text-primary">
                {new Date(lastSyncAt).toLocaleString('zh-CN', { hour12: false })}
              </span>
            </div>
          )}

          <button
            onClick={() => syncNow()}
            disabled={syncStatus === 'syncing'}
            className="btn btn-secondary text-sm flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            立即同步
          </button>

          {auth.kind === 'local' && (
            <div className="flex items-start gap-2 px-3 py-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary leading-relaxed">
                <p className="mb-1.5">
                  现在用的是<b className="text-text-primary">本机账号</b>
                  ：账号和学习数据都只存在你这台电脑上，不联网、不上传、不花钱。
                </p>
                <p>
                  想换电脑继续学？用下面的
                  <b className="text-text-primary">「导出备份」</b>
                  ，在新电脑上用
                  <b className="text-text-primary">「导入备份」</b>
                  就能接着用。
                </p>
                <p className="mt-1.5 text-text-tertiary">
                  如果需要两台电脑自动同步，则需要一台常驻服务器（有持续费用）。本软件已预留云端接口，
                  接入后此页面会自动变成云端同步面板。
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---- 数据管理 ---- */}
      <section className="card">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-4 h-4 text-blender-orange" />
          <h2 className="text-sm font-semibold text-text-primary">数据管理</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="px-3 py-3 rounded-lg bg-dark-elevated">
            <p className="text-xl font-semibold text-text-primary">{lessonCount}</p>
            <p className="text-xs text-text-tertiary mt-0.5">已记录课时</p>
          </div>
          <div className="px-3 py-3 rounded-lg bg-dark-elevated">
            <p className="text-xl font-semibold text-text-primary">{noteCount}</p>
            <p className="text-xs text-text-tertiary mt-0.5">笔记条数</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={exportData} className="btn btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出备份
          </button>
          <button onClick={importData} className="btn btn-secondary text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            导入备份
          </button>
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="btn btn-ghost text-sm flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
              清空学习数据
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="text-xs text-red-400">确定清空吗？此操作不可撤销</span>
              <button onClick={clearData} className="text-xs font-medium text-red-400 hover:text-red-300">
                确定
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-xs text-text-tertiary hover:text-text-secondary"
              >
                取消
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
            <p className="font-medium text-text-primary mb-1">你的数据只属于你</p>
            <p>
              本软件不采集、不上传任何个人信息。所有学习记录都保存在你自己的电脑上。
              即使将来启用云端同步，也只同步你的学习进度与笔记，且由你自行决定是否开启。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
