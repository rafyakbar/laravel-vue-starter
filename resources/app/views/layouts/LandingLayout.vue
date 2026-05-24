<script setup lang="ts">
import PublicNavbar from '@/components/public/PublicNavbar.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'
import PublicBottomNav from '@/components/public/PublicBottomNav.vue'
</script>

<template>
  <div class="flex h-dvh flex-col md:h-auto md:min-h-screen bg-background text-foreground">
    <PublicNavbar />
    <main class="flex-1 max-md:overflow-y-auto max-md:overflow-x-hidden">
      <slot />
      <PublicFooter />
    </main>
    <PublicBottomNav />
  </div>
</template>