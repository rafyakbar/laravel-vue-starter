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
import { Languages } from 'lucide-vue-next'

const prefs = usePreferencesStore()
const { t } = useI18n()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="size-8">
        <Languages class="size-4" />
        <span class="sr-only">{{ t('preferences.language.label') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
      <DropdownMenuLabel>{{ t('preferences.language.label') }}</DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="prefs.locale">
        <DropdownMenuRadioItem value="en">
          {{ t('preferences.language.en') }}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="id">
          {{ t('preferences.language.id') }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
