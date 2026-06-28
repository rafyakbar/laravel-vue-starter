<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { apiGet, apiPost, apiDelete, ApiError } from '@/services/api'
import { AlertCircle } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

type Step = 'disabled' | 'confirm-password' | 'setup' | 'recovery-codes' | 'enabled'

const props = defineProps<{ isTwoFactorEnabled: boolean }>()

const { t } = useI18n()

const step = ref<Step>(props.isTwoFactorEnabled ? 'enabled' : 'disabled')
const qrCode = ref('')
const secretKey = ref('')
const recoveryCodes = ref<string[]>([])
const passwordInput = ref('')
const totpCodeInput = ref('')
const confirmError = ref('')
const totpError = ref('')
const loading = ref(false)

// nextStep tracks where confirmPassword() should advance after success
type PostConfirmAction = 'enable' | 'regenerate' | 'disable'
const postConfirmAction = ref<PostConfirmAction>('enable')

async function confirmPassword() {
  loading.value = true
  confirmError.value = ''
  try {
    await apiPost('/user/confirm-password', { password: passwordInput.value })
    passwordInput.value = ''
    if (postConfirmAction.value === 'enable') {
      await enableTwoFactor()
    } else if (postConfirmAction.value === 'regenerate') {
      await fetchRecoveryCodes()
    } else if (postConfirmAction.value === 'disable') {
      await disableTwoFactor()
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      confirmError.value = data?.errors?.password?.[0] ?? 'Incorrect password.'
    }
  } finally {
    loading.value = false
  }
}

async function enableTwoFactor() {
  loading.value = true
  try {
    await apiPost('/user/two-factor-authentication')
    const [qrResponse, keyResponse] = await Promise.all([
      apiGet<{ svg: string }>('/user/two-factor-qr-code'),
      apiGet<{ secretKey: string }>('/user/two-factor-secret-key'),
    ])
    qrCode.value = qrResponse.svg
    secretKey.value = keyResponse.secretKey
    step.value = 'setup'
  } finally {
    loading.value = false
  }
}

async function confirmTwoFactor() {
  loading.value = true
  totpError.value = ''
  try {
    await apiPost('/user/confirmed-two-factor-authentication', { code: totpCodeInput.value })
    totpCodeInput.value = ''
    const codes = await apiGet<string[]>('/user/two-factor-recovery-codes')
    recoveryCodes.value = codes
    step.value = 'recovery-codes'
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      totpError.value = data?.errors?.code?.[0] ?? 'Invalid code.'
    }
  } finally {
    loading.value = false
  }
}

async function fetchRecoveryCodes() {
  loading.value = true
  try {
    await apiPost('/user/two-factor-recovery-codes')
    const codes = await apiGet<string[]>('/user/two-factor-recovery-codes')
    recoveryCodes.value = codes
    step.value = 'recovery-codes'
  } finally {
    loading.value = false
  }
}

async function disableTwoFactor() {
  loading.value = true
  try {
    await apiDelete('/user/two-factor-authentication')
    qrCode.value = ''
    secretKey.value = ''
    recoveryCodes.value = []
    totpCodeInput.value = ''
    step.value = 'disabled'
  } finally {
    loading.value = false
  }
}

function startEnable() {
  postConfirmAction.value = 'enable'
  passwordInput.value = ''
  confirmError.value = ''
  step.value = 'confirm-password'
}

function startRegenerate() {
  postConfirmAction.value = 'regenerate'
  passwordInput.value = ''
  confirmError.value = ''
  step.value = 'confirm-password'
}

function startDisable() {
  postConfirmAction.value = 'disable'
  passwordInput.value = ''
  confirmError.value = ''
  step.value = 'confirm-password'
}

function copyAll() {
  navigator.clipboard.writeText(recoveryCodes.value.join('\n'))
}
</script>

