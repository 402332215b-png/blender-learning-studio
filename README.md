# Blender Learning Studio

> 为室内设计师打造的 Blender 自学成长系统 —— 双学习路线、可勾选的学习记忆、离线可用的 Windows 桌面应用。

![version](https://img.shields.io/badge/version-0.3.0-F5792A)
![platform](https://img.shields.io/badge/platform-Windows-0078D6)
![electron](https://img.shields.io/badge/Electron-32-47848F)
![react](https://img.shields.io/badge/React-18-61DAFB)
![typescript](https://img.shields.io/badge/TypeScript-5.5-3178C6)

---

## 这是什么

一套给**室内设计师**用的 Blender 学习程序。

它不假设你有 3D 基础，而是从「你手上正在做的室内项目」出发：用 SketchUp 继续做建模主力，把 Blender 当作材质、灯光、相机、渲染、动画的**增强工具**，在**不影响当前项目交期**的前提下把效果图和漫游视频做出来。

打包装成 Windows 桌面应用，双击安装即用，**全部数据保存在本机，不需要联网、不需要注册账号**。

---

## 核心特性

### 双学习路线

| 路线 | 周期 | 适合谁 |
|------|------|--------|
| **Route A** — SU + Blender 工作路线 | 12 周 · 5 阶段 | 手上项目在跑，只想快速把效果图做漂亮 |
| **Route B** — Blender 系统成长路线 | 24 周 · 7 阶段 | 想完整掌握 Blender，长期投入 |

Route A 的完整工作流：

```
CAD → SketchUp → 空间模型 → Blender → 模型整理 → 材质
    → 灯光 → Camera → 效果图 → 动画 → 漫游视频
```

### 八个功能栏目

| 栏目 | 内容 |
|------|------|
| **首页** | 今日待办、继续上次、学习统计、每日一个快捷键 |
| **今日学习** | 按天拆解的学习任务清单 |
| **成长路线** | Route A/B 周计划与课时导航 |
| **课时详情** | 教学正文、操作步骤、笔记、学习状态标记 |
| **复习** | 间隔重复复习队列，自动挑出该复习的课时 |
| **快捷键** | 76 条 Blender 快捷键，含 SketchUp 对照与室内用途 |
| **知识实验室** | 材质 / 灯光 / 相机 / 动画 四个速查库 |
| **实际工作模块** | SU → Blender 全流程 5 条工作流，步骤可勾选 |
| **我的成长** | 学习时长、连续打卡、阶段完成度 |
| **资源库** | 全部内容的统一入口索引 |

### 内容规模

| 项目 | 数量 |
|------|------|
| 课时 | 36（Route A 16 + Route B 20） |
| 周计划 | 17 周 |
| 快捷键 | 76 条（10 个分类） |
| 材质库 | 10 种室内常用材质 |
| 灯光 | 6 种灯光类型 + 5 个室内场景 |
| 相机 | 4 个预设 + 4 个技巧 |
| 动画 | 10 门课（含 6 种镜头运动） |
| 练习 | 8 个等级 · 22 个任务 |
| 工作流 | 5 条 · 67 个步骤 |

---

## 下载安装

前往 [Releases](../../releases) 下载最新的 `BlenderLearningStudio-Setup-x.y.z.exe`，双击安装。

- 支持 Windows 10 / 11（64 位）
- 自带卸载程序（开始菜单或「设置 → 应用」里均可卸载）
- 无需联网，无需注册

> **数据说明**：所有学习进度、笔记、收藏都存在你自己的电脑上。
> 卸载时数据保留，重新安装后可以继续。

---

## 技术栈

| 层 | 技术 |
|------|------|
| 界面 | React 18 + TypeScript 5.5 |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 状态 | Zustand 4 |
| 路由 | React Router 6 |
| 图标 | lucide-react |
| 桌面外壳 | Electron 32 |
| 安装包 | electron-builder + NSIS |
| 账号（本地） | Web Crypto API（SHA-256 + 随机盐） |

### 架构要点

**本地优先。** 认证走可替换的 `AuthProvider` 抽象层：

```ts
// src/lib/auth.ts
export const auth: AuthProvider = new LocalAuthProvider()
//                              ^^^^^^^^^^^^^^^^^^^^
//                              换成 CloudAuthProvider 即可接入云端
```

默认实现 `LocalAuthProvider` 用 Web Crypto 在本机做密码哈希，**不上传任何数据**。
`schema` 与接口约定已按云端方案预留，未来想接 Supabase 等后端只需替换这一行。

**内容与代码分离。** 全部课程内容放在 `data/*.json`，改内容不用碰代码：

```
data/
├── routes.json          # 路线与阶段定义
├── courses-a.json       # Route A 课时
├── courses-b.json       # Route B 课时
├── shortcuts.json       # 快捷键库
├── materials.json       # 材质库
├── lighting.json        # 灯光库
├── camera.json          # 相机库
├── animation.json       # 动画课程
├── practice.json        # 练习任务
└── su-to-blender.json   # 工作流
```

---

## 本地开发

```bash
# 环境：Node.js 18+
npm install
npm run dev      # 开发模式，默认 http://localhost:5173
npm run build    # 构建
npm run preview  # 预览构建产物
```

### 目录结构

```
src/
├── components/
│   ├── layout/      # Layout / Sidebar / UserMenu
│   └── ui/          # Card / ProgressBar / Tag / Kbd 等基础组件
├── pages/           # 17 个页面
├── stores/          # Zustand 状态（学习进度 / 复习队列 / 认证）
├── lib/
│   ├── content.ts   # 数据接入层：JSON → 类型化对象
│   ├── auth.ts      # 认证抽象层
│   └── utils.ts
├── config/
│   └── navigation.ts # 导航结构（分组定义）
├── types/           # TypeScript 类型
└── styles/          # 全局样式
```

---

## 打包成安装程序

前端是标准的 Vite 项目，用 Electron 包一层桌面外壳，再用 NSIS 做安装包。

关键点：

1. **固定端口** — 内置静态服务器必须用固定端口，否则 `origin` 变化会导致 `localStorage` 数据全部丢失
2. **补图标顺序** — 先 `rcedit` 补写 exe 图标，再用 `--prepackaged` 打包，否则图标会被覆盖
3. **winCodeSign** — 若打包卡在 `Cannot create symbolic link`，设置 `signAndEditExecutable: false` 跳过签名

---

## 版本记录

| 版本 | 内容 |
|------|------|
| v0.3.0 | 八个栏目全部补齐，17 个页面零占位；修复动画页数据结构问题；63 项功能验证通过 |
| v0.2.0 | 登录注册（本地账号）、设置页、数据导出导入 |
| v0.1.0 | 基础架构、首页、路由、课程数据接入 |

---

## 说明

- 本项目为个人学习与作品展示用途
- 课程内容基于室内设计工作场景整理，非 Blender 官方资料
- Blender 是 Blender Foundation 的商标，本项目与之无关联
