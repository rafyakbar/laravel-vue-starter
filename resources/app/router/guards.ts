import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Register global navigation guards.
 *
 * - Routes with `meta.requiresAuth` redirect unauthenticated users to /login,
 *   or to /two-factor-challenge when a 2FA challenge is pending.
 * - Routes with `meta.requiresPermission` redirect users without that permission.
 * - Routes with `meta.guest` redirect authenticated users to their default route,
 *   or to /two-factor-challenge when a 2FA challenge is pending.
 * - Routes with `meta.twoFactorOnly` are only accessible during a pending 2FA challenge.
 */
export function registerGuards(router: Router): void {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    // 2FA challenge route: only accessible when requiresTwoFactor is true
    if (to.meta.twoFactorOnly && !authStore.requiresTwoFactor) {
      return { name: 'login' }
    }

    // Must be authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      if (authStore.requiresTwoFactor) {
        return { name: 'two-factor-challenge' }
      }
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Must have a specific permission
    if (to.meta.requiresPermission && authStore.isAuthenticated) {
      const permission = to.meta.requiresPermission as string
      const hasPermission = authStore.user?.permissions?.includes(permission)
      if (!hasPermission) {
        const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
        return hasAdminAccess ? { name: 'admin.dashboard' } : { name: 'home' }
      }
    }

    // Authenticated users should not see guest-only pages
    if (to.meta.guest && authStore.isAuthenticated) {
      const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
      return hasAdminAccess ? { name: 'admin.dashboard' } : { name: 'home' }
    }

    // Redirect 2FA-pending users away from guest pages to the challenge page
    if (to.meta.guest && authStore.requiresTwoFactor) {
      return { name: 'two-factor-challenge' }
    }

    return true
  })
}
