import { ref, computed } from 'vue'

// Translations
import en from './locales/en.json'
import nl from './locales/nl.json'

const locales = { en, nl }

// Current locale
const currentLocale = ref(localStorage.getItem('locale') || 'en')

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

// Translation function
export function t(key, params = {}) {
  const messages = locales[currentLocale.value] || locales.en
  let text = getNestedValue(messages, key) || getNestedValue(locales.en, key) || key

  // Simple parameter interpolation: {param}
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
  })

  return text
}

// Reactive translation (for use in templates)
export function useI18n() {
  const locale = computed({
    get: () => currentLocale.value,
    set: (val) => setLocale(val)
  })

  const setLocale = (newLocale) => {
    if (locales[newLocale]) {
      currentLocale.value = newLocale
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
    }
  }

  const availableLocales = Object.keys(locales)

  return {
    t,
    locale,
    setLocale,
    availableLocales
  }
}

// Initialize document lang
if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLocale.value
}

export default {
  install: (app) => {
    app.config.globalProperties.$t = t
    app.provide('i18n', useI18n())
  }
}
