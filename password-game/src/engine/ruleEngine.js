// 规则引擎核心 —— 规则生成、验证、选择

/**
 * 从规则模板库中生成所有可能的规则组合
 * 每个模板 × 参数空间 = 多条具体规则
 */
export function generateAllRules(templates) {
  const allRules = [];
  // 构建已知模板名集合（用于 parseRuleId 消歧）
  if (!_knownTemplates) _knownTemplates = new Set();
  for (const template of templates) {
    _knownTemplates.add(template.id);
    const paramCombos = enumerateParams(template.params);
    for (const combo of paramCombos) {
      allRules.push(instantiateRule(template, combo));
    }
  }
  return allRules;
}

/** 枚举参数空间的所有组合 */
function enumerateParams(params) {
  if (!params || Object.keys(params).length === 0) return [{}];
  const keys = Object.keys(params);
  const combos = [];
  
  function dfs(idx, current) {
    if (idx === keys.length) {
      combos.push({ ...current });
      return;
    }
    const key = keys[idx];
    const values = params[key];
    for (const val of values) {
      current[key] = val;
      dfs(idx + 1, current);
    }
  }
  dfs(0, {});
  return combos;
}

/** 用具体参数实例化一条规则 */
function instantiateRule(template, params) {
  let desc = template.description;
  for (const [key, val] of Object.entries(params)) {
    desc = desc.replace(`{${key}}`, val);
  }
  let hint = template.hint || null;
  if (hint) {
    for (const [key, val] of Object.entries(params)) {
      hint = hint.replace(`{${key}}`, val);
    }
  }
  const paramKey = Object.values(params).join('_');
  return {
    id: `${template.id}_${paramKey}`,
    category: template.category,
    difficulty: template.difficulty,
    description: desc,
    hint,
    _templateName: template.id,  // 直接存储模板名，避免 ID 解析歧义
    validate: (password) => template.validate(password, params),
  };
}

/** Fisher-Yates 洗牌 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 解析规则 ID 中的数字参数
 * 例如 "math_digit_count_20" → { template: "math_digit_count", nums: [20] }
 * 例如 "str_exact_12" → { template: "str_exact", nums: [12] }
 * 例如 "str_must_contain_char_a" → { template: "str_must_contain_char", nums: [], strParam: "a" }
 */
function parseRuleId(id) {
  const parts = id.split('_');

  // 当已知模板集合可用时，使用最长匹配策略消歧
  if (_knownTemplates && _knownTemplates.size > 0) {
    // 从最长模板名开始尝试（splitIdx 从大到小）
    for (let splitIdx = parts.length; splitIdx >= 1; splitIdx--) {
      const template = parts.slice(0, splitIdx).join('_');
      if (_knownTemplates.has(template)) {
        const paramParts = parts.slice(splitIdx);
        const nums = [];
        let strParam = null;
        // 从参数部分提取：末尾连续数字 → nums，紧邻的非数字 → strParam
        let pi = paramParts.length;
        while (pi > 0 && /^-?\d+$/.test(paramParts[pi - 1])) {
          nums.unshift(parseInt(paramParts[pi - 1]));
          pi--;
        }
        if (pi > 0 && !/^-?\d+$/.test(paramParts[pi - 1])) {
          strParam = paramParts.slice(0, pi).join('_');
        }
        return { template, nums, strParam };
      }
    }
  }

  // 回退：传统解析（无已知模板集合时）
  const nums = [];
  let strParam = null;
  let splitIdx = parts.length;
  while (splitIdx > 0 && /^-?\d+$/.test(parts[splitIdx - 1])) {
    nums.unshift(parseInt(parts[splitIdx - 1]));
    splitIdx--;
  }
  if (splitIdx > 0 && !/^-?\d+$/.test(parts[splitIdx - 1])) {
    strParam = parts[splitIdx - 1];
    splitIdx--;
  }
  const template = parts.slice(0, splitIdx).join('_');
  return { template, nums, strParam };
}

/** 已知模板名集合（由 selectRulesForGame 在首次调用时构建） */
let _knownTemplates = null;

// ════════════════════════════════════════════════════════════
// 互斥模板列表：同模板不同参数 → 互斥（同一局最多出现一条）
// 注意：模板名必须与 parseRuleId 解析出的 template 字段一致
// ════════════════════════════════════════════════════════════
const exclusiveTemplates = [
  // ── 位置类（开头/结尾/长度只能有一个约束）──
  'str_starts_with',          // 密码以 "X" 开头
  'str_ends_with',            // 密码以 "X" 结尾
  'str_exact',                // 密码长度恰好为 N
  'final_starts_with',        // 密码以 "XY" 开头
  'final_ends_with',          // 密码以 "XY" 结尾
  'mega_starts_with_char',    // 密码以字符 "X" 开头
  'mega_ends_with_char',      // 密码以字符 "X" 结尾
  'math_first',               // 第一个数字是 D
  'math_last',                // 最后一个数字是 D

  // ── 计数类（恰好 N 个 X，不同 N 互斥）──
  'str_vowel_count',          // 恰好 N 个元音
  'str_consonant_count',      // 恰好 N 个辅音
  'str_uppercase_count',      // 恰好 N 个大写
  'str_lowercase_count',      // 恰好 N 个小写
  'str_alpha_count',          // 恰好 N 个字母
  'str_special_char_count',   // 恰好 N 个特殊字符
  'str_punctuation_count',    // 恰好 N 个标点
  'math_digit_count',         // 恰好 N 个数字
  'math_digit_sum',           // 数字和恰好为 N
  'math_digit_product',       // 数字积恰好为 N

  // ── 范围类（不同参数互斥）──
  'str_min_length',           // 最小长度
  'str_max_length',           // 最大长度
  'math_digit_min',           // 至少 N 个数字
  'math_digit_max',           // 最多 N 个数字
  'str_no_repeated_chars',    // 不连续超过 N 次

  // ── final 系列（语义与现有规则重叠，同模板不同参数互斥）──
  'final_char_type_count',    // 某类型恰好 N 个
  'final_digit_relations',    // 数字的和/积等于 N
  'final_contains_certain_letter_n_times', // 某字母恰好出现 N 次

  // ── 新增模板 ──
  'emoji_different_categories', // 不同类别Emoji (n=2 和 n=3 互斥)
  'chess_contains_castling_side', // short/long 易位互斥
];

