<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameState } from '@/composables/useGameState'
import { CARE_STYLE_EMOJI, CARE_STYLE_NAMES } from '@/utils/constants'

const router = useRouter()
const { state, restartGame, returnToStart } = useGameState()

onMounted(() => {
  if (state.phase !== 'ended' && !state.score) {
    router.push('/')
  }
})

const score = computed(() => state.score)

const starArray = computed(() => {
  const s = score.value?.stars ?? 1
  return Array.from({ length: 5 }, (_, i) => i < s)
})

const aliveBirds = computed(() => state.birds.filter(b => !b.isDead))

const handleRestart = () => {
  restartGame()
  router.push('/game')
}

const handleHome = () => {
  returnToStart()
  router.push('/')
}

const getBondLevel = (bond: number): string => {
  if (bond >= 80) return '💖 灵魂羁绊'
  if (bond >= 60) return '💗 亲密无间'
  if (bond >= 40) return '💓 心心相印'
  if (bond >= 20) return '💕 渐入佳境'
  return '💛 初识之交'
}
</script>

<template>
  <div class="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 flex items-center justify-center p-6 overflow-auto">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-[10%] text-5xl opacity-20 animate-float">✨</div>
      <div class="absolute top-1/4 right-[15%] text-4xl opacity-20 animate-float" style="animation-delay: 0.5s">🌟</div>
      <div class="absolute bottom-1/4 left-[20%] text-5xl opacity-20 animate-float" style="animation-delay: 1s">🐦</div>
      <div class="absolute bottom-20 right-[10%] text-4xl opacity-20 animate-float" style="animation-delay: 1.5s">🌿</div>
    </div>

    <div v-if="score" class="relative z-10 max-w-2xl w-full">
      <div class="text-center mb-6 animate-pop-in">
        <div class="text-7xl mb-4">{{ score.stars >= 4 ? '🏆' : score.stars >= 3 ? '🎉' : '🌱' }}</div>
        <h1 class="font-display text-5xl text-white mb-2 text-stroke">游戏结束</h1>
        <div class="font-display text-3xl text-amber-300 mb-2">{{ score.rank }}</div>
        <div v-if="score.wishTitle" class="text-xl text-pink-300 font-bold animate-pulse-slow mt-2">
          {{ score.wishTitle }}
        </div>
      </div>

      <div class="flex justify-center gap-2 mb-8 animate-pop-in" style="animation-delay: 0.1s">
        <div
          v-for="(filled, idx) in starArray"
          :key="idx"
          class="text-5xl transition-all"
          :class="filled ? 'animate-bounce-slow' : 'opacity-20 grayscale'"
          :style="{ animationDelay: `${idx * 0.1}s` }"
        >
          {{ filled ? '⭐' : '☆' }}
        </div>
      </div>

      <div class="glass rounded-3xl p-8 card-shadow animate-pop-in" style="animation-delay: 0.2s">
        <div class="text-center mb-8">
          <div class="text-white/60 text-sm mb-2">综合得分</div>
          <div class="font-display text-7xl text-yellow-300 text-stroke mb-1">
            {{ score.totalScore }}
            <span class="text-3xl text-white/60">/100</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <div class="text-2xl mb-1">💚</div>
            <div class="text-white/60 text-[10px] mb-1">成活率</div>
            <div class="font-bold text-xl text-green-400">{{ score.survivalRate }}%</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <div class="text-2xl mb-1">❤️</div>
            <div class="text-white/60 text-[10px] mb-1">平均健康</div>
            <div class="font-bold text-xl text-red-400">{{ score.avgHealth }}</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <div class="text-2xl mb-1">😊</div>
            <div class="text-white/60 text-[10px] mb-1">平均幸福</div>
            <div class="font-bold text-xl text-rose-400">{{ score.avgHappiness }}</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <div class="text-2xl mb-1">💝</div>
            <div class="text-white/60 text-[10px] mb-1">繁殖加成</div>
            <div class="font-bold text-xl text-pink-400">+{{ score.breedingBonus }}</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
            <div class="text-2xl mb-1">🌟</div>
            <div class="text-white/60 text-[10px] mb-1">照料加成</div>
            <div class="font-bold text-xl text-amber-400">+{{ score.personalityBonus }}</div>
          </div>

          <div class="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl p-4 text-center border border-purple-400/30">
            <div class="text-2xl mb-1">✨</div>
            <div class="text-white/60 text-[10px] mb-1">心愿瓶加成</div>
            <div class="font-bold text-xl text-purple-300">+{{ score.wishBottleBonus }}</div>
          </div>
        </div>

        <div v-if="score.careStyle" class="bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 rounded-2xl p-4 mb-6 border border-pink-400/20">
          <div class="text-center">
            <div class="text-white/80 mb-3 flex items-center justify-center gap-2">
            <span>💝</span>
            <span class="font-medium">你的照料之道</span>
          </div>
          <div class="flex flex-wrap justify-center gap-4 mb-3">
            <div class="bg-white/10 px-4 py-2 rounded-xl text-white/80 text-sm flex items-center gap-2">
              <span class="text-xl">{{ CARE_STYLE_EMOJI[score.careStyle] }}</span>
              <span class="font-bold">{{ CARE_STYLE_NAMES[score.careStyle] }}</span>
            </div>
            <div class="bg-white/10 px-4 py-2 rounded-xl text-white/80 text-sm flex items-center gap-2">
              <span class="text-xl">🎪</span>
              <span>{{ score.favoriteActivity }}</span>
            </div>
          </div>
          <div v-if="score.wishMessage" class="bg-white/5 px-4 py-2 rounded-xl text-white/70 text-sm italic border border-white/10">
            「{{ score.wishMessage }}」
          </div>
        </div>

        <div v-if="score.totalWishChoices > 0" class="bg-gradient-to-r from-purple-500/12 to-indigo-500/12 rounded-2xl p-4 mb-6 border border-purple-400/20">
          <div class="text-center">
            <div class="text-white/80 mb-3 flex items-center justify-center gap-2">
              <span>🌟</span>
              <span class="font-medium">心愿瓶成就</span>
            </div>
            <div class="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              <div class="flex items-center gap-1">
                <span class="text-amber-300 font-bold">🏆 Lv.{{ score.wishBottleLevel }}</span>
                <span class="text-white/50">心愿瓶等级</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-pink-300 font-bold">💫 {{ score.totalWishChoices }}</span>
                <span class="text-white/50">心愿回应</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-rose-300 font-bold">💖 {{ score.avgBond }}</span>
                <span class="text-white/50">平均羁绊</span>
              </div>
              <div v-if="score.activityMatchCount > 0" class="flex items-center gap-1">
                <span class="text-indigo-300 font-bold">🎯 {{ score.activityMatchCount }}</span>
                <span class="text-white/50">专属事件</span>
              </div>
            </div>
            <div v-if="score.maxBond >= 60" class="mt-2 text-pink-300 text-xs">
              ✨ 你和小鸟们建立了深厚的羁绊！
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-amber-500/10 to-rose-500/10 rounded-2xl p-5 mb-6 border border-amber-400/20">
          <div class="text-center">
            <div class="text-white/80 mb-3 flex items-center justify-center gap-2">
              <span>📊</span>
              <span class="font-medium">本次总结</span>
            </div>
            <div class="text-white/60 text-sm flex flex-wrap justify-center gap-x-5 gap-y-1">
              <span>📅 第 {{ state.day }} 天</span>
              <span>🥚 孵化 {{ state.totalHatched }} 只</span>
              <span>💔 离世 {{ state.totalDied }} 只</span>
              <span>💝 繁殖 {{ state.breedingCount }} 窝</span>
              <span>🐦 存活 {{ aliveBirds.length }} 只</span>
            </div>
          </div>
        </div>

        <div v-if="aliveBirds.length > 0" class="mb-6">
          <div class="text-white/60 text-sm text-center mb-3">💐 那些陪伴过你的鸟儿们</div>
          <div class="flex flex-wrap justify-center gap-2">
            <div
              v-for="bird in aliveBirds"
              :key="bird.id"
              class="bg-white/10 px-3 py-2 rounded-xl text-sm text-white/90 flex items-center gap-2 border border-white/5"
            >
              <span>🐦</span>
              <span class="font-medium">{{ bird.name }}</span>
              <span class="text-white/40">·</span>
              <span class="text-white/70 text-xs">{{ getBondLevel(bird.wishBond) }}</span>
            </div>
          </div>
        </div>

        <div v-if="score.totalWishChoices >= 3" class="bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl p-4 mb-6 border border-rose-400/20">
          <div class="text-center">
            <div class="text-white/80 mb-2 flex items-center justify-center gap-2">
              <span>💌</span>
              <span class="font-medium">来自小鸟们的回信</span>
            </div>
            <div class="text-white/70 text-sm leading-relaxed">
              <template v-if="score.avgBond >= 60">
                「谢谢你一直陪伴着我们，每一次{{ score.favoriteActivity }}都是最快乐的时光。我们会永远记得你的心愿——{{ score.wishMessage }}，愿你也能一直幸福！」
              </template>
              <template v-else-if="score.totalWishChoices >= 5">
                「和你在一起的每一天都很温暖，虽然我们偶尔也会调皮，但你总是耐心地对待我们。希望能永远和你在一起！」
              </template>
              <template v-else>
                「谢谢你照顾我们，每一天都很温暖，希望下次还能和你一起玩耍！」
              </template>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl
                   font-bold text-lg btn-3d hover:from-green-400 hover:to-emerald-500 flex items-center justify-center gap-2"
            @click="handleRestart"
          >
            <span class="text-xl">🪺</span>
            再来一窝！
          </button>
          <button
            class="px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl
                   font-bold text-lg btn-3d hover:from-slate-500 hover:to-slate-600 flex items-center justify-center gap-2"
            @click="handleHome"
          >
            <span class="text-xl">🏠</span>
            返回主页
          </button>
        </div>
      </div>

      <div class="text-center mt-6 text-white/40 text-sm">
        🌸 感谢游玩！希望你和小鸟们都收获了快乐~
      </div>
    </div>
  </div>
</template>
