// 补充规则模板 — 高产量参数化规则，确保总规则数 ≥ 3000
import { isValidRoman, romanToInt } from './utils.js';

export const bonusTemplates = [
  // ═══ 更多数学规则 ═══
  {
    id: 'math_bonus_sum_equals_double',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字之和的两倍必须等于 {target}',
    params: { target: [20,30,40,50,60,70,80,90,100,120,140,160,180,200] },
    validate: (pwd, { target }) => {
      const sum = (pwd.match(/\d/g) || []).reduce((a,b) => a + +b, 0);
      return sum * 2 === target;
    }
  },
  {
    id: 'math_bonus_digit_difference',
    category: '数学',
    difficulty: 2,
    description: '密码中最大数字与最小数字之差必须为 {diff}',
    params: { diff: [3,4,5,6,7,8,9] },
    validate: (pwd, { diff }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < 2) return false;
      return Math.max(...digits) - Math.min(...digits) === diff;
    }
  },
  {
    id: 'math_bonus_has_cube',
    category: '数学',
    difficulty: 3,
    description: '密码中必须包含一个立方数（如 8, 27, 64, 125...）',
    params: {},
    validate: (pwd) => {
      const cubes = new Set([1,8,27,64,125,216,343,512,729,1000,1331,1728,2197,2744,3375,4096,4913,5832,6859,8000,9261]);
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => cubes.has(parseInt(n)));
    }
  },
  {
    id: 'math_bonus_digit_mod',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字之和对 {mod} 取模必须等于 {rem}',
    params: { mod: [3,4,5,7,9], rem: [0,1,2] },
    validate: (pwd, { mod, rem }) => {
      const sum = (pwd.match(/\d/g) || []).reduce((a,b) => a + +b, 0);
      return sum % mod === rem;
    }
  },
  {
    id: 'math_bonus_consecutive_sum',
    category: '数学',
    difficulty: 3,
    description: '密码中的数字必须是连续整数之和（如 15=1+2+3+4+5 或 15=7+8）',
    params: {},
    validate: (pwd) => {
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => {
        const val = parseInt(n);
        if (val < 3) return false;
        for (let start = 1; start < val; start++) {
          let sum = 0;
          for (let i = start; sum < val; i++) sum += i;
          if (sum === val) return true;
        }
        return false;
      });
    }
  },
  {
    id: 'math_bonus_digit_frequency',
    category: '数学',
    difficulty: 2,
    description: '密码中出现最频繁的数字必须是 {d}',
    params: { d: [1,2,3,5,7,8,9] },
    validate: (pwd, { d }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length === 0) return false;
      const freq = {};
      digits.forEach(x => { freq[x] = (freq[x]||0)+1; });
      let maxFreq = 0, maxDigit = -1;
      for (const [digit, count] of Object.entries(freq)) {
        if (count > maxFreq) { maxFreq = count; maxDigit = parseInt(digit); }
      }
      return maxDigit === d;
    }
  },

  // ═══ 更多字符串规则 ═══
  {
    id: 'str_bonus_must_contain_digit',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含阿拉伯数字 {d}',
    params: { d: [0,1,2,3,4,5,6,7,8,9] },
    validate: (pwd, { d }) => pwd.includes(String(d))
  },
  {
    id: 'str_bonus_must_not_contain_digit',
    category: '字符串',
    difficulty: 1,
    description: '密码中不能包含阿拉伯数字 {d}',
    params: { d: [0,1,2,3,4,5,6,7,8,9] },
    validate: (pwd, { d }) => !pwd.includes(String(d))
  },
  {
    id: 'str_bonus_even_length',
    category: '字符串',
    difficulty: 1,
    description: '密码长度必须是偶数',
    params: {},
    validate: (pwd) => pwd.length % 2 === 0 && pwd.length > 0
  },
  {
    id: 'str_bonus_odd_length',
    category: '字符串',
    difficulty: 1,
    description: '密码长度必须是奇数',
    params: {},
    validate: (pwd) => pwd.length % 2 === 1
  },
  {
    id: 'str_bonus_contains_special',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含特殊符号 "{sym}"',
    params: { sym: ['@','#','$','%','&','*','+','=','!','?','~','^','<','>','/','\\','|','`'] },
    validate: (pwd, { sym }) => pwd.includes(sym)
  },
  {
    id: 'str_bonus_capitalize_each_word',
    category: '字符串',
    difficulty: 3,
    description: '密码中每个单词的首字母必须大写',
    params: {},
    validate: (pwd) => {
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      if (words.length === 0) return false;
      return words.every(w => w[0] === w[0].toUpperCase());
    }
  },
  {
    id: 'str_bonus_ascii_art',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含颜文字 "{face}"',
    params: { face: [
      '(^_^)','(T_T)','(>_<)','(O_O)','(=_=)','(^o^)','(-_-)','(;_;)',
      ':)',':D',':(',':P',':O',';)','XD',':3','>:(',':v',':*',':<','>:(',
      'OwO','UwU','TwT','QwQ','PwP','>w<','^w^','-w-',
    ] },
    validate: (pwd, { face }) => pwd.includes(face)
  },
  {
    id: 'str_bonus_alphabetical_order',
    category: '字符串',
    difficulty: 2,
    description: '密码中的英文字母必须按字母表顺序排列',
    params: {},
    validate: (pwd) => {
      const letters = (pwd.match(/[a-zA-Z]/g) || []).map(l => l.toLowerCase());
      if (letters.length < 2) return true;
      for (let i = 1; i < letters.length; i++) {
        if (letters[i] < letters[i-1]) return false;
      }
      return true;
    }
  },
  {
    id: 'str_bonus_reverse_alphabetical',
    category: '字符串',
    difficulty: 2,
    description: '密码中的英文字母必须按字母表逆序排列',
    params: {},
    validate: (pwd) => {
      const letters = (pwd.match(/[a-zA-Z]/g) || []).map(l => l.toLowerCase());
      if (letters.length < 2) return true;
      for (let i = 1; i < letters.length; i++) {
        if (letters[i] > letters[i-1]) return false;
      }
      return true;
    }
  },

  // ═══ 更多罗马数字规则 ═══
  {
    id: 'roman_bonus_sum_gt',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中所有罗马数字的值之和必须大于 {n}',
    params: { n: [10,20,30,50,100,200] },
    validate: (pwd, { n }) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      let sum = 0;
      for (const m of matches) {
        if (isValidRoman(m)) sum += romanToInt(m);
      }
      return sum > n;
    }
  },
  {
    id: 'roman_bonus_prefix',
    category: '罗马数字',
    difficulty: 2,
    description: '密码的前{n}个字符必须是有效的罗马数字',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => {
      if (pwd.length < n) return false;
      return isValidRoman(pwd.slice(0, n));
    }
  },

  // ═══ 更多图案规则 ═══
  {
    id: 'pat_bonus_contains_abba',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含 ABBA 模式（如 deed, noon, 1221）',
    params: {},
    validate: (pwd) => {
      for (let i = 0; i <= pwd.length - 4; i++) {
        if (pwd[i] === pwd[i+3] && pwd[i+1] === pwd[i+2] && pwd[i] !== pwd[i+1]) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_bonus_chiasm',
    category: '图案',
    difficulty: 3,
    description: '密码中必须包含交叉结构（如 a b b a 或 1 2 2 1）',
    params: {},
    validate: (pwd) => {
      for (let i = 0; i <= pwd.length - 4; i++) {
        const [a,b,c,d] = [pwd[i],pwd[i+1],pwd[i+2],pwd[i+3]];
        if (a === d && b === c && a !== b) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_bonus_strictly_increasing_numbers',
    category: '图案',
    difficulty: 3,
    description: '密码中的数字串必须严格递增（每个数字比前一个大）',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < 2) return true;
      for (let i = 1; i < digits.length; i++) {
        if (digits[i] <= digits[i-1]) return false;
      }
      return true;
    }
  },
  {
    id: 'pat_bonus_v_shape',
    category: '图案',
    difficulty: 3,
    description: '密码的数字部分必须呈 V 字形（先降后升），至少{n}个数字',
    params: { n: [4,5,6] },
    validate: (pwd, { n }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < n) return false;
      for (let i = 0; i <= digits.length - n; i++) {
        const sub = digits.slice(i, i + n);
        let minIdx = 0;
        for (let j = 1; j < sub.length; j++) {
          if (sub[j] < sub[minIdx]) minIdx = j;
        }
        if (minIdx === 0 || minIdx === sub.length - 1) continue;
        let ok = true;
        for (let j = 1; j <= minIdx; j++) if (sub[j] >= sub[j-1]) ok = false;
        for (let j = minIdx + 1; j < sub.length; j++) if (sub[j] <= sub[j-1]) ok = false;
        if (ok) return true;
      }
      return false;
    }
  },

  // ═══ 更多 Emoji 规则 ═══
  {
    id: 'emoji_bonus_contains_unicode_block',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含 {block} 字符',
    params: { block: ['箭头','星号','扑克牌','音符','勾叉','圆圈数字','方框','天气符号'] },
    validate: (pwd, { block }) => {
      const blocks = {
        '箭头': ['→','←','↑','↓','↔','↕','↖','↗','↘','↙','➡','⬅','⬆','⬇','⤴','⤵'],
        '星号': ['★','☆','✦','✧','✩','✪','✫','✬','✭','✮','✯','✰','🌟','⭐','💫','✨'],
        '扑克牌': ['♠','♡','♢','♣','♤','♥','♦','♧','🂡','🂱','🃁','🃑'],
        '音符': ['♪','♫','♬','♩','♭','♮','♯','🎵','🎶','🎼','🎤','🎧'],
        '勾叉': ['✓','✔','✗','✘','☐','☑','☒','○','●','◯','✅','❌','⭕','❎'],
        '圆圈数字': ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','❶','❷','❸','❹','❺'],
        '方框': ['■','□','▣','▤','▥','▦','▧','▨','▩','▪','▫','▬','▭','▮','▯'],
        '天气符号': ['☀','☁','☂','☃','☄','★','☆','☇','☈','☉','☊','☋','☌','☍'],
      };
      return (blocks[block] || []).some(s => pwd.includes(s));
    }
  },
  {
    id: 'emoji_bonus_contains_dingbats',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个装饰符号（dingbat）',
    params: {},
    validate: (pwd) => /[❦❧☙❥❣✿❀✾❁❃❋✽✼✻✺✹✸✷✶✵✴]/u.test(pwd)
  },
  {
    id: 'emoji_bonus_contains_cjk_symbol',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个中文符号',
    params: {},
    validate: (pwd) => /[。，！？…「」『』【】《》；：、～｜〃々]/u.test(pwd)
  },

  // ═══ 更多象棋规则 ═══
  {
    id: 'chess_bonus_both_colors',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须同时包含白色和黑色棋子',
    params: {},
    validate: (pwd) => /[♔♕♖♗♘♙]/.test(pwd) && /[♚♛♜♝♞♟]/.test(pwd)
  },
  {
    id: 'chess_bonus_piece_pair',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一对同类型不同颜色的棋子（如 ♔ 和 ♚）',
    params: {},
    validate: (pwd) => {
      const pairs = [['♔','♚'],['♕','♛'],['♖','♜'],['♗','♝'],['♘','♞'],['♙','♟']];
      return pairs.some(([w,b]) => pwd.includes(w) && pwd.includes(b));
    }
  },
  {
    id: 'chess_bonus_rank',
    category: '象棋',
    difficulty: 2,
    description: '密码中必须包含一个涉及第 {rank} 横排的棋谱记法',
    params: { rank: [1,2,3,4,5,6,7,8] },
    validate: (pwd, { rank }) => {
      return new RegExp(`[a-h]${rank}\\b|[a-h]x[a-h]${rank}|[KQRBN][a-h]?${rank}`, 'i').test(pwd);
    }
  },

  // ═══ 更多科学规则 ═══
  {
    id: 'sci_bonus_nobel_prize',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含诺贝尔奖类别',
    params: {},
    validate: (pwd) => {
      const prizes = ['physics','chemistry','medicine','literature','peace','economics','物理','化学','医学','文学','和平','经济'];
      return prizes.some(p => pwd.toLowerCase().includes(p));
    }
  },
  {
    id: 'sci_bonus_amino_acid',
    category: '科学',
    difficulty: 3,
    description: '密码中必须包含一个氨基酸的三字母缩写',
    params: {},
    validate: (pwd) => {
      const aas = ['Ala','Arg','Asn','Asp','Cys','Gln','Glu','Gly','His','Ile','Leu','Lys','Met','Phe','Pro','Ser','Thr','Trp','Tyr','Val'];
      return aas.some(aa => pwd.includes(aa));
    }
  },
  {
    id: 'sci_bonus_cloud_type',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含云的类型名称',
    params: {},
    validate: (pwd) => {
      const clouds = ['cumulus','stratus','cirrus','nimbus','cumulonimbus','altostratus','cirrostratus','cirrocumulus','积云','层云','卷云','雨云'];
      return clouds.some(c => pwd.toLowerCase().includes(c));
    }
  },
  {
    id: 'sci_bonus_greek_letter',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含希腊字母 "{letter}"',
    params: { letter: ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω'] },
    validate: (pwd, { letter }) => pwd.includes(letter)
  },

  // ═══ 更多文字游戏规则 ═══
  {
    id: 'word_bonus_oxymoron',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含一个矛盾修辞法（如 bittersweet, deafening silence）',
    params: {},
    validate: (pwd) => {
      const oxymorons = [
        'bittersweet','deafening','silence','livingdead','actnaturally',
        'awfullygood','biggermini','clearlyconfused','constantchange',
        'darklight','foundmissing','genuineimitation','goodgrief',
        'growingmini','historicalpresent','icyhot','increasinglyless',
        'jumboshrimp','liquidgas','lonegrouo','minorcatastrophe',
        'oldnews','onlychoice','open secret','original copy',
        'painfullybeautiful','passiveaggressive','peaceforc',
        'plasticglass','privatestate','randomorder','recordedlive',
        'resident alien','samesimilarity','seriouslyfunny','silent scream',
        'smallcrowd','softwarehardware','studentteacher','sweet sorrow',
        'terriblygood','truefiction','unbiasedopinion','virtualreality',
        'workingvacation','littlegiant','militaryintelligence',
        '残酷的温柔','甜蜜的痛苦','喧嚣的寂静','寒冷的火焰','热闹的孤独',
        '清醒的梦','善意的谎言','平凡的奇迹','温柔的暴力','美丽的错误',
      ];
      return oxymorons.some(o => pwd.toLowerCase().includes(o.replace(/\s/g, '')));
    }
  },
  {
    id: 'word_bonus_onomatopoeia',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含一个拟声词',
    params: {},
    validate: (pwd) => {
      const sounds = [
        'boom','bang','crash','splash','sizzle','buzz','hiss','pop','crack',
        'snap','tick','tock','ding','dong','clang','clink','thud','whack',
        'zoom','whoosh','swish','plop','drip','drop','chirp','tweet','roar',
        '轰','啪','哗啦','咔嚓','咚咚','当当','嗡嗡','嗖','噗通','滴滴',
      ];
      return sounds.some(s => pwd.toLowerCase().includes(s));
    }
  },
  {
    id: 'word_bonus_tongue_twister',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含一个绕口令片段（重复辅音/元音模式）',
    params: {},
    validate: (pwd) => {
      const twisters = [
        'peterpiper','she sells','woodchuck','seashells',
        'howmuchwood','fuzzywuzzy','sallysells','red lorry',
        'irish wristwatch','toy boat','unique new york',
        '吃葡萄不吐葡萄皮','四是四','黑化肥',
      ];
      return twisters.some(t => pwd.toLowerCase().includes(t.replace(/\s/g, '')));
    }
  },
  {
    id: 'word_bonus_palindrome_sentence',
    category: '文字游戏',
    difficulty: 3,
    description: '密码中必须包含一个回文短语的关键词（如 racecar, madam, noon）',
    params: {},
    validate: (pwd) => {
      const pals = ['racecar','madam','noon','civic','radar','level','rotor','kayak','refer','deified','reviver','repaper','tenet','solos','stats'];
      return pals.some(p => pwd.toLowerCase().includes(p));
    }
  },
  {
    id: 'word_bonus_contains_roman_suffix',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含罗马数字序号（如 I, II, III, IV...）',
    params: {},
    validate: (pwd) => {
      const numerals = [' I',' II',' III',' IV',' V',' VI',' VII',' VIII',' IX',' X','XI','XII','XIII','XIV','XV'];
      return numerals.some(n => pwd.toUpperCase().includes(n));
    }
  },
  {
    id: 'word_bonus_contains_day_name',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含星期 "{day}"',
    params: { day: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','星期一','星期二','星期三','星期四','星期五','星期六','星期日'] },
    validate: (pwd, { day }) => pwd.toLowerCase().includes(day.toLowerCase())
  },
  {
    id: 'word_bonus_contains_month_name',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含月份 "{month}"',
    params: { month: ['January','February','March','April','May','June','July','August','September','October','November','December','一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'] },
    validate: (pwd, { month }) => pwd.toLowerCase().includes(month.toLowerCase())
  },

  // ═══ 杂项趣味规则 ═══
  {
    id: 'misc_bonus_contains_magic_word',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含魔法咒语 "{spell}"',
    params: { spell: [
      'abracadabra','alakazam','hocuspocus','presto','shazam',
      'expelliarmus','expectopatronum','avadakedavra','lumos','nox',
      'wingardiumleviosa','alohomora','accio','crucio','imperio',
      'open sesame','bibbidibobbidi','simsalabim',
    ] },
    validate: (pwd, { spell }) => pwd.toLowerCase().includes(spell.replace(/\s/g, ''))
  },
  {
    id: 'misc_bonus_contains_mythical',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含神话生物名称',
    params: {},
    validate: (pwd) => {
      const mythical = [
        'dragon','phoenix','unicorn','pegasus','griffin','mermaid','centaur',
        'minotaur','hydra','chimera','kraken','sphinx','cyclops','cerberus',
        'medusa','yeti','bigfoot','nessie','chupacabra','wendigo','banshee',
        '龙','凤凰','麒麟','饕餮','貔貅','玄武','朱雀','白虎','青龙','九尾狐',
      ];
      return mythical.some(m => pwd.toLowerCase().includes(m));
    }
  },
  {
    id: 'misc_bonus_contains_band',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含知名乐队/歌手的名字',
    params: {},
    validate: (pwd) => {
      const artists = [
        'beatles','queen','pinkfloyd','ledzeppelin','acdc','metallica',
        'nirvana','u2','coldplay','radiohead','oasis','blur','gorillaz',
        'davidbowie','elvis','mj','madonna','beyonce','taylorswift',
        'eminem','drake','kendrick','weeknd','brunomars','edsheeran',
        'bts','blackpink','周杰伦','张学友','邓丽君','王菲','陈奕迅',
      ];
      return artists.some(a => pwd.toLowerCase().includes(a));
    }
  },
  {
    id: 'misc_bonus_prime_meridian',
    category: '科学',
    difficulty: 2,
    description: '密码中必须包含经纬度信息（如 30°N 120°E）',
    params: {},
    validate: (pwd) => /\\d+°[NSEW]/.test(pwd) || /\\d+度[北南东西]/.test(pwd)
  },
];
