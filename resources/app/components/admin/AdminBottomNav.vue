<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/components/ui/sidebar'
import { Home, LayoutDashboard, Settings, Menu } from 'lucide-vue-next'

const route = useRoute()
const { setOpenMobile } = useSidebar()

const items = [
  { title: 'Home', icon: Home, routeName: 'home', isExternal: true },
  { title: 'Dashboard', icon: LayoutDashboard, routeName: 'admin.dashboard', isExternal: false },
  { title: 'Settings', icon: Settings, routeName: 'admin.users', isExternal: false },
]

function isActive(routeName: string): boolean {
  return route.name === routeName
}
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
    <router-link
      v-for="item in items"
      :key="item.routeName"
      :to="{ name: item.routeName }"
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :class="isActive(item.routeName)
        ? 'text-primary'
        : 'text-muted-foreground hover:text-foreground'"
    >
      <component :is="item.icon" class="size-5" />
      <span>{{ item.title }}</span>
    </router-link>

    <!-- Hamburger toggle -->
    <button
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      @click="setOpenMobile(true)"
    >
      <Menu class="size-5" />
      <span>Menu</span>
    </button>
  </nav>
</template>
