// 罗马数字规则 (~200 条组合)
import { isValidRoman, romanToInt, intToRoman } from './utils.js';

export const romanTemplates = [
  {
    id: 'roman_contains_numeral_for',
    category: '罗马数字',
    difficulty: 1,
    description: '密码中必须包含罗马数字表示的数字 {n}',
    hint: 'I=1 V=5 X=10 L=50 C=100 D=500 M=1000\n1=I 2=II 3=III 4=IV 5=V 6=VI 7=VII 8=VIII 9=IX 10=X\n20=XX 30=XXX 40=XL 50=L 60=LX 90=XC 100=C',
    params: { n: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,30,35,40,45,50,55,60,70,80,90,100] },
    validate: (pwd, { n }) => {
      const roman = intToRoman(n);
      return pwd.toUpperCase().includes(roman);
    }
  },
  {
    id: 'roman_sum_of_numerals',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中所有罗马数字的值之和必须等于 {target}',
    hint: '罗马数字 I=1 V=5 X=10 L=50 C=100 D=500 M=1000，取你密码中所有合法罗马数字的值加总',
    params: { target: [5,10,15,20,25,30,35,40,45,50,55,60,66,70,75,80,88,90,99,100] },
    validate: (pwd, { target }) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      let sum = 0;
      for (const m of matches) {
        if (isValidRoman(m)) sum += romanToInt(m);
      }
      return sum === target;
    }
  },
  {
    id: 'roman_contains_valid',
    category: '罗马数字',
    difficulty: 1,
    description: '密码中必须包含至少一个有效的罗马数字',
    hint: 'I=1 V=5 X=10 L=50 C=100 D=500 M=1000\n例：IV=4 IX=9 XL=40 XC=90 CD=400 CM=900',
    params: {},
    validate: (pwd) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      return matches.some(m => isValidRoman(m));
    }
  },
  {
    id: 'roman_max_value',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中的罗马数字最大值必须恰好为 {n}',
    hint: 'I=1 V=5 X=10 L=50 C=100 D=500 M=1000',
    params: { n: [5,10,20,50,100] },
    validate: (pwd, { n }) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      if (matches.length === 0) return false;
      const vals = matches.filter(m => isValidRoman(m)).map(m => romanToInt(m));
      if (vals.length === 0) return false;
      return Math.max(...vals) === n;
    }
  },
  {
    id: 'roman_count',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中必须恰好包含 {n} 个有效的罗马数字',
    hint: '合法罗马数字只能由 I V X L C D M 组成，且符合罗马数字规则',
    params: { n: [1,2,3,4,5] },
    validate: (pwd, { n }) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      const valid = matches.filter(m => isValidRoman(m));
      const count = valid.length;
      return { passed: count === n, detail: count === n ? null : `找到 ${count} 个有效罗马数字：${valid.join(', ') || '无'}` };
    }
  },
  {
    id: 'roman_multiple_of',
    category: '罗马数字',
    difficulty: 3,
    description: '密码中所有罗马数字值之和必须是 {n} 的倍数',
    hint: 'I=1 V=5 X=10 L=50 C=100 D=500 M=1000',
    params: { n: [5,10] },
    validate: (pwd, { n }) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      let sum = 0;
      for (const m of matches) {
        if (isValidRoman(m)) sum += romanToInt(m);
      }
      return sum > 0 && sum % n === 0;
    }
  },
  {
    id: 'roman_palindrome_value',
    category: '罗马数字',
    difficulty: 3,
    description: '密码中必须包含一个罗马数字，其值是回文数',
    hint: '回文数如 11, 22, 33, 101, 121...\nI=1 V=5 X=10 L=50 C=100 D=500 M=1000',
    params: {},
    validate: (pwd) => {
      const matches = pwd.match(/[IVXLCDM]+/gi) || [];
      return matches.some(m => {
        if (!isValidRoman(m)) return false;
        const v = romanToInt(m);
        const s = String(v);
        return s === s.split('').reverse().join('') && v > 0;
      });
    }
  },
  {
    id: 'roman_no_certain_numeral',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中不能包含罗马数字 "{numeral}"',
    hint: '罗马数字符号：I V X L C D M\n其中 {numeral} 不允许出现',
    params: { numeral: ['M','D','C','L','X','V'] },
    validate: (pwd, { numeral }) => !pwd.toUpperCase().includes(numeral)
  },
  {
    id: 'roman_at_least_n_numerals',
    category: '罗马数字',
    difficulty: 2,
    description: '密码中至少包含 {n} 个罗马数字符号',
    hint: '罗马数字符号：I V X L C D M，每个符号都算一次',
    params: { n: [2,3,4,5] },
    validate: (pwd, { n }) => {
      const count = (pwd.match(/[IVXLCDM]/gi) || []).length;
      return count >= n;
    }
  },
];
