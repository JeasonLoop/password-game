// 科学知识规则 (~300 条组合)
export const scienceTemplates = [
  {
    id: 'sci_element_symbol',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含化学元素 {elem} 的符号',
    hint: '常见元素：H氢 He氦 C碳 N氮 O氧 Na钠 Fe铁 Cu铜 Ag银 Au金',
    params: {
      elem: ['H:氢','He:氦','Li:锂','Be:铍','B:硼','C:碳','N:氮','O:氧','F:氟','Ne:氖','Na:钠','Mg:镁','Al:铝','Si:硅','P:磷','S:硫','Cl:氯','Ar:氩','K:钾','Ca:钙','Fe:铁','Cu:铜','Zn:锌','Ag:银','Au:金','Sn:锡','Pb:铅','Hg:汞','Pt:铂','U:铀']
    },
    validate: (pwd, { elem }) => {
      const [symbol] = elem.split(':');
      return pwd.includes(symbol);
    }
  },
  {
    id: 'sci_element_name_en',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含化学元素的英文名 "{name}"',
    params: { name: [
      'hydrogen','helium','lithium','carbon','nitrogen','oxygen','fluorine','neon',
      'sodium','aluminum','silicon','sulfur','chlorine','argon','calcium',
      'iron','copper','zinc','silver','gold','tin','lead','mercury','platinum',
      'uranium','titanium','nickel','cobalt','manganese','chromium','vanadium',
      'radium','radon','xenon','krypton','bromine','iodine','phosphorus','boron',
    ] },
    validate: (pwd, { name }) => pwd.toLowerCase().includes(name)
  },
  {
    id: 'sci_planet',
    category: '科学',
    difficulty: 1,
    description: '密码中必须包含行星名 "{planet}"',
    params: { planet: [
      'Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune',
      '水星','金星','地球','火星','木星','土星','天王星','海王星','冥王星',
    ] },
    validate: (pwd, { planet }) => pwd.toLowerCase().includes(planet.toLowerCase())
  },
  {
    id: 'sci_constants',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含物理常数 "{name}" 的前 {n} 位',
    params: {
      name: ['圆周率π','自然常数e','黄金比例φ','光速c','普朗克常数h','阿伏伽德罗常数'],
      n: [2,3,4,5]
    },
    validate: (pwd, { name, n }) => {
      const constants = {
        '圆周率π': '31415926535',
        '自然常数e': '27182818284',
        '黄金比例φ': '16180339887',
        '光速c': '299792458',
        '普朗克常数h': '662607015',
        '阿伏伽德罗常数': '602214076',
      };
      return pwd.includes(constants[name].slice(0, n));
    }
  },
  {
    id: 'sci_moon_phase',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含月相名称',
    params: {},
    validate: (pwd) => {
      const phases = ['newmoon','fullmoon','crescent','gibbous','quarter','waxing','waning','新月','满月','弦月','凸月','朔','望'];
      return phases.some(p => pwd.toLowerCase().includes(p));
    }
  },
  {
    id: 'sci_dinosaur',
    category: '科学',
    difficulty: 1,
    description: '密码中必须包含恐龙名称',
    params: {},
    validate: (pwd) => {
      const dinos = [
        'trex','raptor','triceratops','stegosaurus','brachiosaurus','pterodactyl',
        'spinosaurus','ankylosaurus','diplodocus','allosaurus','parasaurolophus',
        '霸王龙','三角龙','剑龙','腕龙','翼龙','迅猛龙','甲龙','梁龙',
      ];
      return dinos.some(d => pwd.toLowerCase().includes(d));
    }
  },
  {
    id: 'sci_bones',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含人体骨骼名称',
    params: {},
    validate: (pwd) => {
      const bones = [
        'skull','spine','rib','femur','tibia','fibula','humerus','radius','ulna',
        'clavicle','scapula','pelvis','patella','sternum','vertebra','cranium',
        'mandible','maxilla','phalanges','carpal','tarsal','骷髅','脊椎','肋骨','股骨',
      ];
      return bones.some(b => pwd.toLowerCase().includes(b));
    }
  },
  {
    id: 'sci_unit',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含一个国际单位制(SI)单位符号',
    params: {},
    validate: (pwd) => {
      const units = ['m/s','kg','N','J','W','Pa','Hz','V','A','Ω','F','H','T','°C','K','mol','cd','lm','lx','Bq','Gy','Sv','kat'];
      return units.some(u => pwd.includes(u));
    }
  },
  {
    id: 'sci_programming_language',
    category: '科学',
    difficulty: 1,
    description: '密码中必须包含编程语言名称 "{lang}"',
    params: { lang: [
      'python','java','rust','golang','typescript','swift','kotlin','scala',
      'ruby','php','perl','haskell','erlang','elixir','clojure','lisp','scheme',
      'fortran','cobol','pascal','basic','lua','julia','dart','csharp','cpp','c++',
    ] },
    validate: (pwd, { lang }) => pwd.toLowerCase().includes(lang)
  },
  {
    id: 'sci_data_structure',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含数据结构名称',
    params: {},
    validate: (pwd) => {
      const ds = ['array','list','stack','queue','heap','tree','graph','hash','map','set','trie','b-tree','链表','栈','队列','堆','树','图','哈希','字典'];
      return ds.some(d => pwd.toLowerCase().includes(d));
    }
  },
  {
    id: 'sci_algorithm',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含经典算法名称',
    params: {},
    validate: (pwd) => {
      const algs = [
        'binarysearch','quicksort','mergesort','bubblesort','bfs','dfs',
        'dijkstra','floyd','kruskal','prim','backtracking','dynamic','greedy',
        '二分','快排','归并','冒泡','动态规划','贪心','回溯','分治',
      ];
      return algs.some(a => pwd.toLowerCase().includes(a));
    }
  },
  {
    id: 'sci_math_symbol',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含数学符号 {symbol}',
    params: { symbol: ['∞','∑','∏','∫','√','∝','∠','⊥','∥','△','∀','∃','∈','∪','∩','⊂','⊕','⊗','≈','≠','≤','≥','±','×','÷','∂','∇','ℕ','ℤ','ℚ','ℝ','ℂ'] },
    validate: (pwd, { symbol }) => pwd.includes(symbol)
  },
  {
    id: 'sci_geometry',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含几何形状名称',
    params: {},
    validate: (pwd) => {
      const shapes = [
        'triangle','square','rectangle','circle','sphere','cube','pyramid','cone',
        'cylinder','prism','torus','ellipse','parabola','hyperbola','rhombus',
        'trapezoid','hexagon','octagon','pentagon','dodecahedron','icosahedron',
        '三角形','正方形','圆形','球体','立方体','圆锥','圆柱','六边形','八边形',
      ];
      return shapes.some(s => pwd.toLowerCase().includes(s));
    }
  },

  // ━━━ 新增规则：扩展科学分类 ━━━

  {
    id: 'sci_color_code',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含一个颜色名称 "{color}"',
    params: { color: [
      'red','blue','green','yellow','orange','purple','pink','black','white',
      'gray','brown','cyan','magenta','indigo','violet','coral','teal','maroon',
      'navy','olive','crimson','scarlet','azure','ivory','khaki','lavender',
    ] },
    validate: (pwd, { color }) => pwd.toLowerCase().includes(color)
  },
  {
    id: 'sci_contains_color_hex',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含一个十六进制颜色代码（如 #FF0000, #abc）',
    hint: '十六进制颜色以 # 开头，如 #FF0000(红) #00FF00(绿) #0000FF(蓝)',
    params: {},
    validate: (pwd) => /#[0-9a-fA-F]{3,6}/.test(pwd)
  },
  {
    id: 'sci_scientist_name',
    category: '科学',
    difficulty: 1,
    description: '密码中必须包含一位著名科学家的姓氏',
    params: {},
    validate: (pwd) => {
      const scientists = [
        'einstein','newton','darwin','curie','hawking','tesla','galileo','pasteur',
        'bohr','feynman','planck','heisenberg','schrodinger','dirac','fermi',
        'rutherford','maxwell','faraday','mendel','watson','crick','turing',
        'lovelace','noether','roentgen','kelvin','joule','ohm','ampere','volt',
      ];
      return scientists.some(s => pwd.toLowerCase().includes(s));
    }
  },
  {
    id: 'sci_password_has_chemical_formula',
    category: '科学',
    difficulty: 3,
    description: '密码中必须包含一个化学分子式（如 H2O, CO2, NaCl）',
    hint: '化学分子式：H2O(水) CO2(二氧化碳) NaCl(食盐) CH4(甲烷)',
    params: {},
    validate: (pwd) => {
      const formulas = [
        'H2O','CO2','NaCl','CH4','C6H12O6','NaOH','HCl','H2SO4','NH3',
        'C2H5OH','CaCO3','Fe2O3','Al2O3','KMnO4','NaHCO3','Ca(OH)2',
        'HNO3','H3PO4','MgSO4','KCl','Na2SO4','CaCl2',
      ];
      return formulas.some(f => pwd.includes(f));
    }
  },
  {
    id: 'sci_si_prefix',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含至少 {n} 种 SI 国际单位制前缀',
    hint: 'SI前缀：kilo(千) mega(兆) giga(吉) milli(毫) micro(微) nano(纳) pico(皮)',
    params: { n: [2, 3] },
    validate: (pwd, { n }) => {
      const prefixes = ['kilo','mega','giga','tera','peta','milli','micro','nano','pico','femto','atto','centi','deci','hecto','deca'];
      const lower = pwd.toLowerCase();
      const found = prefixes.filter(p => lower.includes(p));
      return found.length >= n;
    }
  },
];
