import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Register global navigation guards.
 *
 * - Routes with `meta.requiresAuth` redirect unauthenticated users to /login.
 * - Routes with `meta.requiresPermission` redirect users without that permission
 *   to /admin/dashboard (if they have admin access) or to / (home).
 * - Routes with `meta.guest` redirect authenticated users to their default route.
 */
export function registerGuards(router: Router): void {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    // Must be authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Must have a specific permission
    if (to.meta.requiresPermission && authStore.isAuthenticated) {
      const permission = to.meta.requiresPermission as string
      const hasPermission = authStore.user?.permissions?.includes(permission)
      if (!hasPermission) {
        // Redirect to admin dashboard if user has admin access (better UX
        // than dropping them out of the admin context); otherwise to home.
        const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
        return hasAdminAccess ? { name: 'admin.dashboard' } : { name: 'home' }
      }
    }

    // Authenticated users should not see guest-only pages
    if (to.meta.guest && authStore.isAuthenticated) {
      const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
      return hasAdminAccess ? { name: 'admin.dashboard' } : { name: 'home' }
    }

    return true
  })
}
