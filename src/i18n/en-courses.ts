/**
 * 英文词典 —— 课程内容部分（路线 / 周计划 / 课时）
 * ==============================================
 *
 * key 是简体中文原文（见 src/i18n/index.ts 的说明）。
 *
 * 有两类句子**故意不收录**，交给 src/i18n/index.ts 里的模板规则处理，
 * 因为它们各自有 100+ 个变体、只有中间一小段不同：
 *
 *   目标：{X}。先在独立练习文件中完成，不直接修改正式项目。   （119 条）
 *   验收：结果满足“{X}”的相关要求，并保存一个可回退版本。      （36 条）
 *
 * 这两条规则里的 {X} 本身都在下面的词典里（它们是课时标题 / 周产出），
 * 所以规则命中后照样能翻出完整英文。
 */

export const EN_COURSES: Record<string, string> = {
  // ---- 路线元信息（data/routes.json）----
  'Blender 系统成长路线': 'Blender Systematic Growth Path',
  'SU + Blender 工作路线': 'SketchUp + Blender Working Route',
  '主推 · 完整掌握 Blender': 'Recommended · master Blender in full',
  '副线 · SketchUp 主力 + Blender 增强': 
    'Secondary · SketchUp as the workhorse, Blender as the upgrade',
  '主线。面向长期能力：系统理解 Blender，而不是只会几个出图按钮。从对象逻辑、建模、材质与 UV、灯光与渲染，到动画与视频、Geometry Nodes 与资产库，半年建立完整能力框架。': 
    'The main line, aimed at long-term capability: understand Blender systematically rather than learning a few render buttons. From object logic, modeling, materials and UVs, lighting and rendering, through animation and video to Geometry Nodes and the asset library — build a complete capability framework in half a year.',
  '面向真实项目：不牺牲出图效率，用 Blender 提升材质、灯光、渲染和视频能力。以 SketchUp 继续做建模主力，Blender 负责「SU 之后」的工作，熟练后再逐步扩大占比。': 
    'Built around real projects: without sacrificing rendering speed, use Blender to upgrade materials, lighting, rendering, and video. SketchUp stays the modeling workhorse while Blender handles everything after SketchUp; expand its share once you are comfortable.',
  '真正掌握 Blender，拥有软件选择权 —— 而不是「换软件」': 
    'Truly master Blender and gain the freedom to choose your tools — not just “switch software”',
  '不影响在做的客户项目，做出能放进汇报的效果图和 30–60 秒空间漫游视频': 
    'Without disturbing current client projects, produce a presentation-ready render and a 30–60 second space walkthrough video',
  '空间与操作 → 建模 → 材质与UV → 灯光与渲染 → 动画与视频 → 高级能力 → 综合项目': 
    'Space & operations → Modeling → Materials & UVs → Lighting & rendering → Animation & video → Advanced skills → Capstone project',
  'CAD / 现场尺寸 → SketchUp 空间+家具+柜体 → FBX/OBJ 交换 → Blender 材质/灯光/相机 → Render 静帧 → Video 漫游': 
    'CAD / site dimensions → SketchUp space + furniture + cabinetry → FBX/OBJ exchange → Blender materials / lighting / camera → still render → video walkthrough',
  '12 周工作型计划，和这套流程一一对应': 
    'A 12-week working plan that maps one-to-one onto these workflows',

  // ---- 阶段名 ----
  '空间与操作': 'Space & Operations',
  '建模': 'Modeling',
  '材质与UV': 'Materials & UVs',
  '灯光与渲染': 'Lighting & Rendering',
  '动画与视频': 'Animation & Video',
  '高级能力': 'Advanced Skills',
  '综合项目': 'Capstone Project',
  '基础操作': 'Basic Operations',
  '操作与导入': 'Operations & Import',
  '干净模型': 'Clean Models',
  '精确建模': 'Precision Modeling',
  '效果图': 'Renders',
  '视频与后期': 'Video & Post',
  '真实项目': 'Real Projects',
  '真实项目组装': 'Assembling a Real Project',
  '毕业输出与复盘': 'Final Output & Review',
  '材质': 'Materials',
  '灯光': 'Lighting',
  '动画': 'Animation',
  '基础建模 I': 'Basic Modeling I',
  '基础建模 II': 'Basic Modeling II',
  '材质节点 I': 'Material Nodes I',
  '材质节点 II': 'Material Nodes II',
  'UV 与材质库': 'UVs & Material Library',
  'UV 基础': 'UV Basics',
  '室内 UV 实战': 'Interior UV in Practice',
  'SU 导入与整理': 'SketchUp Import & Cleanup',
  'Camera 与构图': 'Camera & Composition',
  'Camera 语言': 'Camera Language',
  'Constraint 与节奏': 'Constraints & Timing',
  'EEVEE 与 Cycles': 'EEVEE & Cycles',
  '关键帧与曲线': 'Keyframes & Curves',
  '关键帧与节奏': 'Keyframes & Timing',
  '路径与镜头': 'Paths & Shots',
  '动画与漫游': 'Animation & Walkthroughs',
  '曝光与色彩管理': 'Exposure & Color Management',
  'Principled 材质': 'Principled Materials',
  'Bezier 与 Follow Path': 'Bezier & Follow Path',
  'Blender 的色彩管理位于渲染管线中，不等同于 SketchUp 的显示风格。': 
    'Blender’s color management lives inside the render pipeline — it is not the same as SketchUp display styles.',

  // ---- 教学内容：概念讲义（principle）----
  'Edit Mode 修改网格数据；可靠的室内模型应同时满足真实尺寸、连续拓扑、正确法线和可继续编辑。': 
    'Edit Mode edits mesh data; a reliable interior model must satisfy real-world dimensions, continuous topology, correct normals, and stay editable at the same time.',
  'SketchUp 偏向面与推拉；Blender 网格建模需要主动管理顶点、边、面和拓扑。': 
    'SketchUp leans on faces and push/pull; Blender mesh modeling requires actively managing vertices, edges, faces, and topology.',
  'Object Mode 管理完整对象及其变换；位置、旋转、缩放和局部坐标会影响后续 Modifier、灯光和动画。': 
    'Object Mode manages whole objects and their transforms; position, rotation, scale, and local coordinates affect later modifiers, lighting, and animation.',
  'Modifier 以非破坏方式计算几何；堆栈顺序会改变结果，应用前应保留可调参数和原始网格。': 
    'Modifiers compute geometry non-destructively; stack order changes the result, so keep adjustable parameters and the original mesh before applying.',
  'PBR 材质通过基础色、粗糙度、金属度、法线、透射和 IOR 描述表面对光的反应，而不是只追求贴图看起来像。': 
    'A PBR material describes how a surface reacts to light through base color, roughness, metallic, normal, transmission, and IOR — not just making a texture look right.',
  'UV 把三维表面映射到二维纹理；缝合位置、岛屿比例和方向共同决定木纹、石材纹理是否真实。': 
    'UV maps a 3D surface onto a 2D texture; seam placement, island scale, and direction together decide whether wood grain and stone read as real.',
  'SketchUp 材质主要表达颜色和贴图；Blender 材质同时控制物理反射、透射和微表面细节。': 
    'SketchUp materials mainly express color and texture; Blender materials also control physical reflection, transmission, and micro-surface detail.',
  'SketchUp 常直接移动/旋转面贴图；Blender 使用独立 UV 坐标，可精确统一纹理密度和岛屿布局。': 
    'SketchUp often moves or rotates a face texture directly; Blender uses independent UV coordinates, so texture density and island layout can be unified precisely.',
  'EEVEE 是强调速度和交互的实时渲染器，适合材质、灯光和动画预览，但部分效果与路径追踪不同。': 
    'EEVEE is a real-time renderer built for speed and interactivity — great for previewing materials, lighting, and animation, though some effects differ from path tracing.',
  'Cycles 使用路径追踪计算更完整的光照；质量控制依赖采样、降噪、光线路径、材质和场景尺度的共同平衡。': 
    'Cycles uses path tracing for more complete lighting; quality depends on balancing samples, denoising, light paths, materials, and scene scale.',
  '相比 SketchUp 视图输出，Cycles 会计算材质与多次反弹光，质量更高但成本也更高。': 
    'Compared with SketchUp viewport output, Cycles computes materials and multiple light bounces — higher quality, higher cost.',
  '室内相机的焦距、高度、构图和运动路径共同决定空间尺度感；先稳定静帧，再制作动画。': 
    'Focal length, height, composition, and camera path together determine how a space feels in scale; lock down the stills first, then animate.',
  'SketchUp Scene 适合保存视图；Blender Camera 还包含焦距、景深、约束和可编辑动画曲线。': 
    'SketchUp Scenes are good for saving views; Blender cameras also carry focal length, depth of field, constraints, and editable animation curves.',
  'Sun、Area、Spot、Point 和 Emission 的形状与用途不同；室内照明应按主光、重点光和装饰光分层。': 
    'Sun, Area, Spot, Point, and Emission differ in shape and purpose; interior lighting should be layered into key light, accent light, and decorative light.',
  'World 环境可以用颜色、天空或 HDRI 提供背景和环境照明；自然光测试应先控制曝光，再判断方向和层次。': 
    'The World can supply background and ambient lighting via color, sky, or HDRI; when testing natural light, control exposure first, then judge direction and layering.',
  'SketchUp 常依赖太阳与阴影预览；Blender 可用 HDRI、World 和灯光对象组合控制真实反射与氛围。': 
    'SketchUp relies on the sun and shadow preview; Blender combines HDRI, World, and light objects to control real reflections and mood.',
  'SketchUp 本体不提供完整物理灯光流程；Blender 中灯光会直接参与材质反射、阴影和动画。': 
    'SketchUp itself has no full physically-based lighting pipeline; in Blender, lights participate directly in material reflections, shadows, and animation.',
  '关键帧保存属性在特定时间的值，插值和 Graph Editor 曲线决定运动速度与节奏。': 
    'Keyframes store a property value at a given time; interpolation and the Graph Editor curves determine speed and rhythm.',
  'SketchUp 场景切换偏段落式；Blender 关键帧与曲线可连续控制任意属性。': 
    'SketchUp scene switching is step-based; Blender keyframes and curves control any property continuously.',
  'Geometry Nodes 用节点组以非破坏方式生成或修改几何；Group Input 参数决定工具能否复用。': 
    'Geometry Nodes generate or modify geometry non-destructively through node groups; Group Input parameters decide whether the tool is reusable.',
  'Asset Browser 通过资产标记、目录和库路径管理可复用数据块；资产价值取决于命名、预览和依赖是否完整。': 
    'The Asset Browser manages reusable data-blocks through asset marks, catalogs, and library paths; an asset is only as valuable as its naming, preview, and dependency completeness.',
  '跨软件交接的重点不是单次导入成功，而是单位、层级、命名、法线和材质槽都可检查、可重复。': 
    'The point of a cross-software handoff is not one successful import, but units, hierarchy, naming, normals, and material slots that are all checkable and repeatable.',
  'SketchUp 的 Group/Tag 对应 Blender 中需要明确规划的 Object/Collection，但两者并非自动一一对应。': 
    'SketchUp groups/tags map to objects/collections in Blender that must be planned explicitly — the two do not correspond automatically.',
  '与 SketchUp 的移动、旋转和群组操作相似，但 Blender 还需关注 Origin、局部坐标和 Apply Transform。': 
    'Similar to moving, rotating, and grouping in SketchUp, but Blender also demands attention to origin, local coordinates, and Apply Transform.',
  '曝光与色彩管理决定场景线性光照如何映射到显示设备；应在灯光和材质合理后进行统一调整。': 
    'Exposure and color management decide how the scene’s linear lighting maps onto a display; adjust them uniformly after lighting and materials are sound.',
  '可靠输出应先生成图像序列，再合成为视频；分辨率、帧率、色彩和文件路径必须在渲染前锁定。': 
    'Reliable output means rendering an image sequence first and compositing it into video afterwards; resolution, frame rate, color, and file paths must be locked before rendering.',
  'SketchUp 动画输出较直接；Blender 推荐序列化渲染和后期合成以提高容错。': 
    'SketchUp animation output is more direct; in Blender, rendering an image sequence and compositing afterwards is safer.',
  '相当于把可回退的建模步骤保留在对象上，比 SketchUp 中直接修改几何更便于方案调整。': 
    'It keeps revertible modeling steps on the object, which makes revisions easier than editing geometry directly in SketchUp.',
  '相当于可调参数的生成系统，改变输入后整体自动更新，而不是逐个复制修改。': 
    'It is a parameter-driven generation system: change the input and everything updates, rather than copying and editing one by one.',
  '类似组件库，但 Blender 资产可覆盖对象、材质、世界和节点组等多种数据块。': 
    'Like a component library, but Blender assets can cover objects, materials, worlds, node groups, and more.',
  '类似快速可视化预览，但能使用 Blender 的 PBR 节点、灯光和动画系统。': 
    'Like a fast visualization preview, but with access to Blender’s PBR nodes, lighting, and animation system.',

  // ---- 每周目标（不含模板句的整句版）----
  '理解 Blender 的对象逻辑：Object Mode / Edit Mode / Origin / Apply Transform，以及用最少命令搭出室内基础空间。': 
    'Understand Blender’s object logic — Object Mode / Edit Mode / Origin / Apply Transform — and build basic interior space with the fewest possible commands.',
  '界面 / G R S / Edit Mode / SketchUp 导入整理。目标不是建复杂模型，而是让 Blender 不再陌生，形成最小操作闭环。': 
    'Interface / G R S / Edit Mode / SketchUp import cleanup. The goal is not complex modeling but making Blender feel familiar and closing the smallest possible loop of operations.',
  'Modifier 全系列（Bevel / Solidify / Array / Mirror / Boolean / Subdivision）+ 拓扑、法线与精确建模。掌握非破坏性建模工作流。': 
    'The full modifier lineup (Bevel / Solidify / Array / Mirror / Boolean / Subdivision) plus topology, normals, and precision modeling. Master a non-destructive modeling workflow.',
  'Principled BSDF 四个关键旋钮 + UV 与贴图方向。目标是建立自己的室内材质库（乳胶漆 / 石材 / 木饰面 / 金属 / 玻璃）。': 
    'The four key Principled BSDF dials plus UVs and texture direction. The goal is to build your own interior material library (latex paint / stone / wood veneer / metal / glass).',
  'UV 展开与室内常见问题（木纹方向、石材尺度、墙布拉伸）；PBR 材质节点：Base Color / Roughness / Metallic / Normal / Displacement / IOR。': 
    'UV unwrapping and common interior problems (wood grain direction, stone scale, wallcovering stretch); PBR material nodes: Base Color / Roughness / Metallic / Normal / Displacement / IOR.',
  '环境光与 HDRI、窗外自然光、Area 主光、Spot 重点光、Emission 灯带。一次只改一类光源，建立因果感。': 
    'Ambient light and HDRI, natural light through the window, Area key light, Spot accents, Emission LED strips. Change one light type at a time to build cause and effect.',
  '色彩管理与曝光、Camera 摄影语言，以及 EEVEE 与 Cycles 的分工：一个给效率，一个给最终质量。': 
    'Color management and exposure, camera language, and the division of labor between EEVEE and Cycles: one for speed, one for final quality.',
  'Camera 三类固定机位与焦距比较；EEVEE 用于快速反馈，Cycles 用于最终静帧。目标是独立完成一张能放进汇报的效果图。': 
    'Three kinds of fixed camera position plus focal-length comparison; EEVEE for fast feedback and Cycles for final stills. The goal is to produce one presentation-ready render on your own.',
  '关键帧 / Graph Editor / Follow Path。先学稳定镜头（推、移、转角、定点轻推），不追求复杂电影运镜。': 
    'Keyframes / Graph Editor / Follow Path. Start with stable shots (push, truck, corner, subtle push on a fixed position) rather than complex cinematic moves.',
  '关键帧与曲线、Bezier 路径与 Follow Path、Constraint 控制朝向，最后渲染序列并完成视频与后期。': 
    'Keyframes and curves, Bezier paths with Follow Path, constraints to control aim, then render a sequence and finish video and post.',
  'Geometry Nodes 入门（重复与规则）、Asset Browser 资产管理，以及综合毕业项目。': 
    'Geometry Nodes basics (repetition and rules), Asset Browser management, and a capstone project.',
  '用自己的一个真实项目跑完整流程，并把成果变成下次可复用的模板与资产库。': 
    'Run one of your own real projects through the complete pipeline, and turn the results into reusable templates and an asset library.',
  '积累家具、材质、灯光预设、相机和 Geometry Nodes 工具。': 
    'Build up furniture, materials, lighting presets, cameras, and Geometry Nodes tools.',

  // ---- 每周产出（（本周产出：X）里的 Y，以及验收句里的 X）----
  '1 张可放入汇报 PPT 的效果图': '1 render usable in a presentation deck',
  '2 个 5–8 秒稳定镜头': '2 stable 5–8 second shots',
  '2 张高质量静帧': '2 high-quality stills',
  '3 个命名规范的常用机位': '3 well-named standard camera positions',
  '3 种自建 PBR 材质': '3 self-made PBR materials',
  '3 镜头漫游片段': 'A 3-shot walkthrough clip',
  '4 种稳定基础材质': '4 solid base materials',
  '4 个标准命名机位': '4 standard named camera positions',
  '10 种材质小库': 'A 10-material mini library',
  '20–30㎡空间白模': 'A 20–30㎡ white-model space',
  '30 秒成片': 'A finished 30-second film',
  '一个可反复使用的测试房间': 'A reusable test room',
  '一件完整家具或装置': 'One complete piece of furniture or installation',
  '一套可展示、可复用的项目成果': 'A presentable, reusable set of project deliverables',
  '一套可复用节点组': 'A reusable node group',
  '三种 Modifier 练习': 'Three modifier exercises',
  '个人资产库 v1': 'Personal asset library v1',
  '中性与 3000K 暖光两套预设': 'Two presets: neutral and 3000K warm',
  '同场景曝光对比': 'An exposure comparison in the same scene',
  '可复用的 8 种室内材质': '8 reusable interior materials',
  '可独立修改的精确空间': 'A precise space you can edit independently',
  '完整毕业作品与能力复盘': 'A complete graduation project and a skills review',
  '完整项目场景与镜头脚本': 'A full project scene and shot script',
  '对象逻辑对比练习': 'An object-logic comparison exercise',
  '干净的 SU → Blender 导入模板': 'A clean SketchUp → Blender import template',
  '一段 15 秒连续空间漫游': 'A continuous 15-second space walkthrough',
  '无明显破面的模型': 'A model with no visible broken faces',
  '无拉伸测试模型': 'A test model with no stretching',
  '流畅实时预览': 'Smooth real-time preview',
  '稳定推镜动画': 'A stable push-in animation',
  '纹理方向正确的柜体': 'A cabinet with correct texture direction',
  '结构清楚的小场景': 'A small, clearly structured scene',
  '通过模型质量检查': 'Passing the model quality check',
  '连续漫游路径': 'A continuous walkthrough path',
  '办公室自然光预设': 'Office natural-light preset',
  '参数化格栅': 'A parametric grille',

  // ---- 每周一句话（（本周产出：…）的整句，避免只译半句）----
  '一个用于快速反馈，一个用于最终质量。（本周产出：1 张可放入汇报 PPT 的效果图）': 
    'One for fast feedback, one for final quality. (Weekly deliverable: 1 render usable in a presentation deck)',
  '一次只改一类光源，建立因果感。（本周产出：中性与 3000K 暖光两套预设）': 
    'Change one light type at a time to build cause and effect. (Weekly deliverable: two presets — neutral and 3000K warm)',
  '从会渲染进入稳定画面。（本周产出：同场景曝光对比）': 
    'Move from “it renders” to a stable image. (Weekly deliverable: an exposure comparison in the same scene)',
  '从稳定镜头开始，不追求复杂电影运镜。（本周产出：2 个 5–8 秒稳定镜头）': 
    'Start with stable shots instead of complex cinematic moves. (Weekly deliverable: 2 stable 5–8 second shots)',
  '优先渲染序列，再完成合成。（本周产出：30 秒成片）': 
    'Render a sequence first, then composite. (Weekly deliverable: a finished 30-second film)',
  '先理解真实材质的四个关键旋钮。（本周产出：4 种稳定基础材质）': 
    'Understand the four key dials of real materials first. (Weekly deliverable: 4 solid base materials)',
  '先用窗外光把空间层次搭起来。（本周产出：办公室自然光预设）': 
    'Build the spatial layering with window light first. (Weekly deliverable: office natural-light preset)',
  '固定可交付的室内摄影语言。（本周产出：3 个命名规范的常用机位）': 
    'Lock in a consistent interior photography language. (Weekly deliverable: 3 well-named standard camera positions)',
  '处理对称、开洞与曲面。（本周产出：一件完整家具或装置）': 
    'Handle symmetry, openings, and curved surfaces. (Weekly deliverable: one complete piece of furniture or installation)',
  '建立可控的速度变化。（本周产出：稳定推镜动画）': 
    'Create controllable changes in speed. (Weekly deliverable: a stable push-in animation)',
  '建立快速反馈和动画预览能力。（本周产出：流畅实时预览）': 
    'Build the ability to get fast feedback and preview animation. (Weekly deliverable: smooth real-time preview)',
  '把 3D 表面正确展开为 2D 坐标。（本周产出：无拉伸测试模型）': 
    'Unfold 3D surfaces into 2D coordinates correctly. (Weekly deliverable: a test model with no stretching)',
  '把 SketchUp 白模稳定送进 Blender。（本周产出：干净的 SU → Blender 导入模板）': 
    'Get a SketchUp white model into Blender reliably. (Weekly deliverable: a clean SketchUp → Blender import template)',
  '把成果变成下一次可以复用的模板。（本周产出：一套可展示、可复用的项目成果）': 
    'Turn results into templates you can reuse next time. (Weekly deliverable: a presentable, reusable set of project deliverables)',
  '把成果积累成自己的生产系统。（本周产出：个人资产库 v1）': 
    'Grow your results into a personal production system. (Weekly deliverable: personal asset library v1)',
  '把运动路径和相机朝向分开控制。（本周产出：一段 15 秒连续空间漫游）': 
    'Control the motion path and the camera aim separately. (Weekly deliverable: a continuous 15-second space walkthrough)',
  '把重复与散布用于真实室内。（本周产出：一套可复用节点组）': 
    'Apply repetition and scattering to real interiors. (Weekly deliverable: a reusable node group)',
  '掌握 Displacement、IOR 与 Transmission。（本周产出：10 种材质小库）': 
    'Master Displacement, IOR, and Transmission. (Weekly deliverable: a 10-material mini library)',
  '掌握最终静帧的质量与效率。（本周产出：2 张高质量静帧）': 
    'Get both quality and efficiency in the final stills. (Weekly deliverable: 2 high-quality stills)',
  '控制朝向并完成多镜头组合。（本周产出：3 镜头漫游片段）': 
    'Control aim and assemble multi-shot sequences. (Weekly deliverable: a 3-shot walkthrough clip)',
  '理解 Vertex / Edge / Face 与对象变换。（本周产出：对象逻辑对比练习）': 
    'Understand Vertex / Edge / Face and object transforms. (Weekly deliverable: an object-logic comparison exercise)',
  '理解参数改变、模型自动更新。（本周产出：参数化格栅）': 
    'Understand how changing parameters updates the model automatically. (Weekly deliverable: a parametric grille)',
  '理解四边面、三角面与 N-gon 的边界。（本周产出：无明显破面的模型）': 
    'Understand the boundaries of quads, triangles, and N-gons. (Weekly deliverable: a model with no visible broken faces)',
  '理解对象、Collection 与父子层级。（本周产出：结构清楚的小场景）': 
    'Understand objects, collections, and parent/child hierarchy. (Weekly deliverable: a small, clearly structured scene)',
  '理解颜色、粗糙度、金属与法线。（本周产出：3 种自建 PBR 材质）': 
    'Understand color, roughness, metallic, and normals. (Weekly deliverable: 3 self-made PBR materials)',
  '用完整性检验半年的能力框架。（本周产出：完整毕业作品与能力复盘）': 
    'Test the whole half-year framework for completeness. (Weekly deliverable: a complete graduation project and a skills review)',
  '用最少命令搭建室内空间。（本周产出：20–30㎡空间白模）': 
    'Build an interior space with the fewest commands. (Weekly deliverable: a 20–30㎡ white-model space)',
  '用自己的办公室或酒店项目完成全流程。（本周产出：完整项目场景与镜头脚本）': 
    'Run your own office or hotel project through the whole pipeline. (Weekly deliverable: a full project scene and shot script)',
  '用设计师的空间感建立镜头。（本周产出：4 个标准命名机位）': 
    'Build shots from a designer’s sense of space. (Weekly deliverable: 4 standard named camera positions)',
  '用非破坏方式完成真实边缘和重复结构。（本周产出：三种 Modifier 练习）': 
    'Create real edges and repeating structures non-destructively. (Weekly deliverable: three modifier exercises)',
  '补齐切割、合并、吸附与精确输入。（本周产出：可独立修改的精确空间）': 
    'Fill in cutting, merging, snapping, and precise input. (Weekly deliverable: a precise space you can edit independently)',
  '解决倒角、法线与缩放异常。（本周产出：通过模型质量检查）': 
    'Fix bevel, normal, and scaling problems. (Weekly deliverable: passing the model quality check)',
  '解决木纹、石材与墙布常见问题。（本周产出：纹理方向正确的柜体）': 
    'Solve common wood grain, stone, and wallcovering problems. (Weekly deliverable: a cabinet with correct texture direction)',
  '解决木纹方向、尺度和贴图拉伸。（本周产出：可复用的 8 种室内材质）': 
    'Fix wood grain direction, scale, and texture stretching. (Weekly deliverable: 8 reusable interior materials)',
  '让 Blender 不再陌生，建立最小操作闭环。（本周产出：一个可反复使用的测试房间）': 
    'Make Blender feel familiar and close the smallest loop of operations. (Weekly deliverable: a reusable test room)',
  '让相机沿可编辑路径运动。（本周产出：连续漫游路径）': 
    'Make the camera travel along an editable path. (Weekly deliverable: a continuous walkthrough path)',

  // ---- 课时标题 ----
  '30–45 分钟': '30–45 min',
  'Tab · Object / Edit Mode 切换': 'Tab · switch Object / Edit Mode',
  'Shift+Tab · 吸附开关': 'Shift+Tab · toggle snapping',
  '右键 → Mark Seam · 标记 UV 接缝': 'Right-click → Mark Seam · mark UV seams',
  'Graph Editor · 编辑动画曲线': 'Graph Editor · edit animation curves',
  'Follow Path · 相机沿路径移动': 'Follow Path · camera moves along a path',
  'Track To 约束 · 控制相机朝向': 'Track To constraint · control camera aim',
  '移动、旋转、缩放对象': 'Move, rotate, and scale objects',
  '练习视角、选择与 G / R / S': 'Practice viewport, selection, and G / R / S',
  '练习顶点、边与面选择': 'Practice vertex, edge, and face selection',
  '使用顶点、边、面选择模式完成当前建模目标': 
    'Use vertex, edge, and face select modes to complete the current modeling goal',
  '分别使用快捷键和数值输入完成目标操作': 
    'Complete the target operation once with shortcuts and once with numeric input',
  '切换全局/局部坐标并比较结果': 
    'Switch between global and local coordinates and compare the results',
  '在练习副本中选中目标对象，观察 Outliner、Origin 和 Transform 数值': 
    'Select the target object in a practice copy and watch the Outliner, origin, and transform values',
  '应用或确认对象尺度，再进入 Edit Mode': 
    'Apply or confirm object scale before entering Edit Mode',
  '用尺寸输入建立墙体': 'Build walls with numeric input',
  '开启吸附和数值输入，检查长度、角度与对齐': 
    'Turn on snapping and numeric input; check length, angle, and alignment',
  '退出 Edit Mode，检查阴影、法线、非流形和重复点': 
    'Exit Edit Mode and check shading, normals, non-manifold geometry, and duplicate vertices',
  '练习 Extrude 与 Inset': 'Practice Extrude and Inset',
  '练习 Loop Cut 与 Bevel': 'Practice Loop Cut and Bevel',
  '练习 Knife 与 Merge': 'Practice Knife and Merge',
  '为柜体统一倒角': 'Bevel cabinets consistently',
  '镜像对称柜体': 'Mirror a symmetric cabinet',
  'Boolean 开洞': 'Boolean openings',
  '制作墙板分格': 'Create wall panel divisions',
  '给墙板增加厚度': 'Give wall panels thickness',
  '制作平滑曲面': 'Create smooth curved surfaces',
  '观察布线对曲面的影响': 'Observe how edge flow affects curved surfaces',
  '检查拓扑连续性': 'Check topology continuity',
  '清理重复点和破面': 'Clean duplicate vertices and broken faces',
  '校正单位、缩放和法线': 'Correct units, scale, and normals',
  '应用尺度并检查模型法线': 'Apply scale and check the model normals',
  '设置 Auto / Weighted Normal': 'Set Auto / Weighted Normal',
  '检查尺寸与倒角均匀度': 'Check dimensions and bevel evenness',
  '拆解标准 PBR 材质': 'Break down a standard PBR material',
  '连接 Base Color、Roughness、Metallic 与 Normal/Bump 等核心输入': 
    'Connect the core inputs — Base Color, Roughness, Metallic, and Normal/Bump',
  '调整 Base Color 与 Roughness': 'Adjust Base Color and Roughness',
  '理解 Metallic 与 Normal / Bump': 'Understand Metallic and Normal / Bump',
  '观察 Roughness 变化': 'Observe how Roughness changes',
  '制作乳胶漆与浅灰石材': 'Make latex paint and light gray stone',
  '制作木、石、金属': 'Make wood, stone, and metal',
  '制作玻璃材质': 'Make a glass material',
  '掌握 Displacement、IOR 与 Transmission': 'Master Displacement, IOR, and Transmission',
  '测试真实位移': 'Test real displacement',
  '补齐木饰面、金属、玻璃、肌理漆': 
    'Fill in wood veneer, metal, glass, and textured paint',
  'Mark Seam 与 Unwrap': 'Mark Seam and Unwrap',
  '练习 Cube Projection 与 Unwrap': 'Practice Cube Projection and Unwrap',
  '调整 UV Scale 与 Rotate': 'Adjust UV Scale and Rotate',
  '校准木纹和石材尺度': 'Calibrate wood grain and stone scale',
  '统一石材尺度': 'Unify stone scale',
  '校正柜体木纹方向': 'Correct cabinet wood grain direction',
  '处理可见接缝': 'Handle visible seams',
  '先用中性灯光和标准材质球建立可比较环境': 
    'First build a comparable environment with neutral lighting and a standard material sphere',
  '按真实尺度校准纹理和细节强度': 
    'Calibrate texture and detail strength against real-world scale',
  '在近景、斜角和不同光照下检查高光、接缝与重复纹理': 
    'Check highlights, seams, and tiling in close-ups, at oblique angles, and under different lighting',
  '测试 HDRI 与环境亮度': 'Test HDRI and ambient brightness',
  '在 World 中连接 Environment Texture 并调节强度与旋转': 
    'Connect an Environment Texture in World and adjust its strength and rotation',
  '建立窗外自然光': 'Set up natural light through the window',
  '使用 Area 建立主光': 'Build the key light with Area',
  '用 Spot 做重点照明': 'Use Spot for accent lighting',
  '用 Emission 制作灯带': 'Make LED strips with Emission',
  '检查体积光': 'Check volumetric light',
  '设置阴影与反射': 'Set up shadows and reflections',
  '控制整体 Exposure': 'Control overall Exposure',
  '保留高光与暗部细节': 'Keep highlight and shadow detail',
  '观察高光与暗部细节': 'Observe highlight and shadow detail',
  '设置 Cycles 采样与降噪': 'Set Cycles samples and denoising',
  '控制采样与降噪': 'Control samples and denoising',
  '理解光线弹射': 'Understand light bounces',
  '比较两种引擎的结果与耗时': 'Compare results and render times of the two engines',
  '用 EEVEE 快速检查材质与构图': 'Use EEVEE to quickly check materials and composition',
  '优化实时性能': 'Optimize real-time performance',
  '比较 View Transform / Look': 'Compare View Transform / Look',
  '完成日景与夜景渲染': 'Complete day and night renders',
  '完成一张办公室日景测试': 'Complete an office daylight test render',
  '完成酒店或日料暖光测试': 'Complete a warm-light test for a hotel or Japanese restaurant',
  '比较 24 / 28 / 35 / 50mm': 'Compare 24 / 28 / 35 / 50mm',
  '比较 24 / 28 / 35mm': 'Compare 24 / 28 / 35mm',
  '设置 1.5–1.7m 相机高度': 'Set camera height to 1.5–1.7m',
  '把相机高度设为接近人眼，并锁定一个可复现机位': 
    'Set camera height close to eye level and lock in a reproducible camera position',
  '比较指定焦距，观察空间夸张和主体比例': 
    'Compare the given focal lengths and observe spatial exaggeration and subject proportions',
  '控制垂直线': 'Control verticals',
  '检查垂直线与空间比例': 'Check verticals and spatial proportions',
  '组织前中后景': 'Organize foreground, midground, and background',
  '用安全框、垂直线和前中后景检查构图': 
    'Check composition with safe frames, verticals, and foreground/midground/background',
  '确定 3 个静帧机位': 'Decide on 3 still camera positions',
  '制作入口、45°与侧视机位': 'Create entrance, 45-degree, and side camera positions',
  '理解 Timeline 与帧率': 'Understand the Timeline and frame rate',
  '阅读 Timeline': 'Read the Timeline',
  '在起点和终点插入位置/旋转关键帧': 'Insert location/rotation keyframes at the start and end',
  '插入位置与旋转关键帧': 'Insert location and rotation keyframes',
  '播放检查运动方向与时长': 'Play back to check motion direction and duration',
  '在 Graph Editor 调整缓入缓出': 'Adjust ease in/out in the Graph Editor',
  '在 Graph Editor 调节曲线': 'Adjust curves in the Graph Editor',
  'Graph Editor 微调速度': 'Fine-tune speed in the Graph Editor',
  '设置 Follow Path': 'Set up Follow Path',
  '绘制 Bezier Curve': 'Draw a Bezier Curve',
  '绘制 Bezier 漫游路径': 'Draw a Bezier walkthrough path',
  '设置 Track To': 'Set up Track To',
  '使用 Track To 控制朝向': 'Control aim with Track To',
  '分离路径与朝向': 'Separate path from orientation',
  '修正镜头乱转': 'Fix the camera spinning wildly',
  '匹配镜头速度': 'Match shot speed',
  '完成推镜与横移测试': 'Complete push-in and truck tests',
  '完成转角 Reveal 或 Orbit': 'Complete a corner reveal or orbit',
  '建立 30–60 秒镜头清单': 'Build a 30–60 second shot list',
  '输出 PNG / EXR 序列': 'Output a PNG / EXR sequence',
  '在 VSE 或剪辑软件合成': 'Composite in the VSE or an editor',
  '轻度调色与降噪': 'Light color grading and denoising',
  '输出 30–60 秒 MP4': 'Output a 30–60 second MP4',
  '输出最终静帧': 'Output the final still',
  '输出 3 张 Cycles 静帧': 'Output 3 Cycles stills',
  '输出 4 张静帧与 45–90 秒漫游': 'Output 4 stills and a 45–90 second walkthrough',
  '掌握 X / Y / Z 轴向约束': 'Master X / Y / Z axis constraints',
  '比较 Object 与 Edit 缩放': 'Compare scaling in Object vs Edit mode',
  '比较全局与局部坐标': 'Compare global and local coordinates',
  '建立 4m × 6m 测试房间': 'Build a 4m × 6m test room',
  '独立重建小空间': 'Rebuild a small space independently',
  '完成 50–100㎡项目': 'Complete a 50–100㎡ project',
  '从 SU 导出 FBX 或 OBJ': 'Export FBX or OBJ from SketchUp',
  '整理 SU 白模和导入层级': 'Organize the SketchUp white model and import hierarchy',
  '整理 Collection 与对象名称': 'Organize collections and object names',
  '整理 Collection': 'Organize collections',
  '检查链接资产': 'Check linked assets',
  '完成一次无丢失的往返测试': 'Complete one lossless round-trip test',
  '完成保存、关闭与重新打开工程': 'Save, close, and reopen the project',
  '保存、关闭并重新打开文件，确认状态可恢复': 
    'Save, close, and reopen the file to confirm the state is recoverable',
  '从简单网格建立 Geometry Nodes Modifier': 
    'Build a Geometry Nodes modifier from a simple mesh',
  '用基础几何、实例和变换节点完成最小结果': 
    'Reach a minimal result using basic geometry, instances, and transform nodes',
  '把数量、间距、尺寸或路径暴露为 Group Input': 
    'Expose count, spacing, size, or path as Group Input',
  '控制数量与间距': 'Control count and spacing',
  '建立重复格栅': 'Build a repeating grille',
  '阵列格栅或灯具': 'Array a grille or lights',
  '沿路径生成灯具': 'Generate lights along a path',
  '散布绿植': 'Scatter plants',
  '建立可调展陈模块': 'Build adjustable display modules',
  '整理节点与命名': 'Organize nodes and naming',
  '测试极小值、极大值和不同对象，命名后保存为资产': 
    'Test minimum, maximum, and different objects, then name and save as an asset',
  'Mark as Asset 并生成清晰预览': 'Mark as Asset and generate a clear preview',
  '把材质保存到 Material Library': 'Save materials to the Material Library',
  '标记材质、家具与灯光资产': 'Mark material, furniture, and lighting assets',
  '放入稳定 Catalog，添加用途和尺度说明': 
    'Put it in a stable catalog and add usage and scale notes',
  '归档 Scene、Light、Camera 与 Output 预设': 
    'Archive Scene, Light, Camera, and Output presets',
  '清理对象、材质或节点组的名称与依赖': 
    'Clean up names and dependencies of objects, materials, or node groups',
  '从新的空白项目调用，检查贴图、链接和版本兼容': 
    'Call it from a fresh blank project and check textures, links, and version compatibility',
  '配置 8 类材质与日/夜灯光': 'Set up 8 material types plus day/night lighting',
  '自建 10 种材质与日夜灯光': 'Build 10 materials plus day and night lighting',
  '整理项目与贴图目录': 'Organize project and texture folders',
  '复盘最慢的 3 个环节': 'Review the 3 slowest steps',
  '记录错误与最慢的 3 个环节': 'Note mistakes and the 3 slowest steps',

  // ---- 课时一句话描述 / 室内用法 ----
  '适合墙体、柜体、吊顶、门洞和定制构件的精确建模。': 
    'For precise modeling of walls, cabinets, ceilings, door openings, and custom components.',
  '用于精确放置墙体、家具、灯具和相机，并保持场景层级清晰。': 
    'For placing walls, furniture, lighting, and cameras precisely while keeping the scene hierarchy clear.',
  '用于控制木饰面方向、石材分缝、墙布尺度和定制家具贴图。': 
    'For controlling wood veneer direction, stone joints, wallcovering scale, and custom furniture textures.',
  '建立乳胶漆、木饰面、石材、金属、玻璃、布艺和皮革等可复用材质。': 
    'Build reusable materials for latex paint, wood veneer, stone, metal, glass, fabric, and leather.',
  '用于推进、拉远、横移、环绕和灯光变化等空间展示。': 
    'For push-in, pull-out, truck, orbit, and lighting-change reveals of a space.',
  '用于入口、45°、侧视、推进、横移、环绕和转角展示。': 
    'For entrance, 45-degree, side, push-in, truck, orbit, and corner reveal shots.',
  '快速制作柜体倒角、墙板厚度、重复格栅、对称家具、开洞和曲面构件。': 
    'Quickly produce cabinet bevels, wall panel thickness, repeated grilles, mirrored furniture, openings, and curved components.',
  '用于设计沟通、快速材质灯光迭代和漫游动画预览。': 
    'For design communication, fast material and lighting iteration, and walkthrough previews.',
  '用于格栅、墙板、灯具阵列、绿植散布和展陈模块。': 
    'For grilles, wall panels, lighting arrays, plant scattering, and display modules.',
  '用于最终室内效果图、材质特写和高质量动画帧。': 
    'For final interior renders, material close-ups, and high-quality animation frames.',
  '快速建立办公室、酒店客房和商业空间的日景基础光。': 
    'Quickly establish base daylight for offices, hotel rooms, and commercial spaces.',
  '用于办公室均匀照明、酒店暖光、餐饮重点照明和商业空间氛围。': 
    'For even office lighting, warm hotel light, restaurant accent lighting, and commercial ambience.',
  '保证办公室、酒店和商业空间多镜头输出具有一致的明暗和色彩。': 
    'Keep multi-shot output for offices, hotels, and commercial spaces consistent in brightness and color.',
  '交付 30–90 秒室内漫游、项目汇报片和社交媒体短片。': 
    'Deliver 30–90 second interior walkthroughs, project presentation films, and social media clips.',
  '把已确认的 SketchUp 方案稳定转换为可渲染、可动画的 Blender 场景。': 
    'Reliably convert an approved SketchUp scheme into a renderable, animatable Blender scene.',

  // ---- 步骤 / 常见错误 ----
  '完成本课操作；保存前后对比；记录一个错误和解决方法': 
    'Complete the operations in this lesson, save a before/after comparison, and note one mistake with its fix',
  '为了外观堆叠过多切线，降低后续修改效率': 
    'Stacking too many edge loops for looks, which slows down later edits',
  '产生重叠点、内部面或非流形边': 
    'Producing overlapping vertices, interior faces, or non-manifold edges',
  '未确认尺度就倒角或实体化': 'Beveling or solidifying before confirming scale',
  '未应用尺度导致倒角宽度不一致': 'Unapplied scale causing inconsistent bevel width',
  'Boolean 切割体与目标面共面': 'Boolean cutter coplanar with the target face',
  '过早 Apply，失去后续参数化调整能力': 
    'Applying too early, losing the ability to adjust parameters later',
  '未应用尺度就展开 UV': 'Unwrapping UVs before applying scale',
  '木纹方向与构件受力或施工方向冲突': 
    'Wood grain direction conflicting with structural load or construction direction',
  '不同物体纹理密度不一致': 'Inconsistent texture density across objects',
  '把灰度数据贴图当作 sRGB 颜色读取': 'Reading grayscale data maps as sRGB color',
  '粗糙度、凹凸或位移强度过大': 'Roughness, bump, or displacement set too strong',
  '只在材质预览球上判断，不回到真实空间检查': 
    'Judging only on the material preview sphere without checking back in the real scene',
  '用大量 Point Light 模拟面光源': 'Simulating an area light with many point lights',
  '灯具尺寸太小造成不自然的硬阴影': 
    'Lights too small, producing unnaturally hard shadows',
  '场景尺度或灯光尺寸错误导致异常噪点': 
    'Wrong scene scale or light size causing abnormal noise',
  'HDRI 方向与窗外环境不一致': 'HDRI orientation not matching the environment outside the window',
  '同时修改多个灯光参数，无法判断变化原因': 
    'Changing several light parameters at once, making it impossible to tell what caused the change',
  '只看亮度，不检查色温、反射和照明层次': 
    'Judging brightness only, without checking color temperature, reflections, and lighting layers',
  '盲目提高采样而不分析噪点来源': 
    'Blindly raising samples without analyzing where the noise comes from',
  '高光剪切后继续提高灯光或曝光': 
    'Raising lights or exposure after highlights have already clipped',
  '用曝光掩盖灯光强度问题': 'Using exposure to hide lighting-strength problems',
  '一次开启过多高成本效果': 'Enabling too many expensive effects at once',
  '把实时预览当成 Cycles 的完全替代': 
    'Treating the real-time preview as a full replacement for Cycles',
  '只在低分辨率视口判断最终画面': 
    'Judging the final image from a low-resolution viewport only',
  '使用过广焦距造成边缘严重拉伸': 'Using too wide a focal length, which badly stretches the edges',
  '相机高度随意，空间尺度感不可信': 
    'Arbitrary camera height, which makes the sense of scale unreliable',
  '路径拐角过急或 Track 轴设置错误导致镜头翻转': 
    'Overly sharp path corners, or a wrong Track axis, causing the camera to flip',
  '只凭视图判断尺寸，不检查数值': 'Judging dimensions by eye without checking the numbers',
  '把 Object Mode 与 Edit Mode 的变换混为一谈': 
    'Confusing transforms in Object Mode with those in Edit Mode',
  '忘记保存或覆盖唯一的项目原文件': 
    'Forgetting to save, or overwriting the only original project file',
  '同时移动过多轴导致路径不可控': 
    'Moving too many axes at once, making the path uncontrollable',
  '只看关键帧位置，不检查插值曲线和速度': 
    'Looking only at keyframe positions without checking interpolation curves and speed',
  '没有确认当前帧就覆盖关键帧': 
    'Overwriting a keyframe without confirming the current frame',
  '帧率、色彩空间和剪辑项目设置不一致': 
    'Inconsistent frame rate, color space, and editing project settings',
  '动画直接输出视频，失败后无法从中间帧恢复': 
    'Outputting animation straight to video, with no way to resume from a middle frame if it fails',
  '长动画直接渲染成单个视频文件': 
    'Rendering a long animation straight to a single video file',
  '输出目录使用临时路径或覆盖旧版本': 
    'Using a temporary output path, or overwriting the previous version',
  '不同镜头使用不一致的色彩设置': 
    'Inconsistent color settings across different shots',
  '用饱和度掩盖材质或白平衡问题': 
    'Using saturation to hide material or white-balance problems',
  '直接生成真实几何而不使用实例，造成场景过重': 
    'Generating real geometry instead of instances, which makes the scene too heavy',
  '节点无命名和分组，后续无法维护': 
    'Unnamed, ungrouped nodes that cannot be maintained later',
  '只对单一尺寸有效，没有测试参数边界': 
    'Working for one size only, without testing parameter limits',
  '资产引用了找不到的外部贴图': 
    'The asset references external textures that cannot be found',
  '目录过细或命名不一致': 'Overly fine-grained catalogs or inconsistent naming',
  '没有在新文件中做独立调用测试': 'Not testing an independent call in a new file',
  '导出前没有清理隐藏对象和错误 Tag': 
    'Not cleaning hidden objects and wrong tags before export',
  '导入后直接缩放模型却没有检查单位': 
    'Scaling the model right after import without checking units',
  '对象命名混乱，后续材质和动画无法批量管理': 
    'Messy object naming, which later blocks batch management of materials and animation',

  // ---- 模板句里的 {X} 补录（2026-09-20）----
  // data/courses-b.json 里有两条「目标：…」的 {X} 直接写成 Blender 操作名，
  // 它们本来就是英文术语，只是**没在词典里登记**，于是被覆盖率扫描当成缺口。
  // 登记成同名不是多此一举：这两条走的是 index.ts 的模板规则，规则里
  // `EN[...] ?? 原文` 的回落虽然结果一样，但"缺译"和"有意保留原文"
  // 在扫描报告里必须区分得开，否则以后真漏翻会被这两条淹掉。
  'Apply Scale': 'Apply Scale',
  'Cube Projection': 'Cube Projection',
}
