import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import { useAuthStore } from '@/stores/auth'
import { applyTheme, usePreferencesStore } from '@/stores/preferences'
import type { Theme } from '@/stores/preferences'

// Apply saved theme BEFORE mounting to prevent flash of wrong theme.
// Pinia is not yet active here, so we read localStorage directly.
const savedTheme = (localStorage.getItem('theme') as Theme | null) ?? 'system'
applyTheme(savedTheme)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Instantiate preferences store so its watchers register and the
// system media query listener attaches if theme is 'system'.
usePreferencesStore()

// Fetch user BEFORE installing router so the initial navigation
// guard has the correct auth state. This prevents authenticated
// users from seeing guest-only pages on page refresh.
const authStore = useAuthStore()
authStore.fetchUser().finally(() => {
  app.use(router)
  app.mount('#app')
})
