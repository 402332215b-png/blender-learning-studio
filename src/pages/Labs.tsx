import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Star, Triangle, Sun, Camera as CameraIcon, Film, Layers, Building2 } from 'lucide-react'
import {
  Card,
  PageHeader,
  Tag,
  BulletList,
  StepList,
  ParameterList,
  Kbd,
} from '../components/ui'
import { useProgressStore } from '../stores'
import {
  materials,
  materialCategories,
  lightingTypes,
  interiorScenes,
  cameraPresets,
  cameraTechniques,
  animationCourses,
} from '../lib/content'
import type { FavoriteType } from '../types'

// ---------------------------------------------------------------------------
// 实验室通用：子导航
// ---------------------------------------------------------------------------

const LABS = [
  { path: '/materials', label: '材质实验室', icon: Triangle },
  { path: '/lighting', label: '灯光实验室', icon: Sun },
  { path: '/camera', label: '相机实验室', icon: CameraIcon },
  { path: '/animation', label: '动画实验室', icon: Film },
]

function LabNav() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {LABS.map((l) => (
        <NavLink
          key={l.path}
          to={l.path}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isActive
                ? 'bg-blender-orange text-white border-blender-orange'
                : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
            }`
          }
        >
          <l.icon className="w-3.5 h-3.5" />
          {l.label}
        </NavLink>
      ))}
    </div>
  )
}

/** 收藏按钮 */
function FavButton({
  itemId,
  title,
  itemType,
}: {
  itemId: string
  title: string
  itemType: FavoriteType
}) {
  const favorites = useProgressStore((s) => s.favorites)
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite)
  const active = favorites.some((f) => f.itemId === itemId)

  return (
    <button
      onClick={() =>
        toggleFavorite({
          id: `${itemId}-fav`,
          itemType,
          itemId,
          title,
          createdAt: new Date().toISOString(),
        })
      }
      className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md border transition-colors ${
        active
          ? 'text-blender-orange border-blender-orange/50 bg-blender-orange/10'
          : 'text-text-tertiary border-dark-border hover:text-text-primary'
      }`}
    >
      <Star className={`w-3 h-3 ${active ? 'fill-current' : ''}`} />
      {active ? '已收藏' : '收藏'}
    </button>
  )
}

// ---------------------------------------------------------------------------
// 知识实验室 —— 总览导航
// ---------------------------------------------------------------------------

/**
 * /labs 总览页
 *
 * 四个实验室各自是独立页面，这里只做入口汇总 + 一句话说明
 * 「什么时候该来这里」。避免用户点进去发现内容太多不知道从哪看。
 */
export function LabsHome() {
  const cards = [
    {
      to: '/materials',
      label: '材质实验室',
      icon: Triangle,
      n: materials.length,
      unit: '种材质',
      desc: '室内常用的墙漆、木地板、布艺、金属、玻璃等，每种都给可照抄的参数。',
      when: '调材质卡在「看着不像」的时候',
    },
    {
      to: '/lighting',
      label: '灯光实验室',
      icon: Sun,
      n: lightingTypes.length,
      unit: '种灯光',
      desc: `${lightingTypes.length} 种灯光类型的作用与参数，外加 ${interiorScenes.length} 套完整室内布光方案。`,
      when: '画面发灰、没有层次、光比不对的时候',
    },
    {
      to: '/camera',
      label: '相机实验室',
      icon: CameraIcon,
      n: cameraPresets.length,
      unit: '个预设',
      desc: `${cameraPresets.length} 个焦距预设（含室内常用 24/35/50mm）+ ${cameraTechniques.length} 条构图技巧。`,
      when: '不知道站哪、用多长焦距、怎么摆构图的时候',
    },
    {
      to: '/animation',
      label: '动画实验室',
      icon: Film,
      n: animationCourses.length,
      unit: '节课',
      desc: '从关键帧基础到完整室内漫游视频，含镜头运动节奏与输出设置。',
      when: '要做漫游视频、或者之前渲染出来镜头很抖的时候',
    },
  ]

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="KNOWLEDGE LABS"
        title="知识实验室"
        description="四个可随时查阅的实验室。和「成长路线」不同 —— 路线是按顺序学的，实验室是遇到具体问题时按需查的。"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <NavLink
            key={c.to}
            to={c.to}
            className="card group hover:border-blender-orange transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blender-orange/10 flex items-center justify-center shrink-0 group-hover:bg-blender-orange/20 transition-colors">
                <c.icon className="w-5 h-5 text-blender-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-text-primary">
                    {c.label}
                  </h3>
                  <span className="text-[11px] text-blender-orange font-medium">
                    {c.n} {c.unit}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {c.desc}
                </p>
                <p className="text-[11px] text-text-tertiary mt-2.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blender-orange" />
                  适合：{c.when}
                </p>
              </div>
            </div>
          </NavLink>
        ))}
      </div>

      <div className="mt-6">
        <Card eyebrow="HOW TO USE" title="怎么用这四个实验室">
          <BulletList
            items={[
              '不要按顺序看完 —— 内容量大，硬看会记不住。遇到问题再查，边用边记。',
              '看到有用的条目点右上角「收藏」，之后在「我的成长 → 收藏汇总」里能一键找到。',
              '材质和灯光是最影响出图效果的两块，如果只能挑一个先看，先看灯光。',
              '相机和动画偏输出环节，等前面建模、材质、灯光都顺了再看，效率更高。',
            ]}
            tone="info"
          />
        </Card>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 材质实验室
