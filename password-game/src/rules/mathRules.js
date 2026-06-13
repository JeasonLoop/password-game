// 数学规则 (~600 条组合)
import { isPrime } from './utils.js';

export const mathTemplates = [
  {
    id: 'math_digit_sum',
    category: '数学',
    difficulty: 1,
    description: '密码中所有数字之和必须等于 {target}',
    params: { target: [3,5,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,52,54,55,56,58,60,63,64,66,69,70,72,75,77,78,80,81,84,88,90,96,99,100] },
    validate: (pwd, { target }) => {
      const sum = (pwd.match(/\d/g) || []).reduce((a,b) => a + +b, 0);
      return sum === target;
    }
  },
  {
    id: 'math_digit_product',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字之积必须等于 {target}',
    params: { target: [0,2,4,6,8,10,12,14,16,18,20,24,27,30,32,36,40,42,48,54,56,60,64,72,80,81,84,90,96,100,108,120,128,144,162,180,192,200,216,240,256,288,324,360,384,400,432,480,512,576,648,720,768,864,960,1024] },
    validate: (pwd, { target }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length === 0) return target === 0;
      return digits.reduce((a,b) => a * b, 1) === target;
    }
  },
  {
    id: 'math_digit_count',
    category: '数学',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个数字',
    params: { n: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,20] },
    validate: (pwd, { n }) => {
      const c = (pwd.match(/\d/g) || []).length;
      return { passed: c === n, detail: c === n ? null : `找到 ${c} 个数字` };
    }
  },
  {
    id: 'math_digit_min',
    category: '数学',
    difficulty: 1,
    description: '密码中至少包含 {n} 个数字',
    params: { n: [2,3,4,5,6,7,8,9,10,12,15] },
    validate: (pwd, { n }) => (pwd.match(/\d/g) || []).length >= n
  },
  {
    id: 'math_digit_max',
    category: '数学',
    difficulty: 1,
    description: '密码中最多包含 {n} 个数字',
    params: { n: [2,3,4,5,6,8,10] },
    validate: (pwd, { n }) => (pwd.match(/\d/g) || []).length <= n
  },
  {
    id: 'math_contains_prime',
    category: '数学',
    difficulty: 2,
    description: '密码中必须包含一个质数（两位数以上）',
    params: {},
    validate: (pwd) => {
      const nums = pwd.match(/\d{2,}/g) || [];
      return nums.some(n => isPrime(parseInt(n)));
    }
  },
  {
    id: 'math_contains_number',
    category: '数学',
    difficulty: 1,
    description: '密码中必须包含数字 {n}',
    params: { n: [7,13,23,42,69,77,88,99,100,111,123,200,256,300,365,404,420,500,666,777,888,911,999,1000,1024,1337,2048,4096,9000,10000] },
    validate: (pwd, { n }) => pwd.includes(String(n))
  },
  {
    id: 'math_multiple_of',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字之和必须是 {n} 的倍数',
    params: { n: [2,3,4,5,6,7,8,9,10,11,12,13,15] },
    validate: (pwd, { n }) => {
      const sum = (pwd.match(/\d/g) || []).reduce((a,b) => a + +b, 0);
      return sum > 0 && sum % n === 0;
    }
  },
  {
    id: 'math_square_number',
    category: '数学',
    difficulty: 2,
    description: '密码中必须包含一个完全平方数',
    params: {},
    validate: (pwd) => {
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => {
        const sqrt = Math.sqrt(parseInt(n));
        return sqrt === Math.floor(sqrt) && parseInt(n) > 1;
      });
    }
  },
  {
    id: 'math_fibonacci',
    category: '数学',
    difficulty: 3,
    description: '密码中必须包含一个斐波那契数（至少两位）',
    params: {},
    validate: (pwd) => {
      const fib = new Set([1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765,10946]);
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => fib.has(parseInt(n)));
    }
  },
  {
    id: 'math_digit_avg_gt',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字的平均值必须大于 {n}',
    params: { n: [3,4,5,6,7,8] },
    validate: (pwd, { n }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length === 0) return false;
      return digits.reduce((a,b) => a + b, 0) / digits.length > n;
    }
  },
  {
    id: 'math_digit_avg_lt',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字的平均值必须小于 {n}',
    params: { n: [3,4,5,6,7] },
    validate: (pwd, { n }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length === 0) return false;
      return digits.reduce((a,b) => a + b, 0) / digits.length < n;
    }
  },
  {
    id: 'math_even_gt_odd',
    category: '数学',
    difficulty: 1,
    description: '密码中偶数的个数必须大于奇数的个数',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      let even = 0, odd = 0;
      digits.forEach(d => d % 2 === 0 ? even++ : odd++);
      return even > odd && digits.length > 0;
    }
  },
  {
    id: 'math_odd_gt_even',
    category: '数学',
    difficulty: 1,
    description: '密码中奇数的个数必须大于偶数的个数',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      let even = 0, odd = 0;
      digits.forEach(d => d % 2 === 0 ? even++ : odd++);
      return odd > even && digits.length > 0;
    }
  },
  {
    id: 'math_contains_pi_digits',
    category: '数学',
    difficulty: 2,
    description: '密码中必须包含圆周率π的前 {n} 位数字',
    params: { n: [3,4,5,6,7,8,10] },
    validate: (pwd, { n }) => {
      const piDigits = '3141592653589793238462643383279502884197';
      return pwd.includes(piDigits.slice(0, n));
    }
  },
  {
    id: 'math_last',
    category: '数学',
    difficulty: 1,
    description: '密码中最后一个数字必须是 {d}',
    params: { d: [0,1,2,3,5,7,8,9] },
    validate: (pwd, { d }) => {
      const digits = pwd.match(/\d/g);
      if (!digits) return false;
      return parseInt(digits[digits.length - 1]) === d;
    }
  },
  {
    id: 'math_first',
    category: '数学',
    difficulty: 1,
    description: '密码中第一个数字必须是 {d}',
    params: { d: [1,2,3,4,5,6,7,8,9] },
    validate: (pwd, { d }) => {
      const match = pwd.match(/\d/);
      if (!match) return false;
      return parseInt(match[0]) === d;
    }
  },
  {
    id: 'math_digit_range',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字都必须在 {min} 到 {max} 之间',
    params: { min: [2,3,4,5], max: [6,7,8,9] },
    validate: (pwd, { min, max }) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length === 0) return false;
      return digits.every(d => d >= min && d <= max);
    }
  },
  {
    id: 'math_no_zero',
    category: '数学',
    difficulty: 2,
    description: '密码中不能包含数字 0',
    params: {},
    validate: (pwd) => !pwd.includes('0')
  },
  {
    id: 'math_ascending_digits',
    category: '数学',
    difficulty: 3,
    description: '密码中的数字必须按升序排列',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < 2) return true;
      for (let i = 1; i < digits.length; i++) {
        if (digits[i] < digits[i-1]) return false;
      }
      return true;
    }
  },
  {
    id: 'math_descending_digits',
    category: '数学',
    difficulty: 3,
    description: '密码中的数字必须按降序排列',
    params: {},
    validate: (pwd) => {
      const digits = (pwd.match(/\d/g) || []).map(Number);
      if (digits.length < 2) return true;
      for (let i = 1; i < digits.length; i++) {
        if (digits[i] > digits[i-1]) return false;
      }
      return true;
    }
  },
  {
    id: 'math_digit_repeat',
    category: '数学',
    difficulty: 2,
    description: '密码中必须有数字连续重复 {n} 次',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => new RegExp(`(\\d)\\1{${n-1}}`).test(pwd)
  },
  {
    id: 'math_exactly_n_unique_digits',
    category: '数学',
    difficulty: 2,
    description: '密码中必须恰好有 {n} 个不同的数字',
    params: { n: [2,3,4,5,6] },
    validate: (pwd, { n }) => {
      const unique = new Set(pwd.match(/\d/g) || []);
      return unique.size === n;
    }
  },
  {
    id: 'math_power_of_two',
    category: '数学',
    difficulty: 2,
    description: '密码中必须包含一个2的幂次方数（至少为4）',
    params: {},
    validate: (pwd) => {
      const powers = new Set([4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536]);
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => powers.has(parseInt(n)));
    }
  },
  {
    id: 'math_triangular_number',
    category: '数学',
    difficulty: 3,
    description: '密码中必须包含一个三角数（如1,3,6,10,15...）',
    params: {},
    validate: (pwd) => {
      const tris = new Set([1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,231,253,276,300]);
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => tris.has(parseInt(n)));
    }
  },
  {
    id: 'math_sum_is_prime',
    category: '数学',
    difficulty: 3,
    description: '密码中所有数字之和必须是一个质数',
    params: {},
    validate: (pwd) => {
      const sum = (pwd.match(/\d/g) || []).reduce((a,b) => a + +b, 0);
      return sum > 1 && isPrime(sum);
    }
  },
  {
    id: 'math_lucky_number',
    category: '数学',
    difficulty: 1,
    description: '密码中必须包含一个幸运数字（{n}的倍数之和中的某个数字）',
    params: { n: [7,8,9] },
    validate: (pwd, { n }) => {
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => parseInt(n) % n === 0 && parseInt(n) > 0);
    }
  },
  {
    id: 'math_specific_sum_range',
    category: '数学',
    difficulty: 2,
    description: '密码中所有数字之和必须在 {min} 到 {max} 之间',
    params: { min: [15,20,25,30], max: [35,40,45,50,60] },
    validate: (pwd, { min, max }) => {
      const sum = (pwd.match(/\d/g) || []).reduce((a,b) => a + +b, 0);
      return sum >= min && sum <= max;
    }
  },
  {
    id: 'math_palindrome_number',
    category: '数学',
    difficulty: 2,
    description: '密码中必须包含一个回文数字（至少两位）',
    params: {},
    validate: (pwd) => {
      const nums = pwd.match(/\d{2,}/g) || [];
      return nums.some(n => n === n.split('').reverse().join(''));
    }
  },
  {
    id: 'math_perfect_number',
    category: '数学',
    difficulty: 4,
    description: '密码中必须包含一个完全数（6, 28, 496, 8128）',
    params: {},
    validate: (pwd) => {
      const perfect = new Set([6,28,496,8128]);
      const nums = pwd.match(/\d+/g) || [];
      return nums.some(n => perfect.has(parseInt(n)));
    }
  },
];
