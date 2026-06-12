// Emoji 规则 (~300 条组合)
export const emojiTemplates = [
  {
    id: 'emoji_count',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须恰好包含 {n} 个 Emoji',
    params: { n: [1,2,3,4,5] },
    validate: (pwd, { n }) => {
      const count = [...pwd].filter(c => /\p{Emoji}/u.test(c)).length;
      return count === n;
    }
  },
  {
    id: 'emoji_at_least',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中至少包含 {n} 个 Emoji',
    params: { n: [1,2,3,4] },
    validate: (pwd, { n }) => [...pwd].filter(c => /\p{Emoji}/u.test(c)).length >= n
  },
  {
    id: 'emoji_specific_category',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个 "{cat}" 类 Emoji',
    params: { cat: ['笑脸','动物','食物','运动','交通','天气','手势','心形','植物','音乐','星座','旗帜','衣服','建筑'] },
    validate: (pwd, { cat }) => {
      const emojiMap = {
        '笑脸': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','😏','😒','😞','😔','😟','😕','🙁','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰'],
        '动物': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈'],
        '食物': ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🍜','🍝','🍣','🍤','🍚','🍩','🍪','🎂','🍰','🧁','🍫','🍬','🍭','🍿','🧈'],
        '运动': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','⛳','🎣','🤿','🥊','🥋','⛸️','🎿','🛷','🥌','🎯','🪁','🏹'],
        '交通': ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','✈️','🚀','🛸','🚁','🛶','⛵','🚤','🛳️','🚢','🚲','🛴','🏍️'],
        '天气': ['☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','🌪️','🌫️','🌈','☔','⚡','🌟','⭐','🌙','☄️','💧','💦'],
        '手势': ['👍','👎','👊','✊','🤛','🤜','🤞','✌️','🤟','🤘','👌','🤌','🤏','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','🤙','💪','🦾','🖕','✍️','🙏','👏'],
        '心形': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️'],
        '植物': ['🌵','🎄','🌲','🌳','🌴','🌱','🌿','☘️','🍀','🎍','🎋','🍃','🍂','🍁','🌾','🌺','🌻','🌹','🌷','🌼','🌸','💐','🍄','🌰'],
        '音乐': ['🎵','🎶','🎼','🎤','🎧','🎷','🎸','🎹','🎺','🎻','🥁','🎬','🎮','🎲','♟️','🎯'],
        '星座': ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎'],
        '建筑': ['🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩️','🕋'],
        '旗帜': ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️'],
        '衣服': ['👚','👕','👖','👔','👗','👙','👘','👠','👡','👢','👞','👟','🧢','👒','🎩','🎓','🧣','🧤','🧥','👜','👛','🎒'],
      };
      const emojis = emojiMap[cat] || [];
      return emojis.some(e => pwd.includes(e));
    }
  },
  {
    id: 'emoji_no_emoji',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中不能包含任何 Emoji',
    params: {},
    validate: (pwd) => ![...pwd].some(c => /\p{Emoji}/u.test(c))
  },
  {
    id: 'emoji_smile',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须包含一个笑脸 Emoji 😊',
    params: {},
    validate: (pwd) => /[😀😃😄😁😆😅🤣😂🙂😊😇🥰😍🤩😘]/u.test(pwd)
  },
  {
    id: 'emoji_hands',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须包含一个手势 Emoji（如 👍👎✌️🤞）',
    params: {},
    validate: (pwd) => /[👍👎👊✊🤛🤜🤞✌️🤟🤘👌🤌🤏👈👉👆👇☝️✋🤚🖐️🖖👋🤙💪🦾🖕✍️🙏👏]/u.test(pwd)
  },
  {
    id: 'emoji_animal',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须包含一个动物 Emoji 🐱',
    params: {},
    validate: (pwd) => /[🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵]/u.test(pwd)
  },
  {
    id: 'emoji_food',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须包含一个食物 Emoji 🍕',
    params: {},
    validate: (pwd) => /[🍎🍐🍊🍋🍌🍉🍇🍓🍔🍟🍕🌭🥪🌮🍜🍝🍣🍤🍩🍪🎂🍰]/u.test(pwd)
  },
  {
    id: 'emoji_heart',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须包含一个爱心 Emoji ❤️',
    params: {},
    validate: (pwd) => /[❤️🧡💛💚💙💜🖤🤍🤎💔❣️💕💞💓💗💖💘💝💟♥️]/u.test(pwd)
  },
  {
    id: 'emoji_flag',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个旗帜 Emoji 🚩',
    params: {},
    validate: (pwd) => /[🏁🚩🎌🏴🏳️]/u.test(pwd)
  },
  {
    id: 'emoji_gender_symbol',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个性别符号 (♂ 或 ♀)',
    params: {},
    validate: (pwd) => /[♂♀⚧]/u.test(pwd)
  },
  {
    id: 'emoji_zodiac',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个星座符号',
    params: {},
    validate: (pwd) => /[♈♉♊♋♌♍♎♏♐♑♒♓⛎]/u.test(pwd)
  },
  {
    id: 'emoji_different',
    category: 'Emoji',
    difficulty: 3,
    description: '密码中必须包含 {n} 个不同类型的 Emoji',
    params: { n: [2,3,4] },
    validate: (pwd, { n }) => {
      const emojis = [...pwd].filter(c => /\p{Emoji}/u.test(c));
      return new Set(emojis).size >= n;
    }
  },

  // ━━━ 新增规则：扩展 Emoji 分类 ━━━

  {
    id: 'emoji_consecutive_pair',
    category: 'Emoji',
    difficulty: 1,
    description: '密码中必须包含两个连续的 Emoji',
    params: {},
    validate: (pwd) => {
      const chars = [...pwd];
      for (let i = 0; i < chars.length - 1; i++) {
        if (/\p{Emoji}/u.test(chars[i]) && /\p{Emoji}/u.test(chars[i+1])) return true;
      }
      return false;
    }
  },
  {
    id: 'emoji_sandwich',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中必须包含一个被两个 Emoji 夹住的非 Emoji 字符',
    hint: '例如：❤A❤️ 或 🎉x🎉',
    params: {},
    validate: (pwd) => {
      const chars = [...pwd];
      for (let i = 0; i < chars.length - 2; i++) {
        if (/\p{Emoji}/u.test(chars[i]) && !/\p{Emoji}/u.test(chars[i+1]) && /\p{Emoji}/u.test(chars[i+2])) return true;
      }
      return false;
    }
  },
  {
    id: 'emoji_password_starts_with_emoji',
    category: 'Emoji',
    difficulty: 1,
    description: '密码必须以 Emoji 开头',
    params: {},
    validate: (pwd) => {
      const first = [...pwd][0];
      return first && /\p{Emoji}/u.test(first);
    }
  },
  {
    id: 'emoji_password_ends_with_emoji',
    category: 'Emoji',
    difficulty: 1,
    description: '密码必须以 Emoji 结尾',
    params: {},
    validate: (pwd) => {
      const chars = [...pwd];
      return chars.length > 0 && /\p{Emoji}/u.test(chars[chars.length - 1]);
    }
  },
  {
    id: 'emoji_no_standalone_emoji',
    category: 'Emoji',
    difficulty: 2,
    description: '密码中每个 Emoji 旁边必须紧邻一个非 Emoji 字符',
    hint: 'Emoji 不能孤立存在，旁边必须有字母、数字或符号',
    params: {},
    validate: (pwd) => {
      const chars = [...pwd];
      const emojiIndices = [];
      for (let i = 0; i < chars.length; i++) {
        if (/\p{Emoji}/u.test(chars[i])) emojiIndices.push(i);
      }
      if (emojiIndices.length === 0) return false;
      return emojiIndices.every(i => {
        const prevOk = i > 0 && !/\p{Emoji}/u.test(chars[i-1]);
        const nextOk = i < chars.length - 1 && !/\p{Emoji}/u.test(chars[i+1]);
        return prevOk || nextOk;
      });
    }
  },
  {
    id: 'emoji_different_categories',
    category: 'Emoji',
    difficulty: 3,
    description: '密码中必须包含 {n} 个不同类别的 Emoji',
    hint: '不同类别：笑脸、动物、食物、心形、运动等',
    params: { n: [2, 3] },
    validate: (pwd, { n }) => {
      const categories = {
        faces: /[😀😃😄😁😆😅🤣😂🙂😊😇🥰😍🤩😘😗😚😋😛😜🤪😝🤑🤗🤭😏😒😞😔😟😕🙁😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰]/u,
        animals: /[🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🐦🐤🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋]/u,
        food: /[🍎🍐🍊🍋🍌🍉🍇🍓🍒🍑🥭🍍🥥🥝🍅🥑🍔🍟🍕🌭🥪🌮🌯🍜🍝🍣🍤🍚🍩🍪🎂🍰]/u,
        hearts: /[❤🧡💛💚💙💜🖤🤍🤎💔❣💕💞💓💗💖💘💝💟♥]/u,
        sports: /[⚽🏀🏈⚾🥎🎾🏐🏉🥏🎱🪀🏓🏸🏒🏑🥍🏏⛳🎣🤿🥊🥋]/u,
      };
      let count = 0;
      for (const regex of Object.values(categories)) {
        if (regex.test(pwd)) count++;
      }
      return count >= n;
    }
  },
];
