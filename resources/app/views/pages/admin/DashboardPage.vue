<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import BasicPage from '@/components/shared/BasicPage.vue'

const authStore = useAuthStore()
</script>

<template>
  <BasicPage title="Dashboard" description="Welcome to your admin panel">
    <div class="rounded-lg border bg-card p-6 text-card-foreground">
      <p class="text-sm text-muted-foreground">
        Hello, <span class="font-medium text-foreground">{{ authStore.user?.name }}</span>!
        You're logged in as <span class="font-medium text-foreground">{{ authStore.user?.email }}</span>.
      </p>
    </div>
  </BasicPage>
</template>
