<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, type LocaleKey } from '@/composables/useI18n'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import AdminUserMenu from '@/components/admin/AdminUserMenu.vue'
import AdminThemeMenu from '@/components/admin/AdminThemeMenu.vue'
import AdminLanguageMenu from '@/components/admin/AdminLanguageMenu.vue'

const route = useRoute()
const { t } = useI18n()

const pageTitle = computed(() => {
  const titleKey = route.meta.titleKey as LocaleKey | undefined
  return titleKey ? t(titleKey) : 'Admin'
})
</script>

<template>
  <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />

    <Breadcrumb class="flex-1">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{{ pageTitle }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <AdminThemeMenu />
    <AdminLanguageMenu />
    <AdminUserMenu />
  </header>
</template>
