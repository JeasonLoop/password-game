// 共享工具函数
export function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

export function isPalindrome(s) {
  const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return clean.length >= 3 && clean === clean.split('').reverse().join('');
}

export function countVowels(s) {
  return (s.match(/[aeiouAEIOU]/g) || []).length;
}

export function countConsonants(s) {
  return (s.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
}

export const ROMAN_MAP = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
export const ROMAN_VALID_REGEX = /^(M{0,4})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

export function isValidRoman(s) {
  return ROMAN_VALID_REGEX.test(s.toUpperCase());
}

export function romanToInt(s) {
  let total = 0;
  const u = s.toUpperCase();
  for (let i = 0; i < u.length; i++) {
    const cur = ROMAN_MAP[u[i]] || 0;
    const next = ROMAN_MAP[u[i + 1]] || 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}

export function intToRoman(num) {
  const vals = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let result = '';
  for (const [v, r] of vals) {
    while (num >= v) { result += r; num -= v; }
  }
  return result;
}