// ════════════════════════════════════════════════════════════
// 辅助解析函数（处理 parseRuleId 无法正确处理的特殊模板）
// ════════════════════════════════════════════════════════════

/** 解析 final_char_type_count 的参数（中文类型名导致 parseRuleId 解析异常） */
function parseFinalCharTypeCount(id) {
  const prefix = 'final_char_type_count_';
  if (!id.startsWith(prefix)) return null;
  const rest = id.slice(prefix.length);
  const lastUnderscore = rest.lastIndexOf('_');
  if (lastUnderscore === -1) return null;
  return { type: rest.slice(0, lastUnderscore), n: parseInt(rest.slice(lastUnderscore + 1)) };
}

/** 解析 final_contains_certain_letter_n_times 的参数 */
function parseFinalLetterCount(id) {
  const prefix = 'final_contains_certain_letter_n_times_';
  if (!id.startsWith(prefix)) return null;
  const rest = id.slice(prefix.length);
  const lastUnderscore = rest.lastIndexOf('_');
  if (lastUnderscore === -1) return null;
  return { letter: rest.slice(0, lastUnderscore), n: parseInt(rest.slice(lastUnderscore + 1)) };
}

/** 从规则 ID 提取开头前缀字符串（小写） */
function getStartPrefix(id) {
  return id.split('_').pop()?.toLowerCase() || '';
}

/** 从规则 ID 提取结尾后缀字符串（小写） */
function getEndSuffix(id) {
  return id.split('_').pop()?.toLowerCase() || '';
}

// ════════════════════════════════════════════════════════════
// 核心冲突检测
// ════════════════════════════════════════════════════════════

/**
 * 检测两条规则是否互斥
 */
