<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import UserInitials from '@/components/shared/UserInitials.vue'
import ProfileDropdown from '@/components/shared/ProfileDropdown.vue'

const authStore = useAuthStore()
</script>

<template>
  <ProfileDropdown side="bottom" align="end">
    <template #trigger>
      <button class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <UserInitials :name="authStore.user?.name ?? 'U'" size="sm" />
        <span class="hidden sm:inline-block max-w-32 truncate font-medium">
          {{ authStore.user?.name }}
        </span>
      </button>
    </template>
  </ProfileDropdown>
</template>
