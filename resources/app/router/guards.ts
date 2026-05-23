import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Register global navigation guards.
 *
 * - Routes with `meta.requiresAuth` redirect unauthenticated users to /login.
 * - Routes with `meta.guest` redirect authenticated users to /.
 */
export function registerGuards(router: Router): void {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.guest && authStore.isAuthenticated) {
      return { name: 'admin.dashboard' }
    }

    return true
  })
}
