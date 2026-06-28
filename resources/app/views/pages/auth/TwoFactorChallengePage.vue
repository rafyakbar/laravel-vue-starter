<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { ApiError } from '@/services/api'
import type { TwoFactorChallengePayload } from '@/types/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const useRecovery = ref(false)
const code = ref('')
const recoveryCode = ref('')
const codeError = ref('')
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  codeError.value = ''

  const payload: TwoFactorChallengePayload = useRecovery.value
    ? { recovery_code: recoveryCode.value }
    : { code: code.value }

  try {
    await authStore.completeTwoFactorChallenge(payload)
    const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
    router.push(hasAdminAccess ? '/admin' : '/')
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      const errors = data?.errors ?? {}
      codeError.value = errors.code?.[0] ?? errors.recovery_code?.[0] ?? 'Invalid code.'
    }
  } finally {
    submitting.value = false
  }
}

function toggleMode() {
  useRecovery.value = !useRecovery.value
  code.value = ''
  recoveryCode.value = ''
  codeError.value = ''
}
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
          <h1 class="text-[30px] font-bold text-gray-800 sm:text-[36px] dark:text-white/90">{{ t('twoFactor.title') }}</h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ useRecovery ? t('twoFactor.recoveryDescription') : t('twoFactor.description') }}
          </p>

          <form class="mt-8 space-y-5" @submit.prevent="onSubmit">
            <div v-if="!useRecovery" class="flex flex-col gap-2">
              <Label for="two-factor-code">{{ t('twoFactor.codeLabel') }}</Label>
              <Input
                id="two-factor-code"
                v-model="code"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="000000"
                :class="{ 'border-error-500': codeError }"
              />
              <p v-if="codeError" class="text-sm text-error-500">{{ codeError }}</p>
            </div>

            <div v-else class="flex flex-col gap-2">
              <Label for="recovery-code">{{ t('twoFactor.recoveryCodeLabel') }}</Label>
              <Input
                id="recovery-code"
                v-model="recoveryCode"
                type="text"
                autocomplete="off"
                :class="{ 'border-error-500': codeError }"
              />
              <p v-if="codeError" class="text-sm text-error-500">{{ codeError }}</p>
            </div>

            <Button type="submit" class="w-full py-3" :disabled="submitting">
              {{ submitting ? t('common.saving') : t('twoFactor.submit') }}
            </Button>
          </form>

          <div class="mt-6 text-center text-sm">
            <button
              type="button"
              class="text-brand-500 hover:text-brand-600"
              @click="toggleMode"
            >
              {{ useRecovery ? t('twoFactor.useCode') : t('twoFactor.useRecovery') }}
            </button>
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
