<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { apiGet, apiPost, apiDelete, ApiError } from '@/services/api'
import { Monitor, Smartphone, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type SessionItem = {
  id: string
  ip_address: string
  device: string
  is_current: boolean
  last_active_at: string
}

type ApiValidationError = { errors?: Record<string, string[]> }

const { t } = useI18n()

const sessions = ref<SessionItem[]>([])
const loading = ref(false)
const showPasswordConfirm = ref(false)
const passwordInput = ref('')
const confirmLoading = ref(false)
const confirmError = ref('')
const successMessage = ref('')

async function fetchSessions() {
  loading.value = true
  try {
    sessions.value = await apiGet<SessionItem[]>('/api/profile/sessions')
  } catch {
    // Silently ignore — sessions list is non-critical
  } finally {
    loading.value = false
  }
}

function formatLastActive(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)

  if (diff < 60) {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-diff, 'second')
  } else if (diff < 3600) {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.floor(diff / 60), 'minute')
  } else if (diff < 86400) {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.floor(diff / 3600), 'hour')
  } else {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.floor(diff / 86400), 'day')
  }
}

function isMobile(device: string): boolean {
  return device.includes('iPhone') || device.includes('iPad') || device.includes('Android')
}

async function confirmLogout() {
  confirmLoading.value = true
  confirmError.value = ''
  successMessage.value = ''
  try {
    await apiPost('/user/confirm-password', { password: passwordInput.value })
    await apiDelete('/api/profile/sessions/others')
    await fetchSessions()
    successMessage.value = t('pages.profile.browserSessionsLogoutSuccess')
    showPasswordConfirm.value = false
    passwordInput.value = ''
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as ApiValidationError
      confirmError.value = data?.errors?.password?.[0] ?? 'Incorrect password.'
    } else {
      confirmError.value = 'An error occurred. Please try again.'
    }
  } finally {
    confirmLoading.value = false
  }
}

onMounted(fetchSessions)
</script>

<template>
  <div data-testid="browser-sessions-form" class="space-y-4">
    <p class="text-sm text-muted-foreground">{{ t('pages.profile.browserSessionsInfo') }}</p>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      <span>{{ t('common.loading') }}</span>
    </div>

    <!-- Sessions list -->
    <div v-else class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        data-testid="session-item"
        class="flex items-start gap-3 rounded-lg border bg-card p-3"
      >
        <component
          :is="isMobile(session.device) ? Smartphone : Monitor"
          class="size-5 mt-0.5 text-muted-foreground shrink-0"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-medium">{{ session.device }}</span>
            <Badge v-if="session.is_current" variant="secondary" class="text-xs">
              {{ t('pages.profile.thisDevice') }}
            </Badge>
          </div>
          <div class="mt-0.5 space-y-0.5">
            <p class="text-xs text-muted-foreground">{{ session.ip_address }}</p>
            <p class="text-xs text-muted-foreground">
              {{ t('pages.profile.lastActive') }}: {{ formatLastActive(session.last_active_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success message -->
    <p v-if="successMessage" class="text-sm text-green-600 dark:text-green-400">{{ successMessage }}</p>

    <!-- Password confirmation inline block -->
    <div v-if="showPasswordConfirm" class="space-y-3 rounded-lg border bg-muted/30 p-4">
      <p class="text-sm text-muted-foreground">{{ t('pages.profile.browserSessionsConfirmPassword') }}</p>
      <div class="space-y-1.5">
        <Label for="sessions-confirm-password">{{ t('pages.profile.currentPassword') }}</Label>
        <Input
          id="sessions-confirm-password"
          v-model="passwordInput"
          type="password"
          autocomplete="current-password"
          :class="{ 'border-destructive': confirmError }"
          @keydown.enter.prevent="confirmLogout"
        />
        <p v-if="confirmError" class="text-sm text-destructive">{{ confirmError }}</p>
      </div>
      <div class="flex gap-2">
        <Button size="sm" :disabled="confirmLoading" @click="confirmLogout">
          {{ confirmLoading ? t('common.saving') : t('pages.profile.logoutOtherSessions') }}
        </Button>
        <Button variant="outline" size="sm" :disabled="confirmLoading" @click="showPasswordConfirm = false; confirmError = ''">
          {{ t('common.cancel') }}
        </Button>
      </div>
    </div>

    <!-- Log Out Other Sessions button -->
    <Button
      v-if="!showPasswordConfirm"
      variant="outline"
      @click="showPasswordConfirm = true"
    >
      {{ t('pages.profile.logoutOtherSessions') }}
    </Button>
  </div>
</template>
