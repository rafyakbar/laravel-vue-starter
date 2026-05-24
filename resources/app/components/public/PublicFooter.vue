<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const year = new Date().getFullYear()
const APP_NAME = import.meta.env.VITE_APP_NAME || 'Laravel Vue Starter'

const footerLinks = {
  links: [
    { nameKey: 'landing.footer.features', route: 'features' },
    { nameKey: 'landing.footer.about', route: 'about' },
  ],
}
</script>

<template>
  <footer
    data-slot="public-footer"
    class="border-t border-border bg-muted/50"
  >
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-3">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <router-link :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-bold">
            <span class="text-primary">⚡</span>
            <span>{{ APP_NAME }}</span>
          </router-link>
          <p class="mt-3 text-sm text-muted-foreground max-w-xs">
            {{ t('landing.footer.description') }}
          </p>
        </div>

        <!-- Links column -->
        <div>
          <h3 class="text-sm font-semibold">{{ t('landing.footer.links') }}</h3>
          <ul class="mt-3 flex flex-col gap-2">
            <li v-for="link in footerLinks.links" :key="link.nameKey">
              <router-link
                :to="{ name: link.route }"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ t(link.nameKey) }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Connect -->
        <div>
          <h3 class="text-sm font-semibold">{{ t('landing.footer.connect') }}</h3>
          <div class="mt-3 flex gap-3">
            <a
              href="https://github.com/rafyakbar/laravel-vue-starter"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        &copy; {{ year }} {{ APP_NAME }}. {{ t('landing.footer.rights') }}
      </div>
    </div>
  </footer>
</template>
