<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import BasicPage from '@/components/shared/BasicPage.vue'
import { Badge } from '@/components/ui/badge'

const { t } = useI18n()
</script>

<template>
  <BasicPage :title="t('pages.users.title')" :description="t('pages.users.description')">
    <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Badge variant="secondary" class="mb-3">{{ t('pages.users.comingSoon') }}</Badge>
      <p class="text-sm text-muted-foreground">{{ t('pages.users.comingSoonText') }}</p>
    </div>
  </BasicPage>
</template>
