import { reactive, computed, watch } from 'vue'
import type { GameState, Bird, Berry, GrowthStage, Personality, BerryType, Weather, GameScore, CareStyle, CarePreference, WishBottleEvent, WishChoice } from '@/types/game'
import {
  ATTR_MIN, ATTR_MAX, DEATH_THRESHOLD,
  STAGE_DURATION, FOOD_NEED_MULTIPLIER,
  HUNGER_DECAY_RATE, FEAR_DECAY_RATE, HEALTH_RECOVERY_RATE,
  BERRY_SPAWN_INTERVAL, BERRY_MAX_COUNT, BERRY_LIFETIME,
  BERRY_VALUES, WEATHER_CHANGE_INTERVAL, WEATHER_EFFECTS,
  DAY_DURATION, INITIAL_FOOD, MIN_EGGS, MAX_EGGS,
  MAX_BREEDING_ROUNDS, BIRD_NAMES,
  WISH_EVENT_INTERVAL, WISH_EVENT_MIN_INTERVAL, WISH_BOTTLE_LEVEL_UP_SCORE,
  WISH_EVENT_TEMPLATES, CARE_STYLE_NAMES,
} from '@/utils/constants'
import { randomInt, randomFloat, clamp, randomChoice, generateId, chance } from '@/utils/random'
import { saveGame, loadGame, clearSave } from '@/utils/storage'

const createInitialState = (): GameState => ({
  phase: 'start',
  day: 1,
  dayProgress: 0,
  currentWeather: 'sunny',
  nextWeatherChangeAt: Date.now() + WEATHER_CHANGE_INTERVAL,
  foodStock: INITIAL_FOOD,
  birds: [],
  berries: [],
  totalHatched: 0,
  totalDied: 0,
  breedingCount: 0,
  maxBreedingRounds: MAX_BREEDING_ROUNDS,
  eventLog: [],
  wishBottleEvents: [],
  nextWishEventAt: Date.now() + WISH_EVENT_INTERVAL,
  wishBottleLevel: 1,
  totalWishChoices: 0,
  wishBottleScore: 0,
})

const state = reactive<GameState>(createInitialState())

let gameLoopTimer: ReturnType<typeof setInterval> | null = null
let berrySpawnTimer: ReturnType<typeof setInterval> | null = null

const PERSONALITIES: Personality[] = ['bold', 'shy', 'gentle', 'curious', 'stubborn']
const WEATHERS: Weather[] = ['sunny', 'rainy', 'snowy', 'stormy']
const BERRY_TYPES: BerryType[] = ['red', 'red', 'red', 'blue', 'blue', 'golden']
const GROWTH_ORDER: GrowthStage[] = ['egg', 'chick', 'juvenile', 'subadult', 'adult']

const usedNames = new Set<string>()

const pickName = (): string => {
  const available = BIRD_NAMES.filter(n => !usedNames.has(n))
  if (available.length === 0) {
    usedNames.clear()
    return randomChoice(BIRD_NAMES)
  }
  const name = randomChoice(available)
  usedNames.add(name)
  return name
}

const generatePersonality = (hatchDuration: number, avgHatchDuration: number): Personality => {
  const ratio = hatchDuration / avgHatchDuration
  if (ratio < 0.85) return randomChoice(['curious', 'bold'])
  if (ratio > 1.15) return randomChoice(['shy', 'gentle'])
  return randomChoice(PERSONALITIES)
}

const createEgg = (index: number): Bird => {
  const hatchDuration = randomInt(15000, 35000)
  return {
    id: generateId(),
    name: `蛋${index + 1}号`,
    stage: 'egg',
    stageProgress: 0,
    hunger: 100,
    fear: randomInt(10, 30),
    health: randomInt(85, 100),
    happiness: 50,
    personality: 'gentle',
    hatchDuration,
    hatchTimeLeft: hatchDuration,
    isAway: false,
    isSick: false,
    isDead: false,
    feedingCount: 0,
    lastFedAt: 0,
    wishBond: 0,
  }
}

const addEventLog = (message: string, type: string = 'info') => {
  state.eventLog.unshift({
    id: generateId(),
    message,
    type,
    timestamp: Date.now(),
  })
  if (state.eventLog.length > 50) state.eventLog.pop()
}

