<template>
  <div
    class="glass-card p-6 border-2"
    :class="variant === 'inline' ? 'border-amber-200 dark:border-amber-800' : 'border-indigo-200 dark:border-indigo-800'"
  >
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div
        class="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl shadow-lg"
        :class="variant === 'inline'
          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600'"
      >
        {{ icon }}
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ description }}
        </p>

        <!-- Features list -->
        <ul v-if="features.length" class="space-y-2 mb-4">
          <li
            v-for="(feature, index) in features"
            :key="index"
            class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <span class="text-green-500">&#10003;</span>
            {{ feature }}
          </li>
        </ul>

        <!-- CTA -->
        <div class="flex flex-wrap gap-3">
          <RouterLink
            to="/pricing"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <span>&#9733;</span>
            <span>View Plans</span>
          </RouterLink>

          <button
            v-if="dismissible"
            @click="$emit('dismiss')"
            class="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Unlock More Features'
  },
  description: {
    type: String,
    default: 'Get AI-powered advice, unlimited history, and deep insights with Premium.'
  },
  features: {
    type: Array,
    default: () => []
  },
  icon: {
    type: String,
    default: '&#128640;'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'inline'].includes(v)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])
</script>
