/**
 * 英文词典 —— 实验室内容（材质 / 灯光 / 相机 / 动画）
 * ==================================================
 *
 * key 是简体中文原文。见 src/i18n/index.ts 的说明。
 * 快捷键与 SU→Blender 工作流在 en-shortcuts.ts。
 */

export const EN_LIBRARY: Record<string, string> = {
  // ---- SU → Blender 工作流（data/su-to-blender.json）----
  '同效果图工作流': 'Same as the render workflow',
  '模型整理': 'Model cleanup',
  '单位检查': 'Unit check',
  'SketchUp模型检查': 'SketchUp model check',
  'Tag整理': 'Tag cleanup',
  'Group整理': 'Group cleanup',
  'Normal检查': 'Normal check',
  'Scale检查': 'Scale check',
  'Blender导入': 'Blender import',
  'FBX导出': 'FBX export',
  '—（无直接对应）': '— (no direct equivalent)',
  '—（自动）': '— (automatic)',
  '—（工作区切换）': '— (workspace switch)',
  '—（Properties面板）': '— (Properties panel)',
  '—（SU始终是透视）': '— (SketchUp is always perspective)',
  '—（SU无渲染）': '— (no rendering in SketchUp)',
  '—（不能直接控制阴影）': '— (shadows cannot be controlled directly)',
  '—（用工具栏）': '— (via the toolbar)',
  '—（由HDRI图片决定）': '— (determined by the HDRI image)',
  '—（直接编辑）': '— (edit directly)',
  '—（纯参数即可）': '— (parameters only)',
  '—（通常要避免）': '— (usually avoid)',
  '—（金属不用IOR）': '— (IOR is not used for metal)',
  '—（无）': '— (none)',
  '可选': 'Optional',

  // ---- 时长 ----
  '5分钟': '5 min',
  '20分钟': '20 min',
  '25分钟': '25 min',
  '30分钟': '30 min',
  '35分钟': '35 min',
  '45分钟': '45 min',
  '60分钟': '60 min',
  '90分钟': '90 min',
  '120分钟': '120 min',
  '180分钟': '180 min',

  // ---- 材质实验室 ----
  '材质': 'Materials',
  '墙面': 'Wall',
  '木材': 'Wood',
  '石材': 'Stone',
  '金属': 'Metal',
  '皮革': 'Leather',
  '玻璃': 'Glass',
  '布艺': 'Fabric',
  '织物': 'Fabric',
  '木饰面': 'Wood veneer',
  '乳胶漆': 'Latex paint',
  '肌理漆': 'Textured paint',
  '浅灰大理石': 'Light gray marble',
  '深灰石材': 'Dark gray stone',
  '深胡桃木': 'Dark walnut',
  '透明材质': 'Transparent material',
  '透明玻璃材质': 'Clear glass material',
  '基础材质': 'Base materials',
  'PBR深色木纹贴图': 'Dark wood PBR texture',
  'PBR木纹贴图（Color+Roughness+Normal）': 'Wood PBR texture (Color+Roughness+Normal)',
  'PBR皮革贴图（Color+Roughness+Normal）': 'Leather PBR texture (Color+Roughness+Normal)',
  'PBR贴图套装（Color+Roughness+Normal）': 'PBR texture set (Color+Roughness+Normal)',
  'PBR贴图或程序化Voronoi': 'PBR texture or procedural Voronoi',
  '材质面板': 'Material properties panel',
  '材质预览': 'Material preview',
  '材质测试渲染': 'Material test render',
  '材质工作流': 'Material workflow',
  '新建材质': 'New material',
  '指定材质': 'Assign material',
  '创建材质节点网络': 'Build the material node network',
  '创建/赋予室内材质': 'Create and assign interior materials',
  '编辑材质节点': 'Edit material nodes',
  '打开Shader Editor': 'Open the Shader Editor',
  '在节点编辑器添加节点': 'Add a node in the Node Editor',
  '着色器编辑器': 'Shader Editor',
  '添加节点': 'Add a node',
  '无需贴图': 'No texture needed',
  '不需要贴图': 'No texture needed',
  '程序化Noise即可': 'Procedural Noise is enough',
  '程序化Voronoi + Noise组合': 'Procedural Voronoi + Noise combined',
  'Voronoi Texture模拟不规则颗粒': 'Voronoi Texture simulates irregular grain',
  'Mapping Scale=1.0（按贴图实际大小）': 'Mapping Scale=1.0 (actual texture size)',
  'Mapping Scale=0.5控制纹理大小': 'Mapping Scale=0.5 controls texture size',
  'Scale=5-10控制纹理大小': 'Scale=5–10 controls texture size',
  '可选布料贴图': 'Optional fabric texture',
  '可选微Bump增加表面细节': 'Optional light bump for surface detail',
  '可选微Bump模拟表面纹理': 'Optional light bump to simulate surface texture',
  '可选微Bump（Noise Scale=100 Strength=0.05）': 
    'Optional light bump (Noise Scale=100, Strength=0.05)',
  '微Bump（Noise Texture, Scale=50, Strength=0.1）': 
    'Light bump (Noise Texture, Scale=50, Strength=0.1)',
  '微Bump模拟织物纹理': 'Light bump to simulate fabric weave',
  '可选微Bump': 'Optional light bump',
  '可选（拉丝金属用Anisotropic）': 'Optional (use Anisotropic for brushed metal)',
  '可选增强木纹凹凸': 'Optional — enhances wood grain relief',
  '可选增强皮纹凹凸': 'Optional — enhances leather grain relief',
  '可选，增强木纹凹凸': 'Optional — enhances wood grain relief',
  '可选，增强皮纹凹凸': 'Optional — enhances leather grain relief',
  '可选，模拟微弱刷痕': 'Optional — simulates faint brush marks',
  '拉丝金属可用程序化Noise': 'Brushed metal can use procedural Noise',
  '透明玻璃隔断': 'Clear glass partition',
  '隔断窗户展柜桌面玻璃': 'Partitions, windows, display cases, table tops',
  '隔断/窗户/展柜/桌面玻璃': 'Partitions / windows / display cases / table tops',
  '地面/墙面/背景墙/接待台': 'Floors / walls / feature walls / reception desks',
  '地面/背景墙/外墙感觉': 'Floors / feature walls / exterior walls',
  '柜体/背景墙/门套/家具/木地板': 'Cabinets / feature walls / door frames / furniture / wood floors',
  '灯具/把手/装饰条/家具框架/五金件': 
    'Lighting / handles / trim / furniture frames / hardware',
  '灯带/发光字/屏幕/LED灯条/氛围灯': 'LED strips / illuminated signs / screens / LED bars / ambient light',
  '灯带/面板灯/面光源补光/吊顶灯槽': 
    'LED strips / panel lights / area fill light / ceiling coves',
  '沙发/窗帘/抱枕/床头软包': 'Sofas / curtains / cushions / upholstered headboards',
  '皮椅/沙发/床头软包/软装': 'Leather chairs / sofas / upholstered headboards / soft furnishings',
  '客厅/卧室/办公室墙面，覆盖面积最大的材质': 
    'Living room / bedroom / office walls — the largest surface area in a space',
  '室内常用大理石浅灰色带纹理': 'Common interior marble — light gray with veining',
  '室内常用大理石，浅灰色带纹理': 'Common interior marble — light gray with veining',
  '室内常用皮革材质': 'Common interior leather',
  '室内常用金属材质拉丝磨砂亮面': 'Common interior metals — brushed / matte / polished',
  '室内常用金属材质——拉丝/磨砂/亮面': 'Common interior metals — brushed / matte / polished',
  '室内设计高频材质，木纹饰面': 'A high-frequency interior material — wood veneer',
  '室内软装布料材质': 'Interior soft-furnishing fabric',
  '室内最基础的墙面涂料哑光表面微弱纹理': 'The most basic wall paint — matte with a faint texture',
  '室内最基础的墙面涂料，哑光表面，微弱纹理': 
    'The most basic wall paint — matte surface, faint texture',
  '有明显纹理的装饰涂料如微水泥艺术漆': 
    'Decorative coatings with visible texture, such as microcement and art paint',
  '有明显纹理的装饰涂料，如微水泥、艺术漆': 
    'Decorative coatings with visible texture, such as microcement and art paint',
  '深灰色石材用于地面或背景墙': 'Dark gray stone for floors or feature walls',
  '深灰色石材，用于地面或背景墙': 'Dark gray stone for floors or feature walls',
  '深色胡桃木高端家具常用': 'Dark walnut — common in high-end furniture',
  '深色胡桃木，高端家具常用': 'Dark walnut — common in high-end furniture',
  '高端家具酒店客房柜体背景墙装饰': 
    'High-end furniture / hotel guest room cabinetry / feature wall decoration',
  '高端家具/酒店客房柜体/背景墙装饰': 
    'High-end furniture / hotel guest room cabinetry / feature wall decoration',
  '背景墙客厅主墙商业空间墙面装饰': 
    'Feature walls / living room main wall / commercial wall decoration',
  '背景墙/客厅主墙/商业空间墙面装饰': 
    'Feature walls / living room main wall / commercial wall decoration',
  '墙体吊顶背景墙门洞等空间构件': 
    'Spatial components such as walls, ceilings, feature walls, and door openings',
  '墙体、吊顶、背景墙、门洞等空间构件': 
    'Spatial components — walls, ceilings, feature walls, door openings',
  '空间构件': 'Spatial components',
  '用于表现材质质感': 'To convey material texture',
  '木饰面石材金属线条的电视背景墙': 
    'A TV feature wall in wood veneer, stone, and metal trim',
  '木饰面+石材+金属线条的电视背景墙': 
    'A TV feature wall in wood veneer + stone + metal trim',

  // ---- 灯光实验室 ----
  '灯光': 'Lighting',
  '自然光': 'Natural light',
  '人工灯光': 'Artificial lighting',
  'Area（面光）': 'Area (area light)',
  'Point（点光）': 'Point (point light)',
  'Spot（射灯）': 'Spot (spot light)',
  'Sun（太阳光）': 'Sun (sun light)',
  'Emission（自发光）': 'Emission (self-illuminated)',
  'HDRI（环境光）': 'HDRI (ambient)',
  '点光源向四面八方照射': 'A point light that radiates in all directions',
  '锥形光束有方向性适合射灯轨道灯': 
    'A cone-shaped beam with direction — good for spot and track lights',
  '锥形光束，有方向性，适合射灯/轨道灯': 
    'A cone-shaped beam with direction — good for spot and track lights',
  '面光源柔和阴影最接近室内灯带面板灯效果': 
    'An area light with soft shadows — closest to interior strip and panel lights',
  '面光源，柔和阴影，最接近室内灯带/面板灯效果': 
    'An area light with soft shadows — closest to interior strip and panel lights',
  '模拟自然日光平行光源': 'Simulates natural daylight with parallel rays',
  '高动态范围环境贴图模拟整个环境的光照': 
    'A high dynamic range environment map that simulates the lighting of a whole environment',
  '通过材质自发光不是灯对象而是材质属性': 
    'Emits through the material — a material property, not a light object',
  '通过材质自发光，不是灯对象而是材质属性': 
    'Light comes from the material, not a light object — it is a material property',
  '灯带': 'LED strip',
  '洗墙灯Spot向上45度照射墙面': 'Wall washer — Spot aimed 45° up at the wall',
  '洗墙灯——Spot向上45度照射墙面': 'Wall washer — Spot aimed 45° up at the wall',
  '吊顶灯槽Area放在灯槽内向下照射': 
    'Ceiling cove — an Area light inside the cove shining down',
  '吊顶灯槽——Area放在灯槽内向下照射': 
    'Ceiling cove — Area light placed inside the cove shining down',
  '台灯Point放在灯罩内部': 'Table lamp — Point light inside the shade',
  '台灯——Point放在灯罩内部': 'Table lamp — Point light inside the shade',
  'LED灯带——在灯槽内壁给自发光材质': 
    'LED strip — apply a self-illuminated material to the inner cove surface',
  '台灯落地灯吊灯装饰小灯': 'Table, floor, pendant, and small decorative lamps',
  '台灯/落地灯/吊灯/装饰小灯': 'Table, floor, pendant, and small decorative lamps',
  '射灯轨道灯洗墙灯重点照明': 'Spotlights, track lights, wall washers, accent lighting',
  '射灯/轨道灯/洗墙灯/重点照明': 'Spotlights / track lights / wall washers / accent lighting',
  '办公室': 'Office',
  '商业空间': 'Commercial space',
  '酒店大堂': 'Hotel lobby',
  '酒店客房': 'Hotel guest room',
  '日料店': 'Japanese restaurant',
  '办公室日景效果图': 'Office daylight render',
  '商业空间效果图': 'Commercial space render',
  '酒店客房夜景效果图': 'Hotel guest room night render',
  '日料店暖色氛围': 'Warm ambience for a Japanese restaurant',
  '酒店大堂日景大气明亮': 'Hotel lobby daylight — spacious and bright',
  '酒店大堂日景，大气明亮': 'Hotel lobby in daylight — spacious and bright',
  '酒店客房夜景温馨氛围': 'Hotel guest room at night — warm and inviting',
  '酒店客房夜景，温馨氛围': 'Hotel guest room at night — warm and inviting',
  '办公空间日景自然光人工光组合': 
    'Office space in daylight — natural light combined with artificial light',
  '办公空间日景，自然光+人工光组合': 
    'Office space in daylight — natural light combined with artificial light',
  '商业空间照明高对比度': 'Commercial lighting with high contrast',
  '商业空间照明，高对比度': 'Commercial lighting with high contrast',
  '商业空间需要高对比度重点照明亮环境暗': 
    'Commercial spaces need high contrast — bright accent lighting against a dark ambient',
  '商业空间需要高对比度——重点照明亮，环境暗': 
    'Commercial spaces need high contrast — bright accent lighting, dark ambient',
  '大堂需要层次感自然光重点照明氛围光': 
    'Lobbies need layering — natural light, accent lighting, and ambient light',
  '大堂需要层次感——自然光+重点照明+氛围光': 
    'Lobbies need layering — natural light + accent lighting + ambient light',
  '日景室内自然光从窗户天窗射入的阳光': 
    'Daylight interiors — sunlight entering through windows and skylights',
  '日景室内自然光——从窗户/天窗射入的阳光': 
    'Daylight interiors — sunlight through windows and skylights',
  '自然光室内HDRI从窗户提供环境光': 
    'Natural-light interiors — the HDRI provides ambient light through the window',
  '自然光室内——HDRI从窗户提供环境光': 
    'Natural-light interiors — HDRI provides ambient light through the window',
  'Cycles下HDRI是最自然的环境光来源': 'In Cycles, HDRI is the most natural ambient light source',
  'Cycles渲染商业空间高对比度效果图': 'Render a high-contrast commercial space with Cycles',
  'Cycles渲染酒店客房夜景效果图': 'Render a hotel room at night with Cycles',
  'Eevee快速渲染办公室日景效果图': 'Fast EEVEE render of an office daylight scene',
  'Eevee快速查看材质效果': 'Quickly check materials in EEVEE',
  'Eevee快速查看灯光效果': 'Quickly check lighting in EEVEE',
  'Eevee快速查看': 'Fast preview in EEVEE',
  'Eevee测试': 'EEVEE test',
  'Cycles最终渲染': 'Final Cycles render',
  '灯光工作流': 'Lighting workflow',
  '灯光类型': 'Light types',
  '灯光组合': 'Lighting setups',
  '灯光测试渲染': 'Lighting test render',
  'Area(灯带) + Point(台灯) + Emission(氛围灯)': 
    'Area (strip) + Point (table lamp) + Emission (ambient)',
  'Point(纸灯笼) + Area(灯带) + Spot(射灯重点)': 
    'Point (paper lantern) + Area (strip) + Spot (accent)',
  'Spot(轨道射灯) + Area(面光) + Emission(发光字)': 
    'Spot (track) + Area (fill) + Emission (illuminated sign)',
  'Sun(窗外) + Area(面板灯) + Spot(射灯重点照明)': 
    'Sun (outside) + Area (panel light) + Spot (accent lighting)',
  'HDRI(自然光) + Spot(射灯) + Area(面光) + Emission(灯带)': 
    'HDRI (natural) + Spot + Area (fill) + Emission (strip)',
  '#FFE8D0（暖白）': '#FFE8D0 (warm white)',
  '#FFD9B0（暖白）': '#FFD9B0 (warm white)',
  '#FFEBC4（暖白）': '#FFEBC4 (warm white)',
  '0.01-0.1m（光源大小，影响阴影柔和度）': 
    '0.01–0.1m (light size, affects shadow softness)',
  '0.5-1.0（边缘柔和度）': '0.5–1.0 (edge softness)',
  '0.5m × 2m（灯带）/ 0.3m × 0.3m（射灯）': 
    '0.5m × 2m (strip) / 0.3m × 0.3m (spot)',
  '30-60度（光束角）': '30–60° (beam angle)',
  'Soft Shadow（Radius>0时）': 'Soft Shadow (when Radius > 0)',
  'Spot Size=光锥角度，Blend=边缘羽化': 'Spot Size = beam angle, Blend = edge feathering',
  'Radius=0时阴影最硬，Radius越大阴影越柔': 
    'Radius=0 gives the hardest shadow; larger Radius softens it',
  'Area越大，阴影越柔和': 'The larger the Area, the softer the shadow',
  'Sun方向=太阳方位角+高度角': 'Sun direction = azimuth + elevation',
  'Z轴旋转控制阳光方向': 'Z rotation controls the sun direction',
  '色温2700-3000K暖白，强度不要太高，营造私密感': 
    '2700–3000K warm white at low intensity to create intimacy',
  '色温2700K暖光，纸灯笼柔光，营造日式暖意': 
    '2700K warm light and a soft paper lantern for a Japanese feel',
  '面板灯色温5500K偏冷白，营造专业感': 
    'Panel light at 5500K, slightly cool white, for a professional feel',
  '色温': 'Color temperature',
  '曝光': 'Exposure',
  '灯光组合Setups': 'Lighting setups',
  '三点构图法适用': 'The rule of thirds applies',

  // ---- 相机实验室 ----
  '相机': 'Camera',
  '相机视角': 'Camera view',
  '相机预设': 'Camera presets',
  '相机技巧': 'Camera techniques',
  '进入相机视角': 'Enter camera view',
  '添加相机': 'Add a camera',
  '添加新相机': 'Add a new camera',
  '设为活跃相机': 'Set as the active camera',
  '设选中相机为渲染相机': 'Set the selected camera as the render camera',
  '将相机对齐当前视图': 'Align the camera to the current view',
  '相机对齐视图': 'Align the camera to the view',
  '设置初始机位': 'Set the initial camera position',
  '设置焦距/高度/构图': 'Set focal length / height / composition',
  '设置多机位': 'Set up multiple camera positions',
  '设置多个渲染机位': 'Set up multiple render camera positions',
  '切换不同渲染角度': 'Switch between render angles',
  '快速设置渲染角度': 'Quickly set a render angle',
  '快速定位到某个家具': 'Quickly locate a piece of furniture',
  '固定机位微推': 'Subtle push on a fixed position',
  '固定机位微推：固定不动微调推进': 'Subtle push: stay put and creep forward',
  '固定位置微调推进': 'Subtle push from a fixed position',
  '焦距': 'Focal length',
  '景深': 'Depth of field',
  '机位': 'Camera position',
  '构图': 'Composition',
  '构图规则': 'Composition rules',
  '构图建议': 'Composition tips',
  '取景': 'Framing',
  '焦距选择与构图技巧': 'Focal lengths & composition',
  '24mm 广角': '24mm wide angle',
  '28mm 半广角': '28mm semi-wide',
  '35mm 标准': '35mm standard',
  '50mm 标准': '50mm standard',
  '广角镜头适合拍摄大空间全景': 'A wide lens for large-space panoramas',
  '广角镜头，适合拍摄大空间全景': 'A wide lens for large-space panoramas',
  '半广角室内效果图最常用焦距之一': 
    'Semi-wide — one of the most commonly used focal lengths for interior renders',
  '半广角，室内效果图最常用焦距之一': 
    'Semi-wide — one of the most-used focal lengths in interior renders',
  '标准焦距接近人眼视角': 'A standard focal length close to human vision',
  '标准焦距，接近人眼视角': 'A standard focal length, close to human vision',
  '标准镜头透视与人眼完全一致': 'A standard lens whose perspective matches the human eye exactly',
  '标准镜头，透视与人眼完全一致': 'A standard lens — perspective identical to the human eye',
  '室内效果图首选焦距': 'The preferred focal length for interior renders',
  '室内首选焦距': 'The preferred focal length for interiors',
  '室内效果图最常用视野够宽变形可接受': 
    'Most used for interior renders — wide enough, with acceptable distortion',
  '室内效果图最常用——视野够宽，变形可接受': 
    'Most used for interior renders — wide enough, distortion acceptable',
  '室内效果图通常用F8F11保证全部清晰': 
    'Interior renders usually use f/8–f/11 so everything stays sharp',
  '室内效果图通常用F8-F11保证全部清晰': 
    'Interior renders usually use f/8–f/11 to keep everything sharp',
  'F-stop 2.8：浅景深，背景虚化': 'f/2.8: shallow depth of field, blurred background',
  'F-stop 8：深景深，全部清晰': 'f/8: deep depth of field, everything sharp',
  '控制焦点范围虚化前景或背景': 
    'Control the focus range and blur the foreground or background',
  '控制焦点范围，虚化前景或背景': 
    'Control the focus range — blur the foreground or background',
  '1200mm：人站立视线高度，最自然': '1200mm: standing eye level — most natural',
  '900mm：人坐姿高度，适合客厅/沙发区': 
    '900mm: seated eye level — good for living rooms and sofas',
  '600mm：低角度，适合表现天花/高度感': 
    '600mm: low angle — good for ceilings and a sense of height',
  '室内摄影常用12001500mm高度人站立视线高度': 
    'Interior photography usually sits at 1200–1500mm — standing eye level',
  '室内摄影常用1200-1500mm高度（人站立视线高度）': 
    'Interior photography commonly uses 1200–1500mm — standing eye level',
  '1200mm：人站立视线高度，最自然 ': '1200mm: standing eye level — most natural',
  '接近人眼': 'Close to human vision',
  '透视自然': 'Natural perspective',
  '透视最自然不夸张': 'The most natural, undistorted perspective',
  '透视最自然，不夸张': 'The most natural perspective — no exaggeration',
  '透视夸张': 'Exaggerated perspective',
  '视野开阔': 'Wide field of view',
  '视野较宽': 'Fairly wide field of view',
  '视野窄': 'Narrow field of view',
  '边缘变形': 'Edge distortion',
  '变形极小': 'Almost no distortion',
  '变形较小': 'Slight distortion',
  '无变形': 'No distortion',
  '小空间用它拍出大气感': 'Use it to make a small space feel grand',
  '适合小空间拍出大气感': 'Good for making a small space feel grand',
  '大空间局部取景': 'Framing part of a large space',
  '适合正面对称构图': 'Good for frontal, symmetric compositions',
  '适合特写': 'Good for close-ups',
  '适合细节表达': 'Good for expressing detail',
  '适合局部特写': 'Good for detail close-ups',
  '适合拍摄单品家具': 'Good for a single piece of furniture',
  '适合拍摄家具组合特写': 'Good for a close-up of a furniture group',
  '适合3/4角度拍摄不全正面也不全侧面': 
    'Good for 3/4 angles — neither fully frontal nor fully side-on',
  '适合3/4角度拍摄（不全正面也不全侧面）': 
    'Good for 3/4 angles (neither fully frontal nor fully side-on)',
  '小户型全景紧凑空间想要大气感的效果图': 
    'Small apartments, tight spaces, and renders that need to feel grand',
  '小户型全景/紧凑空间/想要大气感的效果图': 
    'Whole-room shots of small apartments / tight spaces / renders that need to feel grand',
  '局部空间家具组合不想变形的效果图': 
    'Partial spaces, furniture groups, and renders that must not distort',
  '局部空间/家具组合/不想变形的效果图': 
    'Partial spaces / furniture groups / renders that must not distort',
  '空间太小35mm拍不全': 'The space is too small — 35mm cannot capture it all',
  '在狭小空间用50mm拍不全': 'In a tight space, 50mm cannot capture everything',
  '边缘家具严重拉伸': 'Furniture at the edges stretches badly',
  '离物体太近变形严重': 'Too close to the object — heavy distortion',
  '拍摄时尽量居中减少边缘变形': 
    'Keep the subject centred to reduce edge distortion',
  '拍摄时尽量居中，减少边缘变形': 
    'Keep the subject centred to reduce edge distortion',
  '构图太满没有呼吸空间': 'The frame is too full — no breathing room',
  '构图太满，没有呼吸空间': 'The frame is too full — no breathing room',
  '对称构图没居中透视歪斜': 'A symmetric composition that is off-centre, with tilted perspective',
  '对称构图没居中，透视歪斜': 'A symmetric composition that is off-centre, with tilted perspective',
  '保持相机水平避免透视倾斜': 'Keep the camera level to avoid tilted perspective',
  '相机不水平墙面倾斜': 'An unlevel camera makes the walls tilt',
  '三分法将画面分为33主体放在交叉点': 
    'The rule of thirds: split the frame 3×3 and place the subject on an intersection',
  '三分法：将画面分为3×3，主体放在交叉点': 
    'The rule of thirds: split the frame into 3×3 and put the subject on an intersection',
  '对称正面构图适合对称空间': 'Symmetry: frontal compositions suit symmetric spaces',
  '对称：正面构图适合对称空间': 'Symmetry: frontal compositions suit symmetric spaces',
  '对角线利用空间对角线增加深度': 
    'Diagonals: use the space’s diagonals to add depth',
  '对角线：利用空间对角线增加深度': 
    'Diagonals: use the space’s diagonals to add depth',
  '引导线用地板天花线条引导视线': 
    'Leading lines: use floor and ceiling lines to guide the eye',
  '引导线：用地板/天花线条引导视线': 
    'Leading lines: use floor and ceiling lines to guide the eye',
  '前景用家具做前景增加层次': 
    'Foreground: use furniture as a foreground layer',
  '前景：用家具做前景增加层次': 
    'Foreground: use furniture to add layering',
  '注意不要让前景物体离镜头太近': 
    'Do not let foreground objects get too close to the lens',
  '特写可以用浅景深突出重点': 
    'Close-ups can use a shallow depth of field to emphasise the subject',
  '室内摄影构图原则': 'Interior photography composition principles',
  '从不同角度查看室内空间': 'View the interior from different angles',
  '展示整体空间': 'Show the whole space',
  '展示家具空间全貌': 'Show the furniture and the whole space',
  '展示家具/空间全貌': 'Show the furniture / the whole space',
  '展示墙面展柜': 'Show walls and display cases',
  '展示墙面/展柜': 'Show walls / display cases',
  '强调某个空间家具': 'Emphasise a space or a piece of furniture',
  '强调某个空间/家具': 'Emphasise a space / a piece of furniture',
  '可以拍局部空间': 'Can capture part of a space',
  '移动家具到指定位置': 'Move furniture into place',
  '摆放家具位置': 'Position the furniture',

  // ---- 视图与操作 ----
  '视图': 'Viewport',
  '前视图': 'Front view',
  '正视图': 'Front view',
  '右视图': 'Right view',
  '顶视图': 'Top view',
  '局部视图': 'Local view',
  '查看侧立面': 'Check the side elevation',
  '查看墙面正立面': 'Check the front elevation of the wall',
  '查看平面布局': 'Check the floor plan layout',
  '切换到右视图': 'Switch to the right view',
  '切换到正视图': 'Switch to the front view',
  '切换到顶视图': 'Switch to the top view',
  '标准视图前': 'Standard view → Front',
  '标准视图→前': 'Standard view → Front',
  '标准视图右': 'Standard view → Right',
  '标准视图→右': 'Standard view → Right',
  '标准视图顶': 'Standard view → Top',
  '标准视图→顶': 'Standard view → Top',
  '切换正交和透视视图': 'Toggle orthographic and perspective view',
  '正交透视切换': 'Orthographic / perspective toggle',
  '正交模式查看真实比例': 'Use orthographic mode to check true proportions',
  '旋转3D视图角度': 'Rotate the 3D view angle',
  '旋转视图': 'Rotate the view',
  '放大缩小视图': 'Zoom the view in and out',
  '放大/缩小视图': 'Zoom the view',
  '缩放视图': 'Zoom the view',
  '平移视图': 'Pan the view',
  '拉远': 'Dolly out',
  '视图聚焦到选中物体': 'Frame the selected object in the view',
  '聚焦选中': 'Focus on the selection',
  '全屏3D视图工作': 'Work in a full-screen 3D view',
  '全屏切换': 'Toggle full screen',
  '全屏当前面板': 'Maximise the current panel',
  '切换选择模式': 'Switch selection mode',
  '顶点边面': 'Vertex / Edge / Face',
  '顶点/边/面': 'Vertex / Edge / Face',
  '选择物体或元素': 'Select objects or elements',
  '选择场景中的家具灯具等': 'Select furniture, lighting, and so on in the scene',
  '选择场景中的家具、灯具等': 'Select furniture, lighting, and so on in the scene',
  '选择被遮挡的物体': 'Select an occluded object',
  'X-Ray模式': 'X-Ray mode',
  'X-Ray透视': 'X-Ray see-through',
  '透视看穿模型': 'See through the model',
  '只显示选中物体': 'Show only the selected object',
  '隔离编辑单个家具': 'Isolate a single piece of furniture for editing',
  '快速找到不记得快捷键的操作': 'Find an operation whose shortcut you forgot',
  '搜索所有操作命令': 'Search all operators',
  '搜索菜单': 'Search the menu',
  '搜索': 'Search',
  '打开添加菜单': 'Open the Add menu',
  '添加物体': 'Add an object',
  '删除不需要的物体': 'Delete unneeded objects',
  '删除选中物体': 'Delete the selected object',
  '选中所有家具批量操作': 'Select all furniture for batch operations',
  '撤销上一步': 'Undo the last step',
  '撤销误操作': 'Undo a mistake',
  '重做撤销的操作': 'Redo an undone action',
  '恢复撤销的内容': 'Restore what was undone',
  '撤销': 'Undo',
  '重做': 'Redo',
  '全选': 'Select all',
  '全选/取消全选': 'Select all / deselect all',
  '框选': 'Box select',
  '框选区域内的物体': 'Box-select the objects in a region',
  '拖拽框选区域': 'Drag to box-select a region',
  '刷选': 'Circle select',
  '刷选多个物体': 'Circle-select multiple objects',
  '刷选（滚轮调半径）': 'Circle select (scroll wheel adjusts the radius)',
  '套索选': 'Lasso select',
  '自由框选不规则区域的物体': 'Freely box-select objects in an irregular region',
  '自由形状选择': 'Freeform selection',
  '合并': 'Merge',
  '合并物体': 'Join objects',
  '合并顶点': 'Merge vertices',
  '合并多个物体为一个': 'Join multiple objects into one',
  '合并多个部件为一个家具': 'Join multiple parts into one piece of furniture',
  '分离物体': 'Separate objects',
  '分离家具部件': 'Separate furniture parts',
  '分离选中部分为新物体': 'Separate the selection into a new object',
  '复制': 'Duplicate',
  '复制物体修改一个全部跟着改': 'Duplicate an object — edit one and all follow',
  '复制物体（修改一个全部跟着改）': 'Duplicate an object (edit one and all follow)',
  '复制选中物体': 'Duplicate the selected object',
  '关联复制': 'Linked duplicate',
  '组件复制': 'Component copy',
  '复制家具如重复椅子': 'Duplicate furniture, e.g. repeated chairs',
  '复制家具（如重复椅子）': 'Duplicate furniture (e.g. repeated chairs)',
  '复制相同灯具家具': 'Duplicate identical lights or furniture',
  '复制相同灯具/家具': 'Duplicate identical lights / furniture',
  '旋转': 'Rotate',
  '旋转物体到指定角度': 'Rotate an object to a given angle',
  '旋转家具方向': 'Rotate the furniture',
  '旋转物体XYZ限制轴向': 'Rotate an object (+X/Y/Z to constrain the axis)',
  '旋转物体（+X/Y/Z限制轴向）': 'Rotate an object (+X/Y/Z to constrain the axis)',
  '缩放': 'Scale',
  '缩放物体比例': 'Scale the object',
  '缩放物体XYZ限制轴向': 'Scale an object (+X/Y/Z to constrain the axis)',
  '缩放物体（+X/Y/Z限制轴向）': 'Scale an object (+X/Y/Z to constrain the axis)',
  '调整家具大小': 'Resize the furniture',
  '移动': 'Move',
  '移动物体XYZ限制轴向': 'Move an object (+X/Y/Z to constrain the axis)',
  '移动物体（+X/Y/Z限制轴向）': 'Move an object (+X/Y/Z to constrain the axis)',
  '精确数值输入': 'Precise numeric input',
  '沿边线方向滑动': 'Slide along the edge',
  '边滑动': 'Edge slide',
  '在面上加环线': 'Add an edge loop on a face',
  '在面上自由切线': 'Cut freely on a face',
  '手动切割面': 'Cut faces manually',
  '切刀': 'Knife',
  '环切': 'Loop cut',
  '挤出': 'Extrude',
  '从面边挤出新几何体': 'Extrude new geometry from a face or edge',
  '从面/边挤出新几何体': 'Extrude new geometry from a face or edge',
  '从平面挤出家具墙体': 'Extrude furniture and walls from a plan',
  '从平面挤出家具/墙体': 'Extrude furniture / walls from a plane',
  '内缩面': 'Inset faces',
  '面向内缩进': 'Inset the face',
  '倒角': 'Bevel',
  '给边面加圆角': 'Round the edges or faces',
  '给边/面加圆角': 'Round edges / faces',
  '给家具边加圆角': 'Round the furniture edges',
  '做柜体凹槽踢脚': 'Create cabinet grooves and skirting',
  '细分支架': 'Subdivision',
  '细分': 'Subdivide',
  '细分曲面': 'Subdivision surface',
  '细分选中边面': 'Subdivide the selected edges or faces',
  '细分选中边/面': 'Subdivide the selected edges / faces',
  '快速添加细分Modifier': 'Quickly add a Subdivision modifier',
  '配合Subdivision使用': 'Use together with Subdivision',
  '细分平滑圆润曲面': 'Subdivision + smoothing = rounded surfaces',
  '细分+平滑=圆润曲面': 'Subdivision + smoothing = smooth curved surfaces',
  '平滑物体表面': 'Smooth the object surface',
  '平滑着色': 'Smooth shading',
  '自动平滑': 'Auto smooth',
  '按角度自动平滑锐利': 'Auto smooth or sharpen by angle',
  '按角度自动平滑/锐利': 'Auto smooth / sharpen by angle',
  '重计算法线': 'Recalculate normals',
  '法线朝外': 'Normals facing outward',
  '三角化面': 'Triangulate faces',
  '将面三角化': 'Triangulate the face',
  '桥接': 'Bridge',
  '连接两个断开的面': 'Connect two disconnected faces',
  '连接两个边环': 'Connect two edge loops',
  '封住模型缺口': 'Close gaps in the model',
  '给空洞封面': 'Cap the open hole',
  '封面工具': 'Cap tool',
  '填充': 'Fill',
  '增加面数做细节': 'Add geometry for detail',
  '编辑模式切换': 'Toggle Edit Mode',
  '应用Modifier到模型数据': 'Apply the modifier to the mesh data',
  '应用修改器': 'Apply the modifier',
  '应用变换': 'Apply transforms',
  '应用位移旋转缩放到数据': 'Apply location, rotation, and scale to the data',
  '应用位移/旋转/缩放到数据': 'Apply location / rotation / scale to the data',
  '修改器': 'Modifiers',
  '最终确认Modifier效果': 'Confirm the modifier result',
  '重计算': 'Recalculate',
  '吸附': 'Snapping',

  // ---- 动画实验室 ----
  '动画': 'Animation',
  '关键帧': 'Keyframes',
  '关键帧动画基础': 'Keyframe animation basics',
  '动画课程': 'Animation lessons',
  '动画工作流': 'Animation workflow',
  '动画预览': 'Animation preview',
  '动画路径': 'Animation path',
  '动画表': 'Dope Sheet',
  '预览动画效果': 'Preview the animation',
  '播放动画': 'Play the animation',
  '逐帧检查动画': 'Check the animation frame by frame',
  '渲染动画': 'Render animation',
  '渲染动画序列': 'Render the animation sequence',
  '渲染动画与视频输出': 'Rendering animation and video output',
  '渲染动画序列并输出为视频文件': 
    'Render an animation sequence and output it as a video file',
  '动画中Camera运动方式': 'Camera movement styles in animation',
  '镜头运动类型': 'Shot movement types',
  '多镜头组合动画': 'Multi-shot animation',
  '多段路径拼接': 'Joining multiple path segments',
  '多段路径镜头编排': 'Multi-segment path and shot choreography',
  '多段路径+镜头编排': 'Multi-segment path + shot choreography',
  '连续漫游路径': 'Continuous walkthrough path',
  'Bezier Curve路径': 'Bezier Curve path',
  'Bezier Curve：贝塞尔曲线，可定义任意曲线路径': 
    'Bezier Curve: a curve that can define any path',
  'Bezier：平滑加速/减速（最常用）': 'Bezier: smooth acceleration / deceleration (most used)',
  'Linear：匀速（机械感，通常不用）': 'Linear: constant speed (mechanical — usually avoided)',
  'Constant：瞬间跳变（不连续）': 'Constant: instant jumps (discontinuous)',
  'Interpolation：关键帧之间的过渡方式（Linear/Bezier/Constant）': 
    'Interpolation: how keyframes transition (Linear / Bezier / Constant)',
  'Interpolation与缓动': 'Interpolation and easing',
  'Extrapolation：超出关键帧范围的延伸方式': 
    'Extrapolation: how the curve behaves beyond the keyframe range',
  'Keyframe：记录物体在某一时间点的状态（位置/旋转/缩放）': 
    'Keyframe: records an object’s state at a point in time (location / rotation / scale)',
  'Keyframe Handle：关键帧控制柄，控制曲线切线': 
    'Keyframe handle: controls the curve tangent',
  'F-Curve：动画曲线，X=时间 Y=值': 'F-Curve: animation curve, X = time, Y = value',
  'Timeline：时间轴，显示动画帧范围': 'Timeline: shows the animation frame range',
  'Timeline：底部时间轴，控制播放范围': 'Timeline: the bottom bar controlling the playback range',
  'Timeline与Dope Sheet': 'Timeline and Dope Sheet',
  'Dope Sheet：关键帧管理视图，可看到所有物体的关键帧': 
    'Dope Sheet: a keyframe management view showing every object’s keyframes',
  'Graph Editor：动画曲线编辑器': 'Graph Editor: the animation curve editor',
  'Graph Editor：曲线编辑器，X=时间 Y=值': 
    'Graph Editor: curve editor, X = time, Y = value',
  '曲线编辑器': 'Graph Editor',
  'FPS：帧率，通常24（电影）/25（PAL）/30（NTSC）': 
    'FPS: frame rate — usually 24 (film) / 25 (PAL) / 30 (NTSC)',
  'FPS：24或25': 'FPS: 24 or 25',
  'Start Frame / End Frame：动画范围': 
    'Start Frame / End Frame: the animation range',
  'Frame Step：跳帧渲染（测试用）': 'Frame Step: render every Nth frame (for testing)',
  'Output格式：FFmpeg Video': 'Output format: FFmpeg Video',
  'Quality：10-15（中等质量）': 'Quality: 10–15 (medium)',
  'FFmpeg H.264 输出.mp4': 'FFmpeg H.264 output .mp4',
  'Render Animation (Ctrl+F12)：逐帧渲染': 
    'Render Animation (Ctrl+F12): frame-by-frame rendering',
  'Path：Camera沿曲线移动': 'Path: the camera moves along a curve',
  'Follow Path：物体沿Curve路径移动': 'Follow Path: the object moves along the curve',
  'Follow Path控制位置': 'Follow Path controls position',
  'Track To控制朝向': 'Track To controls aim',
  'Track To：物体始终朝向目标物体': 'Track To: the object always aims at the target',
  'Follow Curve：物体旋转跟随曲线方向': 
    'Follow Curve: the object rotates to follow the curve',
  'Forward Axis：物体前进方向': 'Forward Axis: the object’s forward direction',
  'Up Axis：物体朝上方向': 'Up Axis: the object’s up direction',
  'Target Object：被追踪的物体（如一个Empty）': 
    'Target Object: the tracked object (for example an Empty)',
  'Curve Object：曲线物体，在场景中可见但渲染时不显示': 
    'Curve Object: visible in the scene, but not rendered',
  'FollowPath约束': 'Follow Path constraint',
  'Follow Path约束': 'Follow Path constraint',
  'Follow Path环绕动画': 'Follow Path orbit animation',
  'Track To约束': 'Track To constraint',
  'Camera推进动画': 'Camera push-in animation',
  'Camera围绕物体旋转': 'Camera orbits the object',
  'Camera平行移动': 'Camera trucks sideways',
  'Camera高度': 'Camera height',
  'Camera动画制作': 'Camera animation',
  'Camera Animation组合': 'Combined camera animation',
  'Camera从位置A到位置B做30帧直线移动动画': 
    'A 30-frame straight-line camera move from position A to B',
  'Camera沿设计好的路线穿过室内空间，比手动Keyframe更平滑': 
    'The camera travels through the interior along a designed route — smoother than hand-keyed keyframes',
  'Camera沿视线方向前进': 'Camera moves forward along its line of sight',
  'Camera沿视线方向后退': 'Camera moves backward along its line of sight',
  'Camera在走廊/转角处转弯': 'The camera turns at a corridor or corner',
  '让Camera始终看向指定目标': 'Make the camera always aim at a given target',
  '让Camera沿指定路径移动': 'Make the camera move along a given path',
  '组合使用：Follow Path + Track To = Camera沿路径移动且始终看向目标': 
    'Combined: Follow Path + Track To = the camera moves along a path and always aims at the target',
  '组合Follow Path + Track To制作专业Camera动画': 
    'Combine Follow Path + Track To for professional camera animation',
  '使用Bezier Curve+Follow Path制作环绕动画': 
    'Use a Bezier Curve + Follow Path for an orbit animation',
  '使用Bezier曲线定义Camera运动路径': 
    'Use a Bezier curve to define the camera motion path',
  '创建Bezier Curve + Follow Path + Track To': 
    'Create Bezier Curve + Follow Path + Track To',
  '多镜头组合动画：多个Camera切换': 
    'Multi-shot animation: switching between cameras',
  '管理复杂的多镜头动画——比如多个Camera切换': 
    'Manage complex multi-shot animation — for example switching between cameras',
  '环绕': 'Orbit',
  '推进': 'Push in',
  '横移': 'Truck',
  '转弯': 'Turn',
  '环绕：Camera围绕物体旋转': 'Orbit: the camera circles the object',
  '推进：Camera沿视线方向前进': 'Push in: the camera moves forward along its line of sight',
  '拉远：Camera沿视线方向后退': 'Dolly out: the camera moves backward along its line of sight',
  '横移：Camera平行移动（侧滑）': 'Truck: the camera moves sideways',
  '转弯：Camera在走廊/转角处转弯': 'Turn: the camera turns at a corridor or corner',
  '时间线操作': 'Timeline operations',
  '跳到开始': 'Jump to the start',
  '跳到结束': 'Jump to the end',
  '跳到时间线起始位置': 'Jump to the timeline start',
  '跳到时间线结束位置': 'Jump to the timeline end',
  '跳到动画结尾': 'Jump to the end of the animation',
  '回到动画开头': 'Return to the start of the animation',
  '上一帧': 'Previous frame',
  '下一帧': 'Next frame',
  '前进一帧': 'Next frame',
  '后退一帧': 'Previous frame',
  '播放/暂停时间线': 'Play / pause the timeline',
  '打开DopeSheet查看关键帧': 'Open the Dope Sheet to inspect keyframes',
  '打开Dope Sheet查看关键帧': 'Open the Dope Sheet to inspect keyframes',
  '打开时间线': 'Open the Timeline',
  '管理动画关键帧': 'Manage animation keyframes',
  '通过曲线编辑器精确控制动画': 'Control animation precisely with the Graph Editor',
  '调整动画缓动效果': 'Adjust the animation easing',
  '在GraphEditor调整缓动': 'Adjust easing in the Graph Editor',
  '在 Graph Editor 调整缓入缓出': 'Adjust ease in / out in the Graph Editor',
  'Graph Editor 微调速度': 'Fine-tune speed in the Graph Editor',
  '掌握动画过渡方式让运动自然': 
    'Master animation transitions so the motion feels natural',
  '掌握动画过渡方式，让运动自然': 
    'Master animation transitions so the motion feels natural',
  '掌握时间轴和动画表的使用': 'Learn to use the timeline and Dope Sheet',
  '理解关键帧概念掌握基本动画制作': 
    'Understand keyframes and learn basic animation',
  '理解关键帧概念，掌握基本动画制作': 
    'Understand keyframes and learn basic animation',
  '低质量快速预览完整动画': 'Quickly preview the whole animation at low quality',
  '高质量渲染动画序列': 'Render a high-quality animation sequence',
  '渲染图片': 'Render image',
  '渲染当前帧': 'Render the current frame',
  '渲染设置': 'Render settings',
  '打开渲染设置面板': 'Open the render settings panel',

  // ---- 练习体系 ----
  '练习体系': 'Practice system',
  '练习等级': 'Practice levels',
  '练习任务': 'Practice tasks',
  '动手练习': 'Hands-on practice',
  '配套课时': 'Related lessons',
  '基础': 'Basics',
  '从平面图出发建模一面墙并开门窗洞': 
    'Starting from a floor plan, model a wall and cut door and window openings',
  '从平面图出发，建模一面墙(3000×2700mm)并开门窗洞': 
    'Starting from a floor plan, model a wall (3000×2700mm) with door and window openings',
  '使用G轴向快捷键将一把椅子精确移动到指定位置': 
    'Use G plus an axis key to move a chair exactly into position',
  '使用G+轴向快捷键将一把椅子精确移动到指定位置': 
    'Use G + axis keys to move a chair exactly into position',
  '使用R+轴向将一个灯具旋转30度': 'Use R + an axis key to rotate a light fixture 30 degrees',
  '使用S+轴向将一个花瓶缩放到80%': 'Use S + an axis key to scale a vase to 80%',
  '用G+X+数值精确移动一个柜子1200mm': 
    'Use G + X + a number to move a cabinet exactly 1200mm',
  '用G+X+数值精确移动一个柜子1200mm ': 'Use G + X + a number to move a cabinet exactly 1200mm',
  '从Cube挤出建模一个办公桌': 
    'Model a desk by extruding from a cube (1200×600×750mm)',
  '从Cube挤出建模一个办公桌(1200×600×750mm)': 
    'Model a desk by extruding from a cube (1200×600×750mm)',
  '从Cube挤出建模一个床头柜': 
    'Model a nightstand by extruding from a cube (400×400×500mm)',
  '从Cube挤出建模一个床头柜(400×400×500mm)': 
    'Model a nightstand by extruding from a cube (400×400×500mm)',
  '使用挤出BevelSolidify建模一个柜子': 
    'Model a cabinet using Extrude, Bevel, and Solidify',
  '使用挤出+Bevel+Solidify建模一个柜子': 
    'Model a cabinet using Extrude + Bevel + Solidify',
  '使用NoiseVoronoiColorRampBump创建微水泥肌理漆材质': 
    'Create a microcement texture-paint material with Noise, Voronoi, ColorRamp, and Bump',
  '使用Noise+Voronoi+ColorRamp+Bump创建微水泥肌理漆材质': 
    'Create a microcement texture-paint material with Noise + Voronoi + ColorRamp + Bump',
  '创建一面乳胶漆墙面对比Roughness的效果差异': 
    'Create a latex-paint wall and compare the effect of Roughness 0.5 / 0.7 / 0.9',
  '创建一面乳胶漆墙面，对比Roughness 0.5/0.7/0.9的效果差异': 
    'Create a latex-paint wall and compare Roughness 0.5 / 0.7 / 0.9',
  '创建三种金属亮面磨砂拉丝': 
    'Create three metals: polished (R=0.1), matte (R=0.4), brushed (R=0.6 + Anisotropic)',
  '创建三种金属：亮面(R=0.1)/磨砂(R=0.4)/拉丝(R=0.6+Anisotropic)': 
    'Create three metals: polished (R=0.1) / matte (R=0.4) / brushed (R=0.6 + Anisotropic)',
  '创建布艺沙发材质对比有无Sheen和微Bump的差异': 
    'Create a fabric sofa material and compare with and without Sheen and a light bump',
  '创建布艺沙发材质，对比有无Sheen和微Bump的差异': 
    'Create a fabric sofa material and compare with and without Sheen and a light bump',
  '创建木饰面柜体材质调整纹理方向和大小': 
    'Create a wood veneer cabinet material and adjust texture direction and scale',
  '创建木饰面柜体材质，调整纹理方向和大小': 
    'Create a wood veneer cabinet material and adjust texture direction and scale',
  '创建深灰石材地面对比不同Roughness的效果': 
    'Create a dark gray stone floor and compare different Roughness values',
  '创建深灰石材地面，对比不同Roughness的效果': 
    'Create a dark gray stone floor and compare different Roughness values',
  '创建深胡桃木材质与浅木色对比效果': 
    'Create a dark walnut material and compare it with a light wood',
  '创建深胡桃木材质，与浅木色对比效果': 
    'Create a dark walnut material and compare it with light wood',
  '创建皮革材质赋予一个椅子模型对比有无NormalMap': 
    'Create a leather material, apply it to a chair, and compare with and without a Normal Map',
  '创建皮革材质，赋予一个椅子模型，对比有无Normal Map': 
    'Create a leather material, apply it to a chair, and compare with and without a Normal Map',
  '创建透明玻璃隔断测试在Eevee和Cycles下的效果': 
    'Create a clear glass partition and test it in EEVEE and Cycles',
  '创建透明玻璃隔断，测试在Eevee和Cycles下的效果': 
    'Create a clear glass partition and test it in EEVEE and Cycles',
  '导入大理石PBR贴图正确连接ColorRoughnessNormal通道': 
    'Import a marble PBR texture and connect the Color, Roughness, and Normal channels correctly',
  '导入大理石PBR贴图，正确连接Color/Roughness/Normal通道': 
    'Import a marble PBR texture and wire Color / Roughness / Normal correctly',
  '加载一个室外HDRI调整旋转角度让阳光从窗户方向进入': 
    'Load an outdoor HDRI and rotate it so sunlight comes through the window',
  '加载一个室外HDRI，调整旋转角度让阳光从窗户方向进入': 
    'Load an outdoor HDRI and rotate it so sunlight enters through the window',
  '在吊顶灯槽内放置Area灯调整大小和强度模拟灯带': 
    'Place an Area light inside the ceiling cove and adjust size and strength to simulate a strip',
  '在吊顶灯槽内放置Area灯，调整大小和强度模拟灯带': 
    'Place an Area light in the ceiling cove; adjust size and strength to simulate a strip',
  '在一个台灯模型内部放置Point灯调整强度和Radius': 
    'Place a Point light inside a table lamp and adjust intensity and Radius',
  '在一个台灯模型内部放置Point灯，调整强度和Radius': 
    'Place a Point light inside a table lamp model; adjust intensity and Radius',
  '在墙面放置3个Spot射灯45度向上洗墙': 
    'Place 3 Spot lights on the wall, 45° upward, as wall washers',
  '在墙面放置3个Spot射灯，45度向上洗墙': 
    'Place 3 Spot lights on the wall, aimed 45° up, as wall washers',
  '给吊顶灯槽内壁赋Emission材质模拟LED灯带': 
    'Assign an Emission material to the inner ceiling cove to simulate an LED strip',
  '给吊顶灯槽内壁赋Emission材质，模拟LED灯带': 
    'Assign an Emission material to the inner cove to simulate an LED strip',
  '在ShaderEditor中给材质加Emission节点': 
    'Add an Emission node to the material in the Shader Editor',
  '在Shader Editor中给材质加Emission节点': 
    'Add an Emission node to the material in the Shader Editor',
  '在室内场景中设置Sun调整角度让阳光穿过窗户照到地面': 
    'Set up a Sun in the interior scene and angle it so sunlight hits the floor through the window',
  '在室内场景中设置Sun，调整角度让阳光穿过窗户照到地面': 
    'Set up a Sun and angle it so sunlight crosses the window onto the floor',
  '在室内场景中用24mm拍摄正面全景构图': 
    'Shoot a frontal panorama with 24mm in the interior scene',
  '在室内场景中用28mm拍摄34角度构图': 
    'Shoot a 3/4 composition at 28mm in the interior scene',
  '在室内场景中用28mm拍摄3/4角度构图': 
    'Shoot a 3/4-angle composition at 28mm in the interior scene',
  '在室内场景中用35mm拍摄一个家具组合特写': 
    'Shoot a furniture-group close-up at 35mm in the interior scene',
  '在室内场景中用50mm拍摄一个家具单品特写': 
    'Shoot a single-furniture close-up at 50mm in the interior scene',
  '制作30帧Camera推进动画': 'Create a 30-frame camera push-in animation',
  '制作Camera移动动画': 'Create a camera move animation',
  '设计3个镜头并组合为120帧动画': 
    'Design 3 shots and combine them into a 120-frame animation',
  '制作一个房间的完整漫游视频': 
    'Produce a complete walkthrough video of one room (10s, 240 frames)',
  '制作一个房间的完整漫游视频(10秒, 240帧)': 
    'Produce a complete walkthrough of one room (10s, 240 frames)',
  '制作多房间穿越漫游视频': 
    'Produce a multi-room walkthrough video (30s, 720 frames)',
  '制作多房间穿越漫游视频(30秒, 720帧)': 
    'Produce a multi-room walkthrough (30s, 720 frames)',
  '完整建模一个办公室空间': 
    'Fully model an office space (5×6m with walls, ceiling, and floor)',
  '完整建模一个办公室空间(5×6m，含墙体/吊顶/地面)': 
    'Fully model an office space (5×6m, with walls / ceiling / floor)',
  '完整建模一个酒店客房空间': 
    'Fully model a hotel guest room space (4×5m)',
  '完整建模一个酒店客房空间(4×5m)': 
    'Fully model a hotel guest room (4×5m)',
  '建模带灯槽的吊顶': 'Model a ceiling with a light cove (2500 high, one cove ring)',
  '建模带灯槽的吊顶(2500高，留一圈灯槽)': 
    'Model a ceiling with a light cove (2500mm high, one cove ring)',
  '建模一面墙含门窗洞': 'Model a wall with door and window openings',
  '建模一面墙（含门窗洞）': 'Model a wall (with door and window openings)',
  '建模电视背景墙': 'Model a TV feature wall',
  '建模简单吊顶': 'Model a simple ceiling',
  '建模简单柜子': 'Model a simple cabinet',
  '建模办公桌': 'Model a desk',
  '建模床头柜': 'Model a nightstand',
  '建模一个办公室': 'Model an office',
  '建模一个酒店客房': 'Model a hotel guest room',
  '单体模型': 'Single object',
  '床头柜桌子柜子等单体家具建模': 
    'Modeling single pieces such as nightstands, desks, and cabinets',
  '床头柜、桌子、柜子等单体家具建模': 
    'Model single pieces — nightstands, desks, cabinets',
  '完整房间': 'Whole room',
  '完整办公室空间': 'A complete office space',
  '完整酒店客房': 'A complete hotel guest room',
  '完整项目': 'Complete project',
  '完整室内空间建模材质': 'Full interior modeling and materials',
  '完整室内空间建模+材质': 'Full interior modeling + materials',
  '建模材质基本灯光的完整办公室空间': 
    'A complete office space with modeling, materials, and basic lighting',
  '建模+材质+基本灯光的完整办公室空间': 
    'A complete office space with modeling + materials + basic lighting',
  '建模材质基本灯光的完整酒店客房': 
    'A complete hotel guest room with modeling, materials, and basic lighting',
  '建模+材质+基本灯光的完整酒店客房': 
    'A complete hotel guest room with modeling + materials + basic lighting',
  '完成材质': 'Finish materials',
  '完成灯光': 'Finish lighting',
  '完成所有材质': 'Finish all materials',
  '完成所有灯光': 'Finish all lighting',
  '完整室内效果图输出': 'Full interior render output',
  '完整室内漫游视频': 'Full interior walkthrough video',
  '完整室内漫游视频输出': 'Full interior walkthrough video output',
  '单房间漫游视频': 'Single-room walkthrough video',
  '多房间漫游视频': 'Multi-room walkthrough video',
  '输出效果图': 'Output the render',
  '输出室内漫游视频': 'Output the interior walkthrough video',
  '高采样降噪输出效果图': 'High samples + denoising, output the render',
  '高采样+降噪，输出效果图': 'High samples + denoising, then output the render',
  '从SU模型到Blender材质完善': 'From a SketchUp model to finished Blender materials',
  '从SU模型到Blender灯光设置': 'From a SketchUp model to Blender lighting',
  '从SU模型到BlenderCamera动画': 
    'From a SketchUp model to Blender camera animation',
  '从SU模型到Blender Camera动画': 
    'From a SketchUp model to Blender camera animation',
  '效果图工作流': 'Render workflow',
  '室内漫游视频工作流': 'Interior walkthrough video workflow',
  '从SU模型到Blender': 'From SketchUp to Blender',
}
