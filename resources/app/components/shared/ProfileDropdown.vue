<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { LogOut, User } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  label?: string
  triggerClass?: string
  active?: boolean
  contentClass?: string
}>()

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot name="trigger">
        <button
          :class="[triggerClass || 'flex items-center gap-2', active ? 'text-primary' : 'text-muted-foreground hover:text-foreground']"
        >
          <User class="size-5" />
          <span>{{ label || t('nav.profile') }}</span>
        </button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent :side="side ?? 'top'" :align="align ?? 'end'" :class="contentClass || 'w-44'">
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
