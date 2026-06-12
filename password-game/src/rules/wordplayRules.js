// 文字游戏规则 (~400 条组合)
export const wordplayTemplates = [
  {
    id: 'word_anagram_of',
    category: '文字游戏',
    difficulty: 3,
    description: '密码中必须包含 "{word}" 的一个变位词',
    params: { word: [
      'listen','silent','heart','earth','angel','glean','caret','cater',
      'dear','dare','read','stop','spot','post','tops','opts',
      'team','meat','mate','tame','east','seat','teas','ates',
      'stale','steal','least','slate','tales','tesla',
      'cat','act','dog','god','rat','tar','art','bat','tab',
      'night','thing','inch','chin','loop','pool','polo',
      'race','care','acre','note','tone','rose','sore','eros',
    ] },
    validate: (pwd, { word }) => {
      const sorted = word.split('').sort().join('');
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      return words.some(w => w.length === word.length && w.toLowerCase().split('').sort().join('') === sorted);
    }
  },
  {
    id: 'word_contains_color',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含颜色 "{color}"（中文或英文）',
    params: { color: [
      'red','blue','green','yellow','black','white','purple','orange',
      'pink','brown','gray','gold','silver','cyan','magenta','violet',
      '红','蓝','绿','黄','黑','白','紫','橙','粉','棕','灰','金','银','青',
    ] },
    validate: (pwd, { color }) => pwd.toLowerCase().includes(color)
  },
  {
    id: 'word_rhyming_pair',
    category: '文字游戏',
    difficulty: 3,
    description: '密码中必须包含一对押韵的单词（如 cat/hat, light/night）',
    params: {},
    validate: (pwd) => {
      const rhymeGroups = [
        ['cat','hat','bat','rat','mat','fat','pat','sat','chat','flat','that'],
        ['light','night','right','fight','sight','might','tight','bright','flight'],
        ['day','way','say','play','stay','gray','bay','may','pay','ray','lay'],
        ['love','dove','glove','above','shove','of'],
        ['time','rhyme','climb','dime','lime','mime','prime','crime','sublime'],
        ['fire','wire','tire','liar','higher','desire','empire','entire'],
        ['star','far','car','bar','tar','jar','scar','guitar','radar'],
        ['moon','soon','noon','spoon','balloon','cartoon','tycoon','monsoon'],
        ['game','name','same','flame','frame','shame','blame','tame','came'],
        ['dream','stream','team','scream','beam','cream','steam','extreme'],
        ['king','sing','ring','wing','thing','spring','bring','string','swing'],
        ['cool','rule','school','pool','tool','fool','jewel','fuel'],
        ['snow','go','know','show','grow','low','blow','slow','flow','throw'],
        ['rain','pain','train','brain','chain','plain','gain','main','vain','stain'],
        ['sky','fly','why','try','cry','buy','high','sigh','spy','deny','reply'],
      ];
      const words = (pwd.match(/[a-zA-Z]{3,}/g) || []).map(w => w.toLowerCase());
      for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
          for (const group of rhymeGroups) {
            if (group.includes(words[i]) && group.includes(words[j])) {
              return true;
            }
          }
        }
      }
      return false;
    }
  },
  {
    id: 'word_alliteration',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含至少 {n} 个以相同字母开头的单词',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => {
      const words = (pwd.match(/[a-zA-Z]+/g) || []).map(w => w[0].toLowerCase());
      const freq = {};
      words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
      return Object.values(freq).some(v => v >= n);
    }
  },
  {
    id: 'word_english_and_chinese',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须同时包含英文和中文',
    params: {},
    validate: (pwd) => /[a-zA-Z]/.test(pwd) && /[\u4e00-\u9fff]/.test(pwd)
  },
  {
    id: 'word_no_letter_e',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中不能包含字母 e（致敬《消失的字母E》小说）',
    params: {},
    validate: (pwd) => !/[eE]/.test(pwd)
  },
  {
    id: 'word_pangram_check',
    category: '文字游戏',
    difficulty: 3,
    description: '密码中必须包含所有元音字母 (a e i o u)',
    params: {},
    validate: (pwd) => {
      const lower = pwd.toLowerCase();
      return ['a','e','i','o','u'].every(v => lower.includes(v));
    }
  },
  {
    id: 'word_letter_value_sum',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中所有字母的字母表位置之和（a=1,b=2...）必须等于 {target}',
    params: { target: [20,30,40,50,60,70,80,90,100,120,150,200] },
    validate: (pwd, { target }) => {
      let sum = 0;
      for (const c of pwd) {
        const code = c.toLowerCase().charCodeAt(0);
        if (code >= 97 && code <= 122) sum += code - 96;
      }
      return sum === target;
    }
  },
  {
    id: 'word_contains_proverb',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含谚语或成语的一部分',
    params: {},
    validate: (pwd) => {
      const proverbs = [
        'actions speak','better late','break a leg','call it a day',
        'easy come','fortune favors','hit the sack','it takes two',
        'kill two birds','let the cat','no pain','once in a blue',
        'piece of cake','practice makes','raining cats','the ball is',
        'when in rome','you can lead','rome was','all that glitters',
        '千里之行','熟能生巧','画龙点睛','一石二鸟','守株待兔','亡羊补牢',
        '井底之蛙','杯弓蛇影','画蛇添足','对牛弹琴','掩耳盗铃','刻舟求剑',
        '拔苗助长','叶公好龙','狐假虎威','三人成虎','塞翁失马','鹬蚌相争',
      ];
      return proverbs.some(p => pwd.toLowerCase().includes(p));
    }
  },
  {
    id: 'word_heterogram',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含一个没有任何重复字母的单词（至少5个字母）',
    params: {},
    validate: (pwd) => {
      const words = pwd.match(/[a-zA-Z]{5,}/g) || [];
      return words.some(w => new Set(w.toLowerCase().split('')).size === w.length);
    }
  },
  {
    id: 'word_vowel_to_consonant_ratio',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中元音与辅音的比例必须恰好为 {ratio}',
    params: { ratio: ['1:1','1:2','2:1','1:3','2:3'] },
    validate: (pwd, { ratio }) => {
      const v = (pwd.match(/[aeiouAEIOU]/g) || []).length;
      const c = (pwd.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
      if (v === 0 && c === 0) return false;
      const [a,b] = ratio.split(':').map(Number);
      return v * b === c * a;
    }
  },
  {
    id: 'word_starts_and_ends_same',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须有一个单词以相同字母开头和结尾（至少3个字母）',
    params: {},
    validate: (pwd) => {
      const words = pwd.match(/[a-zA-Z]{3,}/g) || [];
      return words.some(w => w[0].toLowerCase() === w[w.length - 1].toLowerCase());
    }
  },
  {
    id: 'word_contains_emotion',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含一个表达情绪的词',
    params: {},
    validate: (pwd) => {
      const emotions = [
        'happy','sad','angry','excited','scared','brave','calm','peace','joy',
        'fear','love','hate','hope','dream','wish','smile','cry','laugh','weep',
        '开心','伤心','难过','高兴','愤怒','害怕','勇敢','平静','快乐','恐惧',
        '热爱','恨','希望','梦想','愿望','微笑','哭泣','大笑','流泪','激动',
      ];
      return emotions.some(e => pwd.toLowerCase().includes(e));
    }
  },
  {
    id: 'word_number_to_word',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中必须包含数字对应的英文单词 "{word}"',
    params: { word: ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','twenty','thirty','hundred','thousand','million'] },
    validate: (pwd, { word }) => pwd.toLowerCase().includes(word)
  },
  {
    id: 'word_contains_animal_sound',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含一个动物叫声',
    params: {},
    validate: (pwd) => {
      const sounds = [
        'meow','woof','bark','moo','oink','quack','cluck','roar','hiss',
        'chirp','ribbit','neigh','baa','caw','hoot','buzz','squeak','growl',
        '喵','汪','哞','哼','嘎','咕','吼','嘶','叽','呱','咩',
      ];
      return sounds.some(s => pwd.toLowerCase().includes(s));
    }
  },
  {
    id: 'word_caesar_cipher',
    category: '文字游戏',
    difficulty: 4,
    description: '密码中必须包含一个与 "{word}" 差 {shift} 位的凯撒密码单词',
    params: { word: ['hello','world','code','game','play','star','moon'], shift: [1,3,5,7] },
    validate: (pwd, { word, shift }) => {
      const encoded = word.split('').map(c => {
        const code = c.charCodeAt(0);
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }).join('');
      return pwd.toLowerCase().includes(encoded);
    }
  },
  {
    id: 'word_spoonerism',
    category: '文字游戏',
    difficulty: 3,
    description: '密码中必须包含两个首字母可互换的单词（如 Dear Queen → Queer Dean 的概念）',
    params: {},
    validate: (pwd) => {
      const words = pwd.match(/[a-zA-Z]{3,}/g) || [];
      for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
          const w1 = words[i].toLowerCase();
          const w2 = words[j].toLowerCase();
          if (w1[0] !== w2[0] && w1.slice(1) === w2.slice(1)) return true;
        }
      }
      return false;
    }
  },
  {
    id: 'word_ambigram',
    category: '文字游戏',
    difficulty: 3,
    description: '密码中必须包含一个仅由对称字母组成的单词（仅含 H I N O S X Z）',
    params: {},
    validate: (pwd) => {
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      return words.some(w => w.length >= 3 && /^[HINOSXZhinossxz]+$/.test(w));
    }
  },
  {
    id: 'word_no_repeating_letters',
    category: '文字游戏',
    difficulty: 2,
    description: '密码中不能有任何重复的字母（每个字母最多出现1次）',
    params: {},
    validate: (pwd) => {
      const letters = (pwd.match(/[a-zA-Z]/g) || []).map(l => l.toLowerCase());
      return new Set(letters).size === letters.length;
    }
  },
  {
    id: 'word_morse_code',
    category: '文字游戏',
    difficulty: 4,
    description: '密码中必须包含 SOS 的莫尔斯码 (...---...)',
    params: {},
    validate: (pwd) => pwd.includes('...---...')
  },
];