const startGame = () => {
  Object.assign(state, createInitialState())
  usedNames.clear()
  state.phase = 'playing'
  clearSave()

  const eggCount = randomInt(MIN_EGGS, MAX_EGGS)
  for (let i = 0; i < eggCount; i++) {
    state.birds.push(createEgg(i))
  }

  addEventLog(`🎉 新的一窝！鸟巢里有 ${eggCount} 颗蛋在等待孵化~`, 'success')
  startGameLoop()
  saveGame(state)
}

const startGameLoop = () => {
  stopGameLoop()
  const tick = 100

  gameLoopTimer = setInterval(() => {
    updateGame(tick)
  }, tick)

  berrySpawnTimer = setInterval(() => {
    spawnBerry()
  }, BERRY_SPAWN_INTERVAL)
}

const stopGameLoop = () => {
  if (gameLoopTimer) {
    clearInterval(gameLoopTimer)
    gameLoopTimer = null
  }
  if (berrySpawnTimer) {
    clearInterval(berrySpawnTimer)
    berrySpawnTimer = null
  }
}

const updateGame = (deltaMs: number) => {
  if (state.phase !== 'playing' && state.phase !== 'breeding') return

  state.dayProgress += deltaMs / DAY_DURATION
  if (state.dayProgress >= 1) {
    state.dayProgress -= 1
    state.day += 1
    addEventLog(`📅 第 ${state.day} 天开始了！`, 'info')
  }

  if (Date.now() >= state.nextWeatherChangeAt) {
    changeWeather()
  }

  const weatherEffect = WEATHER_EFFECTS[state.currentWeather]
  const aliveBirds = state.birds.filter(b => !b.isDead)

  aliveBirds.forEach(bird => {
    updateBird(bird, deltaMs, weatherEffect)
  })

  if (!state.currentWishEvent && Date.now() >= state.nextWishEventAt && state.carePreference) {
    const aliveNonEggs = state.birds.filter(b => !b.isDead && b.stage !== 'egg')
    if (aliveNonEggs.length > 0) {
      triggerWishEvent()
    } else {
      state.nextWishEventAt = Date.now() + WISH_EVENT_INTERVAL
    }
  }

  cleanupExpiredBerries()
  checkGameEnd()
  saveGame(state)
}

