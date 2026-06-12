// Mega 规则扩展 — 超大参数空间，直达 3000+
export const megaTemplates = [
  // ═══ 巨大的参数空间模板 ═══

  // 密码必须包含某个英文单词（100个常用词）
  {
    id: 'mega_contains_common_word',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含单词 "{word}"',
    params: { word: [
      'apple','banana','cherry','dragon','eagle','falcon','garden','harbor','island','jungle',
      'knight','lemon','monkey','ninja','orange','penguin','queen','rocket','sunset','tiger',
      'unicorn','violet','wizard','yellow','zenith','bridge','castle','diamond','emerald','forest',
      'galaxy','horizon','igloo','jigsaw','koala','lantern','mirror','nebula','ocean','planet',
      'quartz','rainbow','shadow','thunder','umbrella','voyage','window','anchor','button','candle',
      'desert','engine','feather','guitar','hammer','insect','jacket','kettle','ladder','magnet',
      'needle','oxygen','puzzle','quiver','ribbon','scroll','trophy','utopia','velvet','wallet',
      'anchor','bamboo','cookie','donkey','elbow','fossil','ginger','helmet','igloo','jumper',
      'karate','lizard','marble','napkin','olive','parrot','quokka','rabbit','sandals','tunnel',
      'urinal','vacuum','waffle','yogurt','zipper','anchor','badger','cactus','dolphin','elephant',
    ] },
    validate: (pwd, { word }) => pwd.toLowerCase().includes(word)
  },

  // 密码中必须包含一个含有特定前缀的单词
  {
    id: 'mega_word_prefix',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须有一个以 "{prefix}" 开头的单词',
    params: { prefix: [
      'pre','pro','con','dis','mis','over','under','inter','super','extra',
      'anti','auto','bio','micro','mini','multi','non','post','semi','sub',
      'tele','trans','ultra','uni','tri','re','un','in','im','ex',
      'hyper','mega','giga','nano','pico','kilo','milli','centi','deci','deca',
      'mono','bi','poly','omni','neo','paleo','proto','pseudo','quasi','retro',
    ] },
    validate: (pwd, { prefix }) => {
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      return words.some(w => w.toLowerCase().startsWith(prefix));
    }
  },

  // 密码中必须包含一个含有特定后缀的单词
  {
    id: 'mega_word_suffix',
    category: '字符串',
    difficulty: 1,
    description: '密码中必须有一个以 "{suffix}" 结尾的单词',
    params: { suffix: [
      'tion','sion','ment','ness','able','ible','ful','less','ous','ive',
      'al','ial','ic','ical','ish','like','ly','ward','wise','ology',
      'ism','ist','er','or','ee','ian','eer','ess','let','ling',
      'ette','dom','ship','hood','th','ity','cy','ence','ance','ure',
      'age','ade','ate','ify','ize','ise','en','fy','ple','ble',
    ] },
    validate: (pwd, { suffix }) => {
      const words = pwd.match(/[a-zA-Z]+/g) || [];
      return words.some(w => w.toLowerCase().endsWith(suffix));
    }
  },

  // 密码中必须包含某种职业/角色
  {
    id: 'mega_profession',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含职业 "{job}"',
    params: { job: [
      'doctor','nurse','teacher','engineer','lawyer','artist','chef','pilot',
      'soldier','sailor','farmer','writer','singer','dancer','actor','actress',
      'designer','programmer','scientist','astronaut','fireman','police','judge',
      'architect','barber','carpenter','dentist','electrician','fisherman','gardener',
      'hunter','inventor','janitor','king','librarian','magician','navigator',
      'painter','queen','reporter','sheriff','tailor','umpire','veterinarian',
      'waiter','zookeeper','banker','baker','butcher','coach','director',
      'editor','florist','geologist','historian','illustrator','jeweler','knight',
      'linguist','musician','novelist','optician','pharmacist','quarterback','ranger',
      'surgeon','therapist','usher','vendor','welder','zoologist','poet','priest',
    ] },
    validate: (pwd, { job }) => pwd.toLowerCase().includes(job)
  },

  // 密码中必须包含一个地名
  {
    id: 'mega_place_name',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含地名 "{place}"',
    params: { place: [
      'Paris','London','Tokyo','Berlin','Moscow','Sydney','Cairo','Delhi',
      'Rome','Madrid','Seoul','Beijing','Bangkok','Dubai','Toronto','Mumbai',
      'Venice','Vienna','Prague','Athens','Oslo','Havana','Lisbon','Dublin',
      'Warsaw','Hanoi','Lima','Osaka','Kyoto','Milan','Lyon','Nice',
      'Seattle','Boston','Chicago','Denver','Austin','Miami','Portland','Atlanta',
      '上海','北京','东京','巴黎','伦敦','纽约','香港','台北',
      '南京','杭州','成都','重庆','西安','武汉','广州','深圳',
      '拉萨','丽江','大理','桂林','青岛','厦门','三亚','哈尔滨',
      '苏州','扬州','洛阳','开封','敦煌','喀什','伊犁','香格里拉',
    ] },
    validate: (pwd, { place }) => pwd.toLowerCase().includes(place.toLowerCase())
  },

  // 密码中必须包含一种水果/蔬菜
  {
    id: 'mega_food_item',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含食物 "{food}"（中文或英文）',
    params: { food: [
      'apple','orange','grape','mango','peach','lemon','lime','kiwi','plum','pear',
      'melon','berry','cherry','fig','guava','lychee','papaya','olive','coconut','dates',
      'carrot','potato','tomato','onion','garlic','ginger','pepper','celery','spinach','kale',
      'broccoli','cabbage','cauliflower','cucumber','pumpkin','radish','mushroom','corn','peas','beans',
      '苹果','橘子','葡萄','芒果','桃子','柠檬','酸橙','猕猴桃','李子','梨',
      '西瓜','草莓','樱桃','荔枝','木瓜','椰子','胡萝卜','土豆','番茄','洋葱',
      '大蒜','生姜','辣椒','芹菜','菠菜','西兰花','卷心菜','黄瓜','南瓜','蘑菇',
    ] },
    validate: (pwd, { food }) => pwd.toLowerCase().includes(food.toLowerCase())
  },

  // 密码中必须包含一个运动名称
  {
    id: 'mega_sport_name',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含运动 "{sport}"（中文或英文）',
    params: { sport: [
      'soccer','basketball','tennis','golf','rugby','cricket','hockey','boxing',
      'swimming','running','cycling','skiing','surfing','diving','climbing','fencing',
      'judo','karate','taekwondo','wrestling','rowing','sailing','archery','badminton',
      'volleyball','baseball','softball','lacrosse','polo','squash','bowling','darts',
      '足球','篮球','网球','高尔夫','橄榄球','板球','曲棍球','拳击',
      '游泳','跑步','骑行','滑雪','冲浪','潜水','攀岩','击剑',
      '柔道','空手道','跆拳道','摔跤','划船','帆船','射箭','羽毛球',
      '排球','棒球','垒球','长曲棍球','马球','壁球','保龄球','飞镖',
    ] },
    validate: (pwd, { sport }) => pwd.toLowerCase().includes(sport.toLowerCase())
  },

  // 密码中必须包含一个节日
  {
    id: 'mega_holiday',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含节日 "{holiday}"',
    params: { holiday: [
      'Christmas','Halloween','Easter','Thanksgiving','NewYear','Valentine',
      'SpringFestival','MidAutumn','DragonBoat','Lantern','Qingming','DoubleNinth',
      'Diwali','Ramadan','Hannukah','Oktoberfest','Carnival','MardiGras',
      '圣诞节','万圣节','复活节','感恩节','新年','情人节',
      '春节','中秋节','端午节','元宵节','清明节','重阳节',
      '七夕','泼水节','火把节','那达慕','藏历年','开斋节',
    ] },
    validate: (pwd, { holiday }) => pwd.toLowerCase().includes(holiday.toLowerCase())
  },

  // 密码中必须包含一个身体部位
  {
    id: 'mega_body_part',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含身体部位 "{part}"',
    params: { part: [
      'head','hand','foot','eye','ear','nose','mouth','arm','leg','knee',
      'elbow','wrist','ankle','finger','thumb','toe','heel','palm','shoulder',
      'chest','back','neck','chin','cheek','forehead','jaw','lip','tongue','tooth',
      '头','手','脚','眼睛','耳朵','鼻子','嘴巴','手臂','腿','膝盖',
      '肘','手腕','脚踝','手指','拇指','脚趾','脚跟','手掌','肩膀',
      '胸部','背部','脖子','下巴','脸颊','额头','颚','唇','舌','牙',
    ] },
    validate: (pwd, { part }) => pwd.toLowerCase().includes(part.toLowerCase())
  },

  // 密码中必须包含一个天气词汇
  {
    id: 'mega_weather',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含天气词汇 "{weather}"',
    params: { weather: [
      'sunny','rainy','cloudy','windy','stormy','snowy','foggy','hazy',
      'hot','cold','warm','cool','humid','dry','mild','freezing',
      'thunder','lightning','rainbow','tornado','hurricane','typhoon','blizzard','drought',
      '晴天','雨天','阴天','刮风','暴风雨','下雪','有雾','雾霾',
      '热','冷','暖和','凉爽','潮湿','干燥','温和','冰冻',
      '雷声','闪电','彩虹','龙卷风','飓风','台风','暴风雪','干旱',
    ] },
    validate: (pwd, { weather }) => pwd.toLowerCase().includes(weather.toLowerCase())
  },

  // 密码以特定字符开头
  {
    id: 'mega_starts_with_char',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以字符 "{ch}" 开头',
    params: { ch: ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','!','@','#','$','%','&','*','+','-'] },
    validate: (pwd, { ch }) => pwd.startsWith(ch)
  },

  // 密码以特定字符结尾
  {
    id: 'mega_ends_with_char',
    category: '字符串',
    difficulty: 1,
    description: '密码必须以字符 "{ch}" 结尾',
    params: { ch: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','!','?','.','@','#','$','%','*'] },
    validate: (pwd, { ch }) => pwd.endsWith(ch)
  },

  // 密码中包含某国家名称
  {
    id: 'mega_country',
    category: '文字游戏',
    difficulty: 1,
    description: '密码中必须包含国家 "{country}"（中文或英文）',
    params: { country: [
      'China','Japan','Korea','India','Russia','France','Germany','Italy',
      'Spain','Brazil','Canada','Australia','Mexico','Egypt','Turkey','Iran',
      'Iraq','Syria','Israel','Greece','Norway','Sweden','Finland','Denmark',
      'Iceland','Ireland','Scotland','Wales','Poland','Ukraine','Vietnam','Thailand',
      '缅甸','老挝','柬埔寨','印尼','菲律宾','马来','新加坡','尼泊尔',
      '中国','日本','韩国','印度','俄国','法国','德国','意大利',
      '西班牙','巴西','加拿大','澳洲','墨西哥','埃及','土耳其','伊朗',
      '希腊','挪威','瑞典','芬兰','丹麦','冰岛','爱尔兰','波兰',
      '乌克兰','越南','泰国','葡萄牙','荷兰','比利时','瑞士','奥地利',
    ] },
    validate: (pwd, { country }) => pwd.toLowerCase().includes(country.toLowerCase())
  },
];
