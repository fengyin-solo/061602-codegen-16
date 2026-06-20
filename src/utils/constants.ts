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
    }
    feedback: string
  }[]
  personalityMatch?: Personality[]
  careStyleMatch?: CareStyle[]
}

export const WISH_EVENT_TEMPLATES: WishEventTemplate[] = [
  {
    type: 'gift',
    title: '神秘礼物',
    description: '{birdName}发现了一个闪闪发光的小盒子，里面似乎装着什么特别的东西...要打开看看吗？',
    choices: [
      {
        text: '小心打开',
        emoji: '📦',
        effects: { happiness: 15, hunger: 10 },
        feedback: '里面是一颗香甜的浆果！{birdName}吃得很开心~',
      },
      {
        text: '先闻一闻',
        emoji: '👃',
        effects: { happiness: 8, health: 5 },
        feedback: '确认安全后，{birdName}慢慢享用了这份惊喜。',
      },
      {
        text: '放回去',
        emoji: '🙈',
        effects: { fear: -5, happiness: -3 },
        feedback: '{birdName}觉得还是不要碰别人的东西比较好...',
      },
    ],
    personalityMatch: ['curious', 'bold'],
  },
  {
    type: 'challenge',
    title: '飞翔挑战',
    description: '远处的树梢上有一颗金色的浆果！{birdName}想要飞过去摘下来，但路途似乎有些危险...',
    choices: [
      {
        text: '鼓励它去',
        emoji: '💪',
        effects: { happiness: 20, hunger: 15, health: -5 },
        feedback: '太棒了！{birdName}成功摘到了金色浆果，成就感满满！',
      },
      {
        text: '劝它别去',
        emoji: '🛡️',
        effects: { happiness: 5, health: 5, fear: -10 },
        feedback: '{birdName}听了你的话，安全第一，心情也很平静。',
      },
      {
        text: '陪它一起',
        emoji: '🤝',
        effects: { happiness: 25, hunger: 10, fear: -15 },
        feedback: '有你在身边，{birdName}感到无比安心和幸福！',
      },
    ],
    personalityMatch: ['bold', 'stubborn'],
    careStyleMatch: ['playful', 'free'],
  },
  {
    type: 'secret',
    title: '小鸟的秘密',
    description: '{birdName}似乎有什么心事，静静地站在枝头望着远方...它愿意和你分享吗？',
    choices: [
      {
        text: '静静陪伴',
        emoji: '🤫',
        effects: { happiness: 12, fear: -12, health: 5 },
        feedback: '虽然没有说出口，但{birdName}感受到了你的陪伴，心里暖暖的。',
      },
      {
        text: '轻声询问',
        emoji: '💬',
        effects: { happiness: 18, fear: -8 },
        feedback: '{birdName}啾啾地诉说着它的小秘密，心情变好了很多！',
      },
      {
        text: '给它空间',
        emoji: '🌿',
        effects: { happiness: 5, health: 3 },
        feedback: '{birdName}独自思考了一会儿，感觉好多了。',
      },
    ],
    personalityMatch: ['shy', 'gentle'],
    careStyleMatch: ['gentle', 'attentive'],
  },
  {
    type: 'dream',
    title: '星空下的梦',
    description: '夜晚，{birdName}做了一个美丽的梦。梦里它飞到了很高很高的地方，看到了从未见过的风景...',
    choices: [
      {
        text: '帮它记住梦想',
        emoji: '⭐',
        effects: { happiness: 20, health: 5 },
        feedback: '{birdName}决定每天练习飞翔，总有一天要实现梦想！',
      },
      {
        text: '告诉它会实现的',
        emoji: '🌈',
        effects: { happiness: 15, fear: -10 },
        feedback: '有你的鼓励，{birdName}对未来充满了期待！',
      },
      {
        text: '珍惜当下就好',
        emoji: '🌸',
        effects: { happiness: 10, health: 8 },
        feedback: '{birdName}明白了，现在的生活也很美好~',
      },
    ],
    personalityMatch: ['curious', 'gentle'],
    careStyleMatch: ['gentle', 'free'],
  },
  {
    type: 'memory',
    title: '温暖回忆',
    description: '{birdName}想起了你们第一次相遇的日子...那时候它还是一只小小的雏鸟，现在已经长这么大了。',
    choices: [
      {
        text: '一起回忆',
        emoji: '📷',
        effects: { happiness: 22, fear: -15 },
        feedback: '回忆起那些温馨的时光，{birdName}紧紧地依偎着你。',
      },
      {
        text: '展望未来',
        emoji: '🚀',
        effects: { happiness: 15, health: 5 },
        feedback: '{birdName}对未来充满了期待，想和你一起创造更多回忆！',
      },
      {
        text: '给它一个拥抱',
        emoji: '🤗',
        effects: { happiness: 25, fear: -20, health: 3 },
        feedback: '这个拥抱里包含了所有的爱，{birdName}感到无比幸福！',
      },
    ],
    personalityMatch: ['gentle', 'shy'],
    careStyleMatch: ['gentle', 'attentive'],
  },
  {
    type: 'gift',
    title: '雨天的礼物',
    description: '下雨天，{birdName}躲在巢里有点无聊。突然，一片漂亮的落叶飘到了它面前...',
    choices: [
      {
        text: '做成标本',
        emoji: '🍂',
        effects: { happiness: 12, fear: -5 },
        feedback: '{birdName}把落叶当作收藏品，下雨天也变得有趣了！',
      },
      {
        text: '当小伞用',
        emoji: '☂️',
        effects: { happiness: 15, health: 5 },
        feedback: '举着落叶小伞，{birdName}在雨中快乐地跳着小步舞~',
      },
      {
        text: '送给朋友',
        emoji: '🎁',
        effects: { happiness: 18, fear: -8 },
        feedback: '{birdName}决定把这份美丽分享给伙伴，心里甜甜的。',
      },
    ],
    personalityMatch: ['curious', 'gentle'],
    careStyleMatch: ['playful', 'gentle'],
  },
  {
    type: 'challenge',
    title: '学唱新歌',
    description: '远处传来了美妙的鸟鸣声，{birdName}也想学会那首歌...但是有点难呢。',
    choices: [
      {
        text: '耐心练习',
        emoji: '🎵',
        effects: { happiness: 15, health: 3 },
        feedback: '经过反复练习，{birdName}终于学会了！它骄傲地唱了一遍又一遍~',
      },
      {
        text: '一起唱',
        emoji: '🎶',
        effects: { happiness: 22, fear: -12 },
        feedback: '二重唱真好听！{birdName}觉得和你一起唱歌是最开心的事。',
      },
      {
        text: '唱自己的歌',
        emoji: '🎤',
        effects: { happiness: 12, health: 5 },
        feedback: '{birdName}决定创作属于自己的歌，也是独一无二的呢！',
      },
    ],
    personalityMatch: ['stubborn', 'curious'],
    careStyleMatch: ['strict', 'playful'],
  },
  {
    type: 'secret',
    title: '藏起来的宝贝',
    description: '{birdName}有一个藏宝贝的秘密基地，今天它邀请你一起去看看...',
    choices: [
      {
        text: '认真欣赏',
        emoji: '✨',
        effects: { happiness: 20, fear: -15 },
        feedback: '得到你的认可，{birdName}开心得尾巴都翘起来了！',
      },
      {
        text: '加入你的收藏',
        emoji: '💎',
        effects: { happiness: 25, fear: -10 },
        feedback: '我们的秘密基地！{birdName}觉得和你分享秘密是最幸福的事。',
      },
      {
        text: '帮它守护',
        emoji: '🔐',
        effects: { happiness: 15, health: 5, fear: -18 },
        feedback: '有你帮忙守护，{birdName}感到非常安心。',
      },
    ],
    personalityMatch: ['shy', 'gentle'],
    careStyleMatch: ['attentive', 'gentle'],
  },
  {
    type: 'dream',
    title: '旅行的意义',
    description: '{birdName}梦见自己去了很远很远的地方旅行，见到了大海、雪山和彩虹...',
    choices: [
      {
        text: '陪它一起去',
        emoji: '🧳',
        effects: { happiness: 28, fear: -10, health: 5 },
        feedback: '和你一起旅行，是{birdName}能想到的最棒的事情！',
      },
      {
        text: '先练好飞行',
        emoji: '✈️',
        effects: { happiness: 12, health: 8 },
        feedback: '{birdName}开始努力练习飞翔，为未来的旅行做准备！',
      },
      {
        text: '身边也有美景',
        emoji: '🏞️',
        effects: { happiness: 10, health: 10, fear: -8 },
        feedback: '{birdName}仔细观察了周围，发现身边的风景也很美呢~',
      },
    ],
    personalityMatch: ['bold', 'curious'],
    careStyleMatch: ['free', 'playful'],
  },
  {
    type: 'memory',
    title: '第一次飞翔',
    description: '{birdName}想起了自己第一次飞出鸟巢的样子...那时候它还有点害怕，但是你一直在旁边鼓励它。',
    choices: [
      {
        text: '那时候真勇敢',
        emoji: '🦁',
        effects: { happiness: 18, fear: -10 },
        feedback: '被夸奖了！{birdName}挺起胸膛，觉得自己真的很勇敢呢。',
      },
      {
        text: '我也很紧张',
        emoji: '😅',
        effects: { happiness: 22, fear: -15 },
        feedback: '原来你也在担心我呀...{birdName}感动地靠近了你。',
      },
      {
        text: '来再飞一次',
        emoji: '🕊️',
        effects: { happiness: 20, health: 5, hunger: -5 },
        feedback: '再次展翅高飞，{birdName}感觉自己比以前飞得更好了！',
      },
    ],
    personalityMatch: ['shy', 'bold'],
    careStyleMatch: ['gentle', 'attentive'],
  },
]
