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
  triggerClass?: string
  active?: boolean
}>()

const authStore = useAuthStore()
const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        :class="[triggerClass || 'flex items-center gap-2', active ? 'text-primary' : 'text-muted-foreground hover:text-foreground']"
      >
        <User class="size-5" />
        <span v-if="!authStore.isAuthenticated">{{ t('landing.nav.signIn') }}</span>
        <span v-else>{{ authStore.user?.name }}</span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :side="side ?? 'top'" :align="align ?? 'end'" class="w-44">
      <template v-if="!authStore.isAuthenticated">
        <DropdownMenuItem as-child>
          <router-link :to="{ name: 'login' }">
            <User class="mr-2 size-4" />
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
      </template>
      <template v-else>
        <DropdownMenuItem as-child>
          <router-link :to="{ name: 'profile' }">
            <User class="mr-2 size-4" />
            <span>{{ t('nav.profile') }}</span>
          </router-link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="authStore.logout()">
          <LogOut class="mr-2 size-4" />
          <span>{{ t('landing.nav.signOut') }}</span>
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
