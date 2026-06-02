<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { ApiError } from '@/services/api'
import type { TwoFactorChallengePayload } from '@/types/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen px-4">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">{{ t('twoFactor.title') }}</CardTitle>
          <CardDescription>
            {{ useRecovery ? t('twoFactor.recoveryDescription') : t('twoFactor.description') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="onSubmit">
            <div v-if="!useRecovery" class="flex flex-col gap-2">
              <Label for="two-factor-code">{{ t('twoFactor.codeLabel') }}</Label>
              <Input
                id="two-factor-code"
                v-model="code"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="000000"
                :class="{ 'border-destructive': codeError }"
              />
              <p v-if="codeError" class="text-sm text-destructive">{{ codeError }}</p>
            </div>

            <div v-else class="flex flex-col gap-2">
              <Label for="recovery-code">{{ t('twoFactor.recoveryCodeLabel') }}</Label>
              <Input
                id="recovery-code"
                v-model="recoveryCode"
                type="text"
                autocomplete="off"
                :class="{ 'border-destructive': codeError }"
              />
              <p v-if="codeError" class="text-sm text-destructive">{{ codeError }}</p>
            </div>

            <Button type="submit" class="w-full" :disabled="submitting">
              {{ submitting ? t('common.saving') : t('twoFactor.submit') }}
            </Button>
          </form>

          <div class="mt-4 text-center text-sm">
            <button
              type="button"
              class="text-[var(--primary)] hover:underline"
              @click="toggleMode"
            >
              {{ useRecovery ? t('twoFactor.useCode') : t('twoFactor.useRecovery') }}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </DefaultLayout>
</template>
