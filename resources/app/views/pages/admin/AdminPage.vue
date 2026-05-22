<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const loggingOut = ref(false)

async function handleLogout() {
  loggingOut.value = true
  try {
    await authStore.logout()
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight">Admin</h1>
        <p class="mt-4 text-lg text-[var(--muted-foreground)]">
          Welcome, {{ authStore.user?.name }}
        </p>

        <div class="mt-8 flex items-center justify-center gap-4">
          <router-link :to="{ name: 'home' }">
            <Button variant="ghost">← Home</Button>
          </router-link>
          <Button variant="outline" :disabled="loggingOut" @click="handleLogout">
            {{ loggingOut ? 'Signing out...' : 'Sign Out' }}
          </Button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
