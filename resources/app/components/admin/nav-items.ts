import type { Component } from 'vue'
import { LayoutDashboard, Settings, Users, Shield } from 'lucide-vue-next'

export interface NavItem {
  title: string
  i18nKey: string
  icon: Component
  routeName: string
  children?: NavItem[]
  badge?: string
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    i18nKey: 'dashboard',
    icon: LayoutDashboard,
    routeName: 'admin.dashboard',
  },
  {
    title: 'Settings',
    i18nKey: 'settings',
    icon: Settings,
    routeName: 'admin.users',
    children: [
      {
        title: 'Users',
        i18nKey: 'users',
        icon: Users,
        routeName: 'admin.users',
        badge: 'Coming Soon',
      },
      {
        title: 'Roles & Permissions',
        i18nKey: 'roles',
        icon: Shield,
        routeName: 'admin.roles',
        badge: 'Coming Soon',
      },
    ],
  },
]
