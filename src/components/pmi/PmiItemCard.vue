<template>
  <div class="flex items-center gap-3 p-3 bg-white/60 rounded-xl group">
    <!-- Text Input -->
    <input
      :value="item.text"
      @input="$emit('update:text', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="flex-1 px-3 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:border-current focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
      :style="{ '--tw-border-opacity': 1, borderColor: item.text ? color : undefined }"
    />

    <!-- Weight -->
    <div class="flex items-center gap-2 min-w-[100px]">
      <input
        type="range"
        :value="item.weight"
        @input="$emit('update:weight', Number($event.target.value))"
        min="1"
        max="10"
        class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-current"
        :style="{ accentColor: color }"
      />
      <span
        class="text-lg font-bold w-6 text-center"
        :style="{ color }"
      >
        {{ item.weight }}
      </span>
    </div>

    <!-- Remove Button -->
    <button
      @click="$emit('remove')"
      class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
      title="Remove item"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Enter item...'
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
})

defineEmits(['update:text', 'update:weight', 'remove'])
</script>
