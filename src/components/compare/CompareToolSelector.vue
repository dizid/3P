<template>
  <div class="glass-card p-6">
    <h3 class="font-bold text-gray-800 mb-4">Select Tools to Compare</h3>
    <p class="text-sm text-gray-600 mb-4">
      Choose 2-3 tools to analyze your decision from different perspectives.
    </p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="(meta, key) in toolMeta"
        :key="key"
        @click="toggleTool(key)"
        :disabled="!selectedTools.includes(key) && selectedTools.length >= 3"
        class="p-4 rounded-xl border-2 transition-all duration-200"
        :class="[
          selectedTools.includes(key)
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300',
          !selectedTools.includes(key) && selectedTools.length >= 3
            ? 'opacity-50 cursor-not-allowed'
            : ''
        ]"
      >
        <div
          class="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl text-white"
          :style="{ backgroundColor: meta.color }"
        >
          <span v-html="meta.icon"></span>
        </div>
        <div class="text-sm font-medium text-gray-700 text-center">{{ meta.name }}</div>
        <div
          v-if="selectedTools.includes(key)"
          class="mt-2 text-xs text-blue-600 font-medium"
        >
          &#10003; Selected
        </div>
      </button>
    </div>

    <div class="mt-4 text-sm text-gray-500 text-center">
      {{ selectedTools.length }}/3 tools selected
    </div>
  </div>
</template>

<script setup>
import { toolMeta } from '@/stores/HistoryStore'

const props = defineProps({
  selectedTools: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:selectedTools'])

const toggleTool = (tool) => {
  const current = [...props.selectedTools]
  const index = current.indexOf(tool)

  if (index >= 0) {
    current.splice(index, 1)
  } else if (current.length < 3) {
    current.push(tool)
  }

  emit('update:selectedTools', current)
}
</script>
