<template>
  <div v-if="templates.length > 0">
    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <span>&#128161; Use a template</span>
    </button>

    <!-- Templates Panel -->
    <Transition name="slide">
      <div v-if="isOpen" class="mt-4">
        <!-- Category Filter -->
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            @click="selectedCategory = ''"
            class="px-3 py-1 text-sm rounded-full transition-all"
            :class="selectedCategory === ''
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            All
          </button>
          <button
            v-for="cat in availableCategories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="px-3 py-1 text-sm rounded-full transition-all"
            :class="selectedCategory === cat.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            <span v-html="cat.icon"></span> {{ cat.name }}
          </button>
        </div>

        <!-- Templates Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="template in filteredTemplates"
            :key="template.id"
            @click="selectTemplate(template)"
            class="p-4 text-left glass rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 group"
          >
            <div class="flex items-start gap-3">
              <span class="text-2xl" v-html="getCategoryIcon(template.category)"></span>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ template.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ template.description }}
                </p>
              </div>
            </div>
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredTemplates.length === 0"
          class="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          No templates available for this category.
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTemplatesForTool, getCategories } from '@/data/templates'

const props = defineProps({
  tool: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const selectedCategory = ref('')

const templates = computed(() => getTemplatesForTool(props.tool))
const categories = getCategories()

const availableCategories = computed(() => {
  const usedCategories = new Set(templates.value.map(t => t.category))
  return categories.filter(c => usedCategories.has(c.id))
})

const filteredTemplates = computed(() => {
  if (!selectedCategory.value) return templates.value
  return templates.value.filter(t => t.category === selectedCategory.value)
})

const getCategoryIcon = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.icon || '&#128196;'
}

const selectTemplate = (template) => {
  emit('select', template.data)
  isOpen.value = false
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
