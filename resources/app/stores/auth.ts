import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import type { User, LoginPayload, RegisterPayload, TwoFactorChallengePayload } from '@/types/auth'
import { apiGet, apiPost, getCsrfCookie, ApiError } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const requiresTwoFactor = ref(false)

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
   * If the server signals a 2FA challenge, sets requiresTwoFactor instead of fetching user.
   */
  async function login(credentials: LoginPayload): Promise<void> {
    await getCsrfCookie()
    const response = await apiPost<{ two_factor?: boolean }>('/login', credentials)
    if (response?.two_factor) {
      requiresTwoFactor.value = true
      return
    }
    await fetchUser()
  }

  /**
   * Complete a pending 2FA challenge with a TOTP code or recovery code.
   */
  async function completeTwoFactorChallenge(payload: TwoFactorChallengePayload): Promise<void> {
    await apiPost('/two-factor-challenge', payload)
    await fetchUser()
    requiresTwoFactor.value = false
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
    requiresTwoFactor.value = false
    router.push({ name: 'home' })
  }

  return {
    user,
    loading,
    isAuthenticated,
    requiresTwoFactor,
    fetchUser,
    login,
    completeTwoFactorChallenge,
    register,
    logout,
  }
})
