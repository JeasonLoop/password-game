// 最终规则扩展 — 补齐至 3000+
export const finalTemplates = [
  // 密码以两个特定字符开始
  {
    id: 'final_starts_with_two',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以 "{prefix}" 开头',
    params: { prefix: [
      'ab','ac','ad','af','ag','al','am','an','ap','ar','as','at',
      'ba','be','bi','bl','bo','br','bu','ca','ce','ch','ci','cl','co','cr','cu',
      'da','de','di','do','dr','du','ea','el','em','en','er','es','et','ev','ex',
      'fa','fe','fi','fl','fo','fr','fu','ga','ge','gi','gl','go','gr','gu',
      'ha','he','hi','ho','hu','im','in','ir','ja','je','jo','ju','ka','ke','ki',
      'la','le','li','lo','lu','ma','me','mi','mo','mu','na','ne','ni','no','nu',
      'pa','pe','pi','pl','po','pr','pu','qu','ra','re','ri','ro','ru',
      'sa','se','sh','si','sl','sm','sn','so','sp','st','su','sw',
      'ta','te','th','ti','to','tr','tu','tw','un','up','va','ve','vi','vo',
      'wa','we','wh','wi','wo','wr','ye','yo','ze','zo','12','21','34','43',
      '56','65','78','87','90','09','11','22','33','44','55','66','77','88','99',
    ] },
    validate: (pwd, { prefix }) => pwd.toLowerCase().startsWith(prefix)
  },

  // 密码以两个特定字符结尾
  {
    id: 'final_ends_with_two',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以 "{suffix}" 结尾',
    params: { suffix: [
      'ed','er','es','et','al','an','ar','as','at',
      'ce','ch','ck','de','ds','ee','el','en','es','et',
      'gs','ic','ie','in','is','it','ke','ks','ld','le','ll','ly',
      'me','ms','nd','ne','ng','ns','nt','ny','od','of','ok','ol','on','or','os','ot','ow',
      'ps','rd','re','rs','rt','ry','se','sh','sk','ss','st',
      'te','th','ts','ty','ue','um','up','us','ut','ve',
      'wn','ws','ye','ys','ze','0','1','2','3','4','5','6','7','8','9',
      '00','11','22','33','44','55','66','77','88','99','01','23','45','67','89',
    ] },
    validate: (pwd, { suffix }) => pwd.toLowerCase().endsWith(suffix)
  },

  // 密码包含特定的三字母组合
  {
    id: 'final_contains_three',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含 "{seq}"',
    params: { seq: [
      'ing','ion','ent','est','and','the','for','are','ate','ive',
      'ous','ble','ant','ary','cal','con','com','des','dis','ence',
      'ian','ial','ile','ine','ise','ish','ism','ist','ity','ive',
      'log','men','min','mis','non','one','ory','our','out','ous',
      'per','phy','ple','pre','pro','rea','rec','red','ree','res',
      'son','sub','ter','tic','tin','tor','tra','tri','tun','tur',
      'ual','und','uni','ure','ven','ver','vin','wil','wor','ous',
      '000','111','222','333','444','555','666','777','888','999',
      '123','234','345','456','567','678','789','890','987','876',
      '765','654','543','432','321','210','101','202','303','404',
      '505','606','707','808','909','135','246','357','468','579',
      'abc','bcd','cde','def','efg','fgh','ghi','hij','ijk','jkl',
      'klm','lmn','mno','nop','opq','pqr','qrs','rst','stu','tuv',
      'uvw','vwx','wxy','xyz','zyx','wvu','tsr','rqp','pon',
      'qaz','wsx','edc','rfv','tgb','yhn','ujm','iko','plm','okm',
      'ijn','uhb','ygv','tfc','rdx','esz','waq','zaq','xsw','cde',
      'vfr','bgt','nhy','mju','ki9','lo0','pa1','sw2','de3','fr4',
    ] },
    validate: (pwd, { seq }) => pwd.toLowerCase().includes(seq)
  },

  // 数学：数字的特定数量关系
  {
    id: 'final_digit_relations',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字的 {op} 必须等于 {target}',
    params: { op: ['和','积'], target: [15,20,25,30,35,40,45,50,60,70,80,90,100,120,150,200,250,300,400,500] },
    validate: (pwd, { op, target }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length === 0) return false;
      if (op === '和') return digits.reduce((a,b) => a + b, 0) === target;
      return digits.reduce((a,b) => a * b, 1) === target;
    }
  },

  // 必须包含指定数量的某类字符
  {
    id: 'final_char_type_count',
    category: '字符串',
    difficulty: 2,
    description: '密码中{type}的数量必须恰好为 {n}',
    params: { type: ['大写字母','小写字母','数字','空格','标点符号'], n: [0,1,2,3,4,5] },
    validate: (pwd, { type, n }) => {
      const patterns = {
        '大写字母': /[A-Z]/g,
        '小写字母': /[a-z]/g,
        '数字': /\d/g,
        '空格': /\s/g,
        '标点符号': /[.,!?;:'"()\-_\[\]{}@#$%^&*+=/\\|~`<>]/g,
      };
      return (pwd.match(patterns[type]) || []).length === n;
    }
  },

  // 密码中包含特定长度的纯字母单词
  {
    id: 'final_word_of_length',
    category: '字符串',
    difficulty: 2,
    description: '密码中必须包含一个恰好为 {n} 个字母的单词',
    params: { n: [3,4,5,6,7,8,9,10,11,12,13,14,15] },
    validate: (pwd, { n }) => {
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      return words.some(w => w.length === n);
    }
  },
  {
    id: 'final_contains_certain_letter_n_times',
    category: '字符串',
    difficulty: 2,
    description: '密码中字母 "{letter}" 必须恰好出现 {n} 次',
    params: { letter: ['a','e','i','o','u','s','t','r','n','l','c','d','m','p','b'], n: [1,2,3,4] },
    validate: (pwd, { letter, n }) => {
      const regex = new RegExp(letter, 'gi');
      return (pwd.match(regex) || []).length === n;
    }
  },
  {
    id: 'final_consecutive_different_types',
    category: '字符串',
    difficulty: 3,
    description: '密码中必须连续包含 {n} 个不同类型的字符（字母/数字/符号各不同）',
    params: { n: [3,4,5] },
    validate: (pwd, { n }) => {
      function type(c) {
        if (/[a-zA-Z]/.test(c)) return 'L';
        if (/\d/.test(c)) return 'D';
        return 'S';
      }
      for (let i = 0; i <= pwd.length - n; i++) {
        const types = new Set();
        for (let j = 0; j < n; j++) types.add(type(pwd[i+j]));
        if (types.size === n) return true;
      }
      return false;
    }
  },
  {
    id: 'final_no_two_consecutive_same_type',
    category: '字符串',
    difficulty: 2,
    description: '密码中不能有连续两个同一类型的字符（数字-数字、字母-字母等）',
    params: {},
    validate: (pwd) => {
      function type(c) {
        if (/[a-zA-Z]/.test(c)) return 'L';
        if (/\d/.test(c)) return 'D';
        return 'S';
      }
      for (let i = 1; i < pwd.length; i++) {
        if (type(pwd[i]) === type(pwd[i-1])) return false;
      }
      return pwd.length > 1;
    }
  },
  {
    id: 'final_contains_math_operation',
    category: '数学',
    difficulty: 2,
    description: '密码中必须包含一个算式（如 "2+3" 或 "5*6"）',
    params: {},
    validate: (pwd) => /\d+\s*[+\-*/]\s*\d+/.test(pwd)
  },

  // 密码中包含某个罗马数字对应值
  {
    id: 'final_roman_value_in_range',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中的罗马数字最大表示的数字必须介于 {min} 到 {max} 之间',
    params: { min: [10,20,50,100], max: [50,100,200,500] },
    validate: (pwd, { min, max }) => {
      const ROMAN_MAP = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
      const ROMAN_VALID_REGEX = /^(M{0,4})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
      function ivr(s) { return ROMAN_VALID_REGEX.test(s.toUpperCase()); }
      function rti(s) {
        let t=0; const u=s.toUpperCase();
        for(let i=0;i<u.length;i++){const c=ROMAN_MAP[u[i]]||0,n=ROMAN_MAP[u[i+1]]||0;t+=c<n?-c:c;}
        return t;
      }
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      const vals = matches.filter(m => ivr(m)).map(m => rti(m));
      if (vals.length === 0) return false;
      const maxVal = Math.max(...vals);
      return maxVal >= min && maxVal <= max;
    }
  },
];
