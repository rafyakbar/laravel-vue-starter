<script setup lang="ts">
import { Slot } from 'radix-vue'
import { useFormField } from './useFormField'

const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
</script>

<template>
  <Slot
    :id="formItemId"
    :aria-describedby="error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId"
    :aria-invalid="!!error"
  >
    <slot />
  </Slot>
</template>
