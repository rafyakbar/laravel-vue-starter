<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import BasicPage from '@/components/shared/BasicPage.vue'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const authStore = useAuthStore()
const { t } = useI18n()

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
</template>
