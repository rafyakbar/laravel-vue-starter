<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { Globe, Home, Info, LogOut, User } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

function isActive(routeName: string): boolean {
  return route.name === routeName
}

async function handleLogout() {
  await authStore.logout()
}
</script>

<template>
  <nav
    class="shrink-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden"
  >
    <!-- Home -->
    <router-link
      :to="{ name: 'home' }"
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :class="isActive('home') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
    >
      <Home class="size-5" />
      <span>{{ t('landing.nav.home') }}</span>
    </router-link>

    <!-- Features -->
    <router-link
      :to="{ name: 'features' }"
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :class="isActive('features') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
    >
      <Globe class="size-5" />
      <span>{{ t('landing.nav.features') }}</span>
    </router-link>

    <!-- About -->
    <router-link
      :to="{ name: 'about' }"
      class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
      :class="isActive('about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
    >
      <Info class="size-5" />
      <span>{{ t('landing.nav.about') }}</span>
    </router-link>

    <!-- Auth actions (dropdown) -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
          :class="isActive('login') || isActive('register') || isActive('profile') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
        >
          <User class="size-5" />
          <span v-if="!authStore.isAuthenticated">{{ t('landing.nav.signIn') }}</span>
          <span v-else>{{ authStore.user?.name }}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" class="w-44">
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
          <DropdownMenuItem @click="handleLogout()">
            <LogOut class="mr-2 size-4" />
            <span>{{ t('landing.nav.signOut') }}</span>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </nav>
</template>
