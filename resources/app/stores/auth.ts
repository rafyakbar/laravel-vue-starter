import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import type { User, LoginPayload, RegisterPayload } from '@/types/auth'
import { apiGet, apiPost, getCsrfCookie, ApiError } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  /**
   * Fetch the authenticated user from the API.
   * Sets user to null on 401 (not authenticated).
   */
  async function fetchUser(): Promise<void> {
    try {
      const response = await apiGet<{ data: User }>('/api/users/auth')
      user.value = response.data
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        user.value = null
      } else {
        user.value = null
      }
    }
  }

  /**
   * Login with credentials.
   * Gets CSRF cookie first, then posts to /login, then fetches user profile.
   */
  async function login(credentials: LoginPayload): Promise<void> {
    await getCsrfCookie()
    await apiPost('/login', credentials)
    await fetchUser()
  }

  /**
   * Register a new user.
   * Gets CSRF cookie first, then posts to /register, then fetches user profile.
   */
  async function register(data: RegisterPayload): Promise<void> {
    await getCsrfCookie()
    await apiPost('/register', data)
    await fetchUser()
  }

  /**
   * Logout the current user.
   * Posts to /logout, clears user state, and redirects to login.
   */
  async function logout(): Promise<void> {
    await apiPost('/logout')
    user.value = null
    router.push({ name: 'home' })
  }

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    login,
    register,
    logout,
  }
})
