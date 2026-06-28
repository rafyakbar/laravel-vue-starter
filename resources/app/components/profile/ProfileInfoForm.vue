<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { apiPut, ApiError } from '@/services/api'
import type { User, ApiValidationError } from '@/types/auth'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const props = defineProps<{ user: User }>()
const emit = defineEmits<{ saved: [] }>()

const authStore = useAuthStore()
const { t } = useI18n()
const successMessage = ref('')

const { handleSubmit, setErrors, isSubmitting } = useForm({
  initialValues: {
    name: props.user.name,
    username: props.user.username,
  },
  validationSchema: {
    name: (value: string) => (value?.trim() ? true : 'Name is required'),
    username: (value: string) => (value?.trim() ? true : 'Username is required'),
  },
})

const onSubmit = handleSubmit(async (values) => {
  successMessage.value = ''
  try {
    await apiPut('/api/profile', values)
    await authStore.fetchUser()
    emit('saved')
    successMessage.value = t('pages.profile.updateSuccess')
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as ApiValidationError
      setErrors(data.errors)
    }
  }
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>{{ t('pages.profile.name') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" autocomplete="name" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>{{ t('pages.profile.username') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" autocomplete="username" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="space-y-2">
      <label for="profile-email" class="text-sm font-medium leading-none">
        {{ t('pages.profile.email') }}
      </label>
      <Input
        id="profile-email"
        type="email"
        :value="props.user.email"
        disabled
        class="cursor-not-allowed opacity-60"
      />
    </div>

    <div class="flex items-center gap-3">
      <Button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? t('common.saving') : t('pages.profile.updateProfile') }}
      </Button>
      <p v-if="successMessage" class="text-sm text-green-600 dark:text-green-400">{{ successMessage }}</p>
    </div>
  </form>
</template>