// ---------------------------------------------------------------------------

export function Materials() {
  const [cat, setCat] = useState<string>('全部')
  const list =
    cat === '全部' ? materials : materials.filter((m) => m.category === cat)

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="MATERIAL LAB"
        title="材质实验室"
        description={`${materials.length} 种室内常用材质，每种都给出可直接照着调的参数、用法和常见错误。`}
      />
      <LabNav />

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['全部', ...materialCategories].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              cat === c
                ? 'bg-blender-orange text-white border-blender-orange'
                : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
            }`}
          >
            {c}
            <span className="ml-1.5 text-[10px] opacity-70">
              {c === '全部'
                ? materials.length
                : materials.filter((m) => m.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((m) => (
          <Card
            key={m.id}
            eyebrow={`${m.category} · ${m.nameEn}`}
            title={m.name}
            action={<FavButton itemId={m.id} title={m.name} itemType="material" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              {m.description}
            </p>

            {m.parameters.baseColor && (
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="w-6 h-6 rounded border border-dark-border shrink-0"
                  style={{ backgroundColor: String(m.parameters.baseColor) }}
                />
                <span className="text-[11px] font-mono text-text-tertiary">
                  {String(m.parameters.baseColor)}
                </span>
              </div>
            )}

            <div className="mt-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
              <p className="text-[11px] font-medium text-text-tertiary mb-1">
                参数
              </p>
              <ParameterList params={m.parameters} />
            </div>

            <div className="mt-3 rounded-lg border border-status-learning/30 bg-status-learning/5 px-3 py-2">
              <p className="text-[11px] font-medium text-status-learning mb-1">
                室内用法
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {m.interiorUse}
              </p>
            </div>

            {m.commonMistakes.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-medium text-status-needs-review mb-1">
                  常见错误
                </p>
                <BulletList items={m.commonMistakes} tone="warn" />
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-dark-border flex items-start gap-2">
              <span className="text-[11px] text-blender-orange shrink-0 mt-0.5">
                练习
              </span>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {m.practiceTask}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 灯光实验室
// ---------------------------------------------------------------------------

export function Lighting() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="LIGHTING LAB"
        title="灯光实验室"
        description={`${lightingTypes.length} 种灯光类型 + ${interiorScenes.length} 个室内场景布光方案。`}
      />
      <LabNav />

      <h2 className="text-sm font-semibold text-text-primary mb-3">灯光类型</h2>
      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        {lightingTypes.map((l) => (
          <Card
            key={l.id}
            eyebrow={l.nameEn}
            title={l.name}
            action={<FavButton itemId={l.id} title={l.name} itemType="lighting" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              {l.description}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Tag tone="accent">{String(l.parameters.type ?? '—')}</Tag>
              <Tag>强度 {String(l.parameters.strength ?? '—')}</Tag>
            </div>

            <div className="mt-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
              <p className="text-[11px] font-medium text-text-tertiary mb-1">参数</p>
              <ParameterList params={l.parameters} />
            </div>

            <div className="mt-3 rounded-lg border border-status-learning/30 bg-status-learning/5 px-3 py-2">
              <p className="text-[11px] font-medium text-status-learning mb-1">
                室内用法
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {l.interiorUse}
              </p>
            </div>

            {l.commonMistakes.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-medium text-status-needs-review mb-1">
                  常见错误
                </p>
                <BulletList items={l.commonMistakes} tone="warn" />
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-dark-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[11px] text-blender-orange shrink-0 mt-0.5">
                  练习场景
                </span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {l.practiceScene}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[11px] text-blender-orange shrink-0 mt-0.5">
                  动手练习
                </span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {l.practiceTask}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-text-primary mb-3">
        室内场景布光方案
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {interiorScenes.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-dark-border bg-dark-surface px-4 py-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blender-orange shrink-0" />
              <p className="text-sm font-semibold text-text-primary">{s.name}</p>
              <span className="text-[10px] text-text-tertiary ml-auto">
                {s.nameEn}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              {s.description}
            </p>
            <div className="rounded-md border border-dark-border bg-dark-bg px-2.5 py-2 mb-2">
              <p className="text-[10px] text-text-tertiary mb-1">灯光组合</p>
              <p className="text-[11px] text-blender-orange font-mono leading-relaxed">
                {s.lightingSetup}
              </p>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed">
              提示：{s.tips}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 相机实验室
// ---------------------------------------------------------------------------

export function CameraLab() {
  const [active, setActive] = useState(cameraPresets[0]?.id)
  const current = cameraPresets.find((c) => c.id === active) ?? cameraPresets[0]

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="CAMERA LAB"
        title="相机实验室"
        description={`${cameraPresets.length} 个常用焦距 + ${cameraTechniques.length} 个构图技巧。`}
      />
      <LabNav />

      {/* 焦距切换 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {cameraPresets.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
              active === c.id
                ? 'bg-blender-orange text-white border-blender-orange'
                : 'bg-dark-elevated text-text-secondary border-dark-border hover:text-text-primary'
            }`}
          >
            <span className="font-mono">{c.focalLength}</span>
            <span className="ml-2 opacity-80">{c.name.replace(c.focalLength, '').trim()}</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] items-start mb-8">
          <Card eyebrow={current.nameEn} title={current.name}>
            <p className="text-xs text-text-secondary leading-relaxed">
              {current.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Tag tone="accent">焦距 {current.focalLength}</Tag>
              <Tag>传感器 {current.sensorWidth}</Tag>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-medium text-text-tertiary mb-1">
                成像特点
              </p>
              <div className="flex flex-wrap gap-2">
                {current.characteristics.map((c) => (
                  <Tag key={c}>{c}</Tag>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-status-learning/30 bg-status-learning/5 px-3 py-2">
              <p className="text-[11px] font-medium text-status-learning mb-1">
                室内用法
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {current.interiorUse}
              </p>
            </div>

            <div className="mt-3 rounded-lg border border-dark-border bg-dark-bg px-3 py-2">
              <p className="text-[11px] font-medium text-blender-orange mb-1">
                练习
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {current.practiceTask}
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            <Card eyebrow="COMPOSITION" title="构图建议">
              <BulletList items={current.compositionTips} tone="info" />
            </Card>
            <Card eyebrow="MISTAKES" title="常见错误">
              <BulletList items={current.commonMistakes} tone="warn" />
            </Card>
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-text-primary mb-3">相机技巧</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {cameraTechniques.map((t) => (
          <div
            key={t.id}
            className="rounded-lg border border-dark-border bg-dark-surface px-4 py-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-blender-orange shrink-0" />
              <p className="text-sm font-semibold text-text-primary">{t.name}</p>
              <span className="text-[10px] text-text-tertiary ml-auto">
                {t.nameEn}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-2">
              {t.description}
            </p>
            <BulletList items={t.tips} tone="info" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 动画实验室
// ---------------------------------------------------------------------------

export function Animation() {
  // animation.json 里两类条目混在一起：
  //  - 普通动画课（concepts/operations）
  //  - 镜头运动类型（shots）
  // 分开渲染，避免用同一种版式硬套。
  const conceptCourses = animationCourses.filter((a) => a.concepts?.length)
  const shotCourses = animationCourses.filter((a) => !a.concepts?.length && a.shots?.length)

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6 md:py-8">
      <PageHeader
        kicker="ANIMATION LAB"
        title="动画实验室"
        description={`${animationCourses.length} 个动画主题，从关键帧基础到室内漫游视频输出。`}
      />
      <LabNav />

      {/* 普通动画课 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {conceptCourses.map((a) => (
          <Card
            key={a.id}
            eyebrow={a.nameEn}
            title={a.name}
            action={<FavButton itemId={a.id} title={a.name} itemType="animation" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              {a.description}
            </p>

            {a.concepts && a.concepts.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-medium text-text-tertiary mb-1">
                  核心概念
                </p>
                <BulletList items={a.concepts} tone="info" />
              </div>
            )}

            {a.operations && a.operations.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-medium text-text-tertiary mb-1">
                  操作步骤
                </p>
                <StepList steps={a.operations} />
              </div>
            )}

            {a.interiorUse && (
              <div className="mt-4 rounded-lg border border-status-learning/30 bg-status-learning/5 px-3 py-2">
                <p className="text-[11px] font-medium text-status-learning mb-1">
                  室内用法
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {a.interiorUse}
                </p>
              </div>
            )}

            {a.practiceTask && (
              <div className="mt-3 pt-3 border-t border-dark-border flex items-start gap-2">
                <Kbd>练习</Kbd>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {a.practiceTask}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 镜头运动类型（结构不同的那一条）*/}
      {shotCourses.map((a) => (
        <div key={a.id} className="mt-6">
          <Card
            eyebrow={a.nameEn}
            title={a.name}
            action={<FavButton itemId={a.id} title={a.name} itemType="animation" />}
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              {a.description}
            </p>
            <div className="grid gap-3 md:grid-cols-2 mt-4">
              {(a.shots ?? []).map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-dark-border bg-dark-bg px-4 py-3"
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-text-primary">
                      {s.name}
                    </p>
                    <span className="text-[10px] text-text-tertiary font-mono">
                      {s.nameEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                    {s.description}
                  </p>
                  <p className="text-[11px] text-blender-orange mt-2 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blender-orange shrink-0" />
                    {s.use}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
