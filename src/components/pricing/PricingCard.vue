<template>
  <div
    class="relative glass-card overflow-hidden"
    :class="{ 'ring-2 ring-indigo-500 shadow-xl': featured }"
  >
    <!-- Featured badge -->
    <div
      v-if="featured"
      class="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl"
    >
      {{ badge || 'Most Popular' }}
    </div>

    <div class="p-8">
      <!-- Plan name -->
      <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ name }}
      </h3>

      <!-- Price -->
      <div class="mb-6">
        <template v-if="price === 0">
          <span class="text-4xl font-black text-gray-800 dark:text-gray-100">Free</span>
        </template>
        <template v-else>
          <span class="text-4xl font-black text-gray-800 dark:text-gray-100">
            {{ currencySymbol }}{{ displayPrice }}
          </span>
          <span class="text-gray-500 dark:text-gray-400">/{{ billingPeriod }}</span>
          <div v-if="savings" class="mt-1">
            <span class="text-sm text-green-600 dark:text-green-400 font-medium">
              Save {{ savings }}
            </span>
          </div>
        </template>
      </div>

      <!-- Features -->
      <ul class="space-y-3 mb-8">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-3"
        >
          <span class="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
          <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
        </li>
      </ul>

      <!-- Limitations (for free tier) -->
      <ul v-if="limitations && limitations.length" class="space-y-3 mb-8">
        <li
          v-for="(limitation, index) in limitations"
          :key="index"
          class="flex items-start gap-3 opacity-60"
        >
          <span class="text-gray-400 mt-0.5 flex-shrink-0">&#10005;</span>
          <span class="text-gray-500 dark:text-gray-400">{{ limitation }}</span>
        </li>
      </ul>

      <!-- CTA Button -->
      <button
        @click="$emit('select')"
        :disabled="disabled"
        class="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300"
        :class="buttonClass"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  billingPeriod: {
    type: String,
    default: 'month'
  },
  features: {
    type: Array,
    default: () => []
  },
  limitations: {
    type: Array,
    default: () => []
  },
  featured: {
    type: Boolean,
    default: false
  },
  badge: {
    type: String,
    default: null
  },
  savings: {
    type: String,
    default: null
  },
  buttonText: {
    type: String,
    default: 'Get Started'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  currency: {
    type: String,
    default: 'EUR'
  }
})

defineEmits(['select'])

const currencySymbol = computed(() => {
  const symbols = { EUR: '€', USD: '$', GBP: '£' }
  return symbols[props.currency] || '€'
})

const displayPrice = computed(() => {
  return props.price.toFixed(2).replace('.', ',')
})

const buttonClass = computed(() => {
  if (props.disabled) {
    return 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
  }
  if (props.featured) {
    return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02]'
  }
  return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
})
</script>
