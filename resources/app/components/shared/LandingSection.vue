<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{
  id?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <section :id="id" data-animate :class="cn('px-4 py-20 sm:px-6 lg:px-8', $attrs.class as string)">
    <div class="mx-auto max-w-5xl">
      <slot />
    </div>
  </section>
</template>