<template>
  <!-- Step: disabled — redesigned with alert icon + explanation -->
  <div v-if="step === 'disabled'" class="space-y-4">
    <div class="flex items-start gap-3">
      <AlertCircle class="size-5 mt-0.5 text-amber-500 shrink-0" />
      <h3 class="text-base font-semibold">{{ t('pages.profile.twoFactorNotEnabled') }}</h3>
    </div>
    <p class="text-sm text-muted-foreground">{{ t('pages.profile.twoFactorExplanation') }}</p>
    <Button :disabled="loading" @click="startEnable">{{ t('pages.profile.twoFactorEnableBtn') }}</Button>
  </div>

  <!-- Step: confirm-password -->
  <div v-else-if="step === 'confirm-password'" class="space-y-3">
    <p class="text-sm font-medium">{{ t('pages.profile.twoFactorConfirmPasswordTitle') }}</p>
    <p class="text-sm text-muted-foreground">{{ t('pages.profile.twoFactorConfirmPasswordDescription') }}</p>
    <div class="flex flex-col gap-2">
      <Label for="tfa-confirm-password">{{ t('pages.profile.twoFactorConfirmPassword') }}</Label>
      <Input
        id="tfa-confirm-password"
        v-model="passwordInput"
        type="password"
        autocomplete="current-password"
        :class="{ 'border-destructive': confirmError }"
        @keydown.enter.prevent="confirmPassword"
      />
      <p v-if="confirmError" class="text-sm text-destructive">{{ confirmError }}</p>
    </div>
    <div class="flex gap-2">
      <Button :disabled="loading" @click="confirmPassword">
        {{ loading ? t('common.saving') : t('pages.profile.twoFactorConfirmPassword') }}
      </Button>
      <Button variant="outline" :disabled="loading" @click="step = isTwoFactorEnabled ? 'enabled' : 'disabled'">
        {{ t('common.cancel') }}
      </Button>
    </div>
  </div>

  <!-- Step: setup (QR + TOTP confirm) -->
  <div v-else-if="step === 'setup'" class="space-y-4">
    <p class="text-sm text-muted-foreground">{{ t('pages.profile.twoFactorScanQr') }}</p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="w-40" v-html="qrCode" />
    <div>
      <p class="text-xs text-muted-foreground mb-1">{{ t('pages.profile.twoFactorManualEntry') }}</p>
      <code class="font-mono text-xs bg-muted px-2 py-1 rounded break-all">{{ secretKey }}</code>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">{{ t('pages.profile.twoFactorVerifyDescription') }}</p>
      <Label for="tfa-totp-code">{{ t('pages.profile.twoFactorCode') }}</Label>
      <Input
        id="tfa-totp-code"
        v-model="totpCodeInput"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        placeholder="000000"
        :class="{ 'border-destructive': totpError }"
        @keydown.enter.prevent="confirmTwoFactor"
      />
      <p v-if="totpError" class="text-sm text-destructive">{{ totpError }}</p>
    </div>
    <Button :disabled="loading" @click="confirmTwoFactor">
      {{ loading ? t('common.saving') : t('pages.profile.twoFactorVerifyCode') }}
    </Button>
  </div>

  <!-- Step: recovery-codes -->
  <div v-else-if="step === 'recovery-codes'" class="space-y-3">
    <p class="text-sm font-medium">{{ t('pages.profile.twoFactorRecoveryTitle') }}</p>
    <p class="text-sm text-muted-foreground">{{ t('pages.profile.twoFactorRecoveryDescription') }}</p>
    <pre class="font-mono text-xs bg-muted rounded p-3 leading-relaxed">{{ recoveryCodes.join('\n') }}</pre>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" @click="copyAll">{{ t('pages.profile.twoFactorCopyAll') }}</Button>
      <Button size="sm" @click="step = 'enabled'">{{ t('pages.profile.twoFactorDone') }}</Button>
    </div>
  </div>

  <!-- Step: enabled -->
  <div v-else-if="step === 'enabled'" class="space-y-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">{{ t('pages.profile.twoFactorStatus') }}:</span>
      <Badge variant="default">{{ t('pages.profile.twoFactorEnabled') }}</Badge>
    </div>
    <div class="flex flex-wrap gap-2">
      <Button variant="outline" :disabled="loading" @click="startRegenerate">
        {{ t('pages.profile.twoFactorRegenerateCodes') }}
      </Button>
      <Button variant="destructive" :disabled="loading" @click="startDisable">
        {{ t('pages.profile.twoFactorDisable') }}
      </Button>
    </div>
  </div>
</template>
