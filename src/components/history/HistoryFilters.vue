<template>
  <div class="glass p-4 rounded-xl mb-6">
    <div class="flex flex-wrap items-center gap-4">
      <!-- Tool Filter -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-500 mb-1">Filter by Tool</label>
        <select
          :value="selectedTool"
          @change="$emit('update:selectedTool', $event.target.value)"
          class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Tools</option>
          <option v-for="(meta, key) in toolMeta" :key="key" :value="key">
            {{ meta.name }}
          </option>
        </select>
      </div>

      <!-- Sort Order -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
        <select
          :value="sortOrder"
          @change="$emit('update:sortOrder', $event.target.value)"
          class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="score-high">Highest Score</option>
          <option value="score-low">Lowest Score</option>
        </select>
      </div>

      <!-- Outcome Filter -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-500 mb-1">Outcome Status</label>
        <select
          :value="outcomeFilter"
          @change="$emit('update:outcomeFilter', $event.target.value)"
          class="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All</option>
          <option value="tracked">Tracked</option>
          <option value="untracked">Not Yet Tracked</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="hasActiveFilters"
        @click="$emit('clearFilters')"
        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toolMeta } from '@/stores/HistoryStore'

const props = defineProps({
  selectedTool: { type: String, default: '' },
  sortOrder: { type: String, default: 'newest' },
  outcomeFilter: { type: String, default: '' }
})

defineEmits(['update:selectedTool', 'update:sortOrder', 'update:outcomeFilter', 'clearFilters'])

const hasActiveFilters = computed(() => {
  return props.selectedTool || props.sortOrder !== 'newest' || props.outcomeFilter
})
</script>
