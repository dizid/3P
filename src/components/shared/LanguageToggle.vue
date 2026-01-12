<template>
  <button
    @click="toggleLocale"
    class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold"
    :title="currentLocale === 'en' ? 'Switch to Dutch' : 'Switch to English'"
  >
    <span class="text-gray-600 dark:text-gray-300">
      {{ currentLocale === 'en' ? 'EN' : 'NL' }}
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentLocale = ref('en')

onMounted(() => {
  currentLocale.value = localStorage.getItem('locale') || 'en'
})

const toggleLocale = () => {
  const newLocale = currentLocale.value === 'en' ? 'nl' : 'en'
  currentLocale.value = newLocale
  localStorage.setItem('locale', newLocale)
  document.documentElement.lang = newLocale
  // Reload page to apply translations (simple approach)
  window.location.reload()
}
</script>
