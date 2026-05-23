<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import BasicPage from '@/components/shared/BasicPage.vue'
import { Badge } from '@/components/ui/badge'

const { t } = useI18n()
</script>

<template>
  <BasicPage :title="t('pages.roles.title')" :description="t('pages.roles.description')">
    <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Badge variant="secondary" class="mb-3">{{ t('pages.roles.comingSoon') }}</Badge>
      <p class="text-sm text-muted-foreground">{{ t('pages.roles.comingSoonText') }}</p>
    </div>
  </BasicPage>
</template>
