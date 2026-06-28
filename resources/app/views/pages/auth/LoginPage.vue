<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/services/api'
import type { LoginPayload, ApiValidationError } from '@/types/auth'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const submitting = ref(false)

const { handleSubmit, setErrors } = useForm<LoginPayload>({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: {
    email: (value: string) => {
      if (!value) return 'Email or username is required'
      return true
    },
    password: (value: string) => {
      if (!value) return 'Password is required'
      return true
    },
  },
})

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    await authStore.login(values)
    if (authStore.requiresTwoFactor) {
      router.push({ name: 'two-factor-challenge' })
      return
    }
    const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
    const redirect = (route.query.redirect as string) || (hasAdminAccess ? '/admin' : '/')
    router.push(redirect)
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as ApiValidationError
      setErrors(data.errors)
    }
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-gray-900">
    <div class="flex min-h-screen flex-col lg:flex-row">
      <!-- Left: Form column -->
      <div class="flex w-full flex-col px-6 py-10 lg:w-1/2 lg:px-16">
        <router-link :to="{ name: 'home' }" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
          <ChevronLeft class="size-4" /> Back to home
        </router-link>

        <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 class="text-[30px] font-bold text-gray-800 sm:text-[36px] dark:text-white/90">Sign In</h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>

          <form @submit="onSubmit" class="mt-8 space-y-5">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="email@example.com"
                    v-bind="componentField"
                    autocomplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    v-bind="componentField"
                    autocomplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full py-3" :disabled="submitting">
              {{ submitting ? 'Signing in...' : 'Sign In' }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm space-y-2">
            <p>
              <router-link :to="{ name: 'forgot-password' }" class="text-brand-500 hover:text-brand-600">
                Forgot your password?
              </router-link>
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              Don't have an account?
              <router-link :to="{ name: 'register' }" class="text-brand-500 hover:text-brand-600">
                Sign up
              </router-link>
            </p>
            <p>
              <router-link :to="{ name: 'home' }" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white/90">
                ← Back to home
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Brand panel (hidden on mobile) -->
      <div class="relative hidden flex-col items-center justify-center bg-brand-50 p-16 lg:flex lg:w-1/2 dark:bg-brand-500/10">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 32px 32px;"></div>
        <div class="relative flex flex-col items-center text-center text-brand-700 dark:text-white/90">
          <div class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-white shadow-theme-md dark:bg-white/5">
            <span class="text-2xl font-bold text-brand-500">A</span>
          </div>
          <p class="text-2xl font-semibold tracking-tight">Admin Panel</p>
          <p class="mt-3 max-w-xs text-sm opacity-75">A full-featured SPA admin starter for Laravel + Vue.</p>
        </div>
      </div>
    </div>
  </div>
</template>
