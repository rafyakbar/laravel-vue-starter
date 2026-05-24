<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { useSidebar } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, LayoutDashboard, LogOut, Menu, User } from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const { setOpenMobile } = useSidebar()

function isActive(routeName: string): boolean {
  return route.name === routeName
}
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
    <!-- Site -->
    <router-link
      :to="{ name: 'home' }"
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :class="isActive('home') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
    >
      <Globe class="size-5" />
      <span>{{ t('nav.site') }}</span>
    </router-link>

    <!-- Dashboard -->
    <router-link
      :to="{ name: 'admin.dashboard' }"
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :class="isActive('admin.dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
    >
      <LayoutDashboard class="size-5" />
      <span>{{ t('nav.dashboard') }}</span>
    </router-link>

    <!-- Menu (opens sidebar drawer) -->
    <button
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      @click="setOpenMobile(true)"
    >
      <Menu class="size-5" />
      <span>{{ t('nav.menu') }}</span>
    </button>

    <!-- Profile (dropdown popup) -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
          :class="isActive('profile') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
        >
          <User class="size-5" />
          <span>{{ t('nav.profile') }}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" class="w-44">
        <DropdownMenuItem as-child>
          <router-link :to="{ name: 'profile' }">
            <User class="mr-2 size-4" />
            <span>{{ t('nav.profile') }}</span>
          </router-link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="authStore.logout()">
          <LogOut class="mr-2 size-4" />
          <span>{{ t('nav.signOut') }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</template>
