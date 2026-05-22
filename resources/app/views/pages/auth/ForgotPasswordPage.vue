<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { apiPost, getCsrfCookie, ApiError } from '@/services/api'
import type { ForgotPasswordPayload, ApiValidationError } from '@/types/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const submitting = ref(false)
const success = ref(false)
const statusMessage = ref('')

const { handleSubmit, setErrors } = useForm<ForgotPasswordPayload>({
  initialValues: {
    email: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  success.value = false
  try {
    await getCsrfCookie()
    const response = await apiPost<{ status?: string }>('/forgot-password', values)
    success.value = true
    statusMessage.value = response?.status || 'We have emailed your password reset link.'
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
          <CardTitle class="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="success" class="rounded-md bg-[var(--primary)]/10 p-4 text-sm text-[var(--primary)]">
            {{ statusMessage }}
          </div>

          <form v-else @submit="onSubmit" class="space-y-4">
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

            <Button type="submit" class="w-full" :disabled="submitting">
              {{ submitting ? 'Sending...' : 'Send Reset Link' }}
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
