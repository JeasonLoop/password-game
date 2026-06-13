// 字符串规则 (~500 条组合)
export const stringTemplates = [
  {
    id: 'str_must_contain_char',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含字母 "{ch}"（不区分大小写）',
    params: { ch: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'] },
    validate: (pwd, { ch }) => pwd.toLowerCase().includes(ch)
  },
  {
    id: 'str_must_not_contain_char',
    category: '字符串',
    difficulty: 1,
    description: '密码中不能包含字母 "{ch}"（不区分大小写）',
    params: { ch: ['a','e','i','o','u','s','t','r','n','l'] },
    validate: (pwd, { ch }) => !pwd.toLowerCase().includes(ch)
  },
  {
    id: 'str_starts_with',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以 "{prefix}" 开头',
    params: { prefix: ['ab','go','pa','sw','su','co','pr','de','re','un','in','ex','my','no','ok','hi','he','lo','wo','th','ba','la','ma','ca','fa'] },
    validate: (pwd, { prefix }) => pwd.toLowerCase().startsWith(prefix)
  },
  {
    id: 'str_ends_with',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以 "{suffix}" 结尾',
    params: { suffix: ['ed','er','ly','ty','le','ng','ck','ss','sh','ch','th','gh','nt','st','rd','nd','ry','ge','ve','ze','me','te','se','de','re','ce','pe','ke','ne','be'] },
    validate: (pwd, { suffix }) => pwd.toLowerCase().endsWith(suffix)
  },
  {
    id: 'str_contains_word',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含单词 "{word}"（不区分大小写）',
    params: { word: ['love','fire','star','moon','dark','code','game','play','blue','gold','zero','hero','king','rose','time','life','home','hope','wind','rain','wolf','lion','bear','hawk','iron','rock','snow','wave','dusk'] },
    validate: (pwd, { word }) => pwd.toLowerCase().includes(word)
  },
  {
    id: 'str_exact',
    category: '字符串',
    difficulty: 1,
    description: '密码的长度必须恰好为 {n} 个字符',
    params: { n: [6,7,8,9,10,11,12,13,14,15,16,18,20,22,25,30] },
    validate: (pwd, { n }) => pwd.length === n
  },
  {
    id: 'str_min_length',
    category: '字符串',
    difficulty: 1,
    description: '密码的长度必须至少为 {n} 个字符',
    params: { n: [8,10,12,15,18,20] },
    validate: (pwd, { n }) => pwd.length >= n
  },
  {
    id: 'str_max_length',
    category: '字符串',
    difficulty: 1,
    description: '密码的长度不能超过 {n} 个字符',
    params: { n: [8,10,12,15] },
    validate: (pwd, { n }) => pwd.length <= n
  },
  {
    id: 'str_vowel_count',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个元音字母 (a e i o u)',
    params: { n: [1,2,3,4,5,6,7,8,10] },
    validate: (pwd, { n }) => {
      const v = (pwd.match(/[aeiouAEIOU]/g) || []).length;
      return { passed: v === n, detail: v === n ? null : `找到 ${v} 个元音` };
    }
  },
  {
    id: 'str_consonant_count',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个辅音字母',
    params: { n: [2,3,4,5,6,7,8,10,12] },
    validate: (pwd, { n }) => {
      const c = (pwd.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
      return { passed: c === n, detail: c === n ? null : `找到 ${c} 个辅音` };
    }
  },
  {
    id: 'str_more_vowels_than_consonants',
    category: '字符串',
    difficulty: 2,
    description: '密码中元音字母的数量必须大于辅音字母',
    params: {},
    validate: (pwd) => {
      const v = (pwd.match(/[aeiouAEIOU]/g) || []).length;
      const c = (pwd.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
      return v > c && v > 0;
    }
  },
  {
    id: 'str_more_consonants_than_vowels',
    category: '字符串',
    difficulty: 2,
    description: '密码中辅音字母的数量必须大于元音字母',
    params: {},
    validate: (pwd) => {
      const v = (pwd.match(/[aeiouAEIOU]/g) || []).length;
      const c = (pwd.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
      return c > v && c > 0;
    }
  },
  {
    id: 'str_no_vowels',
    category: '字符串',
    difficulty: 2,
    description: '密码中不能包含任何元音字母 (a e i o u)',
    params: {},
    validate: (pwd) => !/[aeiouAEIOU]/.test(pwd)
  },
  {
    id: 'str_alpha_count',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个字母',
    params: { n: [2,3,4,5,6,7,8,10,12] },
    validate: (pwd, { n }) => (pwd.match(/[a-zA-Z]/g) || []).length === n
  },
  {
    id: 'str_uppercase_count',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个大写字母',
    params: { n: [1,2,3,4,5] },
    validate: (pwd, { n }) => (pwd.match(/[A-Z]/g) || []).length === n
  },
  {
    id: 'str_lowercase_count',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个小写字母',
    params: { n: [2,3,4,5,6,7,8,10] },
    validate: (pwd, { n }) => (pwd.match(/[a-z]/g) || []).length === n
  },
  {
    id: 'str_alternating_case',
    category: '字符串',
    difficulty: 3,
    description: '密码中的字母大小写必须交替出现（如 AbCdEf）',
    params: {},
    validate: (pwd) => {
      const letters = pwd.match(/[a-zA-Z]/g);
      if (!letters || letters.length < 2) return false;
      for (let i = 1; i < letters.length; i++) {
        const prev = letters[i-1] === letters[i-1].toUpperCase();
        const curr = letters[i] === letters[i].toUpperCase();
        if (prev === curr) return false;
      }
      return true;
    }
  },
  {
    id: 'str_no_uppercase',
    category: '字符串',
    difficulty: 2,
    description: '密码中不能包含任何大写字母',
    params: {},
    validate: (pwd) => !/[A-Z]/.test(pwd)
  },
  {
    id: 'str_no_lowercase',
    category: '字符串',
    difficulty: 2,
    description: '密码中不能包含任何小写字母',
    params: {},
    validate: (pwd) => !/[a-z]/.test(pwd)
  },
  {
    id: 'str_special_char_count',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个特殊字符',
    params: { n: [1,2,3,4,5] },
    validate: (pwd, { n }) => (pwd.match(/[^a-zA-Z0-9]/g) || []).length === n
  },
  {
    id: 'str_no_repeated_chars',
    category: '字符串',
    difficulty: 3,
    description: '同一字符在密码中不能连续出现超过 {n} 次',
    params: { n: [2,3] },
    validate: (pwd, { n }) => !new RegExp(`(.)\\1{${n}}`).test(pwd)
  },
  {
    id: 'str_all_chars_unique',
    category: '字符串',
    difficulty: 3,
    description: '密码中所有字符都必须唯一（不能有重复字符）',
    params: {},
    validate: (pwd) => new Set(pwd.split('')).size === pwd.length
  },
  {
    id: 'str_contains_substring',
    category: '字符串',
    difficulty: 2,
    description: '密码中必须包含子串 "{sub}"',
    params: { sub: ['abc','xyz','qwe','asd','zxc','123','qaz','wsx','edc','rfv','tgb','yhn','ujm','pol','iko','wer','sdf','xcv','ert','dfg','cvb','fgh','vbn','tyu','ghj','bnm'] },
    validate: (pwd, { sub }) => pwd.toLowerCase().includes(sub)
  },
  {
    id: 'str_ascii_only',
    category: '字符串',
    difficulty: 2,
    description: '密码只能包含 ASCII 字符',
    hint: 'ASCII = 键盘能直接打出的字符\n允许：英文 A-Z a-z、数字 0-9、!@#$% 等符号\n不允许：中文、Emoji、全角符号、特殊 Unicode',
    params: {},
    validate: (pwd) => [...pwd].every(c => c.charCodeAt(0) <= 127)
  },
  {
    id: 'str_at_least_n_uppercase',
    category: '字符串',
    difficulty: 1,
    description: '密码中至少包含 {n} 个大写字母',
    params: { n: [2,3,4,5] },
    validate: (pwd, { n }) => (pwd.match(/[A-Z]/g) || []).length >= n
  },
  {
    id: 'str_punctuation_count',
    category: '字符串',
    difficulty: 2,
    description: '密码中必须恰好包含 {n} 个标点符号',
    params: { n: [1,2,3,4] },
    validate: (pwd, { n }) => (pwd.match(/[.,!?;:'"()\-_\[\]{}@#$%^&*+=/\\|~`<>]/g) || []).length === n
  },
  {
    id: 'str_letter_to_number',
    category: '字符串',
    difficulty: 3,
    description: '密码中字母数量必须等于数字数量',
    params: {},
    validate: (pwd) => {
      const alpha = (pwd.match(/[a-zA-Z]/g) || []).length;
      const num = (pwd.match(/\d/g) || []).length;
      return alpha === num && alpha > 0;
    }
  },
  {
    id: 'str_double_letter',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须包含一对连续重复的字母（如 "oo" "ee" "ll"）',
    params: {},
    validate: (pwd) => /([a-zA-Z])\1/.test(pwd)
  },
  {
    id: 'str_no_double_letter',
    category: '字符串',
    difficulty: 2,
    description: '密码中不能有连续重复的字母',
    params: {},
    validate: (pwd) => !/([a-zA-Z])\1/.test(pwd)
  },
  {
    id: 'str_starts_with_letter',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以字母开头',
    params: {},
    validate: (pwd) => /^[a-zA-Z]/.test(pwd)
  },
  {
    id: 'str_ends_with_number',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以数字结尾',
    params: {},
    validate: (pwd) => /\d$/.test(pwd)
  },
  {
    id: 'str_specific_position_char',
    category: '字符串',
    difficulty: 2,
    description: '密码中第 {pos} 个字符必须是 "{ch}"',
    params: { pos: [1,2,3,4,5], ch: ['a','b','c','d','e','x','y','z','1','2','3'] },
    validate: (pwd, { pos, ch }) => pwd.length >= pos && pwd[pos - 1].toLowerCase() === ch
  },
];
