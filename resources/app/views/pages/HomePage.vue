<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const { t } = useI18n()
const signingOut = ref(false)

const hasAdminAccess = () =>
  authStore.user?.permissions?.includes('access-admin-panel') ?? false

async function handleSignOut() {
  signingOut.value = true
  try {
    await authStore.logout()
  } finally {
    signingOut.value = false
  }
}

function userInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight">{{ t('home.title') }}</h1>
        <p class="mt-4 text-lg text-[var(--muted-foreground)]">
          {{ t('home.subtitle') }}
        </p>

        <div class="mt-8 flex items-center justify-center gap-4">
          <!-- Guest: show Sign In + Sign Up -->
          <template v-if="!authStore.isAuthenticated">
            <router-link :to="{ name: 'login' }">
              <Button>{{ t('home.signIn') }}</Button>
            </router-link>
            <router-link :to="{ name: 'register' }">
              <Button variant="outline">{{ t('home.signUp') }}</Button>
            </router-link>
          </template>

          <!-- Authenticated: show role-appropriate actions -->
          <template v-else>
            <!-- Avatar + name indicator -->
            <div class="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span class="inline-flex size-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold">
                {{ userInitials(authStore.user?.name ?? 'U') }}
              </span>
              <span class="font-medium text-[var(--foreground)]">{{ authStore.user?.name }}</span>
            </div>

            <!-- Go to Admin (only for users with admin-panel access) -->
            <router-link v-if="hasAdminAccess()" :to="{ name: 'admin.dashboard' }">
              <Button>{{ t('home.goToAdmin') }}</Button>
            </router-link>

            <!-- Profile link (all authenticated users) -->
            <router-link :to="{ name: 'profile' }">
              <Button variant="outline">{{ t('home.profile') }}</Button>
            </router-link>

            <!-- Sign Out (always visible for authenticated users) -->
            <Button variant="outline" :disabled="signingOut" @click="handleSignOut">
              {{ signingOut ? '...' : t('home.signOut') }}
            </Button>
          </template>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