const updateBird = (bird: Bird, deltaMs: number, weatherEffect: ReturnType<typeof getWeatherEffects>) => {
  if (bird.isDead) return

  if (bird.isAway && bird.awayUntil && Date.now() >= bird.awayUntil) {
    bird.isAway = false
    addEventLog(`🏠 ${bird.name} 回巢了~`, 'success')
  }
  if (bird.isSick && bird.sickUntil && Date.now() >= bird.sickUntil) {
    bird.isSick = false
    addEventLog(`💚 ${bird.name} 康复了！`, 'success')
  }

  if (bird.stage === 'egg') {
    bird.hatchTimeLeft -= deltaMs
    if (bird.hatchTimeLeft <= 0) {
      hatchBird(bird)
    }
    return
  }

  if (bird.isAway) return

  const stageMultiplier = bird.stage in FOOD_NEED_MULTIPLIER
    ? FOOD_NEED_MULTIPLIER[bird.stage as keyof typeof FOOD_NEED_MULTIPLIER]
    : 1

  const hungerDecay = HUNGER_DECAY_RATE * weatherEffect.hungerMod * stageMultiplier * (deltaMs / 1000)
  bird.hunger = clamp(bird.hunger - hungerDecay, ATTR_MIN, ATTR_MAX)

  if (bird.isSick) {
    bird.health = clamp(bird.health - 0.8 * (deltaMs / 1000), ATTR_MIN, ATTR_MAX)
  } else if (bird.hunger < 30) {
    bird.health = clamp(bird.health - 0.4 * (deltaMs / 1000), ATTR_MIN, ATTR_MAX)
  } else if (bird.hunger > 70 && bird.fear < 50) {
    bird.health = clamp(bird.health + HEALTH_RECOVERY_RATE * weatherEffect.healthMod * (deltaMs / 1000), ATTR_MIN, ATTR_MAX)
  }

  if (weatherEffect.fearMod > 1) {
    bird.fear = clamp(bird.fear + (weatherEffect.fearMod - 1) * 2 * (deltaMs / 1000), ATTR_MIN, ATTR_MAX)
  } else {
    bird.fear = clamp(bird.fear - FEAR_DECAY_RATE * weatherEffect.fearMod * (deltaMs / 1000), ATTR_MIN, ATTR_MAX)
  }

  const happinessBase = 0.1
  const hungerHappinessMod = bird.hunger > 70 ? 1.5 : bird.hunger < 30 ? -2 : 0.5
  const fearHappinessMod = bird.fear > 60 ? -1.5 : bird.fear < 30 ? 0.8 : 0
  const healthHappinessMod = bird.health > 80 ? 0.5 : bird.health < 40 ? -1 : 0
  const bondHappinessMod = bird.wishBond / 100
  const happinessDelta = (happinessBase + hungerHappinessMod + fearHappinessMod + healthHappinessMod + bondHappinessMod) * (deltaMs / 1000)
  bird.happiness = clamp(bird.happiness + happinessDelta, ATTR_MIN, ATTR_MAX)

  if (bird.happiness > 80 && chance(0.002 * (deltaMs / 1000))) {
    bird.wishBond = clamp(bird.wishBond + 1, 0, 100)
  }

  if (weatherEffect.awayChance && !bird.isAway && bird.stage !== 'chick') {
    const personalityMod = bird.personality === 'bold' ? 0.3 : bird.personality === 'shy' ? 1.5 : 1
    if (chance(weatherEffect.awayChance * personalityMod * (deltaMs / 10000))) {
      bird.isAway = true
      bird.awayUntil = Date.now() + randomInt(8000, 20000)
      addEventLog(`💨 ${bird.name} 被天气吓跑，暂时离巢了...`, 'warning')
    }
  }

  if (weatherEffect.sickChance && !bird.isSick && !bird.isAway) {
    const personalityMod = bird.personality === 'stubborn' ? 0.7 : bird.personality === 'gentle' ? 1.3 : 1
    if (chance(weatherEffect.sickChance * personalityMod * (deltaMs / 10000))) {
      bird.isSick = true
      bird.sickUntil = Date.now() + randomInt(10000, 25000)
      addEventLog(`🤒 ${bird.name} 生病了，需要好好照顾！`, 'warning')
    }
  }

  if (bird.health <= DEATH_THRESHOLD) {
    killBird(bird)
    return
  }

  if (bird.justHatched) bird.justHatched = false
  if (bird.justGrew) bird.justGrew = false
  if (bird.justFed) bird.justFed = false

  if (bird.stage !== 'adult') {
    const stageKey = bird.stage as keyof typeof STAGE_DURATION
    const stageDuration = STAGE_DURATION[stageKey] * DAY_DURATION
    bird.stageProgress += deltaMs / stageDuration

    const healthMod = bird.health / 100
    if (bird.stageProgress * healthMod >= 1) {
      growBird(bird)
    }
  }
}

const hatchBird = (bird: Bird) => {
  const allBirds = state.birds
  const avgHatch = allBirds.reduce((s, b) => s + b.hatchDuration, 0) / allBirds.length

  bird.stage = 'chick'
  bird.stageProgress = 0
  bird.personality = generatePersonality(bird.hatchDuration, avgHatch)
  bird.name = pickName()
  bird.hunger = randomInt(50, 70)
  bird.fear = randomInt(20, 50)
  bird.health = randomInt(75, 95)
  bird.happiness = randomInt(60, 80)
  bird.wishBond = randomInt(10, 20)
  bird.justHatched = true
  state.totalHatched++

  addEventLog(`🥳 ${bird.name} 破壳啦！性格：${bird.personality}`, 'success')
}

const growBird = (bird: Bird) => {
  const currentIdx = GROWTH_ORDER.indexOf(bird.stage)
  if (currentIdx >= GROWTH_ORDER.length - 1) return

  bird.stage = GROWTH_ORDER[currentIdx + 1]
  bird.stageProgress = 0
  bird.justGrew = true

  addEventLog(`🌟 ${bird.name} 成长为${bird.stage}啦！`, 'success')

  if (bird.stage === 'adult') {
    checkAllAdult()
  }
}

const killBird = (bird: Bird) => {
  bird.isDead = true
  state.totalDied++
  addEventLog(`💔 ${bird.name} 离开了我们...`, 'danger')

  state.birds.filter(b => !b.isDead && b.stage !== 'egg').forEach(survivor => {
    survivor.fear = clamp(survivor.fear + randomInt(15, 30), ATTR_MIN, ATTR_MAX)
    if (survivor.personality === 'gentle' || survivor.personality === 'shy') {
      survivor.health = clamp(survivor.health - randomInt(5, 15), ATTR_MIN, ATTR_MAX)
    }
  })
}

