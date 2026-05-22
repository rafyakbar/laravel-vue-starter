<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
</script>

<template>
  <DefaultLayout>
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight">Laravel Vue Shadcn Starter</h1>
        <p class="mt-4 text-lg text-[var(--muted-foreground)]">
          SPA is working. Ready to build.
        </p>

        <div class="mt-8 flex items-center justify-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <router-link :to="{ name: 'admin' }">
              <Button>Go to Admin</Button>
            </router-link>
          </template>
          <template v-else>
            <router-link :to="{ name: 'login' }">
              <Button>Sign In</Button>
            </router-link>
            <router-link :to="{ name: 'register' }">
              <Button variant="outline">Sign Up</Button>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
