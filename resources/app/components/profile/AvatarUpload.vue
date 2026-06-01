<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { api, ApiError } from '@/services/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  userId: number
  currentAvatarUrl?: string | null
  name?: string
}>()

const emit = defineEmits<{
  uploaded: [url: string]
  removed: []
}>()

const { t } = useI18n()
const previewUrl = ref<string | null>(props.currentAvatarUrl ?? null)

watch(() => props.currentAvatarUrl, (newVal) => {
  previewUrl.value = newVal ?? null
})
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const removing = ref(false)
const errorMessage = ref('')

const initials = (name?: string) => {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  errorMessage.value = ''
  previewUrl.value = URL.createObjectURL(file)

  const formData = new FormData()
  formData.append('avatar', file)

  uploading.value = true
  try {
    const xsrfToken = document.cookie
      .split('; ')
      .find((r) => r.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]

    const response = await fetch(`/api/users/${props.userId}/avatar`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
      },
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new ApiError(response.status, data)
    }

    const data = await response.json()
    const newUrl: string = data?.record?.avatar_url ?? (previewUrl.value as string)
    previewUrl.value = newUrl
    emit('uploaded', newUrl)
  } catch {
    previewUrl.value = props.currentAvatarUrl ?? null
    errorMessage.value = 'Failed to upload avatar'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function removeAvatar() {
  errorMessage.value = ''
  removing.value = true
  try {
    await api(`/api/users/${props.userId}/avatar`, { method: 'DELETE' })
    previewUrl.value = null
    emit('removed')
  } catch {
    errorMessage.value = 'Failed to remove avatar'
  } finally {
    removing.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border bg-card p-6 space-y-4">
    <div>
      <h3 class="text-base font-semibold">{{ t('pages.profile.avatarTitle') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('pages.profile.avatarDescription') }}</p>
    </div>

    <div class="flex items-center gap-4">
      <Avatar class="size-16">
        <AvatarImage v-if="previewUrl" :src="previewUrl" :alt="name ?? 'Avatar'" />
        <AvatarFallback class="text-lg font-medium">{{ initials(name) }}</AvatarFallback>
      </Avatar>

      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" :disabled="uploading || removing" @click="triggerFileInput">
          {{ uploading ? t('pages.profile.saving') : (previewUrl ? t('pages.profile.changeAvatar') : t('pages.profile.uploadAvatar')) }}
        </Button>

        <Button
          v-if="previewUrl"
          type="button"
          variant="ghost"
          size="sm"
          :disabled="uploading || removing"
          @click="removeAvatar"
        >
          {{ removing ? t('pages.profile.saving') : t('pages.profile.removeAvatar') }}
        </Button>
      </div>
    </div>

    <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileSelected"
    />
  </div>
</template>