const buryBird = (birdId: string) => {
  const bird = state.birds.find(b => b.id === birdId)
  if (!bird || !bird.isDead) return

  state.birds = state.birds.filter(b => b.id !== birdId)
  addEventLog(`🕊️ 已将 ${bird.name} 埋葬在树下...`, 'info')

  state.birds.filter(b => !b.isDead).forEach(survivor => {
    survivor.fear = clamp(survivor.fear - randomInt(5, 10), ATTR_MIN, ATTR_MAX)
  })
}

const getWeatherEffects = () => WEATHER_EFFECTS[state.currentWeather]

const changeWeather = () => {
  const newWeather = randomChoice(WEATHERS.filter(w => w !== state.currentWeather))
  state.currentWeather = newWeather
  state.nextWeatherChangeAt = Date.now() + WEATHER_CHANGE_INTERVAL + randomInt(-10000, 10000)
  addEventLog(`🌤️ 天气变化：${newWeather}`, 'info')
}

const spawnBerry = () => {
  if (state.berries.length >= BERRY_MAX_COUNT) return

  const type = randomChoice(BERRY_TYPES)
  state.berries.push({
    id: generateId(),
    x: randomFloat(5, 95),
    y: randomFloat(10, 85),
    value: BERRY_VALUES[type],
    type,
    spawnedAt: Date.now(),
  })
}

const cleanupExpiredBerries = () => {
  const now = Date.now()
  state.berries = state.berries.filter(b => now - b.spawnedAt < BERRY_LIFETIME)
}

const collectBerry = (berryId: string) => {
  const idx = state.berries.findIndex(b => b.id === berryId)
  if (idx === -1) return 0

  const berry = state.berries[idx]
  state.foodStock += berry.value
  state.berries.splice(idx, 1)
  return berry.value
}

const feedBird = (birdId: string, amount: number): boolean => {
  const bird = state.birds.find(b => b.id === birdId)
  if (!bird || bird.isDead || bird.isAway || bird.stage === 'egg') return false
  if (state.foodStock < amount) return false

  state.foodStock -= amount
  bird.hunger = clamp(bird.hunger + amount, ATTR_MIN, ATTR_MAX)
  bird.feedingCount++
  bird.lastFedAt = Date.now()
  bird.justFed = true

  if (bird.fear > 20) {
    const fearReduce = bird.personality === 'shy' ? 3 : bird.personality === 'gentle' ? 5 : 4
    bird.fear = clamp(bird.fear - fearReduce, ATTR_MIN, ATTR_MAX)
  }

  return true
}

const calmBird = (birdId: string): boolean => {
  const bird = state.birds.find(b => b.id === birdId)
  if (!bird || bird.isDead || bird.isAway || bird.stage === 'egg') return false

  bird.fear = clamp(bird.fear - randomInt(8, 15), ATTR_MIN, ATTR_MAX)
  bird.happiness = clamp(bird.happiness + randomInt(3, 8), ATTR_MIN, ATTR_MAX)
  return true
}

const setCarePreference = (careStyle: CareStyle, favoriteActivity: string, wishMessage: string) => {
  state.carePreference = {
    careStyle,
    favoriteActivity,
    wishMessage,
    recordedAt: Date.now(),
  }
  addEventLog('💝 已记录你的照料心愿，小鸟们感受到了你的心意！', 'success')

  state.birds.filter(b => !b.isDead && b.stage !== 'egg').forEach(bird => {
    bird.wishBond = clamp(bird.wishBond + 10, 0, 100)
    bird.happiness = clamp(bird.happiness + 5, ATTR_MIN, ATTR_MAX)
  })

  state.nextWishEventAt = Date.now() + WISH_EVENT_MIN_INTERVAL
}

const weightedRandomChoice = <T extends { weight?: number }>(items: T[]): T => {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 1), 0)
  let random = Math.random() * totalWeight
  for (const item of items) {
    random -= item.weight ?? 1
    if (random <= 0) return item
  }
  return items[items.length - 1]
}

