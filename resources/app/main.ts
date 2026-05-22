import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Fetch user BEFORE installing router so the initial navigation
// guard has the correct auth state. This prevents authenticated
// users from seeing guest-only pages on page refresh.
const authStore = useAuthStore()
authStore.fetchUser().finally(() => {
  app.use(router)
  app.mount('#app')
})
