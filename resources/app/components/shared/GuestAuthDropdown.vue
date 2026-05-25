<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
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
}>()

const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent :side="side ?? 'top'" :align="align ?? 'end'" class="w-44">
      <DropdownMenuItem as-child>
        <router-link :to="{ name: 'login' }">
          <span class="mr-2">→</span>
          <span>{{ t('landing.nav.signIn') }}</span>
        </router-link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <router-link :to="{ name: 'register' }">
          <span class="mr-2">📝</span>
          <span>{{ t('landing.nav.signUp') }}</span>
        </router-link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