function areConflicting(ruleA, ruleB) {
  // 优先使用直接存储的模板名，避免 ID 解析歧义
  const ta = ruleA._templateName || parseRuleId(ruleA.id).template;
  const tb = ruleB._templateName || parseRuleId(ruleB.id).template;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ① 同模板不同参数 → 互斥
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === tb && exclusiveTemplates.includes(ta)) {
    return true; // 同 exclusive 模板的任何两条规则都互斥
  }

  // 以下解析仅用于跨模板冲突检测
  const a = parseRuleId(ruleA.id);
  const b = parseRuleId(ruleB.id);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ② 跨模板：开头规则之间
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const startTemplates = ['str_starts_with', 'final_starts_with', 'mega_starts_with_char'];
  const endTemplates = ['str_ends_with', 'final_ends_with', 'mega_ends_with_char'];

  // 开头规则互斥：不同前缀/开头字符
  if (startTemplates.includes(ta) && startTemplates.includes(tb) && ta !== tb) {
    const prefixA = getStartPrefix(ruleA.id);
    const prefixB = getStartPrefix(ruleB.id);
    const minLen = Math.min(prefixA.length, prefixB.length);
    if (prefixA.slice(0, minLen) !== prefixB.slice(0, minLen)) return true;
  }
  // 结尾规则互斥：不同后缀/结尾字符
  if (endTemplates.includes(ta) && endTemplates.includes(tb) && ta !== tb) {
    const suffixA = getEndSuffix(ruleA.id);
    const suffixB = getEndSuffix(ruleB.id);
    // 从末尾对齐比较
    const minLen = Math.min(suffixA.length, suffixB.length);
    if (suffixA.slice(-minLen) !== suffixB.slice(-minLen)) return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ③ 跨模板：开头 vs str_starts_with_letter
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'str_starts_with_letter' && startTemplates.includes(tb)) {
    const prefix = getStartPrefix(ruleB.id);
    if (!/^[a-zA-Z]/.test(prefix)) return true;
  }
  if (tb === 'str_starts_with_letter' && startTemplates.includes(ta)) {
    const prefix = getStartPrefix(ruleA.id);
    if (!/^[a-zA-Z]/.test(prefix)) return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ④ 跨模板：结尾 vs str_ends_with_number
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'str_ends_with_number' && endTemplates.includes(tb)) {
    const suffix = getEndSuffix(ruleB.id);
    if (!/\d$/.test(suffix)) return true;
  }
  if (tb === 'str_ends_with_number' && endTemplates.includes(ta)) {
    const suffix = getEndSuffix(ruleA.id);
    if (!/\d$/.test(suffix)) return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑤ 跨模板：开头 vs str_specific_position_char
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function posInfo(parsed) {
    if (parsed.template === 'str_specific_position_char')
      return { pos: parsed.nums[0], ch: (parsed.strParam || '').toLowerCase() };
    return null;
  }
  const isPosA = ta === 'str_specific_position_char', isPosB = tb === 'str_specific_position_char';

  if (startTemplates.includes(ta) && isPosB) {
    const prefix = getStartPrefix(ruleA.id);
    const pi = posInfo(b);
    if (pi && pi.pos <= prefix.length && prefix[pi.pos - 1] !== pi.ch) return true;
  }
  if (startTemplates.includes(tb) && isPosA) {
    const prefix = getStartPrefix(ruleB.id);
    const pi = posInfo(a);
    if (pi && pi.pos <= prefix.length && prefix[pi.pos - 1] !== pi.ch) return true;
  }
  // str_starts_with_letter vs pos=1 with non-letter
  if (ta === 'str_starts_with_letter' && isPosB && b.nums[0] === 1 && !/^[a-zA-Z]$/.test(b.strParam || '')) return true;
  if (tb === 'str_starts_with_letter' && isPosA && a.nums[0] === 1 && !/^[a-zA-Z]$/.test(a.strParam || '')) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑥ 长度类交叉冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 最小长度 > 最大长度
  if (ta === 'str_min_length' && tb === 'str_max_length') return a.nums[0] > b.nums[0];
  if (tb === 'str_min_length' && ta === 'str_max_length') return b.nums[0] > a.nums[0];

  // 恰好长度 > 最大长度
  if (ta === 'str_exact' && tb === 'str_max_length') return a.nums[0] > b.nums[0];
  if (tb === 'str_exact' && ta === 'str_max_length') return b.nums[0] > a.nums[0];

  // 恰好长度 < 最小长度
  if (ta === 'str_exact' && tb === 'str_min_length') return a.nums[0] < b.nums[0];
  if (tb === 'str_exact' && ta === 'str_min_length') return b.nums[0] < a.nums[0];

  // 恰好长度 vs 偶数/奇数长度
  if (ta === 'str_exact' && tb === 'str_bonus_even_length') return a.nums[0] % 2 !== 0;
  if (tb === 'str_exact' && ta === 'str_bonus_even_length') return b.nums[0] % 2 !== 0;
  if (ta === 'str_exact' && tb === 'str_bonus_odd_length') return a.nums[0] % 2 === 0;
  if (tb === 'str_exact' && ta === 'str_bonus_odd_length') return b.nums[0] % 2 === 0;

  // 偶数长度 vs 奇数长度
  const evenT = ['str_bonus_even_length']; const oddT = ['str_bonus_odd_length'];
  if (evenT.includes(ta) && oddT.includes(tb)) return true;
  if (oddT.includes(ta) && evenT.includes(tb)) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑦ 数字数量 vs 长度类
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const countTemplates = ['str_vowel_count', 'str_consonant_count', 'str_uppercase_count',
    'str_lowercase_count', 'str_special_char_count', 'str_punctuation_count',
    'str_alpha_count', 'math_digit_count'];
  const lengthTemplates = ['str_exact', 'str_max_length'];

  // 恰好 N 个 X > 长度 ≤ M 或 恰好 M 长度
  if (countTemplates.includes(ta) && lengthTemplates.includes(tb) && a.nums[0] > b.nums[0]) return true;
  if (countTemplates.includes(tb) && lengthTemplates.includes(ta) && b.nums[0] > a.nums[0]) return true;

  // 至少 N 个 > 长度
  const minCountTemplates = ['math_digit_min', 'str_at_least_n_uppercase'];
  if (minCountTemplates.includes(ta) && lengthTemplates.includes(tb) && a.nums[0] > b.nums[0]) return true;
  if (minCountTemplates.includes(tb) && lengthTemplates.includes(ta) && b.nums[0] > a.nums[0]) return true;

  // 字母数量 = 数字数量 vs 奇数长度（字母+数字=偶数，但密码可能还有其他字符，仅在恰好长度且为奇数时冲突）
  if (ta === 'str_letter_to_number' && tb === 'str_exact' && b.nums[0] % 2 !== 0) return true;
  if (tb === 'str_letter_to_number' && ta === 'str_exact' && a.nums[0] % 2 !== 0) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑧ "零个"规则 vs "需要"该类字符的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // math_digit_count(n=0) → 密码中无数字 → 所有需要数字的规则不可能满足
  const needsDigits = ['math_digit_sum', 'math_digit_product', 'math_multiple_of',
    'math_contains_prime', 'math_contains_number', 'math_even_gt_odd', 'math_odd_gt_even',
    'math_ascending_digits', 'math_descending_digits', 'math_digit_avg_gt', 'math_digit_avg_lt',
    'math_contains_pi_digits', 'math_square_number', 'math_fibonacci', 'math_power_of_two',
    'math_triangular_number', 'math_sum_is_prime', 'math_lucky_number',
    'math_specific_sum_range', 'math_palindrome_number', 'math_perfect_number',
    'math_digit_repeat', 'math_exactly_n_unique_digits',
    'math_bonus_sum_equals_double', 'math_bonus_digit_difference', 'math_bonus_has_cube',
    'math_bonus_digit_mod', 'math_bonus_consecutive_sum', 'math_bonus_digit_frequency',
    'str_ends_with_number', 'str_bonus_must_contain_digit',
    'pat_bonus_strictly_increasing_numbers', 'pat_bonus_v_shape', 'pat_zigzag',
    'pat_numbers_sequence', 'final_digit_relations', 'final_contains_math_operation',
  ];
  if (ta === 'math_digit_count' && a.nums[0] === 0 && needsDigits.includes(tb)) return true;
  if (tb === 'math_digit_count' && b.nums[0] === 0 && needsDigits.includes(ta)) return true;

  // str_alpha_count(n=0) → 无字母
  const needsLetters = ['str_starts_with_letter', 'str_alternating_case',
    'str_bonus_capitalize_each_word', 'str_bonus_alphabetical_order', 'str_bonus_reverse_alphabetical',
    'word_pangram_check', 'word_no_letter_e', 'word_alliteration',
    'pat_acronym', 'pat_alphabetical_sequence', 'pat_anagram_pair', 'pat_isogram',
    'pat_vowel_consonant_alternating', 'word_heterogram', 'word_rhyming_pair',
    'word_spoonerism', 'word_ambigram', 'word_no_repeating_letters',
    'mega_word_prefix', 'mega_word_suffix',
    'final_word_of_length', 'final_contains_certain_letter_n_times',
  ];
  if (ta === 'str_alpha_count' && a.nums[0] === 0 && needsLetters.includes(tb)) return true;
  if (tb === 'str_alpha_count' && b.nums[0] === 0 && needsLetters.includes(ta)) return true;

  // str_vowel_count(n=0) → 无元音
  const needsVowelsForCount = ['word_pangram_check', 'str_more_vowels_than_consonants',
    'word_vowel_to_consonant_ratio'];
  if (ta === 'str_vowel_count' && a.nums[0] === 0 && needsVowelsForCount.includes(tb)) return true;
  if (tb === 'str_vowel_count' && b.nums[0] === 0 && needsVowelsForCount.includes(ta)) return true;

  // str_uppercase_count(n=0) → 无大写
  const needsUpperForCount = ['str_at_least_n_uppercase', 'str_bonus_capitalize_each_word',
    'pat_acronym', 'str_alternating_case'];
  if (ta === 'str_uppercase_count' && a.nums[0] === 0 && needsUpperForCount.includes(tb)) return true;
  if (tb === 'str_uppercase_count' && b.nums[0] === 0 && needsUpperForCount.includes(ta)) return true;

  // str_lowercase_count(n=0) → 无小写
  const needsLowerForCount = ['str_alternating_case', 'str_starts_with_letter'];
  if (ta === 'str_lowercase_count' && a.nums[0] === 0 && needsLowerForCount.includes(tb)) return true;
  if (tb === 'str_lowercase_count' && b.nums[0] === 0 && needsLowerForCount.includes(ta)) return true;

  // str_special_char_count(n=0) → 无特殊字符
  if (ta === 'str_special_char_count' && a.nums[0] === 0 && tb === 'str_bonus_contains_special') return true;
  if (tb === 'str_special_char_count' && b.nums[0] === 0 && ta === 'str_bonus_contains_special') return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑨ 包含/不包含同一字符
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'str_must_contain_char' && tb === 'str_must_not_contain_char') return a.strParam === b.strParam;
  if (tb === 'str_must_contain_char' && ta === 'str_must_not_contain_char') return a.strParam === b.strParam;
  if (ta === 'str_bonus_must_contain_digit' && tb === 'str_bonus_must_not_contain_digit') return a.nums[0] === b.nums[0];
  if (tb === 'str_bonus_must_contain_digit' && ta === 'str_bonus_must_not_contain_digit') return a.nums[0] === b.nums[0];

  // final_contains_certain_letter_n_times vs str_must_not_contain_char
  {
    const flcA = parseFinalLetterCount(ruleA.id);
    const flcB = parseFinalLetterCount(ruleB.id);
    if (flcA && tb === 'str_must_not_contain_char' && flcA.letter === b.strParam) return true;
    if (flcB && ta === 'str_must_not_contain_char' && flcB.letter === a.strParam) return true;
    // final letter count vs word_no_letter_e
    if (flcA && tb === 'word_no_letter_e' && flcA.letter === 'e') return true;
    if (flcB && ta === 'word_no_letter_e' && flcB.letter === 'e') return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑩ 无元音 vs 需要元音的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const needsVowels = ['str_vowel_count', 'str_more_vowels_than_consonants', 'word_pangram_check',
    'str_must_contain_char', 'pat_vowel_consonant_alternating', 'word_vowel_to_consonant_ratio',
    'time_consecutive_vowels'];
  if (ta === 'str_no_vowels' && needsVowels.includes(tb)) {
    if (tb === 'str_must_contain_char') return /^[aeiou]$/i.test(b.strParam);
    if (tb === 'str_vowel_count') return b.nums[0] > 0;
    return true;
  }
  if (tb === 'str_no_vowels' && needsVowels.includes(ta)) {
    if (ta === 'str_must_contain_char') return /^[aeiou]$/i.test(a.strParam);
    if (ta === 'str_vowel_count') return a.nums[0] > 0;
    return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑪ 无字母 e vs 需要字母 e 的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'word_no_letter_e' && tb === 'str_must_contain_char' && b.strParam === 'e') return true;
  if (tb === 'word_no_letter_e' && ta === 'str_must_contain_char' && a.strParam === 'e') return true;
  if (ta === 'word_no_letter_e' && tb === 'word_pangram_check') return true;
  if (tb === 'word_no_letter_e' && ta === 'word_pangram_check') return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑫ 全部唯一 / 不重复 vs 需要重复的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const needsRepeats = ['pat_three_in_a_row', 'str_double_letter', 'math_digit_repeat', 'time_contains_double_digits'];
  const allUniqueTemplates = ['str_all_chars_unique', 'word_no_repeating_letters', 'time_all_digits_unique'];
  const noRepeatTemplates = ['str_no_repeated_chars', 'str_no_double_letter'];

  // 全部唯一 vs 需要重复
  for (const u of allUniqueTemplates) {
    if (ta === u && needsRepeats.includes(tb)) return true;
    if (tb === u && needsRepeats.includes(ta)) return true;
  }
  // 全部唯一 vs 全部唯一（两个模板语义相同，不应同时出现）
  if ((ta === 'str_all_chars_unique' && tb === 'word_no_repeating_letters') ||
      (ta === 'word_no_repeating_letters' && tb === 'str_all_chars_unique')) return true;

  // 不重复 vs 需要重复
  for (const nr of noRepeatTemplates) {
    if (ta === nr && needsRepeats.includes(tb)) return true;
    if (tb === nr && needsRepeats.includes(ta)) return true;
  }

  // str_no_double_letter vs str_double_letter（直接对立）
  if (ta === 'str_no_double_letter' && tb === 'str_double_letter') return true;
  if (tb === 'str_no_double_letter' && ta === 'str_double_letter') return true;

  // word_no_repeating_letters vs 需要重复字母
  if (allUniqueTemplates.includes(ta) && needsRepeats.includes(tb)) return true;
  if (allUniqueTemplates.includes(tb) && needsRepeats.includes(ta)) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑬ 无大写 vs 需要大写的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const needsUpper = ['str_uppercase_count', 'str_at_least_n_uppercase', 'str_bonus_capitalize_each_word',
    'str_alternating_case', 'pat_acronym'];
  if (ta === 'str_no_uppercase' && needsUpper.includes(tb)) return true;
  if (tb === 'str_no_uppercase' && needsUpper.includes(ta)) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑭ 无小写 vs 需要小写的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const needsLower = ['str_lowercase_count', 'str_alternating_case'];
  if (ta === 'str_no_lowercase' && needsLower.includes(tb)) return true;
  if (tb === 'str_no_lowercase' && needsLower.includes(ta)) return true;

  // 无小写 vs 开头规则以小写字母开头
  if (ta === 'str_no_lowercase' && startTemplates.includes(tb)) {
    const prefix = getStartPrefix(ruleB.id);
    if (/^[a-z]/.test(prefix)) return true;
  }
  if (tb === 'str_no_lowercase' && startTemplates.includes(ta)) {
    const prefix = getStartPrefix(ruleA.id);
    if (/^[a-z]/.test(prefix)) return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑮ 交替大小写 vs 无大写/无小写
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'str_alternating_case' && (tb === 'str_no_uppercase' || tb === 'str_no_lowercase')) return true;
  if (tb === 'str_alternating_case' && (ta === 'str_no_uppercase' || ta === 'str_no_lowercase')) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑯ ASCII only vs 非 ASCII 规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const nonAscii = [
    'emoji_count', 'emoji_at_least', 'emoji_specific_category', 'emoji_smile',
    'emoji_hands', 'emoji_animal', 'emoji_food', 'emoji_heart', 'emoji_flag', 'emoji_gender_symbol',
    'emoji_zodiac', 'emoji_different',
    'emoji_bonus_contains_unicode_block', 'emoji_bonus_contains_dingbats', 'emoji_bonus_contains_cjk_symbol',
    'meme_chinese_phrase', 'word_english_and_chinese',
    'time_weekday_cn', 'time_month_cn', 'time_season_cn', 'time_zodiac_year',
    'chess_contains_piece', 'chess_contains_white_piece', 'chess_contains_black_piece',
    'chess_bonus_both_colors', 'chess_bonus_piece_pair', 'chess_piece_value',
    'sci_bonus_greek_letter', 'sci_math_symbol',
  ];
  if (ta === 'str_ascii_only' && nonAscii.includes(tb)) return true;
  if (tb === 'str_ascii_only' && nonAscii.includes(ta)) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑰ 无 Emoji vs Emoji 规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'emoji_no_emoji' && tb.startsWith('emoji_')) return true;
  if (tb === 'emoji_no_emoji' && ta.startsWith('emoji_')) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑱ 元音 > 辅音 vs 辅音 > 元音
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'str_more_vowels_than_consonants' && tb === 'str_more_consonants_than_vowels') return true;
  if (tb === 'str_more_vowels_than_consonants' && ta === 'str_more_consonants_than_vowels') return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑲ 偶数 > 奇数 vs 奇数 > 偶数
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'math_even_gt_odd' && tb === 'math_odd_gt_even') return true;
  if (tb === 'math_even_gt_odd' && ta === 'math_odd_gt_even') return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⑳ 升序数字 vs 降序数字
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'math_ascending_digits' && tb === 'math_descending_digits') return true;
  if (tb === 'math_ascending_digits' && ta === 'math_descending_digits') return true;

  // 字母升序 vs 字母降序
  if (ta === 'str_bonus_alphabetical_order' && tb === 'str_bonus_reverse_alphabetical') return true;
  if (tb === 'str_bonus_alphabetical_order' && ta === 'str_bonus_reverse_alphabetical') return true;

  // 降序数字 vs 严格递增数字
  if (ta === 'math_descending_digits' && tb === 'pat_bonus_strictly_increasing_numbers') return true;
  if (tb === 'math_descending_digits' && ta === 'pat_bonus_strictly_increasing_numbers') return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉑ 无零 vs 包含数字 0
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'math_no_zero' && tb === 'math_contains_number' && b.nums[0] === 0) return true;
  if (tb === 'math_no_zero' && ta === 'math_contains_number' && a.nums[0] === 0) return true;

  // 无零 vs 数字范围包含 0
  if (ta === 'math_no_zero' && tb === 'math_digit_range' && b.nums[0] === 0) return true;
  if (tb === 'math_no_zero' && ta === 'math_digit_range' && a.nums[0] === 0) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉒ 数字范围 vs 首位/末位数字
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'math_digit_range' && tb === 'math_first') {
    const d = b.nums[0];
    if (d < a.nums[0] || d > a.nums[1]) return true;
  }
  if (tb === 'math_digit_range' && ta === 'math_first') {
    const d = a.nums[0];
    if (d < b.nums[0] || d > b.nums[1]) return true;
  }
  if (ta === 'math_digit_range' && tb === 'math_last') {
    const d = b.nums[0];
    if (d < a.nums[0] || d > a.nums[1]) return true;
  }
  if (tb === 'math_digit_range' && ta === 'math_last') {
    const d = a.nums[0];
    if (d < b.nums[0] || d > b.nums[1]) return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉓ 数字范围下限 > 乘积目标 / 数字和
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (ta === 'math_digit_range' && tb === 'math_digit_product') return a.nums[0] > b.nums[0];
  if (tb === 'math_digit_range' && ta === 'math_digit_product') return b.nums[0] > a.nums[0];
  if (ta === 'math_digit_range' && tb === 'math_digit_sum') return a.nums[0] > b.nums[0];
  if (tb === 'math_digit_range' && ta === 'math_digit_sum') return b.nums[0] > a.nums[0];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉔ final_char_type_count 语义重叠
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    const fctA = parseFinalCharTypeCount(ruleA.id);
    const fctB = parseFinalCharTypeCount(ruleB.id);

    if (fctA) {
      // final_char_type_count(大写字母, n>0) vs str_no_uppercase
      if (fctA.type === '大写字母' && fctA.n > 0 && tb === 'str_no_uppercase') return true;
      // final_char_type_count(大写字母, n) vs str_uppercase_count(m) n≠m
      if (fctA.type === '大写字母' && tb === 'str_uppercase_count' && fctA.n !== b.nums[0]) return true;
      if (fctA.type === '大写字母' && tb === 'str_at_least_n_uppercase' && fctA.n < b.nums[0]) return true;

      // final_char_type_count(小写字母, n>0) vs str_no_lowercase
      if (fctA.type === '小写字母' && fctA.n > 0 && tb === 'str_no_lowercase') return true;
      // final_char_type_count(小写字母, n) vs str_lowercase_count(m) n≠m
      if (fctA.type === '小写字母' && tb === 'str_lowercase_count' && fctA.n !== b.nums[0]) return true;

      // final_char_type_count(数字, n) vs math_digit_count(m) n≠m
      if (fctA.type === '数字' && tb === 'math_digit_count' && fctA.n !== b.nums[0]) return true;
      // final_char_type_count(数字, n>0) vs math_digit_count(0)
      if (fctA.type === '数字' && fctA.n > 0 && tb === 'math_digit_count' && b.nums[0] === 0) return true;
      // final_char_type_count(数字, n) vs 长度规则
      if (fctA.type === '数字' && lengthTemplates.includes(tb) && fctA.n > b.nums[0]) return true;

      // final_char_type_count(标点符号, n) vs str_punctuation_count(m) n≠m
      if (fctA.type === '标点符号' && tb === 'str_punctuation_count' && fctA.n !== b.nums[0]) return true;
    }

    if (fctB) {
      if (fctB.type === '大写字母' && fctB.n > 0 && ta === 'str_no_uppercase') return true;
      if (fctB.type === '大写字母' && ta === 'str_uppercase_count' && fctB.n !== a.nums[0]) return true;
      if (fctB.type === '大写字母' && ta === 'str_at_least_n_uppercase' && fctB.n < a.nums[0]) return true;
      if (fctB.type === '小写字母' && fctB.n > 0 && ta === 'str_no_lowercase') return true;
      if (fctB.type === '小写字母' && ta === 'str_lowercase_count' && fctB.n !== a.nums[0]) return true;
      if (fctB.type === '数字' && ta === 'math_digit_count' && fctB.n !== a.nums[0]) return true;
      if (fctB.type === '数字' && fctB.n > 0 && ta === 'math_digit_count' && a.nums[0] === 0) return true;
      if (fctB.type === '数字' && lengthTemplates.includes(ta) && fctB.n > a.nums[0]) return true;
      if (fctB.type === '标点符号' && ta === 'str_punctuation_count' && fctB.n !== a.nums[0]) return true;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉕ final_digit_relations 语义重叠
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // final_digit_relations(op=和, target) vs math_digit_sum(target2)
  if (ta === 'final_digit_relations' && a.strParam === '和' && tb === 'math_digit_sum') {
    return a.nums[0] !== b.nums[0];
  }
  if (tb === 'final_digit_relations' && b.strParam === '和' && ta === 'math_digit_sum') {
    return b.nums[0] !== a.nums[0];
  }
  // final_digit_relations(op=积, target) vs math_digit_product(target2)
  if (ta === 'final_digit_relations' && a.strParam === '积' && tb === 'math_digit_product') {
    return a.nums[0] !== b.nums[0];
  }
  if (tb === 'final_digit_relations' && b.strParam === '积' && ta === 'math_digit_product') {
    return b.nums[0] !== a.nums[0];
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉖ final_no_two_consecutive_same_type vs 需要连续同类型的规则
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const needsConsecutiveSameType = [
    'pat_three_in_a_row', 'str_double_letter', 'math_digit_repeat',
    'pat_numbers_sequence', 'pat_alphabetical_sequence', 'pat_keyboard_adjacent',
  ];
  if (ta === 'final_no_two_consecutive_same_type' && needsConsecutiveSameType.includes(tb)) return true;
  if (tb === 'final_no_two_consecutive_same_type' && needsConsecutiveSameType.includes(ta)) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉗ 密码学模板冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // time_all_digits_unique vs time_contains_double_digits（直接对立）
  if (ta === 'time_all_digits_unique' && tb === 'time_contains_double_digits') return true;
  if (tb === 'time_all_digits_unique' && ta === 'time_contains_double_digits') return true;

  // time_all_digits_unique vs math_digit_count(0)（无数字时无意义）
  if (ta === 'time_all_digits_unique' && tb === 'math_digit_count' && b.nums[0] === 0) return true;
  if (tb === 'time_all_digits_unique' && ta === 'math_digit_count' && a.nums[0] === 0) return true;

  // time_contains_uppercase_word / time_contains_two_consecutive_upper vs str_no_uppercase
  const needsUpperNew = ['time_contains_uppercase_word', 'time_contains_two_consecutive_upper', 'time_starts_with_upper'];
  if (ta === 'str_no_uppercase' && needsUpperNew.includes(tb)) return true;
  if (tb === 'str_no_uppercase' && needsUpperNew.includes(ta)) return true;

  // time_ends_with_lower vs str_no_lowercase
  if (ta === 'str_no_lowercase' && tb === 'time_ends_with_lower') return true;
  if (tb === 'str_no_lowercase' && ta === 'time_ends_with_lower') return true;

  // time_alpha_between_digits / time_digit_letter_digit_sandwich vs math_digit_count(0) 或 str_alpha_count(0)
  const needsDigitAndLetter = ['time_alpha_between_digits', 'time_digit_letter_digit_sandwich'];
  if (ta === 'math_digit_count' && a.nums[0] === 0 && needsDigitAndLetter.includes(tb)) return true;
  if (tb === 'math_digit_count' && b.nums[0] === 0 && needsDigitAndLetter.includes(ta)) return true;
  if (ta === 'str_alpha_count' && a.nums[0] === 0 && needsDigitAndLetter.includes(tb)) return true;
  if (tb === 'str_alpha_count' && b.nums[0] === 0 && needsDigitAndLetter.includes(ta)) return true;

  // time_contains_equation 需要数字
  if (ta === 'time_contains_equation' && tb === 'math_digit_count' && b.nums[0] === 0) return true;
  if (tb === 'time_contains_equation' && ta === 'math_digit_count' && a.nums[0] === 0) return true;

  // time_contains_double_pair (ABBA) / time_contains_xyz (AAA) 与无重复规则冲突
  const needsRepeatStructure = ['time_contains_double_pair', 'time_contains_xyz'];
  for (const tmpl of needsRepeatStructure) {
    if (ta === tmpl && allUniqueTemplates.includes(tb)) return true;
    if (tb === tmpl && allUniqueTemplates.includes(ta)) return true;
    if (ta === tmpl && noRepeatTemplates.includes(tb)) return true;
    if (tb === tmpl && noRepeatTemplates.includes(ta)) return true;
  }
  // time_contains_xyz 还需要与 str_double_letter 不冲突（它其实需要 double letter），但不与 str_no_double_letter 共存
  if (ta === 'time_contains_xyz' && tb === 'str_no_double_letter') return true;
  if (tb === 'time_contains_xyz' && ta === 'str_no_double_letter') return true;

  // time_char_types_diversity(n=4) 需要所有4种字符类型
  // vs str_no_uppercase / str_no_lowercase / math_digit_count(0) / str_ascii_only（ASCII只有3类）
  if (ta === 'time_char_types_diversity' && a.nums[0] >= 4) {
    if (tb === 'str_no_uppercase' || tb === 'str_no_lowercase') return true;
    if (tb === 'math_digit_count' && b.nums[0] === 0) return true;
    if (tb === 'str_alpha_count' && b.nums[0] === 0) return true;
  }
  if (tb === 'time_char_types_diversity' && b.nums[0] >= 4) {
    if (ta === 'str_no_uppercase' || ta === 'str_no_lowercase') return true;
    if (ta === 'math_digit_count' && a.nums[0] === 0) return true;
    if (ta === 'str_alpha_count' && a.nums[0] === 0) return true;
  }

  // time_keyboard_pattern 与 final_no_two_consecutive_same_type 冲突（键盘片段都是同类型连续）
  if (ta === 'time_keyboard_pattern' && tb === 'final_no_two_consecutive_same_type') return true;
  if (tb === 'time_keyboard_pattern' && ta === 'final_no_two_consecutive_same_type') return true;

  // time_lucky_number 与 str_bonus_must_not_contain_digit 冲突
  if (ta === 'time_lucky_number' && tb === 'str_bonus_must_not_contain_digit' && a.nums[0] === b.nums[0]) return true;
  if (tb === 'time_lucky_number' && ta === 'str_bonus_must_not_contain_digit' && b.nums[0] === a.nums[0]) return true;
  // time_lucky_number(0) vs math_no_zero
  if (ta === 'time_lucky_number' && a.nums[0] === 0 && tb === 'math_no_zero') return true;
  if (tb === 'time_lucky_number' && b.nums[0] === 0 && ta === 'math_no_zero') return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉘ 新增 Emoji 规则冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // emoji_password_starts_with_emoji vs str_starts_with（开头不能既是emoji又是普通字符）
  if (ta === 'emoji_password_starts_with_emoji' && startTemplates.includes(tb)) return true;
  if (tb === 'emoji_password_starts_with_emoji' && startTemplates.includes(ta)) return true;
  if (ta === 'emoji_password_starts_with_emoji' && tb === 'str_starts_with_letter') return true;
  if (tb === 'emoji_password_starts_with_emoji' && ta === 'str_starts_with_letter') return true;

  // emoji_password_ends_with_emoji vs str_ends_with / str_ends_with_number / str_ends_with_letter
  if (ta === 'emoji_password_ends_with_emoji' && endTemplates.includes(tb)) return true;
  if (tb === 'emoji_password_ends_with_emoji' && endTemplates.includes(ta)) return true;
  if (ta === 'emoji_password_ends_with_emoji' && tb === 'str_ends_with_number') return true;
  if (tb === 'emoji_password_ends_with_emoji' && ta === 'str_ends_with_number') return true;

  // 新emoji规则 vs emoji_no_emoji（需要emoji vs 不能有emoji）
  const newEmojiNeeds = ['emoji_consecutive_pair', 'emoji_sandwich',
    'emoji_password_starts_with_emoji', 'emoji_password_ends_with_emoji',
    'emoji_no_standalone_emoji', 'emoji_different_categories'];
  for (const et of newEmojiNeeds) {
    if (ta === et && tb === 'emoji_no_emoji') return true;
    if (tb === et && ta === 'emoji_no_emoji') return true;
  }

  // 新emoji规则 vs str_ascii_only
  const newEmojiNonAscii = ['emoji_consecutive_pair', 'emoji_sandwich',
    'emoji_password_starts_with_emoji', 'emoji_password_ends_with_emoji',
    'emoji_no_standalone_emoji', 'emoji_different_categories'];
  for (const et of newEmojiNonAscii) {
    if (ta === et && tb === 'str_ascii_only') return true;
    if (tb === et && ta === 'str_ascii_only') return true;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉙ 新增象棋规则冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 棋子规则 vs str_ascii_only
  const newChessNonAscii = ['chess_both_colors_pieces', 'chess_piece_count',
    'chess_notation_pair', 'chess_king_safety'];
  for (const ct of newChessNonAscii) {
    if (ta === ct && tb === 'str_ascii_only') return true;
    if (tb === ct && ta === 'str_ascii_only') return true;
  }

  // chess_both_colors_pieces vs emoji_no_emoji（不冲突，但vs str_ascii_only已处理）
  // chess_both_colors_pieces 需要白+黑棋子 vs chess_contains_white_piece / chess_contains_black_piece
  // 这些不互斥，因为 both_colors 是更严格的要求

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉚ 新增图案规则冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 需要数字的图案规则 vs math_digit_count(0)
  const newPatNeedsDigits = ['pat_digit_pair_sum', 'pat_numeric_palindrome',
    'pat_rise_and_fall_digits', 'pat_symmetric_digits', 'pat_mirror_digit_pair'];
  for (const pt of newPatNeedsDigits) {
    if (ta === pt && tb === 'math_digit_count' && b.nums[0] === 0) return true;
    if (tb === pt && ta === 'math_digit_count' && a.nums[0] === 0) return true;
  }

  // pat_char_code_sequence 需要字母 vs str_alpha_count(0)
  if (ta === 'pat_char_code_sequence' && tb === 'str_alpha_count' && b.nums[0] === 0) return true;
  if (tb === 'pat_char_code_sequence' && ta === 'str_alpha_count' && a.nums[0] === 0) return true;

  // pat_repeating_triplet vs 全部唯一模板（需要重复字符）
  if (ta === 'pat_repeating_triplet' && allUniqueTemplates.includes(tb)) return true;
  if (tb === 'pat_repeating_triplet' && allUniqueTemplates.includes(ta)) return true;
  if (ta === 'pat_repeating_triplet' && noRepeatTemplates.includes(tb)) return true;
  if (tb === 'pat_repeating_triplet' && noRepeatTemplates.includes(ta)) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉛ 新增科学规则冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // sci_password_has_chemical_formula 需要括号和数字 vs str_special_char_count(0)
  if (ta === 'sci_password_has_chemical_formula' && tb === 'str_special_char_count' && b.nums[0] === 0) return true;
  if (tb === 'sci_password_has_chemical_formula' && ta === 'str_special_char_count' && a.nums[0] === 0) return true;

  // sci_contains_color_hex 需要 # vs str_special_char_count(0)
  if (ta === 'sci_contains_color_hex' && tb === 'str_special_char_count' && b.nums[0] === 0) return true;
  if (tb === 'sci_contains_color_hex' && ta === 'str_special_char_count' && a.nums[0] === 0) return true;

  // sci_si_prefix 需要字母 vs str_alpha_count(0)
  if (ta === 'sci_si_prefix' && tb === 'str_alpha_count' && b.nums[0] === 0) return true;
  if (tb === 'sci_si_prefix' && ta === 'str_alpha_count' && a.nums[0] === 0) return true;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ㉜ 新增密码学规则冲突
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // time_contains_binary 需要数字 vs math_digit_count(0)
  if (ta === 'time_contains_binary' && tb === 'math_digit_count' && b.nums[0] === 0) return true;
  if (tb === 'time_contains_binary' && ta === 'math_digit_count' && a.nums[0] === 0) return true;

  // time_contains_hex_encoding 需要字母和数字 vs math_digit_count(0) 或 str_alpha_count(0)
  if (ta === 'time_contains_hex_encoding' && tb === 'math_digit_count' && b.nums[0] === 0) return true;
  if (tb === 'time_contains_hex_encoding' && ta === 'math_digit_count' && a.nums[0] === 0) return true;
  if (ta === 'time_contains_hex_encoding' && tb === 'str_alpha_count' && b.nums[0] === 0) return true;
  if (tb === 'time_contains_hex_encoding' && ta === 'str_alpha_count' && a.nums[0] === 0) return true;

  // time_contains_base64 需要字母和数字
  if (ta === 'time_contains_base64' && tb === 'str_alpha_count' && b.nums[0] === 0) return true;
  if (tb === 'time_contains_base64' && ta === 'str_alpha_count' && a.nums[0] === 0) return true;

  // time_password_has_unicode_escape 需要反斜杠 vs str_special_char_count(0)
  if (ta === 'time_password_has_unicode_escape' && tb === 'str_special_char_count' && b.nums[0] === 0) return true;
  if (tb === 'time_password_has_unicode_escape' && ta === 'str_special_char_count' && a.nums[0] === 0) return true;

  // time_contains_morse_code 需要点和横线（.-字符）vs 长度太短
  if (ta === 'time_contains_morse_code' && tb === 'str_max_length' && b.nums[0] < 2) return true;
  if (tb === 'time_contains_morse_code' && ta === 'str_max_length' && a.nums[0] < 2) return true;
  if (ta === 'time_contains_morse_code' && tb === 'str_exact' && b.nums[0] < 2) return true;
  if (tb === 'time_contains_morse_code' && ta === 'str_exact' && a.nums[0] < 2) return true;

  return false;
}

/**
 * 为一局游戏选择规则（含冲突检测）
 * @param {Array} rulePool - 全部规则池
 * @param {number} difficulty - 难度 1-5
 * @returns {{ baseRules: Array, bonusRules: Array }}
 */
export function selectRulesForGame(rulePool, difficulty) {
  const bonusCount = 20 + (difficulty - 1) * 5;
  
  // 基础规则从难度1-2的规则中选
  const easyRules = rulePool.filter(r => r.difficulty <= 2);
  const baseRules = pickNonConflicting(easyRules, 3);
  const baseIds = new Set(baseRules.map(r => r.id));
  
  // 额外规则从难度适当的规则中选
  const maxDiff = Math.min(difficulty + 2, 5);
  const candidateRules = rulePool.filter(
    r => r.difficulty <= maxDiff && !baseIds.has(r.id)
  );
  const bonusRules = pickNonConflicting(candidateRules, bonusCount, baseRules);
  
  return { baseRules, bonusRules };
}

/**
 * 从候选池中选取不互斥的 N 条规则
 * @param {Array} pool - 候选规则池
 * @param {number} count - 需要选取的数量
 * @param {Array} [existing] - 已有的规则（新规则不能与之冲突）
 */
function pickNonConflicting(pool, count, existing = []) {
  const allExisting = [...existing];
  let bestSelected = [];

  // 多轮洗牌尝试，找到足够多或最多的不冲突规则组合
  const maxAttempts = bestSelected.length < count ? 5 : 1;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffle(pool);
    const selected = [];
    const current = [...allExisting];

    for (const candidate of shuffled) {
      if (selected.length >= count) break;
      const conflicts = current.some(r => areConflicting(r, candidate));
      if (!conflicts) {
        selected.push(candidate);
        current.push(candidate);
      }
    }

    if (selected.length > bestSelected.length) {
      bestSelected = selected;
    }
    if (bestSelected.length >= count) break;
  }

  return bestSelected;
}

/** 验证密码是否满足某条规则 */
export function validateRule(password, rule) {
  return rule.validate(password);
}

/** 验证密码是否满足所有规则 */
export function validateAllRules(password, rules) {
  return rules.map(rule => {
    const result = validateRule(password, rule);
    // 支持返回 { passed, detail } 对象或纯 boolean
    if (typeof result === 'object' && result !== null) {
      return { rule, passed: result.passed, detail: result.detail || null };
    }
    return { rule, passed: result, detail: null };
  });
}
