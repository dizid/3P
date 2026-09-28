import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// style.css holds the Tailwind directives plus all custom styles (glass, gradient-mesh, FormKit, transitions)
import './style.css'
import { plugin, defaultConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig)
app.mount('#app')