const getSuitableEvents = (bird: Bird) => {
  return WISH_EVENT_TEMPLATES.filter(template => {
    if (template.personalityMatch && !template.personalityMatch.includes(bird.personality)) {
      return false
    }
    if (template.careStyleMatch && state.carePreference && !template.careStyleMatch.includes(state.carePreference.careStyle)) {
      return false
    }
    if (template.favoriteActivityMatch && state.carePreference) {
      if (!template.favoriteActivityMatch.includes(state.carePreference.favoriteActivity)) {
        return false
      }
    }
    return true
  })
}

const fillTemplateVars = (text: string, bird: Bird): string => {
  let result = text
  result = result.replace(/{birdName}/g, bird.name)
  if (state.carePreference) {
    result = result.replace(/{favoriteActivity}/g, state.carePreference.favoriteActivity)
    result = result.replace(/{wishMessage}/g, state.carePreference.wishMessage)
  } else {
    result = result.replace(/{favoriteActivity}/g, '一起玩耍')
    result = result.replace(/{wishMessage}/g, '希望你健康快乐')
  }
  return result
}

const triggerWishEvent = () => {
  const aliveBirds = state.birds.filter(b => !b.isDead && b.stage !== 'egg')
  if (aliveBirds.length === 0) return

  const weightedBirds = aliveBirds.map(bird => ({
    ...bird,
    weight: 1 + bird.wishBond / 50,
  }))
  const bird = weightedRandomChoice(weightedBirds)
  const suitableEvents = getSuitableEvents(bird)

  if (suitableEvents.length === 0) return

  const template = weightedRandomChoice(suitableEvents)
  const event: WishBottleEvent = {
    id: generateId(),
    type: template.type,
    title: template.title,
    description: fillTemplateVars(template.description, bird),
    birdName: bird.name,
    birdId: bird.id,
    choices: template.choices.map((choice, idx) => ({
      id: `choice_${idx}`,
      text: choice.text,
      emoji: choice.emoji,
      effects: { ...choice.effects },
      feedback: fillTemplateVars(choice.feedback, bird),
      careStyleBonus: choice.careStyleBonus,
    })),
    triggeredAt: Date.now(),
  }

  state.currentWishEvent = event
  state.wishBottleEvents.unshift(event)
  if (state.wishBottleEvents.length > 20) state.wishBottleEvents.pop()

  addEventLog(`🌟 ${bird.name} 有一个心愿想和你分享...`, 'success')
}

const handleWishChoice = (choiceId: string) => {
  const event = state.currentWishEvent
  if (!event) return

  const choice = event.choices.find(c => c.id === choiceId)
  if (!choice) return

  const bird = state.birds.find(b => b.id === event.birdId)
  if (bird && !bird.isDead) {
    let multiplier = 1
    let bonusApplied: string[] = []

    if (choice.careStyleBonus && state.carePreference && choice.careStyleBonus.includes(state.carePreference.careStyle)) {
      multiplier *= 1.5
      bonusApplied.push(CARE_STYLE_NAMES[state.carePreference.careStyle])
    }

    const bondMultiplier = 1 + bird.wishBond / 100
    multiplier *= bondMultiplier

    const applyEffect = (base?: number): number | undefined => {
      if (base === undefined) return undefined
      return Math.round(base * multiplier)
    }

    const hungerDelta = applyEffect(choice.effects.hunger)
    const fearDelta = applyEffect(choice.effects.fear)
    const healthDelta = applyEffect(choice.effects.health)
    const happinessDelta = applyEffect(choice.effects.happiness)
    const bondDeltaBase = choice.effects.bond ?? Math.max(5, Math.floor((choice.effects.happiness || 0) / 2))
    const bondDelta = Math.round(bondDeltaBase * multiplier)

    if (hungerDelta !== undefined) bird.hunger = clamp(bird.hunger + hungerDelta, ATTR_MIN, ATTR_MAX)
    if (fearDelta !== undefined) bird.fear = clamp(bird.fear + fearDelta, ATTR_MIN, ATTR_MAX)
    if (healthDelta !== undefined) bird.health = clamp(bird.health + healthDelta, ATTR_MIN, ATTR_MAX)
    if (happinessDelta !== undefined) bird.happiness = clamp(bird.happiness + happinessDelta, ATTR_MIN, ATTR_MAX)
    bird.wishBond = clamp(bird.wishBond + bondDelta, 0, 100)

    const scoreGain = Math.max(5, Math.round(
      ((happinessDelta || 0) + Math.abs(fearDelta || 0) / 2 + bondDelta) * multiplier
    ))
    state.wishBottleScore += scoreGain
    state.totalWishChoices++

    const newLevel = Math.floor(state.wishBottleScore / WISH_BOTTLE_LEVEL_UP_SCORE) + 1
    if (newLevel > state.wishBottleLevel) {
      state.wishBottleLevel = newLevel
      addEventLog(`✨ 心愿瓶升级啦！当前等级：Lv.${state.wishBottleLevel}`, 'success')
    }

    let bonusStr = ''
    if (bonusApplied.length > 0) {
      bonusStr = ` 💖 ${bonusApplied.join('+')}风格加成 x${multiplier.toFixed(1)}`
    } else if (bondMultiplier > 1.1) {
      bonusStr = ` 💝 羁绊加成 x${bondMultiplier.toFixed(1)}`
    }

    addEventLog(`💫 ${choice.feedback}${bonusStr}`, 'info')

    if (bird.happiness >= 90) {
      addEventLog(`😊 ${bird.name} 超级开心！对你的信任越来越深了~`, 'success')
    }
    if (bird.wishBond >= 80 && bird.wishBond - bondDelta < 80) {
      addEventLog(`💖 ${bird.name} 和你的羁绊达到了新高度！`, 'success')
    }
    if (bird.health <= 30 && healthDelta !== undefined && healthDelta < 0) {
      addEventLog(`⚠️ ${bird.name} 的健康状态令人担忧...`, 'warning')
    }
  }

  state.currentWishEvent = undefined
  state.nextWishEventAt = Date.now() + WISH_EVENT_INTERVAL + randomInt(-10000, 10000)
}

