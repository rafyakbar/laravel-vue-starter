<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import BasicPage from '@/components/shared/BasicPage.vue'

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <BasicPage :title="t('pages.dashboard.title')" :description="t('pages.dashboard.description')">
    <div class="rounded-lg border bg-card p-6 text-card-foreground">
      <p class="text-sm text-muted-foreground">
        <span class="font-medium text-foreground">
          {{ t('pages.dashboard.welcome', { name: authStore.user?.name ?? '' }) }}
        </span>
        {{ t('pages.dashboard.loggedInAs', { email: authStore.user?.email ?? '' }) }}
      </p>
    </div>
  </BasicPage>
</template>
