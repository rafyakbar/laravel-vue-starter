<script setup lang="ts">
import { useNavActive } from '@/composables/useNavActive'
import { useI18n } from '@/composables/useI18n'
import AuthDropdown from '@/components/shared/AuthDropdown.vue'
import { Globe, Home, Info, User } from 'lucide-vue-next'

const { t } = useI18n()
const { isActive } = useNavActive()
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
    <AuthDropdown
      side="top"
      align="end"
      :active="isActive('login') || isActive('register') || isActive('profile')"
      trigger-class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
    />
  </nav>
</template>
