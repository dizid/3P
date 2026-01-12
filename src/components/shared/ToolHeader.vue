<template>
  <div class="mb-8">
    <!-- Back Button -->
    <RouterLink
      to="/tools"
      class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4 group"
    >
      <svg
        class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="font-medium">All Tools</span>
    </RouterLink>

    <!-- Header Card -->
    <div
      class="relative overflow-hidden rounded-2xl p-8 text-white"
      :style="{ background: `linear-gradient(135deg, ${color}, ${colorDark})` }"
    >
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      <div class="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full"></div>

      <div class="relative z-10 flex items-center gap-4">
        <div class="text-5xl">{{ icon }}</div>
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold mb-2">{{ title }}</h1>
          <p class="text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
    default: '#6366f1'
  }
})
</script>
