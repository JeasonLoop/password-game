// 网络热梗规则 (~500 条组合)
export const memeTemplates = [
  {
    id: 'meme_contains_phrase',
    category: '热梗',
    difficulty: 1,
    description: '密码中必须包含 "{phrase}"',
    params: { phrase: [
      'rizz','skibidi','gyat','sigma','based','cringe','cap','no cap','bussin',
      'slay','yass','queen','king','vibe','mood','sus','chad','goat','based',
      'flex','lit','fire','drip','yeet','pog','poggers','kek','lmao','lmfao',
      'bruh','sheesh','bet','ick','slaps','banger','cooked','ate','left no crumbs',
      'delulu','pick me','main character','era','its giving','hot girl','clean girl',
      'glow up','red flag','green flag','ick list','situationship','rizzler',
      'skrrt','woke','cancelled','stan','ship','clapback','receipts','tea','spill',
    ] },
    validate: (pwd, { phrase }) => pwd.toLowerCase().includes(phrase.replace(/\s/g, ''))
  },
  {
    id: 'meme_chinese_phrase',
    category: '热梗',
    difficulty: 1,
    description: '密码中必须包含中文热梗 "{phrase}"',
    params: { phrase: [
      '绝绝子','YYDS','emo了','摆烂','内卷','躺平','凡尔赛','社恐','社牛','破防',
      '显眼包','特种兵旅游','city不city','遥遥领先','尊嘟假嘟','哈基米','搭子',
      '纯爱战士','发疯文学','精神内耗','电子榨菜','无效化妆','松弛感','多巴胺',
      '芭比Q了','栓Q','真的会谢','家人们谁懂啊','CPU烧了','CPU干烧了','你没事吧',
      '退退退','他在CPU你','恐龙抗狼','我姓石','我勒个豆','泰裤辣','鼠鼠我啊',
      '命运齿轮开始转动','泼天富贵','遥遥领先','早C晚A','公主请上车','不确定再看看',
      '算了算了','无所谓我会出手','简直无语','好家伙','不愧是你','大意了没有闪',
    ] },
    validate: (pwd, { phrase }) => pwd.includes(phrase)
  },
  {
    id: 'meme_song_lyric',
    category: '热梗',
    difficulty: 2,
    description: '密码中必须包含歌词片段 "{lyric}"（拼音或英文）',
    params: { lyric: [
      'lonely','dance','baby','sorry','hello','goodbye','forever','together',
      'shine','dream','believe','imagine','wonder','magic','thunder','lightning',
      'warriors','legends','heroes','champion','survivor','fighter','believer',
      'happy','sad','crazy','lazy','hazy','amazing','fantastic','incredible',
    ] },
    validate: (pwd, { lyric }) => pwd.toLowerCase().includes(lyric)
  },
  {
    id: 'meme_movie_quote',
    category: '热梗',
    difficulty: 2,
    description: '密码中必须包含经典电影台词中的词 "{word}"',
    params: { word: [
      'force','rings','matrix','avatar','titanic','gladiator','inception',
      'interstellar','gravity','joker','batman','spiderman','ironman','thor',
      'avengers','wakanda','panther','bond','bourne','mission','impossible',
      'terminator','predator','alien','riddik','fury','saving','private','ryan',
    ] },
    validate: (pwd, { word }) => pwd.toLowerCase().includes(word)
  },
  {
    id: 'meme_leet_speak',
    category: '热梗',
    difficulty: 2,
    description: '密码中必须包含一个 Leet Speak 风格的词（至少3个字符，含数字替换字母）',
    params: {},
    validate: (pwd) => /[a-zA-Z]*\d[a-zA-Z]*/.test(pwd) && /[a-zA-Z]{2,}/.test(pwd)
  },
  {
    id: 'meme_uwu_speak',
    category: '热梗',
    difficulty: 2,
    description: '密码中必须包含 "uwu" 或 "owo"',
    params: {},
    validate: (pwd) => /(uwu|owo|UwU|OwO)/i.test(pwd)
  },
  {
    id: 'meme_keyboard_smash',
    category: '热梗',
    difficulty: 1,
    description: '密码中必须包含键盘乱打风格的片段（至少4个连续字母）',
    params: {},
    validate: (pwd) => {
      const smashes = ['asdf','jkl','qwer','zxcv','hjkl','fdsa','poiu','mnbv'];
      return smashes.some(s => pwd.toLowerCase().includes(s));
    }
  },
  {
    id: 'meme_gaming_term',
    category: '热梗',
    difficulty: 1,
    description: '密码中必须包含游戏术语 "{term}"',
    params: { term: [
      'gg','ez','noob','pro','ggwp','afk','brb','glhf','nerf','buff',
      'op','meta','dps','tank','healer','carry','support','jungle','mid','top',
      'botlane','gank','farm','push','defend','clutch','ace','pentakill','wipe',
      'respawn','spawn','loot','drop','zone','circle','headshot','wallhack',
    ] },
    validate: (pwd, { term }) => pwd.toLowerCase().includes(term)
  },
  {
    id: 'meme_programming_term',
    category: '热梗',
    difficulty: 2,
    description: '密码中必须包含编程梗 "{term}"',
    params: { term: [
      'todo','fixme','hack','bug','feature','hotfix','patch','deploy','shipit',
      'itworks','worksonmymachine','lgtm','ship','merge','conflict','rebase',
      'gitgud','codenix','stackoverflow','copypaste','hello world','undefined',
      'null','nan','semicolon','syntax','compile','runtime','exception','crash',
    ] },
    validate: (pwd, { term }) => pwd.toLowerCase().includes(term.replace(/\s/g, ''))
  },
  {
    id: 'meme_internet_slang',
    category: '热梗',
    difficulty: 1,
    description: '密码中必须包含网络缩略语 "{slang}"',
    params: { slang: [
      'lol','rofl','lmao','tbh','imo','imho','tldr','ftw','irl','afaik',
      'ianal','nsfw','sfw','fomo','yolo','jk','idk','idc','ttyl','brb',
      'gtg','nvm','omw','rn','tfw','mfw','icymi','smh','tifu','ama',
      'eli5','til','op','oc','cmv','dae','hmu','wip','eta','qed',
    ] },
    validate: (pwd, { slang }) => pwd.toLowerCase().includes(slang)
  },
];
