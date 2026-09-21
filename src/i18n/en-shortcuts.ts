/**
 * 英文词典 —— 快捷键 / 操作步骤 / 补漏条目
 * ========================================
 *
 * 这个文件装三类东西：
 *   1) 快捷键中心的按键与说明（data/shortcuts.json）
 *   2) 动画实验室那种「1. XX → YY」的分步操作串
 *   3) 前两个词典漏掉的零散条目（材质、灯光的常见错误与参数建议）
 *
 * key 是简体中文原文。见 src/i18n/index.ts 的说明。
 */

export const EN_SHORTCUTS: Record<string, string> = {
  // ---- 单个术语（知识点标签）----
  '法线': 'Normals',
  '渲染': 'Rendering',
  '拓扑': 'Topology',
  '垂直线': 'Verticals',
  '单位': 'Units',
  '降噪': 'Denoising',
  '合成': 'Compositing',
  '采样': 'Samples',
  '切割': 'Cut',
  '材质节点': 'Material nodes',
  '色彩管理': 'Color management',
  '资产库': 'Asset library',
  '对象': 'Object',
  '选择': 'Select',
  '删除': 'Delete',
  '编辑': 'Edit',
  '完全自然': 'Completely natural',
  '视频输出': 'Video output',

  // ---- 建模 / 对象操作 ----
  'Move, Rotate, Scale等基础操作练习': 'Practice basics: Move, Rotate, Scale',
  '办公室、酒店客房等完整房间建模': 
    'Modeling complete rooms such as offices and hotel guest rooms',
  '移动工具(M)': 'Move tool (M)',
  '旋转工具': 'Rotate tool',
  '缩放工具(S)': 'Scale tool (S)',
  '缩放工具': 'Scale tool',
  '选择工具(Q)': 'Select tool (Q)',
  '选择工具+拖拽': 'Select tool + drag',
  '轨道工具(O)': 'Orbit tool (O)',
  '平移工具(H)': 'Pan tool (H)',
  '推拉工具(P)': 'Push/Pull tool (P)',
  '倒角工具(B)': 'Bevel tool (B)',
  '偏移工具': 'Offset tool',
  '画线工具': 'Line tool',
  '左键': 'Left click',
  '中键': 'Middle mouse',
  '滚轮': 'Scroll wheel',
  'Ctrl+左键': 'Ctrl + left click',
  'Shift+中键': 'Shift + middle mouse',
  '选中物体或元素': 'Select an object or element',
  '放大查看细节': 'Zoom in to inspect detail',
  '正交/透视切换': 'Orthographic / perspective toggle',
  '保存': 'Save',
  '保存.blend文件': 'Save the .blend file',
  '保存工作进度': 'Save your progress',
  '另存为': 'Save as',
  '另存为新文件': 'Save as a new file',
  '另存版本/备份': 'Save a version / backup',
  '插入关键帧': 'Insert keyframes',
  '在当前位置插入关键帧': 'Insert a keyframe at the current frame',
  '打开Graph Editor编辑动画曲线': 
    'Open the Graph Editor to edit animation curves',

  // ---- 视图着色 ----
  '着色模式': 'Shading mode',
  '着色模式菜单': 'Shading mode menu',
  '着色模式按钮': 'Shading mode buttons',
  '切换Wireframe/Solid/Material/Rendered': 
    'Switch Wireframe / Solid / Material / Rendered',
  '切换到材质预览模式': 'Switch to Material Preview mode',
  '切换到渲染预览模式': 'Switch to Rendered preview mode',
  '切换查看材质效果': 'Toggle material preview',
  '查看材质效果': 'Check the material',
  '视口渲染预览': 'Viewport render preview',
  '实时查看渲染效果': 'See the render result in real time',

  // ---- 编辑模式与家具编辑 ----
  'Object/Edit模式切换': 'Toggle Object / Edit mode',
  '进入编辑修改家具': 'Enter Edit Mode to modify furniture',
  '编辑家具的不同级别': 'Edit furniture at different levels',
  'Group/组件': 'Group / component',
  '修复SU导入的Scale问题': 'Fix the scale problem from the SketchUp import',
  '建立父级': 'Set up parenting',
  '设置父物体': 'Set the parent object',
  '把灯具关联到天花板': 'Parent the light fixture to the ceiling',
  '让家具表面圆润': 'Round the furniture surface',
  '让家具变圆润': 'Round the furniture',
  '右键 → Shade Auto Smooth': 'Right-click → Shade Auto Smooth',
  '右键 → Shade Smooth': 'Right-click → Shade Smooth',
  '圆润+锐利边共存': 'Rounded and sharp edges side by side',
  '右键 → Subdivide': 'Right-click → Subdivide',
  '给家具加细分线': 'Add subdivision edge loops to furniture',
  '修复重叠顶点/重面': 'Fix overlapping vertices / duplicate faces',
  '修复黑面问题': 'Fix black-face problems',
  '调整边的位置不改变拓扑': 'Move edges without changing topology',
  '做柜体凹槽踢脚': 'Create cabinet grooves and skirting',
  '做柜体凹槽/踢脚': 'Create cabinet grooves / skirting',

  // ---- UV ----
  '标记接缝': 'Mark seams',
  '右键 → Mark Seam': 'Right-click → Mark Seam',
  '标记UV展开接缝': 'Mark UV seams',
  '控制UV展开方向': 'Control UV unwrap direction',
  'UV展开菜单': 'Unwrap menu',
  '打开UV展开选项': 'Open the unwrap options',
  '展开模型UV': 'Unwrap the model UVs',

  // ---- 材质指定 ----
  '给物体新建材质': 'Create a new material for the object',
  '为家具赋予材质': 'Assign materials to furniture',
  '将材质指定给选中面': 'Assign the material to the selected faces',
  '给家具不同部分不同材质': 
    'Use different materials on different parts of the furniture',

  // ---- 渲染设置 ----
  '设置渲染参数': 'Set the render parameters',
  '快速预览效果图效果': 'Quickly preview the render',
  '查看渲染构图': 'Check render composition',
  '移动到室内不同区域': 'Move to different areas of the interior',
  '添加家具灯具参考图': 'Add furniture / lighting / reference images',
  '添加家具/灯具/参考图': 'Add furniture / lighting / reference images',

  // ---- 动画：分步操作 ----
  'Keyframe动画基础': 'Keyframe animation basics',
  '室内漫游中常用的镜头运动方式': 
    'Common camera moves used in interior walkthroughs',
  '室内空间导览': 'Interior space tour',
  '微妙呼吸感，增加画面活力': 'A subtle breathing motion that adds life to the frame',
  '1. 切换到Animation工作区': '1. Switch to the Animation workspace',
  '1. Timeline → 设置Start=1, End=120': '1. Timeline → set Start=1, End=120',
  '2. 打开Dope Sheet编辑器': '2. Open the Dope Sheet editor',
  '3. 框选关键帧 → G移动时间位置': 
    '3. Box-select the keyframes → G to move them in time',
  '4. 删除不需要的关键帧（X → Delete Keyframes）': 
    '4. Delete unneeded keyframes (X → Delete Keyframes)',
  '1. 选中Camera → I → Location（插入位置关键帧）': 
    '1. Select Camera → I → Location (insert a location keyframe)',
  '2. 时间线移动到第60帧 → 移动Camera位置 → I → Location': 
    '2. Move the timeline to frame 60 → move the Camera → I → Location',
  '3. Space播放预览': '3. Space to play the preview',
  '4. Dope Sheet → 调整关键帧时间': '4. Dope Sheet → adjust keyframe timing',
  '1. 选中关键帧 → T → 打开插值菜单': 
    '1. Select the keyframe → T → open the interpolation menu',
  '2. 选择Bezier（推荐）': '2. Choose Bezier (recommended)',
  '3. 打开Graph Editor调整曲线': 
    '3. Open the Graph Editor and adjust the curve',
  '4. 拖拽控制柄调整缓动': '4. Drag the handles to adjust easing',
  '1. 创建Bezier Curve路径': '1. Create a Bezier Curve path',
  '2. Edit Mode → 调整曲线形状': '2. Edit Mode → adjust the curve shape',
  '3. 选中Camera → Add Constraint → Follow Path': 
    '3. Select Camera → Add Constraint → Follow Path',
  '4. Target → 选择Curve': '4. Target → select Curve',
  '5. 勾选Follow Curve → Animate Path': '5. Tick Follow Curve → Animate Path',
  '1. 选中Camera → Constraint → Follow Path': 
    '1. Select Camera → Constraint → Follow Path',
  '2. Target → 选择Bezier Curve': '2. Target → select the Bezier Curve',
  '3. 勾选Follow Curve + Forward': '3. Tick Follow Curve + Forward',
  '4. 调整Forward Axis到正确方向': 
    '4. Set Forward Axis to the correct direction',
  '1. Shift+A → Empty → 添加目标点': '1. Shift+A → Empty → add a target point',
  '2. 选中Camera → Constraint → Track To': 
    '2. Select Camera → Constraint → Track To',
  '3. Target → 选择Empty': '3. Target → select Empty',
  '2. Camera → Follow Path（位置）': '2. Camera → Follow Path (position)',
  '3. Camera → Track To Empty（朝向）': '3. Camera → Track To Empty (aim)',
  '4. Graph Editor调整缓动': '4. Adjust easing in the Graph Editor',
  '5. 空格键预览': '5. Space to preview',
  '2. Graph Editor → 选中Camera': '2. Graph Editor → select Camera',
  '3. 选中关键帧 → T → 设置Handle Type': 
    '3. Select the keyframe → T → set Handle Type',
  '4. 拖拽控制柄调整曲线形状': 
    '4. Drag the handles to adjust the curve shape',
  '1. Output Properties → Output → 选择保存路径': 
    '1. Output Properties → Output → choose a save path',
  '5. Ctrl+F12 → 开始渲染动画': '5. Ctrl+F12 → start rendering the animation',
  '6. 完成后在指定路径找到.mp4文件': 
    '6. When done, find the .mp4 file at the given path',
  'Play预览，Graph Editor调整': 'Play to preview, adjust in the Graph Editor',
  'Graph Editor微调速度': 'Fine-tune speed in the Graph Editor',
  '动画时分离路径与朝向预览速度后再提高采样': 
    'Separate path from orientation when animating; preview the speed before raising samples',
  '动画时分离路径与朝向，预览速度后再提高采样': 
    'Separate path from orientation when animating; preview the speed before raising samples',

  // ---- 动画：长句说明 ----
  '制作室内漫游动画的基础——通过Camera位置变化产生镜头运动': 
    'The foundation of interior walkthrough animation — shot movement created by changing the camera position',
  '室内漫游动画的核心——Camera沿曲线路径穿过房间/走廊': 
    'The core of an interior walkthrough — the camera follows a curved path through rooms and corridors',
  '完整室内漫游动画的基础——Camera沿路径移动+始终看向目标': 
    'The foundation of a complete interior walkthrough — the camera moves along a path while always aiming at a target',
  'Camera运动需要缓动——开始慢、中间快、结束慢，才像真实的摄影机运动': 
    'Camera moves need easing — slow at the start, fast in the middle, slow at the end — to feel like a real camera',
  '微调Camera运动速度——开始慢加速、中间匀速、结束减速': 
    'Fine-tune camera speed — slow start, constant middle, slow finish',
  '缓动：动画开始和结束减速，中间加速——像真实的相机运动': 
    'Easing: slow at the start and end, faster in the middle — like a real camera move',
  'Camera在移动过程中始终看向室内某个焦点（如接待台/沙发/艺术品）': 
    'The camera keeps aiming at a focal point in the room while moving (reception desk / sofa / artwork)',
  '最终输出完整的室内漫游视频文件，交付给客户': 
    'Finally output the complete interior walkthrough video file for the client',

  // ---- 构图与镜头 ----
  '单品特写/局部细节/材质表现': 
    'Single-item close-ups / details / material expression',
  '材质和细节表现最佳': 'Best for materials and detail',
  '俯拍：适合平面布局表现': 'Top-down: good for showing layout',
  '后退不够导致构图太紧': 'Not backing up enough, leaving the frame too tight',
  '后退太远穿墙了（用Local View检查）': 
    'Backed up too far and went through the wall (check with Local View)',
  '离物体太近变形严重': 'Too close to the object — heavy distortion',
  '离物体太近，变形严重': 'Too close to the object — heavy distortion',
  '相机不水平墙面倾斜': 'An unlevel camera makes the walls tilt',
  '相机不水平，墙面倾斜': 'An unlevel camera makes the walls tilt',
  '对比同材质的粗糙度变化': 'Compare roughness variations on the same material',
  '理解 Origin 与 Apply Transform': 'Understand Origin and Apply Transform',
  '使用 Snap 精确对齐': 'Align precisely with Snap',

  // ---- 灯光：参数建议与常见错误 ----
  '模拟自然日光，平行光源': 'Simulates natural daylight with parallel rays',
  '根据时间/季节调整': 'Adjust for time of day or season',
  '点光源，向四面八方照射': 'A point light that radiates in all directions',
  '强度太高，室内曝光过度': 'Intensity too high — the interior is overexposed',
  '强度太高，局部过曝': 'Intensity too high — local overexposure',
  '强度太高，亮斑过曝': 'Intensity too high — the hot spot blows out',
  '强度太高，像灯泡直射': 'Intensity too high — like a bare bulb',
  '强度太高，整个场景过亮': 'Intensity too high — the whole scene is too bright',
  '强度太高，渲染噪点暴增': 'Intensity too high — render noise explodes',
  '不调色温，灯光颜色不自然': 'No color temperature adjustment — the light looks unnatural',
  '不调Blend，光束边缘太硬': 'No Blend adjustment — the beam edge is too hard',
  'Spot Size太大，没有聚光效果': 'Spot Size too large — no focused beam',
  'Area太小，阴影太硬像点光': 'Area too small — shadows are as hard as a point light',
  'Radius=0，阴影太硬不真实': 'Radius=0 — shadows are too hard to be believable',
  '颜色不对，灯光与环境不协调': 
    'Wrong color — the light clashes with the environment',
  '颜色太白，缺乏阳光的暖色调': 
    'Too white — missing the warm tone of sunlight',
  '角度不对，阳光没有穿过窗户': 
    'Wrong angle — the sunlight does not come through the window',
  '办公室日景——Sun从窗户方向45度射入': 
    'Office daylight — Sun entering at 45° from the window',
  'Eevee需要开启Bloom才能看到光晕': 'EEVEE needs Bloom enabled to show glow',
  'Eevee下不开启Bloom看不到光晕': 
    'Without Bloom enabled in EEVEE, you get no glow',
  'Emission面没有厚度，从背面也发光': 
    'An Emission surface has no thickness, so it also glows from behind',
  '高动态范围环境贴图，模拟整个环境的光照': 
    'A high dynamic range environment map that simulates the lighting of a whole environment',
  '自然光室内/室外环境光/窗外光线': 
    'Natural-lit interiors / outdoor ambient light / light through the window',
  '不旋转HDRI，阳光方向不合适': 
    'Not rotating the HDRI — the sunlight direction is wrong',
  '背景显示HDRI但渲染时不需要——需要在渲染设置中关闭背景': 
    'The background shows the HDRI but the render does not need it — turn the background off in render settings',
  '关闭多余灯光，用中性材质检查空间体块': 
    'Turn off extra lights and check the spatial massing with neutral materials',
  '用窗洞、高光和阴影判断主光方向': 
    'Use window openings, highlights, and shadows to judge key-light direction',
  '分别检查亮部不过曝、暗部有信息和材质颜色稳定': 
    'Separately check that highlights are not blown, shadows hold detail, and material color stays stable',
  '先关闭 World 强光，单独测试每一类灯的方向、范围和阴影': 
    'Turn off strong World lighting first, then test each light type for direction, range, and shadow on its own',
  '用 Area 建立柔和主光，用 Spot 强调重点，用 Emission 表达可见灯带': 
    'Use Area for soft key light, Spot for accents, and Emission for visible LED strips',
  '按真实空间尺度调整灯具尺寸、功率和色温': 
    'Adjust light size, power, and color temperature to real spatial scale',
  '用灰材质与最终材质各检查一次曝光、噪点和反射': 
    'Check exposure, noise, and reflections once with a gray material and once with the final material',
  '先用低采样确认构图、材质和灯光方向': 
    'Confirm composition, materials, and light direction at low samples first',
  '设置目标设备与合理采样，启用降噪': 
    'Set the target device and sensible samples, and enable denoising',
  '检查噪点来源、间接光、高光和透明材质': 
    'Check noise sources, indirect light, highlights, and transparent materials',
  '以最终分辨率输出测试区域，再开始完整渲染': 
    'Render a test region at final resolution before starting the full render',
  '使用中性参考材质确认灯光能量': 
    'Use a neutral reference material to confirm the light energy',
  '查看高光、暗部和直方图，调整 Exposure': 
    'Check highlights, shadows, and the histogram, then adjust Exposure',
  '比较 View Transform 与 Look，但保留统一项目设置': 
    'Compare View Transform and Look, but keep the project settings consistent',
  '在不同显示尺寸导出测试图，检查层次与色偏': 
    'Export test images at different display sizes to check layering and color cast',
  '简单材质即可（灯光测试不需要精细材质）': 
    'A simple material is fine (lighting tests do not need detailed materials)',
  '重点：Sun/HDRI + 人工光 + 氛围光': 
    'Focus: Sun/HDRI + artificial light + ambient light',
  '重点：创建PBR材质，UV展开': 'Focus: create PBR materials, unwrap UVs',

  // ---- 材质：参数建议与常见错误 ----
  'Roughness太低（<0.7），墙面反光像塑料': 
    'Roughness too low (<0.7) — the wall reflects like plastic',
  '加了过强的Bump，墙面看起来像砂纸': 
    'Bump too strong — the wall looks like sandpaper',
  '颜色太纯白，缺乏真实涂料的微暖色调': 
    'Too pure white — missing the slightly warm tone of real paint',
  '纹理Scale太大，颗粒变成大块': 
    'Texture Scale too large — the grain turns into blobs',
  'Bump Strength太强，墙面看起来像石头': 
    'Bump Strength too high — the wall looks like rock',
  '颜色饱和度太高，失去涂料感': 'Saturation too high — it stops reading as paint',
  'Normal Map连到Bump通道（应该用Normal Map节点）': 
    'Normal Map wired into the Bump input (use a Normal Map node instead)',
  '贴图重复太明显，需要调Scale或用无缝贴图': 
    'Tiling is too obvious — adjust Scale or use a seamless texture',
  '贴图重复明显，需要调Scale': 'Tiling is obvious — adjust Scale',
  'Roughness太高，大理石失去光泽': 'Roughness too high — the marble loses its sheen',
  '颜色太黑，失去石材质感': 'Too dark — it stops reading as stone',
  'Roughness=0像镜面，不像石头': 'Roughness=0 looks like a mirror, not stone',
  'Roughness太低，木头看起来像塑料': 
    'Roughness too low — the wood looks like plastic',
  '木纹Normal Map方向不对，需要调Mapping Rotation': 
    'The wood grain Normal Map points the wrong way — adjust Mapping Rotation',
  '颜色太黑看不清木纹': 'Too dark — the wood grain is invisible',
  'Roughness太低反光太强': 'Roughness too low — reflections are too strong',
  'Metallic用中间值如0.5（金属是0或1）': 
    'Metallic set to a middle value like 0.5 (for metal it should be 0 or 1)',
  'Roughness=0变成镜面（除非要镜面效果）': 
    'Roughness=0 becomes a mirror (unless you want a mirror)',
  '忘记Metallic=1后Base Color变成反射颜色而非漫反射': 
    'Forgetting that with Metallic=1, Base Color becomes the reflection color rather than diffuse color',
  'Transmission=0看不到透明效果': 'Transmission=0 — no transparency is visible',
  'Roughness>0玻璃变磨砂（除非要做磨砂玻璃）': 
    'Roughness>0 turns glass frosted (unless you want frosted glass)',
  'Eevee下需要开启Screen Space Refraction才能看到透明': 
    'EEVEE needs Screen Space Refraction enabled to show transparency',
  'Roughness太低像塑料': 'Roughness too low — looks like plastic',
  '忽略Sheen参数，织物没有毛感': 
    'Ignoring the Sheen parameter — the fabric has no fuzz',
  'Bump太强，布面像砂纸': 'Bump too strong — the fabric looks like sandpaper',
  '没有Normal Map，皮革像PU皮': 'Without a Normal Map, leather looks like PU',
  'Roughness太低像塑料皮': 'Roughness too low — looks like plastic leather',
  '颜色太黑看不出皮纹': 'Too dark — the leather grain is invisible',

  // ---- 渲染：步骤与常见错误 ----
  '确定帧率、起止帧和镜头目的': 
    'Decide the frame rate, start/end frames, and the purpose of the shot',
  '在 Graph Editor 调整缓入缓出，消除突然启动和停止': 
    'Adjust ease in and ease out in the Graph Editor to remove abrupt starts and stops',
  '切换 EEVEE 并确认材质节点兼容': 
    'Switch to EEVEE and confirm material nodes are compatible',
  '逐项检查阴影、反射、光线追踪和体积设置': 
    'Check shading, reflections, ray tracing, and volume settings one by one',
  '在目标分辨率下播放视图，定位性能瓶颈': 
    'Play the viewport at the target resolution to locate performance bottlenecks',
  '输出测试帧，与 Cycles 参考帧比较差异': 
    'Render test frames and compare them against a Cycles reference frame',
  '确认分辨率、帧率、帧范围和输出目录': 
    'Confirm resolution, frame rate, frame range, and output directory',
  '先渲染少量代表帧检查曝光、噪点和运动': 
    'Render a few representative frames first to check exposure, noise, and motion',
  '输出 PNG 或 EXR 图像序列，并保留中间结果': 
    'Output a PNG or EXR image sequence and keep the intermediate results',
  '在 Video Sequencer 或剪辑软件合成、调色并导出 MP4': 
    'Composite and color grade in the Video Sequencer or an editor, then export MP4',
  '复制对象作对照并检查 Scale': 
    'Duplicate the object as a reference and check Scale',
  '添加目标 Modifier，先使用低复杂度参数获得正确结构': 
    'Add the target modifier and start with low-complexity parameters to get the structure right',
  '调整堆栈顺序，比较视图与渲染结果': 
    'Reorder the stack and compare viewport with render result',
  '确认拓扑、阴影和性能后再决定是否 Apply': 
    'Confirm topology, shading, and performance before deciding whether to apply',

  // ---- 建模：UV 与导入 ----
  '按不显眼位置标记 Seam，选择合适的 Unwrap 或 Projection': 
    'Mark seams in inconspicuous places and choose the right unwrap or projection',
  '在 UV Editor 中检查拉伸、岛屿方向和统一比例': 
    'Check stretching, island orientation, and consistent scale in the UV Editor',
  '加载测试棋盘或真实贴图，在多个视角复核接缝': 
    'Load a checker map or the real texture and recheck seams from several angles',
  '在 SketchUp 中按空间、家具和灯具整理 Group 与 Tag，并另存交接副本': 
    'Organize groups and tags by space, furniture, and lighting in SketchUp, then save a handoff copy',
  '按项目版本命名后导出 FBX；记录单位、贴图和坐标选项': 
    'Name by project version, then export FBX; record unit, texture, and axis options',
  '在 Blender 新文件中导入，逐项核对尺寸、层级、材质槽和法线': 
    'Import into a fresh Blender file and check dimensions, hierarchy, material slots, and normals item by item',
  '修正后保存为导入模板，并用第二个小模型重复验证': 
    'Save the corrected version as an import template and re-verify with a second small model',
  '检查Group/Component命名、Tag清理、删除不可见几何体': 
    'Check group/component naming, clean up tags, and delete invisible geometry',
  '按墙体/门窗/家具/灯具分组': 
    'Group by wall / doors & windows / furniture / lighting',
  '确保Tag干净，无多余图层': 'Make sure tags are clean with no stray layers',
  'File → Export → FBX，单位Millimeters': 
    'File → Export → FBX, units in millimeters',
  'Ctrl+A → All Transforms，确认Scale=1': 
    'Ctrl+A → All Transforms, confirm Scale=1',
  'Merge by Distance, Collection组织': 'Merge by Distance, organize collections',
  'Ctrl+A (在Modifier面板)': 'Ctrl+A (in the modifier panel)',
  '从SketchUp模型到Blender效果图输出': 
    'From a SketchUp model to a Blender render output',
  '从SU模型到完整室内漫游视频输出': 
    'From a SketchUp model to a complete interior walkthrough video',

  // ---- 快捷键中心：按键说明 ----
  'Tab · Object / Edit Mode 切换': 'Tab · switch Object / Edit Mode',
  'Shift+Tab · 吸附开关': 'Shift+Tab · toggle snapping',
  'Ctrl+A · 应用变换': 'Ctrl+A · apply transforms',
  'Ctrl+Z · 撤销': 'Ctrl+Z · undo',
  'Ctrl+Shift+Z · 重做': 'Ctrl+Shift+Z · redo',
  'A · 全选': 'A · select all',
  'B · 框选': 'B · box select',
  'C · 刷选': 'C · circle select',
  'G · 移动': 'G · move',
  'R · 旋转': 'R · rotate',
  'S · 缩放': 'S · scale',
  'E · 挤出': 'E · extrude',
  'I · 内缩面': 'I · inset faces',
  'Ctrl+B · 倒角': 'Ctrl+B · bevel',
  'Ctrl+R · 环切': 'Ctrl+R · loop cut',
  'K · 切刀': 'K · knife',
  'X · 删除': 'X · delete',
  'Shift+D · 复制': 'Shift+D · duplicate',
  'Alt+D · 关联复制': 'Alt+D · linked duplicate',
  'M · 合并': 'M · merge',
  'P · 分离': 'P · separate',
  'Ctrl+J · 合并物体': 'Ctrl+J · join objects',
  'Ctrl+1~3 · 细分': 'Ctrl+1~3 · subdivide',
  'N · 侧边栏': 'N · sidebar',
  'T · 工具栏': 'T · toolbar',
  'F12 · 渲染当前帧': 'F12 · render the current frame',
  'Ctrl+F12 · 渲染动画': 'Ctrl+F12 · render animation',
  'Space · 播放/暂停': 'Space · play / pause',
  'Shift+A · 添加菜单': 'Shift+A · Add menu',
  'F9 · 调整上一步': 'F9 · adjust the last operation',
  'Z · 着色模式': 'Z · shading mode',
  'Alt+Z · X-Ray': 'Alt+Z · X-Ray',
  'Numpad 1 · 正视图': 'Numpad 1 · front view',
  'Numpad 3 · 右视图': 'Numpad 3 · right view',
  'Numpad 7 · 顶视图': 'Numpad 7 · top view',
  'Numpad 5 · 正交/透视': 'Numpad 5 · orthographic / perspective',
  'Numpad . · 聚焦选中': 'Numpad . · focus the selection',
  '鼠标中键 · 旋转视图': 'Middle mouse · orbit the view',
  'Shift+中键 · 平移视图': 'Shift + middle mouse · pan the view',
  '滚轮 · 缩放视图': 'Scroll wheel · zoom the view',
  '左键 · 选择': 'Left click · select',
  'Ctrl+左键 · 刷选增加': 'Ctrl + left click · add to the selection',
  'Shift+右键 · 吸附菜单': 'Shift + right click · snapping pie menu',
  'Ctrl+Tab · 切换工作区': 'Ctrl+Tab · switch workspace',
  '视角、选择与 G / R / S': 'Viewport, selection, and G / R / S',
}
