<template>
  <div class="flex flex-col items-center justify-center py-8">
    <!-- Animated brain icon -->
    <div class="relative mb-6">
      <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl animate-pulse shadow-lg">
        &#129504;
      </div>
      <div class="absolute -inset-2 bg-indigo-500/20 rounded-3xl blur-xl animate-pulse"></div>
    </div>

    <!-- Loading text -->
    <p class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
      {{ message }}
    </p>

    <!-- Animated dots -->
    <div class="flex gap-1">
      <span
        v-for="i in 3"
        :key="i"
        class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
        :style="{ animationDelay: `${i * 0.15}s` }"
      ></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Analyzing your decision...'
  }
})
</script>
