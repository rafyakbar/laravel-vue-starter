<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import UserInitials from '@/components/shared/UserInitials.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-vue-next'

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <UserInitials :name="authStore.user?.name ?? 'U'" size="sm" />
        <span class="hidden sm:inline-block max-w-32 truncate font-medium">
          {{ authStore.user?.name }}
        </span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-48">
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
</template>
