<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'

const props = defineProps<{
  name?: string
  email?: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  showEmail?: boolean
  class?: HTMLAttributes['class']
}>()

const initials = computed(() => {
  if (!props.name) return 'U'
  return props.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'size-6'
    case 'lg': return 'size-16'
    default: return 'size-8'
  }
})
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.class)">
    <Avatar :class="sizeClass">
      <AvatarFallback class="text-xs font-medium">
        {{ initials }}
      </AvatarFallback>
    </Avatar>
    <div v-if="showName || showEmail" class="grid text-left text-sm leading-tight">
      <span v-if="showName" class="truncate font-semibold">{{ name }}</span>
      <span v-if="showEmail" class="truncate text-xs text-muted-foreground">{{ email }}</span>
    </div>
  </div>
</template>
