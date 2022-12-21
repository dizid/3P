import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// import './assets/index.css'  // NEEDED??
import './index.css'
import { plugin, defaultConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig)
app.mount('#app')
