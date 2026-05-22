<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { error, formMessageId } = useFormField()
const body = computed(() => error.value)
</script>

<template>
  <p
    v-if="body"
    :id="formMessageId"
    :class="cn('text-[0.8rem] font-medium text-destructive', props.class)"
  >
    {{ body }}
  </p>
</template>
