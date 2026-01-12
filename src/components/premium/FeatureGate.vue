<template>
  <div class="relative">
    <!-- Unlocked: Show content normally -->
    <slot v-if="hasAccess" />

    <!-- Locked: Show blurred preview with upgrade prompt -->
    <div v-else class="relative">
      <!-- Blurred content preview -->
      <div class="blur-sm pointer-events-none select-none" aria-hidden="true">
        <slot name="preview">
          <slot />
        </slot>
      </div>

      <!-- Upgrade overlay -->
      <div class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl">
        <div class="text-center p-6 max-w-sm">
          <div class="text-4xl mb-4">&#128274;</div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {{ title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ description }}
          </p>
          <RouterLink
            to="/pricing"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <span>&#9733;</span>
            <span>Upgrade to Premium</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSubscriptionStore } from '@/stores/SubscriptionStore'

const props = defineProps({
  feature: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Premium Feature'
  },
  description: {
    type: String,
    default: 'Upgrade to Premium to unlock this feature and get the most out of your decision-making.'
  }
})

const subscriptionStore = useSubscriptionStore()

const hasAccess = computed(() => {
  return subscriptionStore.canUseFeature(props.feature)
})
</script>
