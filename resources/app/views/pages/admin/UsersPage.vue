<script setup lang="ts">
import BasicPage from '@/components/shared/BasicPage.vue'
import { Badge } from '@/components/ui/badge'
</script>

<template>
  <BasicPage title="Users" description="Manage user accounts">
    <div class="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Badge variant="secondary" class="mb-3">Coming Soon</Badge>
      <p class="text-sm text-muted-foreground">User management will be available in a future update.</p>
    </div>
  </BasicPage>
</template>
