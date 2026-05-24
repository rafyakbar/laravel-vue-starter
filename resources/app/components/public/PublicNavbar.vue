<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'
import { Button } from '@/components/ui/button'
import { SunMoon, Sun, Moon, Monitor, User, LogOut, ExternalLink } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const authStore = useAuthStore()
const prefs = usePreferencesStore()
const { t } = useI18n()

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Laravel Vue Starter'

const navLinks = [
  { name: 'home', labelKey: 'landing.nav.home' },
  { name: 'features', labelKey: 'landing.nav.features' },
  { name: 'about', labelKey: 'landing.nav.about' },
]

async function handleLogout() {
  await authStore.logout()
}
</script>

<template>
  <header
    data-slot="public-navbar"
    class="relative z-50 shrink-0 border-b border-border bg-background shadow-sm md:fixed md:top-0 md:left-0 md:right-0 md:w-full md:bg-background/80 md:backdrop-blur-md"
  >
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <router-link :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-bold tracking-tight">
        <span class="text-primary">⚡</span>
        <span>{{ APP_NAME }}</span>
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden md:flex md:items-center md:gap-6">
        <router-link
          v-for="link in navLinks"
          :key="String(link.name)"
          :to="{ name: link.name }"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          active-class="text-foreground"
        >
          {{ t(link.labelKey) }}
        </router-link>
      </div>

      <!-- Desktop actions -->
      <div class="hidden md:flex md:items-center md:gap-2">
        <template v-if="!authStore.isAuthenticated">
          <router-link :to="{ name: 'login' }">
            <Button variant="ghost" size="sm">{{ t('landing.nav.signIn') }}</Button>
          </router-link>
          <router-link :to="{ name: 'register' }">
            <Button size="sm">{{ t('landing.nav.signUp') }}</Button>
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'profile' }">
            <Button variant="ghost" size="sm" class="gap-2">
              <User class="size-4" />
              <span class="max-w-24 truncate">{{ authStore.user?.name }}</span>
            </Button>
          </router-link>
          <Button variant="outline" size="sm" @click="handleLogout">
            <LogOut class="size-4" />
            {{ t('landing.nav.signOut') }}
          </Button>
          <router-link
            v-if="authStore.user?.permissions?.includes('access-admin-panel')"
            :to="{ name: 'admin.dashboard' }"
          >
            <Button size="sm" class="gap-1.5">
              {{ t('landing.nav.admin') }}
              <ExternalLink class="size-3.5" />
            </Button>
          </router-link>
        </template>
      </div>

      <!-- Theme switcher (desktop only) -->
      <div class="hidden md:flex md:items-center md:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon-sm" class="size-8">
              <SunMoon class="size-4" />
              <span class="sr-only">{{ t('preferences.theme.label') }}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-40">
            <DropdownMenuLabel>{{ t('preferences.theme.label') }}</DropdownMenuLabel>
            <DropdownMenuRadioGroup v-model="prefs.theme">
              <DropdownMenuRadioItem value="light">
                <Sun class="mr-2 size-4" />
                {{ t('preferences.theme.light') }}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon class="mr-2 size-4" />
                {{ t('preferences.theme.dark') }}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor class="mr-2 size-4" />
                {{ t('preferences.theme.system') }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  </header>
</template>