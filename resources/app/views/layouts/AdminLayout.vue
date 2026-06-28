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
      <main class="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <div class="mx-auto max-w-[1536px] p-4 md:p-6 w-full">
          <slot>
            <router-view />
          </slot>
        </div>
      </main>
    </SidebarInset>
    <AdminBottomNav />
  </SidebarProvider>
</template>
