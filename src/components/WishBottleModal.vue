<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CareStyle, WishBottleEvent } from '@/types/game'
import {
  CARE_STYLE_NAMES,
  CARE_STYLE_EMOJI,
  CARE_STYLE_DESC,
  FAVORITE_ACTIVITIES,
  WISH_EVENT_TYPE_EMOJI,
  WISH_EVENT_TYPE_NAMES,
} from '@/utils/constants'
import { useGameState } from '@/composables/useGameState'

const props = defineProps<{
  visible: boolean
  currentEvent?: WishBottleEvent
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { state, setCarePreference, handleWishChoice } = useGameState()

const view = ref<'main' | 'preference' | 'event'>('main')

const selectedCareStyle = ref<CareStyle>('gentle')
const selectedActivity = ref(FAVORITE_ACTIVITIES[0])
const wishMessage = ref('')

const careStyles: CareStyle[] = ['gentle', 'strict', 'playful', 'free', 'attentive']

const hasPreference = computed(() => !!state.carePreference)

watch(() => props.visible, (val) => {
  if (val) {
    if (props.currentEvent) {
      view.value = 'event'
    } else if (!hasPreference.value) {
      view.value = 'preference'
    } else {
      view.value = 'main'
    }
  }
})

watch(() => props.currentEvent, (val) => {
  if (val && props.visible) {
    view.value = 'event'
  }
})

const handleSetPreference = () => {
  if (!wishMessage.value.trim()) {
    wishMessage.value = '希望小鸟们健康快乐地成长~'
  }
  setCarePreference(selectedCareStyle.value, selectedActivity.value, wishMessage.value.trim())
  view.value = 'main'
}

const handleChoice = (choiceId: string) => {
  handleWishChoice(choiceId)
  emit('close')
}

const goToPreference = () => {
  view.value = 'preference'
  if (state.carePreference) {
    selectedCareStyle.value = state.carePreference.careStyle
    selectedActivity.value = state.carePreference.favoriteActivity
    wishMessage.value = state.carePreference.wishMessage
  }
}

const goToMain = () => {
  view.value = 'main'
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-rose-900/95 border border-white/20 card-shadow animate-pop-in"
        @click.stop
      >
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-5 left-[10%] text-4xl opacity-20 animate-float">✨</div>
          <div class="absolute top-1/4 right-[8%] text-3xl opacity-20 animate-float" style="animation-delay: 0.5s">🌟</div>
          <div class="absolute bottom-1/4 left-[15%] text-4xl opacity-20 animate-float" style="animation-delay: 1s">💫</div>
          <div class="absolute bottom-8 right-[10%] text-3xl opacity-20 animate-float" style="animation-delay: 1.5s">🌙</div>
        </div>

        <button
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all z-10"
          @click="emit('close')"
        >
          ✕
        </button>

        <div class="relative z-10 p-6 overflow-y-auto max-h-[90vh] scrollbar-hide">
          <!-- 主界面 -->
          <div v-if="view === 'main'" class="animate-fade-in">
            <div class="text-center mb-6">
              <div class="text-6xl mb-3 animate-bounce-slow inline-block">🌟</div>
              <h2 class="font-display text-3xl text-amber-300 text-stroke mb-2">鸟语心愿瓶</h2>
              <div class="text-white/60 text-sm">记录你的照料心愿，收获专属回忆</div>
            </div>

            <div class="glass rounded-2xl p-4 mb-4 border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🏆</span>
                  <span class="text-white font-bold">心愿瓶等级</span>
                </div>
                <div class="font-display text-2xl text-amber-300">Lv.{{ state.wishBottleLevel }}</div>
              </div>
              <div class="flex items-center gap-4 text-sm text-white/70">
                <span>💝 心愿 {{ state.totalWishChoices }} 个</span>
                <span>⭐ 积分 {{ state.wishBottleScore }}</span>
              </div>
            </div>

            <div v-if="state.carePreference" class="glass rounded-2xl p-4 mb-4 border border-white/10">
              <div class="text-white/60 text-xs mb-2">我的照料偏好</div>
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">{{ CARE_STYLE_EMOJI[state.carePreference.careStyle] }}</span>
                <div>
                  <div class="text-white font-bold">{{ CARE_STYLE_NAMES[state.carePreference.careStyle] }}</div>
                  <div class="text-white/50 text-xs">{{ CARE_STYLE_DESC[state.carePreference.careStyle] }}</div>
                </div>
              </div>
              <div class="text-white/60 text-sm mb-1">
                <span class="text-amber-300">💕</span> 最爱的活动：{{ state.carePreference.favoriteActivity }}
              </div>
              <div class="text-white/60 text-sm">
                <span class="text-pink-300">💌</span> 心愿：{{ state.carePreference.wishMessage }}
              </div>
              <button
                class="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-all"
                @click="goToPreference"
              >
                ✏️ 修改偏好
              </button>
            </div>

            <div v-else class="glass rounded-2xl p-4 mb-4 border border-white/10 text-center">
              <div class="text-4xl mb-2">💝</div>
              <div class="text-white/70 text-sm mb-3">还没有记录照料偏好哦~</div>
              <button
                class="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm btn-3d hover:from-pink-400 hover:to-rose-400"
                @click="goToPreference"
              >
                记录心愿
              </button>
            </div>

            <div class="glass rounded-2xl p-4 border border-white/10">
              <div class="text-white/80 font-bold mb-3 flex items-center gap-2">
                <span>📜</span> 心愿回忆
              </div>
              <div v-if="state.wishBottleEvents.length > 0" class="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                <div
                  v-for="event in state.wishBottleEvents.slice(0, 10)"
                  :key="event.id"
                  class="bg-white/5 rounded-xl p-3 border border-white/5"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">{{ WISH_EVENT_TYPE_EMOJI[event.type] }}</span>
                    <span class="text-white/80 text-sm font-medium">{{ event.title }}</span>
                  </div>
                  <div class="text-white/50 text-xs">{{ event.birdName }} · {{ WISH_EVENT_TYPE_NAMES[event.type] }}</div>
                </div>
              </div>
              <div v-else class="text-center py-6 text-white/40 text-sm">
                还没有心愿回忆...
              </div>
            </div>
          </div>

          <!-- 偏好设置界面 -->
          <div v-else-if="view === 'preference'" class="animate-fade-in">
            <div class="text-center mb-6">
              <div class="text-5xl mb-3">💝</div>
              <h2 class="font-display text-2xl text-amber-300 text-stroke mb-2">记录你的心愿</h2>
              <div class="text-white/60 text-sm">告诉小鸟们你的照料方式吧~</div>
            </div>

            <div class="mb-5">
              <div class="text-white/80 font-bold mb-3 flex items-center gap-2">
                <span>🎭</span> 选择你的照料风格
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="style in careStyles"
                  :key="style"
                  :class="[
                    'p-3 rounded-2xl border-2 transition-all text-left',
                    selectedCareStyle === style
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  ]"
                  @click="selectedCareStyle = style"
                >
                  <div class="text-2xl mb-1">{{ CARE_STYLE_EMOJI[style] }}</div>
                  <div class="text-white text-sm font-bold">{{ CARE_STYLE_NAMES[style] }}</div>
                  <div class="text-white/50 text-xs">{{ CARE_STYLE_DESC[style] }}</div>
                </button>
              </div>
            </div>

            <div class="mb-5">
              <div class="text-white/80 font-bold mb-3 flex items-center gap-2">
                <span>🎪</span> 最爱的活动
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="activity in FAVORITE_ACTIVITIES"
                  :key="activity"
                  :class="[
                    'px-4 py-2 rounded-xl text-sm transition-all',
                    selectedActivity === activity
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  ]"
                  @click="selectedActivity = activity"
                >
                  {{ activity }}
                </button>
              </div>
            </div>

            <div class="mb-6">
              <div class="text-white/80 font-bold mb-3 flex items-center gap-2">
                <span>💌</span> 写下你的心愿
              </div>
              <textarea
                v-model="wishMessage"
                placeholder="写下你对小鸟们的心愿和祝福..."
                class="w-full h-24 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-amber-400/50 transition-all"
              />
            </div>

            <div class="flex gap-3">
              <button
                v-if="hasPreference"
                class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-2xl font-bold transition-all"
                @click="goToMain"
              >
                返回
              </button>
              <button
                class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold btn-3d hover:from-amber-400 hover:to-orange-400"
                @click="handleSetPreference"
              >
                💝 确认心愿
              </button>
            </div>
          </div>

          <!-- 事件界面 -->
          <div v-else-if="view === 'event' && currentEvent" class="animate-fade-in">
            <div class="text-center mb-5">
              <div class="text-5xl mb-3 animate-bounce-slow inline-block">
                {{ WISH_EVENT_TYPE_EMOJI[currentEvent.type] }}
              </div>
              <div class="text-white/50 text-xs mb-1">{{ WISH_EVENT_TYPE_NAMES[currentEvent.type] }} · {{ currentEvent.birdName }}</div>
              <h2 class="font-display text-2xl text-amber-300 text-stroke">{{ currentEvent.title }}</h2>
            </div>

            <div class="glass rounded-2xl p-5 mb-5 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <p class="text-white/90 text-center leading-relaxed">
                {{ currentEvent.description }}
              </p>
            </div>

            <div class="text-white/60 text-sm text-center mb-4">你会怎么做呢？</div>

            <div class="space-y-3">
              <button
                v-for="choice in currentEvent.choices"
                :key="choice.id"
                class="w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-amber-400/30 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                @click="handleChoice(choice.id)"
              >
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ choice.emoji }}</span>
                  <div class="flex-1">
                    <div class="text-white font-bold">{{ choice.text }}</div>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span v-if="choice.effects.hunger" class="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                        {{ choice.effects.hunger > 0 ? '+' : '' }}{{ choice.effects.hunger }} 饱食
                      </span>
                      <span v-if="choice.effects.fear" class="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        {{ choice.effects.fear > 0 ? '+' : '' }}{{ choice.effects.fear }} 恐惧
                      </span>
                      <span v-if="choice.effects.health" class="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                        {{ choice.effects.health > 0 ? '+' : '' }}{{ choice.effects.health }} 健康
                      </span>
                      <span v-if="choice.effects.happiness" class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        {{ choice.effects.happiness > 0 ? '+' : '' }}{{ choice.effects.happiness }} 幸福
                      </span>
                    </div>
                  </div>
                  <span class="text-white/30">→</span>
                </div>
              </button>
            </div>

            <button
              class="mt-4 w-full py-2 text-white/40 text-sm hover:text-white/60 transition-all"
              @click="emit('close')"
            >
              先放一放...
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
