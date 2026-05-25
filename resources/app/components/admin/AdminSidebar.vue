<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { navItems } from '@/components/admin/nav-items'
import UserInitials from '@/components/shared/UserInitials.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, ChevronUp, Globe, LogOut, User } from 'lucide-vue-next'
import { useSidebar } from '@/components/ui/sidebar/utils'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const { state, isMobile } = useSidebar()

/** Open state for collapsible groups (keyed by routeName) */
const openGroups = ref<Record<string, boolean>>({ 'admin.users': true })

/** Filter nav items based on user permissions */
const visibleNavItems = computed(() => {
  return navItems.filter((item) => {
    if (!item.requiredPermission) return true
    return authStore.user?.permissions?.includes(item.requiredPermission) ?? false
  })
})

function isActive(routeName: string): boolean {
  return route.name === routeName
}

function isGroupActive(children: { routeName: string }[]): boolean {
  return children.some((child) => route.name === child.routeName)
}
</script>

<template>
  <Sidebar collapsible="icon">
    <!-- Header: App name -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <router-link :to="{ name: 'admin.dashboard' }">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span class="text-xs font-bold">A</span>
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Admin Panel</span>
                <span class="truncate text-xs text-muted-foreground">{{ t('nav.dashboard') }}</span>
              </div>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Content: Navigation -->
    <SidebarContent>
      <!-- Main navigation group -->
      <SidebarGroup>
        <SidebarGroupLabel>{{ t('nav.menu') }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <template v-for="item in visibleNavItems" :key="item.routeName">
              <!-- Item with children (collapsible group) -->
              <SidebarMenuItem v-if="item.children">
                <!-- Collapsed: DropdownMenu -->
                <DropdownMenu v-if="state === 'collapsed' && !isMobile">
                  <DropdownMenuTrigger as-child>
                    <SidebarMenuButton :tooltip="t(`nav.${item.i18nKey}`)">
                      <component :is="item.icon" />
                      <span>{{ t(`nav.${item.i18nKey}` as any) }}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" :side-offset="8" class="w-56">
                    <DropdownMenuItem v-for="child in item.children" :key="child.routeName" as-child>
                      <router-link :to="{ name: child.routeName }" class="flex items-center gap-2">
                        <component :is="child.icon" class="size-4" />
                        <span>{{ t(`nav.${child.i18nKey}` as any) }}</span>
                        <Badge v-if="child.badge" variant="secondary" class="ml-auto">{{ child.badge }}</Badge>
                      </router-link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <!-- Expanded: Collapsible -->
                <Collapsible v-else
                  v-model:open="openGroups[item.routeName]"
                  class="group/collapsible"
                >
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton :is-active="isGroupActive(item.children)">
                      <component :is="item.icon" />
                      <span>{{ t(`nav.${item.i18nKey}` as any) }}</span>
                      <ChevronRight class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem v-for="child in item.children" :key="child.routeName">
                        <SidebarMenuSubButton as-child :is-active="isActive(child.routeName)">
                          <router-link :to="{ name: child.routeName }">
                            <component :is="child.icon" />
                            <span>{{ t(`nav.${child.i18nKey}` as any) }}</span>
                          </router-link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              <!-- Top-level item (no children) -->
              <SidebarMenuItem v-else>
                <SidebarMenuButton :tooltip="t(`nav.${item.i18nKey}`)" as-child :is-active="isActive(item.routeName)">
                  <router-link :to="{ name: item.routeName }">
                    <component :is="item.icon" />
                    <span>{{ t(`nav.${item.i18nKey}` as any) }}</span>
                  </router-link>
                </SidebarMenuButton>
                <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Site link group (pinned to bottom of content area, above footer) -->
      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton :tooltip="t('nav.site')" as-child>
                <router-link :to="{ name: 'home' }">
                  <Globe />
                  <span>{{ t('nav.site') }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer: User menu -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton size="lg">
                <UserInitials :name="authStore.user?.name ?? 'U'" :email="authStore.user?.email" size="sm" />
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ authStore.user?.name }}</span>
                  <span class="truncate text-xs text-muted-foreground">{{ authStore.user?.email }}</span>
                </div>
                <ChevronUp class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" class="w-(--reka-popper-anchor-width)">
              <DropdownMenuItem as-child>
                <router-link :to="{ name: 'profile' }">
                  <User class="mr-2 size-4" />
                  <span>{{ t('nav.profile') }}</span>
                </router-link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="authStore.logout()">
                <LogOut class="mr-2 size-4" />
                <span>{{ t('nav.signOut') }}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
