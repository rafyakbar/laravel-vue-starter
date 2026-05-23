<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
import { useI18n } from '@/composables/useI18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SunMoon, Sun, Moon, Monitor } from 'lucide-vue-next'

const prefs = usePreferencesStore()
const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="size-8">
        <SunMoon class="size-4" />
        <span class="sr-only">{{ t('preferences.theme.label') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
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
</template>
