<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import AdminLayout from '@/views/layouts/AdminLayout.vue'
import BasicPage from '@/components/shared/BasicPage.vue'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const { t } = useI18n()
const signingOut = ref(false)

/**
 * Admin/superadmin see profile inside the admin layout (sidebar + header).
 * Regular users see a simpler standalone layout.
 */
const useAdminLayout = () =>
  authStore.user?.permissions?.includes('access-admin-panel') ?? false

function userInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

async function handleSignOut() {
  signingOut.value = true
  try {
    await authStore.logout()
  } finally {
    signingOut.value = false
  }
}
</script>

<template>
  <!-- Admin/superadmin: full admin layout with sidebar -->
  <AdminLayout v-if="useAdminLayout()">
    <BasicPage :title="t('pages.profile.title')" :description="t('pages.profile.description')">
      <div class="rounded-lg border bg-card p-6">
        <div class="flex items-center gap-4">
          <Avatar class="size-16">
            <AvatarFallback class="text-lg">
              {{ userInitials(authStore.user?.name ?? 'U') }}
            </AvatarFallback>
          </Avatar>
          <div>
            <p class="text-lg font-semibold">{{ authStore.user?.name }}</p>
            <p class="text-sm text-muted-foreground">{{ authStore.user?.email }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              <Badge v-for="role in authStore.user?.roles" :key="role" variant="secondary">
                {{ role }}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <Badge variant="secondary" class="mb-3">{{ t('pages.profile.comingSoon') }}</Badge>
        <p class="text-sm text-muted-foreground">{{ t('pages.profile.comingSoonText') }}</p>
      </div>
    </BasicPage>
  </AdminLayout>

  <!-- Regular user: standalone layout -->
  <DefaultLayout v-else>
    <div class="min-h-screen px-4 py-12">
      <div class="mx-auto max-w-lg space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">{{ t('pages.profile.title') }}</h1>
            <p class="mt-1 text-sm text-[var(--muted-foreground)]">{{ t('pages.profile.description') }}</p>
          </div>
          <router-link :to="{ name: 'home' }">
            <Button variant="ghost" size="sm">←</Button>
          </router-link>
        </div>

        <div class="rounded-lg border bg-[var(--card)] p-6 text-[var(--card-foreground)]">
          <div class="flex items-center gap-4">
            <Avatar class="size-16">
              <AvatarFallback class="text-lg">
                {{ userInitials(authStore.user?.name ?? 'U') }}
              </AvatarFallback>
            </Avatar>
            <div>
              <p class="text-lg font-semibold">{{ authStore.user?.name }}</p>
              <p class="text-sm text-[var(--muted-foreground)]">{{ authStore.user?.email }}</p>
              <div class="mt-2 flex flex-wrap gap-1">
                <Badge v-for="role in authStore.user?.roles" :key="role" variant="secondary">
                  {{ role }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Badge variant="secondary" class="mb-3">{{ t('pages.profile.comingSoon') }}</Badge>
          <p class="text-sm text-[var(--muted-foreground)]">{{ t('pages.profile.comingSoonText') }}</p>
        </div>

        <div class="flex justify-center">
          <Button variant="outline" :disabled="signingOut" @click="handleSignOut">
            {{ signingOut ? '...' : t('home.signOut') }}
          </Button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
