<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { apiPost, getCsrfCookie, ApiError } from '@/services/api'
import type { ResetPasswordPayload, ApiValidationError } from '@/types/auth'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)

const token = (route.query.token as string) || ''
const email = (route.query.email as string) || ''

const { handleSubmit, setErrors } = useForm<ResetPasswordPayload>({
  initialValues: {
    token,
    email,
    password: '',
    password_confirmation: '',
  },
  validationSchema: {
    email: (value: string) => {
      if (!value) return 'Email is required'
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address'
      return true
    },
    password: (value: string) => {
      if (!value) return 'Password is required'
      if (value.length < 8) return 'Password must be at least 8 characters'
      return true
    },
    password_confirmation: (value: string) => {
      if (!value) return 'Password confirmation is required'
      return true
    },
  },
})

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    await getCsrfCookie()
    await apiPost('/reset-password', values)
    router.push({ name: 'login', query: { reset: 'true' } })
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
          <h1 class="text-[30px] font-bold text-gray-800 sm:text-[36px] dark:text-white/90">Reset Password</h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter your new password below</p>

          <form @submit="onSubmit" class="mt-8 space-y-5">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    v-bind="componentField"
                    autocomplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    v-bind="componentField"
                    autocomplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password_confirmation">
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    v-bind="componentField"
                    autocomplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full py-3" :disabled="submitting">
              {{ submitting ? 'Resetting...' : 'Reset Password' }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm">
            <router-link :to="{ name: 'login' }" class="text-brand-500 hover:text-brand-600">
              Back to sign in
            </router-link>
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
