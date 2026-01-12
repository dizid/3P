<template>
  <div
    class="glass p-5 rounded-2xl border-2 h-full"
    :class="borderClass"
  >
    <div class="flex items-center gap-3 mb-4">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white shadow-lg"
        :class="iconBgClass"
      >
        <span v-html="icon"></span>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
        <p class="text-xs text-gray-500">{{ subtitle }}</p>
      </div>
      <div class="ml-auto text-2xl font-bold" :class="scoreClass">
        {{ prefix }}{{ score }}
      </div>
    </div>

    <div class="space-y-2 mb-4 min-h-[120px]">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-3 p-3 bg-white/60 rounded-xl group"
      >
        <input
          :value="item.text"
          @input="$emit('updateText', item.id, $event.target.value)"
          type="text"
          :placeholder="placeholder"
          class="flex-1 px-3 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
          :class="focusBorderClass"
        />

        <div class="flex items-center gap-2 min-w-[100px]">
          <input
            type="range"
            :value="item.weight"
            @input="$emit('updateWeight', item.id, Number($event.target.value))"
            min="1"
            max="10"
            class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            :style="{ accentColor: color }"
          />
          <span
            class="text-lg font-bold w-6 text-center"
            :style="{ color }"
          >
            {{ item.weight }}
          </span>
        </div>

        <button
          @click="$emit('remove', item.id)"
          class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
          title="Remove item"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <button
      @click="$emit('add')"
      class="w-full py-2 px-4 border-2 border-dashed rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      :class="addButtonClass"
    >
      <span>+</span> Add {{ title }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: String, required: true },
  placeholder: { type: String, required: true },
  items: { type: Array, required: true },
  score: { type: Number, required: true },
  color: { type: String, required: true },
  type: { type: String, required: true } // 'strength' | 'weakness' | 'opportunity' | 'threat'
})

defineEmits(['add', 'remove', 'updateText', 'updateWeight'])

const prefix = computed(() => {
  if (props.type === 'weakness' || props.type === 'threat') return '-'
  return '+'
})

const borderClass = computed(() => {
  const classes = {
    strength: 'border-green-300',
    weakness: 'border-red-300',
    opportunity: 'border-blue-300',
    threat: 'border-orange-300'
  }
  return classes[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    strength: 'bg-gradient-to-br from-green-400 to-emerald-600',
    weakness: 'bg-gradient-to-br from-red-400 to-rose-600',
    opportunity: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    threat: 'bg-gradient-to-br from-orange-400 to-amber-600'
  }
  return classes[props.type]
})

const scoreClass = computed(() => {
  const classes = {
    strength: 'text-green-600',
    weakness: 'text-red-600',
    opportunity: 'text-blue-600',
    threat: 'text-orange-600'
  }
  return classes[props.type]
})

const focusBorderClass = computed(() => {
  const classes = {
    strength: 'focus:border-green-500',
    weakness: 'focus:border-red-500',
    opportunity: 'focus:border-blue-500',
    threat: 'focus:border-orange-500'
  }
  return classes[props.type]
})

const addButtonClass = computed(() => {
  const classes = {
    strength: 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400',
    weakness: 'border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400',
    opportunity: 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400',
    threat: 'border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400'
  }
  return classes[props.type]
})
</script>
