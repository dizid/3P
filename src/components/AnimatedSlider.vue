<template>
  <div class="slider-container group">
    <div class="relative">
      <input
        type="range"
        :value="modelValue"
        @input="handleInput"
        :min="min"
        :max="max"
        class="w-full h-3 rounded-full appearance-none cursor-pointer outline-none transition-all duration-200"
        :style="sliderStyle"
      />
    </div>

    <!-- Scale Markers -->
    <div class="flex justify-between mt-2 px-1">
      <span class="text-xs text-gray-400">{{ min }}</span>
      <span class="text-xs text-gray-400">{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 100
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  trackColor: {
    type: String,
    default: '#e5e7eb'
  }
})

const emit = defineEmits(['update:modelValue'])

const percentage = computed(() => {
  return ((Number(props.modelValue) - props.min) / (props.max - props.min)) * 100
})

const sliderStyle = computed(() => ({
  background: `linear-gradient(to right, ${props.color} 0%, ${props.color} ${percentage.value}%, ${props.trackColor} ${percentage.value}%, ${props.trackColor} 100%)`,
  '--slider-color': props.color
}))

const handleInput = (event) => {
  emit('update:modelValue', Number(event.target.value))
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 4px solid var(--slider-color, #3b82f6);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease,
              border-color 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 4px solid var(--slider-color, #3b82f6);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}
</style>
