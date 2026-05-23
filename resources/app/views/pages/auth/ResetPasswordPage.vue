<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { apiPost, getCsrfCookie, ApiError } from '@/services/api'
import type { ResetPasswordPayload, ApiValidationError } from '@/types/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen px-4">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="space-y-4">
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

            <Button type="submit" class="w-full" :disabled="submitting">
              {{ submitting ? 'Resetting...' : 'Reset Password' }}
            </Button>
          </form>

          <div class="mt-4 text-center text-sm">
            <router-link :to="{ name: 'login' }" class="text-[var(--primary)] hover:underline">
              Back to sign in
            </router-link>
          </div>
        </CardContent>
      </Card>
    </div>
  </DefaultLayout>
</template>
