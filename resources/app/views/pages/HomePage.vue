<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight">{{ t('home.title') }}</h1>
        <p class="mt-4 text-lg text-[var(--muted-foreground)]">
          {{ t('home.subtitle') }}
        </p>

        <div class="mt-8 flex items-center justify-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <router-link :to="{ name: 'admin.dashboard' }">
              <Button>{{ t('home.goToAdmin') }}</Button>
            </router-link>
          </template>
          <template v-else>
            <router-link :to="{ name: 'login' }">
              <Button>{{ t('home.signIn') }}</Button>
            </router-link>
            <router-link :to="{ name: 'register' }">
              <Button variant="outline">{{ t('home.signUp') }}</Button>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
