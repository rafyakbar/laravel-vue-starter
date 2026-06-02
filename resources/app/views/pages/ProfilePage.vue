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
      <div v-if="authStore.user" class="space-y-6">
        <AvatarUpload
          :user-id="authStore.user.id"
          :current-avatar-url="authStore.user.avatar_url"
          :name="authStore.user.name"
          @uploaded="onAvatarUploaded"
          @removed="onAvatarRemoved"
        />
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileInfoForm :user="authStore.user" @saved="onProfileSaved" />
          <PasswordForm />
        </div>
        <TwoFactorForm :is-two-factor-enabled="isTwoFactorEnabled" />
      </div>
    </BasicPage>
  </AdminLayout>

  <!-- Regular user: standalone layout -->
  <DefaultLayout v-else>
    <div class="min-h-screen px-4 py-12">
      <div class="mx-auto max-w-lg space-y-6">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">{{ t('pages.profile.title') }}</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.description') }}</p>
        </div>

        <div v-if="authStore.user" class="space-y-6">
          <AvatarUpload
            :user-id="authStore.user.id"
            :current-avatar-url="authStore.user.avatar_url"
            :name="authStore.user.name"
            @uploaded="onAvatarUploaded"
            @removed="onAvatarRemoved"
          />
          <ProfileInfoForm :user="authStore.user" @saved="onProfileSaved" />
          <PasswordForm />
          <TwoFactorForm :is-two-factor-enabled="isTwoFactorEnabled" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
