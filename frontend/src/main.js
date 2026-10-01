import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { setUnauthorizedHandler } from './services/api'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)
setUnauthorizedHandler(() => {
  auth.clearAuth()
  if (router.currentRoute.value.name !== 'login') {
    router.replace({ name: 'login', query: { next: router.currentRoute.value.fullPath } })
  }
})

app.mount('#app')
