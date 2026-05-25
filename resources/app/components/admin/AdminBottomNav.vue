<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useNavActive } from '@/composables/useNavActive'
import { useSidebar } from '@/components/ui/sidebar'
import ProfileDropdown from '@/components/shared/ProfileDropdown.vue'
import { Globe, LayoutDashboard, Menu, User } from 'lucide-vue-next'

const { t } = useI18n()
const { setOpenMobile } = useSidebar()
const { isActive } = useNavActive()
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
    <ProfileDropdown
      side="top"
      align="end"
      :active="isActive('profile')"
      trigger-class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :label="t('nav.profile')"
    />
  </nav>
</template>
