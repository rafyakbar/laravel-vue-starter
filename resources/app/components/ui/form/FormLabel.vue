<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { formItemId, error } = useFormField()
</script>

<template>
  <Label
    :for="formItemId"
    :class="cn(error ? 'text-destructive' : '', props.class)"
  >
    <slot />
  </Label>
</template>
