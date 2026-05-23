<script setup lang="ts">
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminBottomNav from '@/components/admin/AdminBottomNav.vue'
</script>

<template>
  <SidebarProvider storage-key="admin-sidebar">
    <AdminSidebar />
    <SidebarInset>
      <AdminHeader />
      <main class="flex flex-1 flex-col gap-4 p-4 pb-20 md:pb-4">
        <slot>
          <router-view />
        </slot>
      </main>
    </SidebarInset>
    <AdminBottomNav />
  </SidebarProvider>
</template>
