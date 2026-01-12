<template>
  <div class="text-center px-4 py-6">
    <!-- Icon -->
    <div class="text-6xl mb-6" v-html="icon"></div>

    <!-- Title -->
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
      {{ title }}
    </h2>

    <!-- Description -->
    <p class="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
      {{ description }}
    </p>

    <!-- Optional features list -->
    <ul v-if="features && features.length" class="mt-6 space-y-2 text-left max-w-sm mx-auto">
      <li
        v-for="(feature, index) in features"
        :key="index"
        class="flex items-start gap-3"
      >
        <span class="text-green-500 mt-0.5">&#10003;</span>
        <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
      </li>
    </ul>
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
  features: {
    type: Array,
    default: () => []
  }
})
</script>