const closeWishEvent = () => {
  state.currentWishEvent = undefined
  state.nextWishEventAt = Date.now() + WISH_EVENT_INTERVAL
}

const allAdults = computed(() => {
  const alive = state.birds.filter(b => !b.isDead)
  return alive.length > 0 && alive.every(b => b.stage === 'adult')
})

const aliveCount = computed(() => state.birds.filter(b => !b.isDead).length)

const checkAllAdult = () => {
  if (allAdults.value) {
    addEventLog(`🎉 所有小鸟都已长成成鸟！请选择放飞或留下配对~`, 'success')
  }
}

const releaseBirds = () => {
  const adults = state.birds.filter(b => b.stage === 'adult' && !b.isDead)
  adults.forEach(b => addEventLog(`🕊️ ${b.name} 飞向了自由的天空！`, 'success'))
  endGame('release')
}

const keepAndBreed = () => {
  const adults = state.birds.filter(b => b.stage === 'adult' && !b.isDead)
  if (adults.length < 2 || state.breedingCount >= state.maxBreedingRounds) {
    endGame('keep')
    return
  }

  state.breedingCount++
  state.phase = 'breeding'

  adults.forEach(b => {
    b.hunger = clamp(b.hunger - randomInt(10, 20), ATTR_MIN, ATTR_MAX)
  })

  const newEggCount = randomInt(MIN_EGGS, MAX_EGGS)
  for (let i = 0; i < newEggCount; i++) {
    state.birds.push(createEgg(state.birds.length))
  }

  addEventLog(`💝 成鸟们产下了 ${newEggCount} 颗新蛋！第 ${state.breedingCount} 窝`, 'success')
  state.phase = 'playing'
}

const checkGameEnd = () => {
  if (aliveCount.value === 0 && state.phase === 'playing') {
    endGame('allDead')
  }
}

