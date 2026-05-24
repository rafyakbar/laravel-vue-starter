<script setup lang="ts">
import { ref, provide } from 'vue'
import PublicNavbar from '@/components/public/PublicNavbar.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'
import PublicBottomNav from '@/components/public/PublicBottomNav.vue'

const scrollContainer = ref<HTMLElement | null>(null)
provide('scrollContainer', scrollContainer)
</script>

<template>
  <div class="flex h-dvh flex-col md:h-auto md:min-h-screen bg-background text-foreground">
    <PublicNavbar />
    <main ref="scrollContainer" class="flex-1 max-md:overflow-y-auto">
      <slot />
      <PublicFooter />
    </main>
    <PublicBottomNav />
  </div>
</template>
