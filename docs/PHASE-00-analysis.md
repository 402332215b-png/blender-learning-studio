# PHASE 00 — PPT 内容分析、课程树、信息架构、数据库设计与开发计划

> **Blender Learning Studio｜室内设计师 Blender 成长系统**
> 文档版本：v0.0.1 | 日期：2026-09-01

---

## 目录

1. [PPT 内容分析](#1-ppt-内容分析)
2. [完整课程树](#2-完整课程树)
3. [程序信息架构](#3-程序信息架构)
4. [数据库结构](#4-数据库结构)
5. [项目文件夹结构](#5-项目文件夹结构)
6. [Phase 开发计划](#6-phase-开发计划)
7. [当前存在的问题和风险](#7-当前存在的问题和风险)

---

## 1. PPT 内容分析

### 1.1 PPT 现状

项目文件夹中暂未发现 .pptx 文件。根据项目文档中已描述的核心逻辑，以下分析基于文档中提供的两条学习路线的结构性信息。**待 PPT 文件放入项目文件夹后，将补充每节课的详细知识点和实操任务。**

### 1.2 PPT A — Route A：《SU主力 + Blender增强 12周工作型学习计划》

**核心定位：** 不影响当前室内设计项目工作，以 SketchUp 为建模主力、Blender 为增强工具。

**核心工作流：**
```
CAD → SketchUp → SU完成空间模型 → Blender → 模型整理 → 材质 → 灯光 → Camera → 效果图 → 动画 → 视频
```

**学习逻辑分析：**
- 不学 Blender 基础建模，而是在 SU 建模基础上学习 Blender 的后期环节
- 每周一个工作模块，12 周覆盖完整工作流
- 目标是"马上能用"，每周末能输出实际项目成果
- 重点关注 SU → Blender 的模型传递环节（FBX 导出、单位/Scale/Normal 检查）

**推断的 12 周结构（基于工作流逆推）：**

| Week | 主题 | 核心内容 | 预期产出 |
|------|------|----------|----------|
| 01 | SU → Blender 模型传递 | FBX导出、导入、单位检查、Scale检查、Normal检查 | 成功导入一个SU空间模型 |
| 02 | 模型整理与优化 | Mesh清理、重面处理、法线统一、拓扑基础 | 干净可用的Blender场景 |
| 03 | 材质基础（室内） | Principled BSDF、乳胶漆/木饰面/金属/玻璃 | 室内基础材质库 |
| 04 | PBR材质与贴图 | Base Color/Roughness/Normal/Bump/UV Scale | PBR材质体系 |
| 05 | UV展开 | UV基础、智能UV、接缝标记、UV Pack | 正确贴图的模型 |
| 06 | 灯光基础（室内） | Sun/Area/Point/Spot、色温、亮度 | 室内日景/夜景灯光 |
| 07 | HDRI与环境光 | HDRI设置、世界环境、背景 | 自然光照室内场景 |
| 08 | Camera与构图 | 24/28/35/50mm、机位高度、景深 | 专业室内摄影构图 |
| 09 | Eevee渲染 | Eevee设置、SSS、SSR、Bloom、渲染参数 | 快速效果图输出 |
| 10 | Cycles渲染 | Cycles设置、降噪、采样、GPU渲染 | 高品质效果图 |
| 11 | Camera动画基础 | Keyframe、Timeline、Follow Path、Track To | 镜头运动动画 |
| 12 | 室内漫游视频 | 镜头编排、渲染动画、视频输出 | 完整室内漫游视频 |

### 1.3 PPT B — Route B：《Blender 系统学习 24周成长计划》

**核心定位：** 系统完整掌握 Blender，从基础到高级全链路学习。

**学习顺序分析（文档已明确）：**
```
Blender基础 → 视图 → Object Mode → Edit Mode → 基础建模 → 室内建模 →
Modifier → 拓扑 → Normal → UV → Material → PBR → Texture →
Lighting → Camera → Eevee → Cycles → Animation →
Bezier Curve → Follow Path → Camera Animation → Render Animation →
Geometry Nodes → Asset Browser → 完整室内项目
```

**推断的 24 周结构（按学习顺序切分）：**

| Week | 阶段 | 主题 | 核心知识点 |
|------|------|------|------------|
| 01 | 基础 | Blender基础 | 界面布局、工作区、偏好设置、文件管理 |
| 02 | 基础 | 视图操作 | 视图导航、正交/透视、局部视图、视图着色模式 |
| 03 | 基础 | Object Mode | 选择、移动、旋转、缩放、复制、镜像、对齐 |
| 04 | 基础 | Edit Mode | 顶点/边/面、挤出、倒角、环切、填充、合并 |
| 05 | 建模 | 基础建模 | Mesh Primitive、挤出建模、布尔运算、参考图 |
| 06 | 建模 | 室内建模(一) | 墙体建模、门窗洞口、踢脚线、地面 |
| 07 | 建模 | 室内建模(二) | 吊顶、背景墙、柜体、楼梯 |
| 08 | 修改器 | Modifier(一) | Array、Mirror、Solidify、Bevel |
| 09 | 修改器 | Modifier(二) | Subdivision Surface、Boolean、Screw、Curve |
| 10 | 拓扑 | 拓扑基础 | 拓扑原则、四边面流动、环形布线、星点处理 |
| 11 | 法线 | Normal与法线 | 法线方向、法线平滑(Shade Smooth/Auto Smooth)、Custom Normal |
| 12 | UV | UV Mapping(一) | UV基础、Smart UV Project、接缝标记 |
| 13 | UV | UV Mapping(二) | 手动展开、UV Pack、UV同步、多对象UV |
| 14 | 材质 | Material | Principled BSDF、材质节点、材质槽、继承 |
| 15 | 材质 | PBR材质 | Base Color、Roughness、Metallic、IOR、Subsurface |
| 16 | 材质 | Texture & Image | Image Texture、Mapping节点、 procedural纹理、Bump/Normal Map |
| 17 | 灯光 | Lighting | Sun、Area、Spot、Point、Emission、三点光 |
| 18 | 相机 | Camera | 焦距、Sensor、景深、构图规则、室内摄影 |
| 19 | 渲染 | Eevee | SSS、SSR、Bloom、Ambient Occlusion、渲染参数 |
| 20 | 渲染 | Cycles | 采样、降噪、GPU、Caustics、渲染层 |
| 21 | 动画 | Animation基础 | Keyframe、Timeline、Dope Sheet、插值模式 |
| 22 | 动画 | Bezier曲线与路径 | Bezier Curve、Follow Path、Track To、约束 |
| 23 | 动画 | Camera Animation | 镜头运动、Graph Editor、缓动、渲染动画 |
| 24 | 综合项目 | 完整室内项目 | Asset Browser、Geometry Nodes入门、完整室内场景制作与输出 |

---

## 2. 完整课程树

### 2.1 数据结构层级

```
Route（学习路线）
  └── Phase（阶段）
       └── Week（周）
            └── Lesson（课程）
                 └── KnowledgePoint（知识点）
                      └── PracticeTask（实操任务）
                           └── CompletionStatus（完成状态）
                                └── PersonalNotes（个人笔记）
```

### 2.2 Route A 课程树（12周 / SU + Blender工作路线）

```
Route A: SU + Blender 工作路线
├── Phase 1: 模型传递与整理（Week 01-02）
│   ├── Week 01: SU → Blender 模型传递
│   │   ├── Lesson 01.1: SketchUp模型检查与整理
│   │   │   ├── KP: Group/Component整理原则
│   │   │   ├── KP: Tag（图层）管理
│   │   │   └── Practice: 整理一个SU室内场景模型
│   │   ├── Lesson 01.2: FBX导出设置
│   │   │   ├── KP: SketchUp FBX导出参数
│   │   │   ├── KP: 单位与坐标原点
│   │   │   └── Practice: 导出FBX并记录参数
│   │   ├── Lesson 01.3: Blender导入与单位检查
│   │   │   ├── KP: FBX导入设置
│   │   │   ├── KP: Blender单位设置（Metric/Centimeters）
│   │   │   ├── KP: Scale检查与修正
│   │   │   ├── KP: Normal检查与翻转
│   │   │   └── Practice: 导入FBX并完成单位/Scale/Normal检查清单
│   │   └── Lesson 01.4: 常见导入问题排查
│   │       ├── KP: 模型碎片问题
│   │       ├── KP: 材质丢失
│   │       ├── KP: 法线翻转
│   │       └── Practice: 问题排查清单实操
│   └── Week 02: 模型整理与优化
│       ├── Lesson 02.1: Mesh清理
│       │   ├── KP: Merge by Distance（重面/重叠顶点）
│       │   ├── KP: 删除零面积面
│       │   ├── KP: Recalculate Normals
│       │   └── Practice: 清理导入模型的Mesh问题
│       ├── Lesson 02.2: 场景组织
│       │   ├── KP: Collection组织
│       │   ├── KP: 命名规范
│       │   ├── KP: 实例化与Link
│       │   └── Practice: 建立室内场景Collection结构
│       └── Lesson 02.3: 模型优化
│           ├── KP: LOD概念
│           ├── KP: 面数控制
│           ├── KP: Decimate Modifier
│           └── Practice: 优化模型面数
│
├── Phase 2: 材质与贴图（Week 03-05）
│   ├── Week 03: 材质基础（室内）
│   │   ├── Lesson 03.1: Principled BSDF基础
│   │   │   ├── KP: Base Color / Roughness / Metallic / Specular
│   │   │   ├── KP: 室内材质命名规范
│   │   │   ├── KP: Material Properties vs Shader Editor
│   │   │   └── Practice: 创建乳胶漆、木饰面、金属三种基础材质
│   │   ├── Lesson 03.2: 室内基础材质库
│   │   │   ├── KP: 乳胶漆（高Roughness、微Bump）
│   │   │   ├── KP: 木饰面（Base Color + Roughness + Normal）
│   │   │   ├── KP: 金属（Metallic=1、Roughness变化）
│   │   │   ├── KP: 玻璃（Transmission、IOR=1.5）
│   │   │   └── Practice: 建立室内基础材质库（8种）
│   │   └── Lesson 03.3: 布艺与皮革
│       ├── KP: Sheen（织物光泽）
│       ├── KP: Subsurface（皮革/石材微SSS）
│       ├── KP: Bump纹理模拟纹理感
│       └── Practice: 创建布艺沙发与皮革材质
│   ├── Week 04: PBR材质与贴图
│   │   ├── Lesson 04.1: PBR工作流
│   │   │   ├── KP: PBR原理（Albedo/Roughness/Normal/Metallic）
│   │   │   ├── KP: 贴图通道对应关系
│   │   │   └── Practice: 完成一个PBR木地板材质
│   │   ├── Lesson 04.2: Image Texture与Mapping
│   │   │   ├── KP: Image Texture节点
│   │   │   ├── KP: Mapping节点与UV Map
│   │   │   ├── KP: 贴图Scale与重复
│   │   │   └── Practice: 大理石地面PBR材质
│   │   └── Lesson 04.3: 程序化纹理
│       ├── KP: Noise / Voronoi / Musgrave
│       ├── KP: ColorRamp调节
│       ├── KP: Bump vs Normal Map
│       └── Practice: 程序化肌理漆材质
│   └── Week 05: UV展开
│       ├── Lesson 05.1: UV基础
│       │   ├── KP: UV Editor界面
│       │   ├── KP: UV Map概念
│       ├── Lesson 05.2: Smart UV Project
│       │   ├── KP: 智能UV展开
│       │   ├── KP: 接缝标记（Mark Seam）
│       │   └── Practice: 展开一个柜子UV
│       └── Lesson 05.3: 手动UV与Pack
│           ├── KP: 手动展开方法
│           ├── KP: UV Pack优化
│           └── Practice: 展开复杂模型UV
│
├── Phase 3: 灯光与环境（Week 06-07）
│   ├── Week 06: 灯光基础（室内）
│   │   ├── Lesson 06.1: 灯光类型
│   │   │   ├── KP: Sun（自然光）
│   │   │   ├── KP: Area（柔和面光）
│   │   │   ├── KP: Spot（射灯）
│   │   │   ├── KP: Point（点光源）
│   │   │   ├── KP: Emission（自发光）
│   │   │   └── Practice: 搭建办公室基础灯光
│   │   ├── Lesson 06.2: 色温与亮度
│   │   │   ├── KP: 色温（Warm/Cool）
│   │   │   ├── KP: 亮度控制（Power/Multiplier）
│   │   │   ├── KP: 三点光逻辑在室内的应用
│   │   │   └── Practice: 室内日景与夜景灯光对比
│   │   └── Lesson 06.3: 阴影控制
│       ├── KP: 阴影柔和度
│       ├── KP: Shadow Map / Contact Shadow
│       └── Practice: 调整室内阴影层次
│   └── Week 07: HDRI与环境光
│       ├── Lesson 07.1: HDRI设置
│       │   ├── KP: World环境HDRI
│       │   ├── KP: HDRI亮度与方向
│       │   ├── KP: 背景与渲染分离
│       │   └── Practice: HDRI室内自然光
│       └── Lesson 07.2: 环境光与补光
│           ├── KP: Ambient Occlusion
│           ├── KP: 补光策略
│           └── Practice: 完整自然光室内场景
│
├── Phase 4: Camera与渲染（Week 08-10）
│   ├── Week 08: Camera与构图
│   │   ├── Lesson 08.1: Camera设置
│   │   │   ├── KP: 焦距（24/28/35/50mm）
│   │   │   ├── KP: Sensor Size
│   │   │   ├── KP: 景深(DOF)
│   │   │   ├── KP: Camera高度与构图
│   │   │   └── Practice: 室内多机位构图
│   │   └── Lesson 08.2: 室内摄影构图
│       ├── KP: 三分法/对角线/对称
│       ├── KP: 视角引导线
│       └── Practice: 拍摄5个室内构图
│   ├── Week 09: Eevee渲染
│   │   ├── Lesson 09.1: Eevee设置
│   │   │   ├── KP: SSS / SSR / Bloom
│   │   │   ├── KP: Ambient Occlusion
│   │   │   ├── KP: 渲染参数
│   │   │   └── Practice: Eevee快速效果图
│   │   └── Lesson 09.2: Eevee vs Cycles选择
│       ├── KP: 渲染器对比
│       ├── KP: 快速预览策略
│       └── Practice: Eevee/Cycles对比渲染
│   └── Week 10: Cycles渲染
│       ├── Lesson 10.1: Cycles设置
│       │   ├── KP: 采样与降噪
│       │   ├── KP: GPU渲染
│       │   ├── KP: 渲染层与通道
│       │   └── Practice: Cycles高品质效果图
│       └── Lesson 10.2: 后处理与输出
│           ├── KP: Color Management
│           ├── KP: 合成器(Compositor)
│           └── Practice: 最终效果图输出
│
└── Phase 5: 动画与漫游（Week 11-12）
    ├── Week 11: Camera动画基础
    │   ├── Lesson 11.1: Keyframe动画
    │   │   ├── KP: Keyframe插入
    │   │   ├── KP: Timeline与Dope Sheet
    │   │   ├── KP: 插值模式
    │   │   └── Practice: Camera推进动画
    │   └── Lesson 11.2: Follow Path与Track To
    │       ├── KP: Bezier Curve路径
    │       ├── KP: Follow Path约束
    │       ├── KP: Track To约束
    │       └── Practice: Camera沿路径移动
    └── Week 12: 室内漫游视频
        ├── Lesson 12.1: 镜头编排
        │   ├── KP: 多镜头组合
        │   ├── KP: 镜头节奏
        │   ├── KP: Graph Editor缓动
        │   └── Practice: 设计室内漫游分镜
        └── Lesson 12.2: 渲染动画与视频输出
            ├── KP: Render Animation
            ├── KP: 视频编码设置
            ├── KP: 输出格式
            └── Practice: 输出完整室内漫游视频
```

### 2.3 Route B 课程树（24周 / Blender系统成长路线）

> Route B 课程树结构较长，核心数据将写入 `data/courses.json`。以下为阶段概览：

```
Route B: Blender 系统成长路线
├── Phase 1: Blender基础（Week 01-04）
│   ├── Week 01: Blender基础（界面/工作区/文件管理）
│   ├── Week 02: 视图操作（导航/正交透视/着色模式）
│   ├── Week 03: Object Mode（选择/变换/复制/对齐）
│   └── Week 04: Edit Mode（挤出/倒角/环切/填充）
│
├── Phase 2: 建模（Week 05-07）
│   ├── Week 05: 基础建模（Primitive/挤出/布尔）
│   ├── Week 06: 室内建模一（墙体/门窗/地面）
│   └── Week 07: 室内建模二（吊顶/背景墙/柜体）
│
├── Phase 3: 修改器与拓扑（Week 08-11）
│   ├── Week 08: Modifier一（Array/Mirror/Solidify/Bevel）
│   ├── Week 09: Modifier二（Subdivision/Boolean/Screw/Curve）
│   ├── Week 10: 拓扑基础（四边面/环形布线/星点）
│   └── Week 11: Normal与法线（法线方向/平滑/Custom Normal）
│
├── Phase 4: UV与材质（Week 12-16）
│   ├── Week 12: UV Mapping一（UV基础/Smart UV）
│   ├── Week 13: UV Mapping二（手动展开/Pack）
│   ├── Week 14: Material（Principled BSDF/节点）
│   ├── Week 15: PBR材质（Albedo/Roughness/Metallic/IOR）
│   └── Week 16: Texture（Image/Mapping/程序化/Bump/Normal）
│
├── Phase 5: 灯光/相机/渲染（Week 17-20）
│   ├── Week 17: Lighting（Sun/Area/Spot/Point/HDRI）
│   ├── Week 18: Camera（焦距/景深/构图）
│   ├── Week 19: Eevee（SSS/SSR/Bloom/AO）
│   └── Week 20: Cycles（采样/降噪/GPU/通道）
│
├── Phase 6: 动画（Week 21-23）
│   ├── Week 21: Animation基础（Keyframe/Timeline/Dope Sheet）
│   ├── Week 22: Bezier曲线与路径（Curve/Follow Path/Track To）
│   └── Week 23: Camera Animation（镜头运动/Graph Editor/渲染动画）
│
└── Phase 7: 综合项目（Week 24）
    ├── Week 24: 完整室内项目
    │   ├── Asset Browser使用
    │   ├── Geometry Nodes入门
    │   └── 完整室内场景制作与输出
```

### 2.4 课程模板（每节课统一结构）

每节课的 JSON 数据结构如下（示例用 Lesson 03.1）：

```json
{
  "lessonId": "A03-01",
  "routeId": "A",
  "week": 3,
  "lessonNumber": "03.1",
  "title": "Principled BSDF基础",
  "englishName": "Principled BSDF",
  "shortcut": "Shift+Z (Material Preview) / Shift+Click (Shader Editor)",
  "objective": "理解Principled BSDF各参数含义，掌握室内材质创建的基本方法",
  "principle": "Principled BSDF是Blender的统一材质着色器，基于PBR（基于物理的渲染）原理...",
  "blenderOperations": [
    "1. 选中物体 → 右键 → Assign New Material",
    "2. 切换到Shader Editor (Shift+Click material icon)",
    "3. 调整Base Color / Roughness / Metallic参数"
  ],
  "interiorDesignUse": "乳胶漆墙面、木饰面家具、金属配件等所有室内材质的基础。掌握后可以快速创建90%的室内材质。",
  "sketchupReference": "SketchUp中材质是简单的颜色+贴图，没有PBR概念。Blender的Principled BSDF相当于把SU材质升级为真实物理材质——有粗糙度、反射、金属质感等。",
  "commonMistakes": [
    "Roughness=0导致所有材质像镜面金属",
    "Metallic不是0就是1，不要用中间值（除非特殊效果）",
    "忘记切换到Material Preview或Rendered模式看不到效果"
  ],
  "practiceTasks": [
    {
      "taskId": "A03-01-P1",
      "title": "创建三种基础室内材质",
      "description": "创建乳胶漆（白色高Roughness）、木饰面（棕色中Roughness+Normal Map）、金属（Metallic=1低Roughness）三种材质",
      "difficultyLevel": 2,
      "estimatedTime": "20分钟"
    }
  ],
  "knowledgePoints": [
    "Base Color - 材质基础颜色",
    "Roughness - 表面粗糙度（0=镜面 1=磨砂）",
    "Metallic - 金属度（0=非金属 1=金属）",
    "Specular - 反射强度",
    "IOR - 折射率"
  ]
}
```

---

## 3. 程序信息架构

### 3.1 页面/路由结构

```
/ (Home)
  ├── /home                    → 首页：欢迎回来 + 继续学习 + 今日任务 + 进度 + 复习

/learn (学习中心)
  ├── /learn                    → 路线选择（Route A / Route B）
  ├── /learn/route-a            → Route A 12周时间轴
  ├── /learn/route-a/:weekId    → 某周课程列表
  ├── /learn/route-a/:weekId/:lessonId → 课程详情页
  ├── /learn/route-b            → Route B 24周时间轴
  ├── /learn/route-b/:weekId
  └── /learn/route-b/:weekId/:lessonId

/practice (练习)
  ├── /practice                 → 练习难度选择（Level 01-08）
  └── /practice/:levelId        → 具体练习任务

/materials (材质实验室)
  ├── /materials                → 材质列表
  └── /materials/:materialId    → 材质详情

/lighting (灯光实验室)
  ├── /lighting                 → 灯光类型列表
  └── /lighting/:lightingId     → 灯光详情

/camera (Camera实验室)
  ├── /camera                   → 焦距/构图列表
  └── /camera/:cameraId         → Camera详情

/animation (动画实验室)
  ├── /animation                → 动画课程列表
  └── /animation/:animationId   → 动画详情

/su-to-blender (SU → Blender助手)
  └── /su-to-blender            → 工作流引导（效果图/材质/灯光/动画/视频）

/library (资源库)
  ├── /library/shortcuts        → 快捷键中心
  ├── /library/assets           → Asset Library Guide
  └── /library/favorites        → 收藏夹

/growth (个人成长中心)
  └── /growth                   → 学习数据统计

/settings (设置)
  └── /settings                 → 账号/同步/离线设置

/auth (认证)
  ├── /auth/login               → 登录
  ├── /auth/register            → 注册
  └── /auth/forgot              → 忘记密码
```

### 3.2 导航结构

**桌面端侧边栏：**

```
┌─────────────────────────┐
│  Blender Learning Studio │
│  [用户头像] [用户名]      │
├─────────────────────────┤
│  🏠 Home                 │
│  📖 Learn                │
│  ✏️ Practice             │
│  🎨 Material            │
│  💡 Lighting            │
│  📷 Camera              │
│  🎬 Animation           │
│  🔄 SU → Blender        │
│  📚 Library             │
│  📊 Growth              │
│  ⚙️ Settings            │
└─────────────────────────┘
```

**移动端底部导航：**

```
┌──────┬──────┬──────┬──────┬──────┐
│ Home │Learn │Short │ Growth│ More │
└──────┴──────┴──────┴──────┴──────┘
```

### 3.3 首页信息架构

```
┌──────────────────────────────────────────────────────┐
│  Blender Learning Studio        2026/09/01  [Avatar]  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Welcome Back, [用户名]                                │
│  你已经连续学习 X 天                                    │
│                                                       │
│  ┌─ Continue Learning ───────────────────────────┐   │
│  │  Route B · Week 05 · Modifier一               │   │
│  │  Array Modifier                              │   │
│  │  ████████████░░░░░  70%                       │   │
│  │  [继续上次学习 →]                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
│  ┌─ Today ──────────────┐ ┌─ Review ─────────────┐  │
│  │ 今日知识点            │ │ UV Mapping           │  │
│  │ Bevel Modifier        │ │ 21天未复习            │  │
│  │ 快捷键: Ctrl+B        │ │ [去复习 →]            │  │
│  │ 15分钟练习            │ └────────────────────┘  │
│  │ [开始今日学习 →]       │                          │
│  └──────────────────────┘                          │
│                                                       │
│  ┌─ Route Progress ──────────────────────────────┐    │
│  │ Route A (12周)  ██████░░░░░░  25%             │    │
│  │ Route B (24周)  ████░░░░░░░░░░  18%           │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  ┌─ Recent ─────────────────────────────────────┐    │
│  │ 09/01 - Material - Principled BSDF ✓         │    │
│  │ 08/31 - Lighting - Area Light ✓              │    │
│  │ 08/30 - Camera - 35mm焦距 ✓                  │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 4. 数据库结构

### 4.1 Supabase / PostgreSQL 表结构

#### 4.1.1 profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  current_route CHAR(1) DEFAULT 'B',  -- 'A' or 'B'
  current_week INTEGER DEFAULT 1,
  current_lesson_id TEXT,
  total_study_days INTEGER DEFAULT 0,
  consecutive_study_days INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.2 user_progress

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  route_id CHAR(1) NOT NULL,  -- 'A' or 'B'
  lesson_id TEXT NOT NULL,
  knowledge_point_id TEXT,
  status TEXT DEFAULT 'not_started',
    -- not_started | learning | completed | mastered | needs_review
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  review_count INTEGER DEFAULT 0,
  mastery_score INTEGER DEFAULT 0,  -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, knowledge_point_id)
);
```

#### 4.1.3 notes

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.4 learning_sessions

```sql
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT,
  route_id CHAR(1),
  session_date DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.5 review_queue

```sql
CREATE TABLE review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  knowledge_point_id TEXT,
  added_reason TEXT,  -- 'manual' | 'auto_stale' | 'low_mastery'
  last_reviewed_at TIMESTAMPTZ,
  next_review_date DATE,
  review_interval_days INTEGER DEFAULT 7,
  priority INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.6 favorites

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,  -- 'shortcut' | 'knowledge' | 'material' | 'lighting' | 'camera'
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);
```

#### 4.1.7 practice_records

```sql
CREATE TABLE practice_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  practice_task_id TEXT NOT NULL,
  difficulty_level INTEGER,
  status TEXT DEFAULT 'not_started',  -- not_started | in_progress | completed
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.8 user_settings

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  daily_reminder_enabled BOOLEAN DEFAULT false,
  daily_reminder_time TIME,
  default_route CHAR(1) DEFAULT 'B',
  theme TEXT DEFAULT 'dark',
  offline_mode_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### 4.1.9 projects (后期)

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT,  -- 'render' | 'animation' | 'practice' | 'work'
  thumbnail_url TEXT,
  file_urls JSONB,
  related_lesson_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4.1.10 Row Level Security

```sql
-- 所有用户表启用RLS，确保用户只能访问自己的数据
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Profiles: 用户只能读写自己的
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Notes, Learning Sessions, Review Queue, Favorites, Practice Records, Settings, Projects
-- 同样模式：SELECT/INSERT/UPDATE/DELETE 均 WHERE auth.uid() = user_id
```

### 4.2 本地 IndexedDB 结构

```
IndexedDB Database: blender-learning-studio

Object Stores:
├── courses          → 缓存的课程数据（routes.json, courses.json, lessons.json等）
├── progress         → 本地学习进度（离线暂存，联网后sync到Supabase）
├── notes            → 本地笔记暂存
├── sessions        → 本地学习记录暂存
├── review_queue    → 本地复习队列暂存
├── favorites       → 本地收藏暂存
├── practice        → 本地练习记录暂存
└── settings        → 本地设置缓存

Sync 策略:
- 每条记录包含: local_updated_at (timestamp)
- 联网时比较 local_updated_at vs server_updated_at
- 冲突时取最新时间戳的版本
- 合并策略: field-level merge（非覆盖式）
```

### 4.3 课程数据 JSON 文件

课程内容与代码分离，存放在 `/data` 目录：

```
data/
├── routes.json          → 路线元信息（A/B基本信息）
├── courses-a.json       → Route A 全部课程（12周 × 3-4 lessons）
├── courses-b.json       → Route B 全部课程（24周 × 3-4 lessons）
├── shortcuts.json       → 快捷键库（按分类）
├── materials.json       → 材质实验室数据
├── lighting.json        → 灯光实验室数据
├── camera.json          → Camera实验室数据
├── animation.json       → 动画实验室数据
├── practice.json        → 练习任务（按Level 01-08）
├── su-to-blender.json   → SU→Blender工作流步骤
└── assets-guide.json    → Asset Library资源指引
```

---

## 5. 项目文件夹结构

```
blender-learning-studio/
├── public/
│   ├── icons/                  → PWA图标
│   ├── manifest.json           → PWA manifest
│   └── sw.js                   → Service Worker (生成或手写)
│
├── src/
│   ├── main.tsx                → 应用入口
│   ├── App.tsx                 → 根组件 + 路由
│   ├── router.tsx              → 路由配置
│   │
│   ├── components/             → 通用组件
│   │   ├── ui/                 → 基础UI（Button, Card, Progress等）
│   │   ├── layout/             → 布局组件（Sidebar, Header, MobileNav）
│   │   └── shared/             → 共享业务组件
│   │
│   ├── pages/                  → 页面组件
│   │   ├── Home.tsx
│   │   ├── Learn/
│   │   │   ├── RouteSelect.tsx
│   │   │   ├── RouteA.tsx
│   │   │   ├── RouteB.tsx
│   │   │   └── LessonDetail.tsx
│   │   ├── Practice/
│   │   ├── Materials/
│   │   ├── Lighting/
│   │   ├── Camera/
│   │   ├── Animation/
│   │   ├── SUToBlender/
│   │   ├── Library/
│   │   ├── Growth/
│   │   ├── Settings/
│   │   └── Auth/
│   │
│   ├── features/               → 功能模块（业务逻辑）
│   │   ├── auth/               → 认证
│   │   ├── progress/           → 学习进度管理
│   │   ├── sync/               → 云端同步
│   │   ├── offline/            → 离线缓存
│   │   ├── review/             → 智能复习
│   │   └── today/              → 今日学习推荐
│   │
│   ├── hooks/                  → 自定义Hooks
│   │   ├── useAuth.ts
│   │   ├── useProgress.ts
│   │   ├── useSync.ts
│   │   ├── useOffline.ts
│   │   └── useToday.ts
│   │
│   ├── lib/                    → 工具库
│   │   ├── supabase.ts         → Supabase客户端
│   │   ├── db.ts               → IndexedDB封装
│   │   ├── sync.ts             → 同步逻辑
│   │   └── utils.ts            → 通用工具函数
│   │
│   ├── stores/                 → 状态管理（Zustand）
│   │   ├── authStore.ts
│   │   ├── progressStore.ts
│   │   ├── settingsStore.ts
│   │   └── syncStore.ts
│   │
│   ├── types/                  → TypeScript类型
│   │   ├── course.ts
│   │   ├── progress.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   └── styles/                 → 全局样式
│       └── globals.css
│
├── data/                       → 课程数据（与代码分离）
│   ├── routes.json
│   ├── courses-a.json
│   ├── courses-b.json
│   ├── shortcuts.json
│   ├── materials.json
│   ├── lighting.json
│   ├── camera.json
│   ├── animation.json
│   ├── practice.json
│   ├── su-to-blender.json
│   └── assets-guide.json
│
├── docs/                       → 项目文档
│   ├── PHASE-00-analysis.md    → 本文档
│   ├── database-schema.sql     → SQL建表语句
│   └── deployment.md
│
├── .env                         → 环境变量（Supabase URL/Key等，不提交）
├── .env.example                 → 环境变量示例
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── docs/PHASE-00-analysis.md
```

---

## 6. Phase 开发计划

### 概览

| Phase | 名称 | 核心交付物 | 依赖 |
|-------|------|-----------|------|
| 00 | PPT分析与课程结构 | 本文档 | — |
| 01 | 项目初始化 | React+TS+Vite+路由+目录结构 | 00 |
| 02 | 基础UI系统 | 颜色/字体/按钮/Card/Nav/Progress | 01 |
| 03 | 首页 | Welcome/Continue/Today/Progress/Review | 02 |
| 04 | A/B学习路线 | 12周+24周时间轴+完成度 | 03 |
| 05 | 课程页面 | 课程内容/练习/笔记/完成状态 | 04 |
| 06 | Supabase集成 | Auth/登录/数据存储 | 05 |
| 07 | 学习记忆系统 | 进度/掌握程度/历史/薄弱知识 | 06 |
| 08 | IndexedDB离线 | 离线缓存+自动同步 | 07 |
| 09 | 快捷键中心 | 搜索/分类/SU对应 | 02 |
| 10 | Material Lab | 材质实验室 | 02 |
| 11 | Lighting Lab | 灯光实验室 | 02 |
| 12 | Camera Lab | Camera实验室 | 02 |
| 13 | Animation Lab | 动画实验室 | 02 |
| 14 | SU→Blender助手 | 工作流引导 | 02 |
| 15 | 个人成长中心 | 统计/数据/作品 | 07 |
| 16 | PWA | ServiceWorker/Manifest/离线 | 08 |
| 17 | 多设备测试 | 响应式+PWA验证 | 16 |
| 18 | UI优化 | 整体打磨 | 17 |

### 详细 Phase 计划

**PHASE 01 — 项目初始化**
- 初始化 Vite + React + TypeScript 项目
- 安装核心依赖：react-router-dom, zustand, @supabase/supabase-js, tailwindcss, dexie (IndexedDB), date-fns, lucide-react
- 配置 Tailwind CSS（主题色、字体、间距系统）
- 配置路由（所有页面骨架占位）
- 建立目录结构
- 验证：`npm run dev` 能打开空白框架页面

**PHASE 02 — 基础UI系统**
- 定义颜色变量（深灰/黑灰/暖灰/白 + Blender Orange #F5792A）
- 定义字体（Inter 或 system-ui）
- 开发基础组件：Button, Card, Badge, ProgressBar, Tabs, Sidebar, Header, MobileNav
- 开发 EmptyState, LoadingSpinner 等辅助组件
- 验证：Storybook 风格的组件预览页面

**PHASE 03 — 首页**
- Home页面布局
- "Welcome Back" 区域（显示用户名+连续学习天数）
- "Continue Learning" 卡片（上次学习+进度+按钮）
- "Today" 卡片（推荐知识点+快捷键+练习）
- "Review" 卡片（待复习项）
- Route Progress 双进度条
- Recent 列表
- 侧边栏导航
- 数据：使用 mock 数据（Phase 06 接入真实数据）

**PHASE 04 — A/B学习路线**
- Route 选择页
- Route A 12周时间轴（Phase分组+Week卡片+完成度环）
- Route B 24周时间轴
- 点击 Week 展开该周所有 Lessons
- 完成度计算（已完成/总数）
- 模拟数据来自 `data/courses-a.json` 和 `data/courses-b.json`

**PHASE 05 — 课程页面**
- 课程详情页统一模板
- 渲染课程JSON中的所有字段
- 练习任务卡片 + 完成按钮
- 笔记区域（textarea + 自动保存到本地）
- 掌握程度选择器（5种状态）
- 底部：上一课/下一课导航
- 前一篇/后一篇

**PHASE 06 — Supabase集成**
- 配置 Supabase 客户端
- Auth UI（登录/注册/忘记密码）
- profiles 表自动创建（触发器）
- user_progress CRUD
- notes CRUD
- RLS 验证

**PHASE 07 — 学习记忆系统**
- 进度跟踪（Route级别+Week级别+Lesson级别）
- 掌握程度管理
- 学习历史记录
- 薄弱知识自动识别（completed但长时间未reviewed）
- 智能复习队列（间隔复习算法）
- "今日学习"推荐逻辑
- "继续学习"逻辑

**PHASE 08 — IndexedDB离线缓存**
- Dexie.js 初始化
- 课程数据缓存（首次加载后持久化）
- 进度/笔记/练习本地暂存
- 在线/离线检测
- 自动同步（联网时推送+拉取）
- 冲突合并（时间戳策略）

**PHASE 09-14 — 各实验室**
- 快捷键中心：搜索+分类+收藏
- Material Lab：材质卡片+参数详情+室内语言解释
- Lighting Lab：灯光类型+场景练习
- Camera Lab：焦距对比+构图规则
- Animation Lab：动画类型+镜头练习
- SU→Blender：工作流步骤引导+勾选

**PHASE 15 — 个人成长中心**
- 统计仪表盘
- 学习日历热力图
- 技能掌握雷达图
- 作品记录（图片上传到 Supabase Storage）

**PHASE 16 — PWA**
- manifest.json 配置
- Service Worker（缓存策略：cache-first for static, network-first for data）
- Installable 验证
- 离线访问验证

**PHASE 17 — 多设备测试**
- 1920px / 1440px / 笔记本 / iPad / 手机
- 修复布局问题
- PWA安装测试

**PHASE 18 — UI优化**
- 微交互打磨
- 动画过渡（适度）
- 颜色/间距统一
- 无障碍检查

---

## 7. 当前存在的问题和风险

### 7.1 问题

| # | 问题 | 影响 | 解决方案 |
|---|------|------|----------|
| 1 | **PPT文件未到位** | 课程细节知识点可能不完整 | 当前基于文档描述推断课程结构。待PPT放入后，运行PPT解析脚本补充每节课的详细内容。课程数据为JSON格式，补充更新不涉及代码改动。 |
| 2 | **Supabase需要创建账号** | 无法立即开始云端功能开发 | Phase 01-05 不依赖云端（使用本地数据）。Phase 06 开始前需要用户提供Supabase项目URL和Anon Key。可以先开发离线版本，后续无缝接入。 |
| 3 | **课程内容深度** | 仅靠文档推断的课程结构可能缺少PPT中的实操细节 | 课程JSON设计为可扩展结构，后续可通过更新data文件补充内容，不需要修改代码。 |
| 4 | **同步冲突处理复杂度** | IndexedDB ↔ Supabase 合并逻辑需要仔细设计 | 采用updated_at时间戳+field-level merge。第一版可以先实现"最后写入优先"策略，后续优化。 |

### 7.2 风险

| # | 风险 | 等级 | 缓解措施 |
|---|------|------|----------|
| 1 | Supabase免费额度限制 | 低 | 学习类应用数据量小，免费额度（500MB数据库+1GB存储）足够长期使用 |
| 2 | PWA在iOS上功能受限 | 中 | iOS Safari对PWA支持有限，第一版确保核心功能可用即可，手机定位为"查看+复习" |
| 3 | 课程内容需要持续维护 | 中 | 课程数据与代码分离，更新data/目录JSON即可，不需要重新部署 |
| 4 | 离线同步冲突数据丢失 | 高 | 实施前充分测试；采用时间戳策略；关键操作前提示用户 |
| 5 | AI Tutor预留接口设计不当 | 低 | 第一版不接AI，但数据库预留ai_conversations表结构，后续可灵活扩展 |

### 7.3 技术选型确认

| 技术 | 选择 | 理由 |
|------|------|------|
| 前端框架 | React 18 + TypeScript | 成熟生态、类型安全 |
| 构建工具 | Vite 5 | 极快HMR、生产优化 |
| UI框架 | Tailwind CSS 3 | 快速开发、一致设计、无运行时开销 |
| UI组件 | 自建组件库（基于Tailwind） | 完全控制设计风格，避免第三方库风格冲突 |
| 路由 | react-router-dom 6 | React生态标准 |
| 状态管理 | Zustand | 轻量、TypeScript友好、无boilerplate |
| 云服务 | Supabase | Auth + PostgreSQL + Storage + RLS 一站式 |
| 离线存储 | Dexie.js (IndexedDB) | 最成熟的IndexedDB封装库 |
| PWA | vite-plugin-pwa | 自动生成SW和manifest |
| 图标 | lucide-react | 轻量、现代、Tree-shakeable |
| 日期处理 | date-fns | 模块化、轻量 |

---

## 8. 下一步行动

1. **立即：** 开始 PHASE 01 — 项目初始化
2. **等待：** 用户提供两份PPT文件 → 解析并补充 `data/courses-a.json` 和 `data/courses-b.json`
3. **等待：** 用户提供Supabase项目URL和Anon Key（Phase 06前需要）
4. **持续：** 每完成一个Phase，更新README.md和本文档

---

_本文档将随项目进展持续更新。_
