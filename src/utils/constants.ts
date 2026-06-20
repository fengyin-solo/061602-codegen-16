import type { Weather, WeatherEffect, BerryType, GrowthStage, Personality, CareStyle, WishEventType } from '@/types/game'

export const ATTR_MIN = 0
export const ATTR_MAX = 100
export const DEATH_THRESHOLD = 10

export const STAGE_DURATION: Record<Exclude<GrowthStage, 'adult'>, number> = {
  egg: 1,
  chick: 2,
  juvenile: 2,
  subadult: 1,
}

export const STAGE_NAMES: Record<GrowthStage, string> = {
  egg: '🥚 蛋',
  chick: '🐣 雏鸟',
  juvenile: '🐥 幼鸟',
  subadult: '🦜 亚成鸟',
  adult: '🐦 成鸟',
}

export const STAGE_EMOJI: Record<GrowthStage, string> = {
  egg: '🥚',
  chick: '🐣',
  juvenile: '🐥',
  subadult: '🦜',
  adult: '🐦',
}

export const FOOD_NEED_MULTIPLIER: Record<Exclude<GrowthStage, 'egg'>, number> = {
  chick: 1.5,
  juvenile: 1.2,
  subadult: 1.0,
  adult: 0.8,
}

export const HUNGER_DECAY_RATE = 1.5
export const FEAR_DECAY_RATE = 0.8
export const HEALTH_RECOVERY_RATE = 0.5

export const BERRY_SPAWN_INTERVAL = 4000
export const BERRY_MAX_COUNT = 8
export const BERRY_LIFETIME = 20000

export const BERRY_VALUES: Record<BerryType, number> = {
  red: 10,
  blue: 15,
  golden: 25,
}

export const BERRY_COLORS: Record<BerryType, string> = {
  red: '#C41E3A',
  blue: '#4169E1',
  golden: '#FFD700',
}

export const BERRY_EMOJI: Record<BerryType, string> = {
  red: '🍒',
  blue: '🫐',
  golden: '✨',
}

export const WEATHER_CHANGE_INTERVAL = 25000

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect> = {
  sunny: { hungerMod: 1.0, fearMod: 0.8, healthMod: 1.0 },
  rainy: { hungerMod: 1.3, fearMod: 1.5, healthMod: 0.9, awayChance: 0.08 },
  snowy: { hungerMod: 1.5, fearMod: 1.2, healthMod: 0.7, sickChance: 0.12 },
  stormy: { hungerMod: 1.2, fearMod: 2.0, healthMod: 0.6, awayChance: 0.2, sickChance: 0.18 },
}

export const WEATHER_NAMES: Record<Weather, string> = {
  sunny: '☀️ 晴天',
  rainy: '🌧️ 雨天',
  snowy: '❄️ 雪天',
  stormy: '🌪️ 暴风',
}

export const WEATHER_COLORS: Record<Weather, string> = {
  sunny: 'from-amber-300/30 to-yellow-200/20',
  rainy: 'from-blue-400/40 to-gray-500/30',
  snowy: 'from-blue-100/40 to-white/30',
  stormy: 'from-gray-600/50 to-purple-800/40',
}

export const PERSONALITY_NAMES: Record<Personality, string> = {
  bold: '勇敢大胆',
  shy: '胆小害羞',
  gentle: '温柔恬静',
  curious: '好奇活泼',
  stubborn: '倔强独立',
}

export const PERSONALITY_EMOJI: Record<Personality, string> = {
  bold: '💪',
  shy: '🥺',
  gentle: '🌸',
  curious: '🌟',
  stubborn: '😤',
}

export const DAY_DURATION = 60000
export const INITIAL_FOOD = 30
export const MIN_EGGS = 2
export const MAX_EGGS = 4
export const MAX_BREEDING_ROUNDS = 2

export const BIRD_NAMES = [
  '毛毛', '豆豆', '啾啾', '喳喳', '花花', '点点', '果果', '泡泡',
  '糖糖', '圆圆', '小米', '小麦', '云朵', '星星', '月亮', '太阳',
  '小橘', '小蓝', '小绿', '小红', '阿黄', '阿白', '阿黑', '阿灰',
]

export const CARE_STYLE_NAMES: Record<CareStyle, string> = {
  gentle: '温柔呵护',
  strict: '严格要求',
  playful: '活泼好玩',
  free: '自由放养',
  attentive: '细心照料',
}

