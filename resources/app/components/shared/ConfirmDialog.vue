<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    loading?: boolean
  }>(),
  {
    confirmText: undefined,
    cancelText: undefined,
    variant: 'destructive',
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()

function close() {
  emit('update:open', false)
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <Dialog :open="open" @update:open="close">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter class="sm:justify-end gap-2">
        <Button variant="outline" :disabled="loading" @click="close">
          {{ cancelText ?? t('common.cancel') }}
        </Button>
        <Button :variant="variant" :disabled="loading" @click="confirm">
          {{ confirmText ?? t('common.confirm') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
