<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useI18n } from '@/composables/useI18n'
import { api, ApiError } from '@/services/api'
import type { ApiValidationError } from '@/types/auth'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const successMessage = ref('')

const { handleSubmit, setErrors, isSubmitting, resetForm } = useForm({
  initialValues: {
    current_password: '',
    password: '',
    password_confirmation: '',
  },
  validationSchema: {
    current_password: (value: string) => (value ? true : 'Current password is required'),
    password: (value: string) => (value?.length >= 8 ? true : 'Password must be at least 8 characters'),
    password_confirmation: (value: string, ctx: { form: { password: string } }) => {
      if (!value) return 'Please confirm your password'
      if (value !== ctx.form.password) return 'Passwords do not match'
      return true
    },
  },
})

const onSubmit = handleSubmit(async (values) => {
  successMessage.value = ''
  try {
    await api('/user/password', {
      method: 'PUT',
      body: JSON.stringify(values),
    })
    resetForm()
    successMessage.value = t('pages.profile.passwordSuccess')
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as ApiValidationError
      setErrors(data.errors)
    }
  }
})
</script>

<template>
  <div class="rounded-lg border bg-card p-6 space-y-4">
    <div>
      <h3 class="text-base font-semibold">{{ t('pages.profile.passwordTitle') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('pages.profile.passwordDescription') }}</p>
    </div>
    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="current_password">
        <FormItem>
          <FormLabel>{{ t('pages.profile.currentPassword') }}</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" autocomplete="current-password" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>{{ t('pages.profile.newPassword') }}</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" autocomplete="new-password" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password_confirmation">
        <FormItem>
          <FormLabel>{{ t('pages.profile.confirmPassword') }}</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" autocomplete="new-password" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex items-center gap-3">
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? t('pages.profile.saving') : t('pages.profile.saveChanges') }}
        </Button>
        <p v-if="successMessage" class="text-sm text-green-600 dark:text-green-400">{{ successMessage }}</p>
      </div>
    </form>
  </div>
</template>