export const CARE_STYLE_EMOJI: Record<CareStyle, string> = {
  gentle: '🌸',
  strict: '📚',
  playful: '🎈',
  free: '🌿',
  attentive: '💝',
}

export const CARE_STYLE_DESC: Record<CareStyle, string> = {
  gentle: '用爱与温柔陪伴小鸟成长',
  strict: '培养小鸟独立自主的能力',
  playful: '每天都要玩得开心才好',
  free: '让小鸟按照天性自由发展',
  attentive: '无微不至地关心每一个细节',
}

export const FAVORITE_ACTIVITIES = [
  '晨间歌唱',
  '午后小憩',
  '收集浆果',
  '梳理羽毛',
  '眺望远方',
  '探索树洞',
  '沐浴阳光',
  '玩捉迷藏',
]

export const WISH_EVENT_INTERVAL = 45000
export const WISH_EVENT_MIN_INTERVAL = 30000
export const MAX_WISH_EVENTS_PER_DAY = 3
export const WISH_BOTTLE_LEVEL_UP_SCORE = 100

export const WISH_EVENT_TYPE_NAMES: Record<WishEventType, string> = {
  gift: '礼物',
  challenge: '挑战',
  secret: '秘密',
  dream: '梦想',
  memory: '回忆',
}

export const WISH_EVENT_TYPE_EMOJI: Record<WishEventType, string> = {
  gift: '🎁',
  challenge: '⚔️',
  secret: '🤫',
  dream: '💫',
  memory: '📸',
}

export interface WishEventTemplate {
  type: WishEventType
  title: string
  description: string
  choices: {
    text: string
    emoji: string
    effects: {
      hunger?: number
      fear?: number
      health?: number
      happiness?: number
      bond?: number
    }
    feedback: string
    careStyleBonus?: CareStyle[]
  }[]
  personalityMatch?: Personality[]
  careStyleMatch?: CareStyle[]
  favoriteActivityMatch?: string[]
  weight?: number
  isActivityExclusive?: boolean
}

