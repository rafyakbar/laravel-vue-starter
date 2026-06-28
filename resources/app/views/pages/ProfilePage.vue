<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import AdminLayout from '@/views/layouts/AdminLayout.vue'
import BasicPage from '@/components/shared/BasicPage.vue'
import AvatarUpload from '@/components/profile/AvatarUpload.vue'
import ProfileInfoForm from '@/components/profile/ProfileInfoForm.vue'
import PasswordForm from '@/components/profile/PasswordForm.vue'
import TwoFactorForm from '@/components/profile/TwoFactorForm.vue'
import BrowserSessionsForm from '@/components/profile/BrowserSessionsForm.vue'

const authStore = useAuthStore()
const { t } = useI18n()

const useAdminLayout = computed(() =>
  authStore.user?.permissions?.includes('access-admin-panel') ?? false
)

const isTwoFactorEnabled = computed(() => !!authStore.user?.two_factor_confirmed_at)

function onAvatarUploaded() {
  authStore.fetchUser()
}

function onAvatarRemoved() {
  authStore.fetchUser()
}

function onProfileSaved() {
  authStore.fetchUser()
}
</script>

<template>
  <!-- Admin/superadmin: full admin layout with sidebar -->
  <AdminLayout v-if="useAdminLayout">
    <BasicPage :title="t('pages.profile.title')" :description="t('pages.profile.description')">
      <div v-if="authStore.user" class="divide-y">
        <!-- Section 1: Personal Information -->
        <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
          <div data-testid="section-description">
            <h2 class="text-lg font-semibold">{{ t('pages.profile.personalInfoTitle') }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.personalInfoDescription') }}</p>
          </div>
          <div data-testid="section-form">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
              <AvatarUpload
                :compact="true"
                :user-id="authStore.user.id"
                :current-avatar-url="authStore.user.avatar_url"
                :name="authStore.user.name"
                @uploaded="onAvatarUploaded"
                @removed="onAvatarRemoved"
              />
              <ProfileInfoForm :user="authStore.user" @saved="onProfileSaved" />
            </div>
          </div>
        </div>

        <!-- Section 2: Password -->
        <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
          <div data-testid="section-description">
            <h2 class="text-lg font-semibold">{{ t('pages.profile.passwordTitle') }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.passwordSectionDescription') }}</p>
          </div>
          <div data-testid="section-form">
            <PasswordForm />
          </div>
        </div>

        <!-- Section 3: Two-Factor Authentication -->
        <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
          <div data-testid="section-description">
            <h2 class="text-lg font-semibold">{{ t('pages.profile.twoFactorSectionTitle') }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.twoFactorSectionDescription') }}</p>
          </div>
          <div data-testid="section-form">
            <TwoFactorForm :is-two-factor-enabled="isTwoFactorEnabled" />
          </div>
        </div>

        <!-- Section 4: Browser Sessions -->
        <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
          <div data-testid="section-description">
            <h2 class="text-lg font-semibold">{{ t('pages.profile.browserSessionsTitle') }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.browserSessionsSectionDescription') }}</p>
          </div>
          <div data-testid="section-form">
            <BrowserSessionsForm />
          </div>
        </div>
      </div>
    </BasicPage>
  </AdminLayout>

  <!-- Regular user: standalone layout -->
  <DefaultLayout v-else>
    <div class="min-h-screen px-4 py-12">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8">
          <h1 class="text-2xl font-bold tracking-tight">{{ t('pages.profile.title') }}</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.description') }}</p>
        </div>

        <div v-if="authStore.user" class="divide-y">
          <!-- Section 1: Personal Information -->
          <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
            <div data-testid="section-description">
              <h2 class="text-lg font-semibold">{{ t('pages.profile.personalInfoTitle') }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.personalInfoDescription') }}</p>
            </div>
            <div data-testid="section-form">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
                <AvatarUpload
                  :compact="true"
                  :user-id="authStore.user.id"
                  :current-avatar-url="authStore.user.avatar_url"
                  :name="authStore.user.name"
                  @uploaded="onAvatarUploaded"
                  @removed="onAvatarRemoved"
                />
                <ProfileInfoForm :user="authStore.user" @saved="onProfileSaved" />
              </div>
            </div>
          </div>

          <!-- Section 2: Password -->
          <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
            <div data-testid="section-description">
              <h2 class="text-lg font-semibold">{{ t('pages.profile.passwordTitle') }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.passwordSectionDescription') }}</p>
            </div>
            <div data-testid="section-form">
              <PasswordForm />
            </div>
          </div>

          <!-- Section 3: Two-Factor Authentication -->
          <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
            <div data-testid="section-description">
              <h2 class="text-lg font-semibold">{{ t('pages.profile.twoFactorSectionTitle') }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.twoFactorSectionDescription') }}</p>
            </div>
            <div data-testid="section-form">
              <TwoFactorForm :is-two-factor-enabled="isTwoFactorEnabled" />
            </div>
          </div>

          <!-- Section 4: Browser Sessions -->
          <div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">
            <div data-testid="section-description">
              <h2 class="text-lg font-semibold">{{ t('pages.profile.browserSessionsTitle') }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.browserSessionsSectionDescription') }}</p>
            </div>
            <div data-testid="section-form">
              <BrowserSessionsForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
