// 图案规则 (~400 条组合)
import { isPalindrome } from './utils.js';

export const patternTemplates = [
  {
    id: 'pat_palindrome',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个回文（至少{n}个字符）',
    hint: '回文：正读反读一样，如 level、radar、上海自来水来自海上、12321',
    params: { n: [3,4,5] },
    validate: (pwd, { n }) => {
      const s = pwd.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      for (let i = 0; i <= s.length - n; i++) {
        const sub = s.slice(i, i + n);
        if (sub === sub.split('').reverse().join('')) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_three_in_a_row',
    category: '图案',
    difficulty: 1,
    description: '密码中必须有 {n} 个连续相同的字符',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => new RegExp(`(.)\\1{${n-1}}`).test(pwd)
  },
  {
    id: 'pat_alternating',
    category: '图案',
    difficulty: 3,
    description: '密码中必须有一个交替模式（如 ababa 或 12121），至少{n}个字符',
    params: { n: [4,5,6] },
    validate: (pwd, { n }) => {
      for (let i = 0; i <= pwd.length - n; i++) {
        const sub = pwd.slice(i, i + n);
        let ok = true;
        for (let j = 2; j < sub.length; j++) {
          if (sub[j] !== sub[j - 2]) { ok = false; break; }
        }
        if (ok) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_mirror',
    category: '图案',
    difficulty: 3,
    description: '密码的前半部分必须是后半部分的镜像（忽略中间字符）',
    params: {},
    validate: (pwd) => {
      if (pwd.length < 4) return false;
      const half = Math.floor(pwd.length / 2);
      const first = pwd.slice(0, half);
      const second = pwd.slice(-half).split('').reverse().join('');
      return first === second;
    }
  },
  {
    id: 'pat_repeating_pattern',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个长度为 {n} 的片段，且该片段重复至少2次',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => {
      for (let i = 0; i <= pwd.length - n * 2; i++) {
        const sub = pwd.slice(i, i + n);
        if (pwd.slice(i + n).includes(sub)) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_keyboard_adjacent',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含键盘上相邻的 {n} 个键',
    params: { n: [3,4] },
    validate: (pwd, { n }) => {
      const keyboard = [
        'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
        '1234567890', 'qazwsxedcrfvtgbyhnujmikolp'
      ];
      const lower = pwd.toLowerCase();
      for (let i = 0; i <= lower.length - n; i++) {
        const sub = lower.slice(i, i + n);
        for (const row of keyboard) {
          for (let j = 0; j <= row.length - n; j++) {
            if (sub === row.slice(j, j + n) || sub === row.slice(j, j + n).split('').reverse().join('')) {
              return true;
            }
          }
        }
      }
      return false;
    }
  },
  {
    id: 'pat_alphabetical_sequence',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个长度为 {n} 的字母连续序列（如 abc, def）',
    params: { n: [3,4] },
    validate: (pwd, { n }) => {
      const lower = pwd.toLowerCase();
      for (let i = 0; i <= lower.length - n; i++) {
        const sub = lower.slice(i, i + n);
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
  {
    id: 'pat_numbers_sequence',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个长度为 {n} 的数字连续序列（如 123, 987）',
    params: { n: [3,4] },
    validate: (pwd, { n }) => {
      for (let i = 0; i <= pwd.length - n; i++) {
        const sub = pwd.slice(i, i + n);
        if (!/^\d+$/.test(sub)) continue;
        let asc = true, desc = true;
        for (let j = 1; j < sub.length; j++) {
          if (parseInt(sub[j]) !== parseInt(sub[j-1]) + 1) asc = false;
          if (parseInt(sub[j]) !== parseInt(sub[j-1]) - 1) desc = false;
        }
        if (asc || desc) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_anagram_pair',
    category: '图案',
    difficulty: 3,
    description: '密码中必须包含两个长度≥{n}的单词，它们互为变位词',
    params: { n: [3,4] },
    validate: (pwd, { n }) => {
      const words = (pwd.match(/[a-zA-Z]+/g) || []).filter(w => w.length >= n);
      const sorted = words.map(w => w.toLowerCase().split('').sort().join(''));
      return new Set(sorted).size < sorted.length;
    }
  },
  {
    id: 'pat_isogram',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个没有重复字母的单词（至少{n}个字母）',
    params: { n: [4,5,6] },
    validate: (pwd, { n }) => {
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      return words.some(w => w.length >= n && new Set(w.toLowerCase().split('')).size === w.length);
    }
  },
  {
    id: 'pat_sandwich',
    category: '图案',
    difficulty: 3,
    description: '密码中必须有一个字符被另一个字符"夹住"（如 xyx 或 121），至少{n}组',
    params: { n: [1,2,3] },
    validate: (pwd, { n }) => {
      let count = 0;
      for (let i = 0; i < pwd.length - 2; i++) {
        if (pwd[i] === pwd[i + 2] && pwd[i] !== pwd[i + 1]) count++;
      }
      return count >= n;
    }
  },
  {
    id: 'pat_vowel_consonant_alternating',
    category: '图案',
    difficulty: 2,
    description: '密码中必须有一段元音辅音交替至少 {n} 个字符',
    params: { n: [4,5,6] },
    validate: (pwd, { n }) => {
      const vowels = new Set('aeiouAEIOU');
      const consonants = new Set('bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ');
      for (let i = 0; i <= pwd.length - n; i++) {
        const sub = pwd.slice(i, i + n);
        let ok = true;
        for (let j = 1; j < sub.length; j++) {
          const prevType = vowels.has(sub[j-1]) ? 'v' : consonants.has(sub[j-1]) ? 'c' : null;
          const currType = vowels.has(sub[j]) ? 'v' : consonants.has(sub[j]) ? 'c' : null;
          if (!prevType || !currType || prevType === currType) { ok = false; break; }
        }
        if (ok) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_zigzag',
    category: '图案',
    difficulty: 3,
    description: '密码中的数字部分必须呈现锯齿状（先升后降或先降后升），至少{n}个数字',
    params: { n: [4,5] },
    validate: (pwd, { n }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < n) return false;
      for (let i = 0; i <= digits.length - n; i++) {
        const sub = digits.slice(i, i + n);
        let peakFound = false, valleyFound = false;
        for (let j = 1; j < sub.length - 1; j++) {
          if (sub[j] > sub[j-1] && sub[j] > sub[j+1]) peakFound = true;
          if (sub[j] < sub[j-1] && sub[j] < sub[j+1]) valleyFound = true;
        }
        if (peakFound || valleyFound) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_same_start_end',
    category: '图案',
    difficulty: 1,
    description: '密码必须以相同字符开头和结尾',
    params: {},
    validate: (pwd) => pwd.length >= 2 && pwd[0].toLowerCase() === pwd[pwd.length - 1].toLowerCase()
  },
  {
    id: 'pat_acronym',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个由 {n} 个大写字母组成的首字母缩略词',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => new RegExp(`[A-Z]{${n},}`).test(pwd)
  },

  // ━━━ 新增规则：扩展图案分类 ━━━

  {
    id: 'pat_digit_pair_sum',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一对相邻数字，其和等于 {target}',
    params: { target: [5, 7, 9, 10, 12, 15] },
    validate: (pwd, { target }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      for (let i = 0; i < digits.length - 1; i++) {
        if (digits[i] + digits[i + 1] === target) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_numeric_palindrome',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一个数字回文（至少 {n} 位，如 121, 12321）',
    hint: '数字回文：如 121、1331、12321',
    params: { n: [3, 4, 5] },
    validate: (pwd, { n }) => {
      const digits = pwd.match(/\d+/g) || [];
      for (const d of digits) {
        if (d.length >= n && d === d.split('').reverse().join('')) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_rise_and_fall_digits',
    category: '图案',
    difficulty: 2,
    description: '密码中的数字序列中必须有一段先升后降（如 13542 或 2465）',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < 4) return false;
      for (let i = 0; i <= digits.length - 4; i++) {
        const sub = digits.slice(i, i + 4);
        for (let peak = 1; peak < sub.length - 1; peak++) {
          if (sub[peak] > sub[peak - 1] && sub[peak] > sub[peak + 1]) return true;
        }
      }
      return false;
    }
  },
  {
    id: 'pat_char_code_sequence',
    category: '图案',
    difficulty: 3,
    description: '密码中必须包含一段字符编码递增的片段（至少 {n} 个字符，如 "abc"→97,98,99）',
    hint: '字符编码连续递增：如 abc(97,98,99)、123(49,50,51)、ABCD',
    params: { n: [3, 4] },
    validate: (pwd, { n }) => {
      for (let i = 0; i <= pwd.length - n; i++) {
        const sub = pwd.slice(i, i + n);
        let ok = true;
        for (let j = 1; j < sub.length; j++) {
          if (sub.charCodeAt(j) !== sub.charCodeAt(j - 1) + 1) { ok = false; break; }
        }
        if (ok) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_symmetric_digits',
    category: '图案',
    difficulty: 2,
    description: '密码中必须包含一段对称的数字序列（至少 {n} 位，如 12321, 5665）',
    params: { n: [3, 4] },
    validate: (pwd, { n }) => {
      const digitRuns = pwd.match(/\d+/g) || [];
      for (const run of digitRuns) {
        if (run.length < n) continue;
        for (let i = 0; i <= run.length - n; i++) {
          const sub = run.slice(i, i + n);
          if (sub === sub.split('').reverse().join('')) return true;
        }
      }
      return false;
    }
  },
  {
    id: 'pat_repeating_triplet',
    category: '图案',
    difficulty: 1,
    description: '密码中必须包含一个重复出现的三元组（如 "abc" 出现两次）',
    hint: '找一段 3 个字符的片段，在密码中至少出现两次',
    params: {},
    validate: (pwd) => {
      if (pwd.length < 6) return false;
      for (let i = 0; i <= pwd.length - 3; i++) {
        const triplet = pwd.slice(i, i + 3);
        if (pwd.slice(i + 3).includes(triplet)) return true;
      }
      return false;
    }
  },
  {
    id: 'pat_mirror_digit_pair',
    category: '图案',
    difficulty: 3,
    description: '密码中必须包含两对互为镜像的相邻数字（如 "12" 和 "21"）',
    hint: '找两段两位数字，如 "35" 和 "53"，它们互为镜像',
    params: {},
    validate: (pwd) => {
      const pairs = new Set();
      for (let i = 0; i < pwd.length - 1; i++) {
        if (/\d{2}/.test(pwd.slice(i, i + 2))) {
          pairs.add(pwd.slice(i, i + 2));
        }
      }
      for (const p of pairs) {
        if (pairs.has(p.split('').reverse().join('')) && p !== p.split('').reverse().join('')) return true;
      }
      return false;
    }
  },
];
