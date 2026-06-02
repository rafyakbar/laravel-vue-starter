<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/services/api'
import type { LoginPayload, ApiValidationError } from '@/types/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen px-4">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="space-y-4">
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

            <Button type="submit" class="w-full" :disabled="submitting">
              {{ submitting ? 'Signing in...' : 'Sign In' }}
            </Button>
          </form>

          <div class="mt-4 text-center text-sm space-y-2">
            <p>
              <router-link :to="{ name: 'forgot-password' }" class="text-[var(--primary)] hover:underline">
                Forgot your password?
              </router-link>
            </p>
            <p class="text-[var(--muted-foreground)]">
              Don't have an account?
              <router-link :to="{ name: 'register' }" class="text-[var(--primary)] hover:underline">
                Sign up
              </router-link>
            </p>
            <p>
              <router-link :to="{ name: 'home' }" class="text-[var(--muted-foreground)] hover:underline">
                ← Back to home
              </router-link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </DefaultLayout>
</template>