export const WISH_EVENT_TEMPLATES: WishEventTemplate[] = [
  {
    type: 'gift',
    title: '神秘礼物',
    description: '{birdName}发现了一个闪闪发光的小盒子，里面似乎装着什么特别的东西...想起你说过「{wishMessage}」，{birdName}想和你一起打开！',
    choices: [
      {
        text: '小心打开',
        emoji: '📦',
        effects: { happiness: 18, hunger: 12, bond: 8 },
        feedback: '里面是一颗香甜的浆果！{birdName}吃得很开心，和你分享了一半~',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '先闻一闻',
        emoji: '👃',
        effects: { happiness: 10, health: 8, bond: 5 },
        feedback: '确认安全后，{birdName}慢慢享用了这份惊喜。你的细心让它很安心！',
        careStyleBonus: ['strict', 'attentive'],
      },
      {
        text: '放回去',
        emoji: '🙈',
        effects: { fear: -8, happiness: -2, bond: 3 },
        feedback: '{birdName}觉得还是不要碰别人的东西比较好...虽然有点小失望，但很佩服你的原则。',
        careStyleBonus: ['strict'],
      },
    ],
    personalityMatch: ['curious', 'bold'],
    weight: 1,
  },
  {
    type: 'challenge',
    title: '飞翔挑战',
    description: '远处的树梢上有一颗金色的浆果！{birdName}想要飞过去摘下来，这让它想起你最爱的「{favoriteActivity}」——要挑战一下吗？',
    choices: [
      {
        text: '鼓励它去',
        emoji: '💪',
        effects: { happiness: 25, hunger: 18, health: -5, bond: 10 },
        feedback: '太棒了！{birdName}成功摘到了金色浆果，成就感满满！它觉得你的鼓励是最棒的力量~',
        careStyleBonus: ['playful', 'free', 'strict'],
      },
      {
        text: '劝它别去',
        emoji: '🛡️',
        effects: { happiness: 6, health: 8, fear: -12, bond: 6 },
        feedback: '{birdName}听了你的话，安全第一，心情也很平静。被你保护着的感觉真好！',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '陪它一起',
        emoji: '🤝',
        effects: { happiness: 30, hunger: 12, fear: -18, bond: 18 },
        feedback: '有你在身边，{birdName}感到无比安心和幸福！这是属于你们的冒险~',
        careStyleBonus: ['playful', 'gentle', 'free'],
      },
    ],
    personalityMatch: ['bold', 'stubborn'],
    careStyleMatch: ['playful', 'free'],
    weight: 1.2,
  },
  {
    type: 'secret',
    title: '小鸟的秘密',
    description: '{birdName}似乎有什么心事，静静地站在枝头望着远方...它记起了你写的心愿：「{wishMessage}」，愿意和你分享吗？',
    choices: [
      {
        text: '静静陪伴',
        emoji: '🤫',
        effects: { happiness: 15, fear: -15, health: 6, bond: 12 },
        feedback: '虽然没有说出口，但{birdName}感受到了你的陪伴，心里暖暖的。有时候沉默就是最好的语言。',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '轻声询问',
        emoji: '💬',
        effects: { happiness: 22, fear: -10, bond: 10 },
        feedback: '{birdName}啾啾地诉说着它的小秘密，心情变好了很多！能和你分享，它觉得特别幸福~',
        careStyleBonus: ['attentive', 'playful'],
      },
      {
        text: '给它空间',
        emoji: '🌿',
        effects: { happiness: 6, health: 4, bond: 4 },
        feedback: '{birdName}独自思考了一会儿，感觉好多了。它知道你会在它需要时出现。',
        careStyleBonus: ['free'],
      },
    ],
    personalityMatch: ['shy', 'gentle'],
    careStyleMatch: ['gentle', 'attentive'],
    weight: 1,
  },
  {
    type: 'dream',
    title: '星空下的梦',
    description: '夜晚，{birdName}做了一个美丽的梦。梦里你们一起「{favoriteActivity}」，飞到了很高很高的地方，看到了从未见过的风景...',
    choices: [
      {
        text: '帮它记住梦想',
        emoji: '⭐',
        effects: { happiness: 25, health: 6, bond: 12 },
        feedback: '{birdName}决定每天练习飞翔，总有一天要实现梦想！它希望那个梦里的场景能真的发生~',
        careStyleBonus: ['strict', 'playful'],
      },
      {
        text: '告诉它会实现的',
        emoji: '🌈',
        effects: { happiness: 18, fear: -12, bond: 10 },
        feedback: '有你的鼓励，{birdName}对未来充满了期待！你的心愿「{wishMessage}」也会实现的！',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '珍惜当下就好',
        emoji: '🌸',
        effects: { happiness: 12, health: 10, bond: 8 },
        feedback: '{birdName}明白了，现在的生活也很美好~和你在一起的每一天都是珍贵的。',
        careStyleBonus: ['gentle', 'free'],
      },
    ],
    personalityMatch: ['curious', 'gentle'],
    careStyleMatch: ['gentle', 'free'],
    weight: 1,
  },
  {
    type: 'memory',
    title: '温暖回忆',
    description: '{birdName}想起了你们第一次相遇的日子...那时候它还是一只小小的雏鸟，你就对它说「{wishMessage}」，现在已经长这么大了。',
    choices: [
      {
        text: '一起回忆',
        emoji: '📷',
        effects: { happiness: 28, fear: -18, bond: 18 },
        feedback: '回忆起那些温馨的时光，{birdName}紧紧地依偎着你。谢谢你陪它走过了这么多路~',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '展望未来',
        emoji: '🚀',
        effects: { happiness: 18, health: 6, bond: 10 },
        feedback: '{birdName}对未来充满了期待，想和你一起「{favoriteActivity}」，创造更多回忆！',
        careStyleBonus: ['playful', 'free'],
      },
      {
        text: '给它一个拥抱',
        emoji: '🤗',
        effects: { happiness: 32, fear: -25, health: 4, bond: 22 },
        feedback: '这个拥抱里包含了所有的爱，{birdName}感到无比幸福！它永远不会忘记你的心意~',
        careStyleBonus: ['gentle', 'attentive', 'playful'],
      },
    ],
    personalityMatch: ['gentle', 'shy'],
    careStyleMatch: ['gentle', 'attentive'],
    weight: 1.3,
  },
  {
    type: 'gift',
    title: '雨天的礼物',
    description: '下雨天，{birdName}躲在巢里有点无聊。突然，一片漂亮的落叶飘到了它面前...它想起你说过「{wishMessage}」，决定做些有趣的事！',
    choices: [
      {
        text: '做成标本',
        emoji: '🍂',
        effects: { happiness: 15, fear: -6, bond: 8 },
        feedback: '{birdName}把落叶当作收藏品，下雨天也变得有趣了！以后「{favoriteActivity}」时可以带着它~',
        careStyleBonus: ['strict', 'attentive'],
      },
      {
        text: '当小伞用',
        emoji: '☂️',
        effects: { happiness: 18, health: 6, bond: 10 },
        feedback: '举着落叶小伞，{birdName}在雨中快乐地跳着小步舞~它多希望你也在这里一起玩！',
        careStyleBonus: ['playful', 'gentle'],
      },
      {
        text: '送给朋友',
        emoji: '🎁',
        effects: { happiness: 22, fear: -10, bond: 12 },
        feedback: '{birdName}决定把这份美丽分享给伙伴，心里甜甜的。你教会了它分享的快乐！',
        careStyleBonus: ['gentle', 'playful'],
      },
    ],
    personalityMatch: ['curious', 'gentle'],
    careStyleMatch: ['playful', 'gentle'],
    weight: 1,
  },
  {
    type: 'challenge',
    title: '学唱新歌',
    description: '远处传来了美妙的鸟鸣声，{birdName}也想学会那首歌...那旋律让它想起你们「{favoriteActivity}」时的心情，但是有点难呢。',
    choices: [
      {
        text: '耐心练习',
        emoji: '🎵',
        effects: { happiness: 18, health: 4, bond: 10 },
        feedback: '经过反复练习，{birdName}终于学会了！它骄傲地唱了一遍又一遍~你的坚持精神感染了它！',
        careStyleBonus: ['strict', 'attentive'],
      },
      {
        text: '一起唱',
        emoji: '🎶',
        effects: { happiness: 28, fear: -15, bond: 20 },
        feedback: '二重唱真好听！{birdName}觉得和你一起唱歌是最开心的事。这就是「{wishMessage}」吧！',
        careStyleBonus: ['playful', 'gentle', 'attentive'],
      },
      {
        text: '唱自己的歌',
        emoji: '🎤',
        effects: { happiness: 14, health: 6, bond: 8 },
        feedback: '{birdName}决定创作属于自己的歌，也是独一无二的呢！它的歌声里全是对你的思念~',
        careStyleBonus: ['free', 'playful'],
      },
    ],
    personalityMatch: ['stubborn', 'curious'],
    careStyleMatch: ['strict', 'playful'],
    weight: 1,
  },
  {
    type: 'secret',
    title: '藏起来的宝贝',
    description: '{birdName}有一个藏宝贝的秘密基地，今天它邀请你一起去看看...这里收藏着每次「{favoriteActivity}」时找到的好东西！',
    choices: [
      {
        text: '认真欣赏',
        emoji: '✨',
        effects: { happiness: 25, fear: -18, bond: 15 },
        feedback: '得到你的认可，{birdName}开心得尾巴都翘起来了！能和你分享秘密，它特别有成就感~',
        careStyleBonus: ['attentive', 'gentle'],
      },
      {
        text: '加入你的收藏',
        emoji: '💎',
        effects: { happiness: 30, fear: -12, bond: 22 },
        feedback: '我们的秘密基地！{birdName}觉得和你分享秘密是最幸福的事。「{wishMessage}」——你的话它一直记着！',
        careStyleBonus: ['playful', 'gentle', 'attentive'],
      },
      {
        text: '帮它守护',
        emoji: '🔐',
        effects: { happiness: 18, health: 6, fear: -22, bond: 14 },
        feedback: '有你帮忙守护，{birdName}感到非常安心。它知道这些宝贝和你的心意都会被好好珍藏。',
        careStyleBonus: ['strict', 'attentive'],
      },
    ],
    personalityMatch: ['shy', 'gentle'],
    careStyleMatch: ['attentive', 'gentle'],
    weight: 1.1,
  },
  {
    type: 'dream',
    title: '旅行的意义',
    description: '{birdName}梦见自己去了很远很远的地方旅行，见到了大海、雪山和彩虹...梦里你一直在它身边，陪它「{favoriteActivity}」！',
    choices: [
      {
        text: '陪它一起去',
        emoji: '🧳',
        effects: { happiness: 35, fear: -12, health: 6, bond: 25 },
        feedback: '和你一起旅行，是{birdName}能想到的最棒的事情！你的心愿「{wishMessage}」，就是最美的目的地。',
        careStyleBonus: ['playful', 'free', 'gentle'],
      },
      {
        text: '先练好飞行',
        emoji: '✈️',
        effects: { happiness: 14, health: 10, bond: 10 },
        feedback: '{birdName}开始努力练习飞翔，为未来的旅行做准备！你教会了它为梦想努力的意义。',
        careStyleBonus: ['strict', 'attentive'],
      },
      {
        text: '身边也有美景',
        emoji: '🏞️',
        effects: { happiness: 12, health: 12, fear: -10, bond: 8 },
        feedback: '{birdName}仔细观察了周围，发现身边的风景也很美呢~有你在的地方就是最好的风景！',
        careStyleBonus: ['gentle', 'free'],
      },
    ],
    personalityMatch: ['bold', 'curious'],
    careStyleMatch: ['free', 'playful'],
    weight: 1.1,
  },
  {
    type: 'memory',
    title: '第一次飞翔',
    description: '{birdName}想起了自己第一次飞出鸟巢的样子...那时候它还有点害怕，但你一直对它说「{wishMessage}」，给了它最大的勇气。',
    choices: [
      {
        text: '那时候真勇敢',
        emoji: '🦁',
        effects: { happiness: 22, fear: -12, bond: 12 },
        feedback: '被夸奖了！{birdName}挺起胸膛，觉得自己真的很勇敢呢。你的认可是它最大的动力！',
        careStyleBonus: ['strict', 'playful'],
      },
      {
        text: '我也很紧张',
        emoji: '😅',
        effects: { happiness: 28, fear: -18, bond: 18 },
        feedback: '原来你也在担心我呀...{birdName}感动地靠近了你。你们的心跳当时一定是同频的！',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '来再飞一次',
        emoji: '🕊️',
        effects: { happiness: 24, health: 6, hunger: -6, bond: 16 },
        feedback: '再次展翅高飞，{birdName}感觉自己比以前飞得更好了！就像你们每次「{favoriteActivity}」一样默契~',
        careStyleBonus: ['playful', 'free'],
      },
    ],
    personalityMatch: ['shy', 'bold'],
    careStyleMatch: ['gentle', 'attentive'],
    weight: 1.2,
  },
  {
    type: 'memory',
    title: '晨间歌会',
    description: '今天阳光特别好，{birdName}想邀请你一起「{favoriteActivity}」！清晨的空气里全是花香和鸟鸣，这是属于你们的美好时光~',
    choices: [
      {
        text: '放声歌唱',
        emoji: '🎤',
        effects: { happiness: 30, health: 8, fear: -10, bond: 20 },
        feedback: '你的歌声真好听！{birdName}觉得和你一起「{favoriteActivity}」是全世界最幸福的事~',
        careStyleBonus: ['playful', 'gentle', 'free'],
      },
      {
        text: '静静聆听',
        emoji: '👂',
        effects: { happiness: 18, fear: -15, health: 5, bond: 14 },
        feedback: '{birdName}越唱越起劲，它知道有人在认真听着。你的心意「{wishMessage}」它全收到了！',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '录下来留念',
        emoji: '📱',
        effects: { happiness: 22, bond: 16 },
        feedback: '以后每次听到这段录音，{birdName}都会想起今天的幸福时光~',
        careStyleBonus: ['attentive', 'strict'],
      },
    ],
    personalityMatch: ['curious', 'gentle', 'bold'],
    favoriteActivityMatch: ['晨间歌唱'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'dream',
    title: '午后梦境',
    description: '暖洋洋的午后，{birdName}打起了盹...梦里它化身为云朵，在天空中尽情漂浮。你说过「{wishMessage}」，它也想做一朵自由自在的云！',
    choices: [
      {
        text: '帮它盖好小毯子',
        emoji: '🧣',
        effects: { happiness: 20, health: 10, bond: 15 },
        feedback: '{birdName}睡得更香甜了，梦里全是温暖的感觉。你的细心让它每天都很安心~',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '一起小憩一会儿',
        emoji: '💤',
        effects: { happiness: 28, fear: -15, health: 8, bond: 22 },
        feedback: '在你身边入睡，{birdName}做了最美的梦——你们化身为两朵云，一起「{favoriteActivity}」~',
        careStyleBonus: ['gentle', 'free', 'playful'],
      },
      {
        text: '轻声哼摇篮曲',
        emoji: '🎵',
        effects: { happiness: 24, fear: -18, bond: 18 },
        feedback: '你的声音是最好的催眠曲，{birdName}带着微笑进入了梦乡。「{wishMessage}」一定会实现的！',
        careStyleBonus: ['gentle', 'attentive'],
      },
    ],
    personalityMatch: ['gentle', 'shy'],
    favoriteActivityMatch: ['午后小憩'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'gift',
    title: '浆果探险',
    description: '树林深处有传说中的金色浆果丛！{birdName}兴奋地想要去探索，这正是「{favoriteActivity}」的好机会！要一起出发吗？',
    choices: [
      {
        text: '组队出发',
        emoji: '🗺️',
        effects: { happiness: 30, hunger: 25, bond: 20 },
        feedback: '大丰收！{birdName}叼着满满一嘴浆果飞回你身边，最大最甜的那颗留给了你~',
        careStyleBonus: ['playful', 'free', 'bold'],
      },
      {
        text: '先侦查地形',
        emoji: '🔭',
        effects: { happiness: 18, health: 5, hunger: 18, bond: 12 },
        feedback: '你的谨慎让这次探险非常顺利！{birdName}学到了很多技巧，下次「{favoriteActivity}」一定会更棒！',
        careStyleBonus: ['strict', 'attentive'],
      },
      {
        text: '和伙伴分享',
        emoji: '🤝',
        effects: { happiness: 25, hunger: 15, fear: -10, bond: 18 },
        feedback: '独乐乐不如众乐乐！{birdName}和伙伴们一起分享了收获。你教会了它分享的快乐~',
        careStyleBonus: ['gentle', 'playful'],
      },
    ],
    personalityMatch: ['bold', 'curious'],
    favoriteActivityMatch: ['收集浆果'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'secret',
    title: '华丽变身',
    description: '{birdName}在水边看到了自己的倒影，觉得羽毛有些凌乱...它想要好好打理一下，把「{favoriteActivity}」变成今天的主题！',
    choices: [
      {
        text: '帮它顺毛',
        emoji: '✨',
        effects: { happiness: 25, health: 8, bond: 18 },
        feedback: '你的手法太舒服了！{birdName}差点睡着了，它觉得自己现在是全世界最漂亮的小鸟~',
        careStyleBonus: ['gentle', 'attentive'],
      },
      {
        text: '找片清水沐浴',
        emoji: '💧',
        effects: { happiness: 22, health: 10, fear: -5, bond: 14 },
        feedback: '水花飞溅！{birdName}在水里快乐地玩耍，清凉的感觉棒极了。你的主意真好！',
        careStyleBonus: ['playful', 'gentle'],
      },
      {
        text: '插朵小花装饰',
        emoji: '🌸',
        effects: { happiness: 30, bond: 22 },
        feedback: '太美了！{birdName}对着倒影欣赏了好久，它觉得「{wishMessage}」里一定包括了变得更美~',
        careStyleBonus: ['playful', 'gentle', 'free'],
      },
    ],
    personalityMatch: ['gentle', 'shy', 'curious'],
    favoriteActivityMatch: ['梳理羽毛'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'dream',
    title: '远方风景',
    description: '{birdName}站在最高的枝头，久久地凝望着远方的山峦...那里会有什么呢？它好想和你一起「{favoriteActivity}」看看世界！',
    choices: [
      {
        text: '指给它看星座',
        emoji: '🌟',
        effects: { happiness: 28, fear: -12, bond: 18 },
        feedback: '原来每颗星星都有名字！{birdName}听得入了迷，你的心愿「{wishMessage}」就像星星一样闪亮~',
        careStyleBonus: ['gentle', 'attentive', 'free'],
      },
      {
        text: '一起飞得更高',
        emoji: '🕊️',
        effects: { happiness: 32, health: 5, hunger: -5, bond: 25 },
        feedback: '风在耳边呼啸，整个森林都在你们脚下！{birdName}觉得和你一起「{favoriteActivity}」是最酷的事！',
        careStyleBonus: ['playful', 'free', 'bold'],
      },
      {
        text: '讲远方的故事',
        emoji: '📖',
        effects: { happiness: 22, fear: -8, bond: 15 },
        feedback: '你的故事太精彩了！{birdName}闭上眼睛，仿佛已经到过那些美丽的地方。',
        careStyleBonus: ['gentle', 'attentive', 'strict'],
      },
    ],
    personalityMatch: ['curious', 'bold', 'gentle'],
    favoriteActivityMatch: ['眺望远方'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'challenge',
    title: '树洞探险',
    description: '发现了一个神秘的树洞！{birdName}好奇极了，邀请你一起「{favoriteActivity}」。里面会藏着什么秘密呢？',
    choices: [
      {
        text: '勇敢探索',
        emoji: '🔦',
        effects: { happiness: 30, hunger: 10, bond: 20 },
        feedback: '哇！树洞里住着一只友好的小松鼠，它还送了你们一颗松果！今天的「{favoriteActivity}」太棒了~',
        careStyleBonus: ['playful', 'free', 'bold'],
      },
      {
        text: '小心观察',
        emoji: '👀',
        effects: { happiness: 18, health: 8, fear: -5, bond: 12 },
        feedback: '你的谨慎让探险变得很安全！{birdName}学到了很多观察技巧，下次一定用得上~',
        careStyleBonus: ['strict', 'attentive'],
      },
      {
        text: '留下礼物标记',
        emoji: '🎁',
        effects: { happiness: 25, bond: 18 },
        feedback: '{birdName}放下了一颗最漂亮的浆果。也许下次「{favoriteActivity}」时，会收到回礼呢！',
        careStyleBonus: ['gentle', 'attentive', 'playful'],
      },
    ],
    personalityMatch: ['curious', 'bold', 'stubborn'],
    favoriteActivityMatch: ['探索树洞'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'gift',
    title: '阳光派对',
    description: '今天的阳光暖洋洋的，洒在身上特别舒服！{birdName}想要举办一场「{favoriteActivity}」派对，邀请你一起享受~',
    choices: [
      {
        text: '铺开野餐垫',
        emoji: '🧺',
        effects: { happiness: 30, health: 10, hunger: 15, bond: 22 },
        feedback: '阳光下的野餐真舒服！{birdName}把最好的位置留给了你，你的心愿「{wishMessage}」就是最好的礼物~',
        careStyleBonus: ['gentle', 'playful', 'attentive'],
      },
      {
        text: '晒晒羽毛',
        emoji: '☀️',
        effects: { happiness: 22, health: 12, fear: -8, bond: 14 },
        feedback: '暖洋洋的阳光真舒服！{birdName}感觉每根羽毛都充满了活力，和你一起「{favoriteActivity}」太惬意了~',
        careStyleBonus: ['gentle', 'free'],
      },
      {
        text: '玩影子游戏',
        emoji: '🐦',
        effects: { happiness: 28, bond: 18 },
        feedback: '哈哈！你的影子变成了大怪兽，{birdName}假装被吓跑了，然后又飞回来偷袭你~太好玩了！',
        careStyleBonus: ['playful', 'free'],
      },
    ],
    personalityMatch: ['gentle', 'curious', 'bold'],
    favoriteActivityMatch: ['沐浴阳光'],
    isActivityExclusive: true,
    weight: 2,
  },
  {
    type: 'challenge',
    title: '捉迷藏大赛',
    description: '森林里的小伙伴们都来了！{birdName}想要组织一场「{favoriteActivity}」大赛，你也一起来玩吗？',
    choices: [
      {
        text: '当寻找者',
        emoji: '🔍',
        effects: { happiness: 32, fear: -10, hunger: -5, bond: 20 },
        feedback: '你的眼神太厉害了！大家都被你找到了。{birdName}佩服得五体投地，你的心愿「{wishMessage}」充满了力量！',
        careStyleBonus: ['strict', 'playful', 'attentive'],
      },
      {
        text: '当躲藏者',
        emoji: '🙈',
        effects: { happiness: 28, fear: -15, bond: 18 },
        feedback: '你藏得太隐蔽了！{birdName}找了好久才发现你。这个游戏真好玩，下次还要一起「{favoriteActivity}」！',
        careStyleBonus: ['playful', 'gentle', 'free'],
      },
      {
        text: '当裁判',
        emoji: '🏆',
        effects: { happiness: 20, bond: 14 },
        feedback: '有你当裁判，大家都玩得特别公平！{birdName}获得了最佳躲藏奖，它最想感谢的就是你~',
        careStyleBonus: ['strict', 'attentive', 'gentle'],
      },
    ],
    personalityMatch: ['bold', 'curious', 'playful'],
    favoriteActivityMatch: ['玩捉迷藏'],
    isActivityExclusive: true,
    weight: 2,
  },
]
