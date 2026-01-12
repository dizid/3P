<template>
  <RouterLink
    :to="to"
    class="block glass-card p-6 card-lift group cursor-pointer"
  >
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div
        class="relative flex-shrink-0"
      >
        <div
          class="absolute inset-0 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"
          :style="{ backgroundColor: color }"
        ></div>
        <div
          class="relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
          :style="{ background: `linear-gradient(135deg, ${color}, ${colorDark})` }"
        >
          {{ icon }}
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 leading-relaxed">
          {{ description }}
        </p>
      </div>

      <!-- Arrow -->
      <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  colorDark: {
    type: String,
    default: '#1d4ed8'
  }
})
</script>