const calculateScore = (): GameScore => {
  const totalBirds = state.totalHatched
  const survived = state.birds.filter(b => !b.isDead).length + state.totalDied
  const survivalRate = totalBirds > 0 ? (survived - state.totalDied) / totalBirds : 0

  const aliveBirds = state.birds.filter(b => !b.isDead)
  const avgHealth = aliveBirds.length > 0
    ? aliveBirds.reduce((s, b) => s + b.health, 0) / aliveBirds.length
    : 0

  const avgHappiness = aliveBirds.length > 0
    ? aliveBirds.reduce((s, b) => s + b.happiness, 0) / aliveBirds.length
    : 0

  const avgBond = aliveBirds.length > 0
    ? aliveBirds.reduce((s, b) => s + b.wishBond, 0) / aliveBirds.length
    : 0

  const maxBond = aliveBirds.length > 0
    ? Math.max(...aliveBirds.map(b => b.wishBond))
    : 0

  const breedingBonus = state.breedingCount * 20
  const personalityBonus = aliveBirds.length > 0
    ? aliveBirds.reduce((s, b) => s + (b.feedingCount > 10 ? 5 : 2), 0)
    : 0

  const activityMatchCount = state.wishBottleEvents.filter(e => {
    const template = WISH_EVENT_TEMPLATES.find(t => t.title === e.title)
    return template?.isActivityExclusive
  }).length

  const careStyleMatch = state.wishBottleEvents.reduce((count, event) => {
    return count + event.choices.filter(c => c.careStyleBonus && state.carePreference && c.careStyleBonus.includes(state.carePreference.careStyle)).length > 0 ? 1 : 0
  }, 0)

  const levelBonus = state.wishBottleLevel * 5
  const choicesBonus = state.totalWishChoices * 2
  const happinessBonus = Math.round(avgHappiness * 0.3)
  const bondBonus = Math.round(avgBond * 0.2)
  const activityBonus = activityMatchCount * 3
  const wishBottleBonus = levelBonus + choicesBonus + happinessBonus + bondBonus + activityBonus

  const totalScore = Math.round(
    survivalRate * 35 +
    avgHealth * 0.3 +
    breedingBonus +
    personalityBonus +
    wishBottleBonus
  )

  let stars = 1
  if (totalScore >= 95) stars = 5
  else if (totalScore >= 80) stars = 4
  else if (totalScore >= 60) stars = 3
  else if (totalScore >= 40) stars = 2

  let wishTitle: string | undefined
  if (state.wishBottleLevel >= 5 && state.totalWishChoices >= 10) {
    wishTitle = '🌟 心愿大师'
  } else if (state.wishBottleLevel >= 3) {
    wishTitle = '💝 心灵伙伴'
  } else if (state.totalWishChoices >= 5) {
    wishTitle = '✨ 细心倾听者'
  }

  const rank = stars >= 5 ? '🏆 传奇养鸟人'
    : stars === 4 ? '🥇 金牌养鸟人'
    : stars === 3 ? '🥈 银牌养鸟人'
    : stars === 2 ? '🥉 铜牌养鸟人'
    : '🌱 新手养鸟人'

  return {
    totalScore: clamp(totalScore, 0, 100),
    survivalRate: Math.round(survivalRate * 100),
    avgHealth: Math.round(avgHealth),
    breedingBonus,
    personalityBonus,
    wishBottleBonus,
    wishBottleLevel: state.wishBottleLevel,
    totalWishChoices: state.totalWishChoices,
    avgHappiness: Math.round(avgHappiness),
    avgBond: Math.round(avgBond),
    maxBond: Math.round(maxBond),
    careStyleMatch,
    activityMatchCount,
    careStyle: state.carePreference?.careStyle,
    favoriteActivity: state.carePreference?.favoriteActivity,
    wishMessage: state.carePreference?.wishMessage,
    stars,
    rank,
    wishTitle,
  }
}

const endGame = (_reason: string) => {
  stopGameLoop()
  state.phase = 'ended'
  state.score = calculateScore()
  addEventLog('🎮 游戏结束', 'info')
  saveGame(state)
}

const restartGame = () => {
  stopGameLoop()
  startGame()
}

const returnToStart = () => {
  stopGameLoop()
  Object.assign(state, createInitialState())
  clearSave()
}

const tryLoadGame = (): boolean => {
  const saved = loadGame()
  if (saved && saved.phase === 'playing' || saved?.phase === 'breeding') {
    Object.assign(state, saved)
    startGameLoop()
    return true
  }
  return false
}

watch(
  () => state.phase,
  (phase) => {
    if (phase === 'ended') {
      stopGameLoop()
    }
  }
)

export function useGameState() {
  return {
    state,
    startGame,
    stopGameLoop,
    collectBerry,
    feedBird,
    calmBird,
    buryBird,
    releaseBirds,
    keepAndBreed,
    restartGame,
    returnToStart,
    tryLoadGame,
    allAdults,
    aliveCount,
    setCarePreference,
    handleWishChoice,
    closeWishEvent,
    triggerWishEvent,
  }
}
