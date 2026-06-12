// 密码学规则 (~200 条组合) — 纯结构性规则，无时效性依赖
export const timeTemplates = [
  {
    id: 'time_contains_uppercase_word',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含一个至少 {n} 个字母的全大写单词',
    params: { n: [2, 3, 4] },
    validate: (pwd, { n }) => {
      const words = pwd.match(/[A-Z]+/g) || [];
      return words.some(w => w.length >= n);
    }
  },
  {
    id: 'time_contains_exact_word',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含单词 "{word}"（不区分大小写）',
    params: { word: [
      'password','secret','master','hidden','cipher','encode','decode','crypto',
      'secure','vault','token','hash','puzzle','riddle','enigma','mystery',
      'lock','key','code','shield','guard','stealth','shadow','phantom',
      'agent','matrix','binary','signal','nexus','orbit','vector','prime',
    ] },
    validate: (pwd, { word }) => pwd.toLowerCase().includes(word)
  },
  {
    id: 'time_starts_with_upper',
    category: '密码学',
    difficulty: 1,
    description: '密码的第一个字母必须是大写的',
    params: {},
    validate: (pwd) => {
      const m = pwd.match(/[a-zA-Z]/);
      return m && m[0] === m[0].toUpperCase();
    }
  },
  {
    id: 'time_ends_with_lower',
    category: '密码学',
    difficulty: 1,
    description: '密码的最后一个字母必须是小写的',
    params: {},
    validate: (pwd) => {
      const letters = pwd.match(/[a-zA-Z]/g);
      if (!letters || letters.length === 0) return false;
      const last = letters[letters.length - 1];
      return last === last.toLowerCase();
    }
  },
  {
    id: 'time_alpha_between_digits',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须至少有一个字母被两个数字夹住（如 3a7）',
    params: {},
    validate: (pwd) => /\d[a-zA-Z]\d/.test(pwd)
  },
  {
    id: 'time_contains_digit_word',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含数字的英文单词 "{word}"',
    params: { word: [
      'zero','one','two','three','four','five','six','seven','eight','nine',
      'ten','eleven','twelve','thirteen','fourteen','fifteen','twenty','thirty',
      'forty','fifty','sixty','seventy','eighty','ninety','hundred','thousand',
    ] },
    validate: (pwd, { word }) => pwd.toLowerCase().includes(word)
  },
  {
    id: 'time_consecutive_vowels',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须有连续 {n} 个元音字母',
    params: { n: [2, 3] },
    validate: (pwd, { n }) => new RegExp(`[aeiouAEIOU]{${n}}`).test(pwd)
  },
  {
    id: 'time_all_digits_unique',
    category: '密码学',
    difficulty: 2,
    description: '密码中所有数字必须互不相同',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []);
      return digits.length > 0 && new Set(digits).size === digits.length;
    }
  },
  {
    id: 'time_contains_three_letters_seq',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须包含 {n} 个连续的字母表相邻字母（如 abc, xyz）',
    params: { n: [3, 4] },
    validate: (pwd, { n }) => {
      const lower = pwd.toLowerCase();
      for (let i = 0; i <= lower.length - n; i++) {
        const sub = lower.slice(i, i + n);
        if (!/^[a-z]+$/.test(sub)) continue;
        let ascending = true, descending = true;
        for (let j = 1; j < sub.length; j++) {
          if (sub.charCodeAt(j) !== sub.charCodeAt(j-1) + 1) ascending = false;
          if (sub.charCodeAt(j) !== sub.charCodeAt(j-1) - 1) descending = false;
        }
        if (ascending || descending) return true;
      }
      return false;
    }
  },

  // ━━━ 趣味规则 ━━━

  {
    id: 'time_contains_equation',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含一个算式（如 "2+3=5" 或 "6*7=42"）',
    hint: '在密码中写入一个简单的数学等式即可，例如 2+3=5',
    params: {},
    validate: (pwd) => {
      const patterns = [
        /(\d+)\s*([+\-*/])\s*(\d+)\s*=\s*(\d+)/, // 完整等式
      ];
      for (const pat of patterns) {
        const m = pwd.match(pat);
        if (m) {
          const a = parseInt(m[1]), op = m[2], b = parseInt(m[3]), c = parseInt(m[4]);
          let expected;
          if (op === '+') expected = a + b;
          else if (op === '-') expected = a - b;
          else if (op === '*') expected = a * b;
          else if (op === '/') expected = b !== 0 ? a / b : NaN;
          if (expected === c) return true;
        }
      }
      return false;
    }
  },
  {
    id: 'time_contains_double_pair',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含 ABBA 结构（如 "deed", "noon", "1221"）',
    hint: '找一个正读反读都一样的 4 字符片段，如 abba、noon、1221',
    params: {},
    validate: (pwd) => {
      for (let i = 0; i <= pwd.length - 4; i++) {
        if (pwd[i] === pwd[i+3] && pwd[i+1] === pwd[i+2] && pwd[i] !== pwd[i+1]) return true;
      }
      return false;
    }
  },
  {
    id: 'time_contains_xyz',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含连续三个相同的字符（如 "aaa", "111", "!!!"）',
    hint: '直接连续输入三个相同的字符即可',
    params: {},
    validate: (pwd) => /(.)\1\1/.test(pwd)
  },
  {
    id: 'time_char_types_diversity',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须至少包含 {n} 种不同类型的字符（大写字母/小写字母/数字/特殊符号）',
    hint: '四种类型：大写字母(A-Z)、小写字母(a-z)、数字(0-9)、特殊符号(!@#等)',
    params: { n: [2, 3, 4] },
    validate: (pwd, { n }) => {
      let types = 0;
      if (/[A-Z]/.test(pwd)) types++;
      if (/[a-z]/.test(pwd)) types++;
      if (/\d/.test(pwd)) types++;
      if (/[^a-zA-Z0-9]/.test(pwd)) types++;
      return types >= n;
    }
  },
  {
    id: 'time_lucky_number',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含幸运数字 "{n}"',
    params: { n: [7, 8, 13, 21, 42, 69, 77, 88, 99, 100, 168, 520, 666, 777, 888, 999] },
    validate: (pwd, { n }) => pwd.includes(String(n))
  },
  {
    id: 'time_keyboard_pattern',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含键盘上的一个横向连续片段（如 "qwer", "asdf", "zxcv", "1234"）',
    hint: '键盘上从左到右连续按的几个键',
    params: {},
    validate: (pwd) => {
      const rows = [
        'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
        '1234567890', '!@#$%^&*()',
      ];
      const lower = pwd.toLowerCase();
      for (const row of rows) {
        for (let len = 3; len <= row.length; len++) {
          for (let i = 0; i <= row.length - len; i++) {
            const seg = row.slice(i, i + len);
            if (lower.includes(seg)) return true;
          }
        }
      }
      return false;
    }
  },

  // ━━━ 以下保留原规则 ━━━

  {
    id: 'time_mirror_char',
    category: '密码学',
    difficulty: 3,
    description: '密码的第 1 个和最后 1 个字符必须相同，或第 2 个和倒数第 2 个相同',
    params: {},
    validate: (pwd) => {
      if (pwd.length < 2) return false;
      if (pwd[0].toLowerCase() === pwd[pwd.length-1].toLowerCase()) return true;
      if (pwd.length >= 4 && pwd[1].toLowerCase() === pwd[pwd.length-2].toLowerCase()) return true;
      return false;
    }
  },
  {
    id: 'time_contains_double_digits',
    category: '密码学',
    difficulty: 1,
    description: '密码中必须包含一对连续相同的数字（如 11, 55, 99）',
    params: {},
    validate: (pwd) => /(\d)\1/.test(pwd)
  },
  {
    id: 'time_all_letters_in_range',
    category: '密码学',
    difficulty: 2,
    description: '密码中所有字母都必须在 "{start}" 到 "{end}" 之间',
    params: {
      start: ['a', 'c', 'e', 'g', 'i', 'k', 'm'],
      end:   ['f', 'h', 'j', 'l', 'n', 'p', 'r', 't'],
    },
    validate: (pwd, { start, end }) => {
      const letters = (pwd.match(/[a-zA-Z]/g) || []).map(l => l.toLowerCase());
      if (letters.length === 0) return false;
      if (start >= end) return false;
      return letters.every(l => l >= start && l <= end);
    }
  },
  {
    id: 'time_digit_pairs_sum',
    category: '密码学',
    difficulty: 3,
    description: '密码中至少两个数字之和必须等于 {target}',
    params: { target: [5, 7, 9, 10, 12, 15, 18, 20] },
    validate: (pwd, { target }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      for (let i = 0; i < digits.length; i++) {
        for (let j = i + 1; j < digits.length; j++) {
          if (digits[i] + digits[j] === target) return true;
        }
      }
      return false;
    }
  },
  {
    id: 'time_max_digit_diff',
    category: '密码学',
    difficulty: 2,
    description: '密码中最大数字与最小数字之差必须 ≥ {diff}',
    params: { diff: [3, 4, 5, 6, 7, 8] },
    validate: (pwd, { diff }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < 2) return false;
      return Math.max(...digits) - Math.min(...digits) >= diff;
    }
  },
  {
    id: 'time_contains_two_consecutive_upper',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须有至少 {n} 个连续的大写字母',
    params: { n: [2, 3, 4] },
    validate: (pwd, { n }) => new RegExp(`[A-Z]{${n}}`).test(pwd)
  },
  {
    id: 'time_first_last_different_type',
    category: '密码学',
    difficulty: 1,
    description: '密码的第一个字符和最后一个字符必须是不同类型（字母/数字/符号各不同）',
    params: {},
    validate: (pwd) => {
      if (pwd.length < 2) return false;
      function type(c) {
        if (/[a-zA-Z]/.test(c)) return 'L';
        if (/\d/.test(c)) return 'D';
        return 'S';
      }
      return type(pwd[0]) !== type(pwd[pwd.length - 1]);
    }
  },

  // ━━━ 新增规则：编码与密码学趣味规则 ━━━

  {
    id: 'time_contains_morse_code',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须包含一段摩尔斯电码（如 ".- " 代表 A，"--" 代表 M）',
    hint: '摩尔斯电码用点和横线：A=.- B=-... C=-.-. SOS=... --- ...',
    params: {},
    validate: (pwd) => {
      return /[.\-]{2,}/.test(pwd) && /[.\-]/.test(pwd);
    }
  },
  {
    id: 'time_contains_binary',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须包含至少 {n} 位二进制数字序列',
    hint: '二进制只包含 0 和 1，如 101、1100、10101',
    params: { n: [4, 6, 8] },
    validate: (pwd, { n }) => new RegExp(`[01]{${n},}`).test(pwd)
  },
  {
    id: 'time_contains_base64',
    category: '密码学',
    difficulty: 3,
    description: '密码中必须包含一段 Base64 编码字符串（至少 {n} 个字符）',
    hint: 'Base64 由 A-Z, a-z, 0-9, +, / 组成，常以 = 结尾',
    params: { n: [8, 12] },
    validate: (pwd, { n }) => new RegExp(`[A-Za-z0-9+/]{${n},}={0,2}`).test(pwd)
  },
  {
    id: 'time_contains_hex_encoding',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须包含一段十六进制编码（至少 {n} 个十六进制字符）',
    hint: '十六进制：0-9 和 A-F，如 4F 7A FF 或 0xDEAD',
    params: { n: [4, 6, 8] },
    validate: (pwd, { n }) => {
      return new RegExp(`(?:0x)?[0-9a-fA-F]{${n},}`).test(pwd);
    }
  },
  {
    id: 'time_password_has_unicode_escape',
    category: '密码学',
    difficulty: 3,
    description: '密码中必须包含一个 Unicode 转义序列（如 \\u0041 代表 A）',
    hint: 'Unicode转义：\\u + 4位十六进制，如 \\u0041=A, \\u4e2d=中',
    params: {},
    validate: (pwd) => /\\u[0-9a-fA-F]{4}/.test(pwd)
  },
  {
    id: 'time_contains_roman_in_context',
    category: '密码学',
    difficulty: 2,
    description: '密码中必须包含被非字母字符包围的罗马数字（如 "#IV#" 或 "3-XII-5"）',
    hint: '罗马数字 I=1 V=5 X=10 L=50 C=100，需要被其他字符包围',
    params: {},
    validate: (pwd) => {
      return /[^IVXLCDMivxlcdm][IVXLCDM]{2,}[^IVXLCDMivxlcdm]/.test(pwd);
    }
  },
];
