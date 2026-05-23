import type { Component } from 'vue'
import { LayoutDashboard, Settings, Users, Shield } from 'lucide-vue-next'

export interface NavItem {
  title: string
  icon: Component
  routeName: string
  children?: NavItem[]
  badge?: string
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    routeName: 'admin.dashboard',
  },
  {
    title: 'Settings',
    icon: Settings,
    routeName: 'admin.users',
    children: [
      {
        title: 'Users',
        icon: Users,
        routeName: 'admin.users',
        badge: 'Coming Soon',
      },
      {
        title: 'Roles & Permissions',
        icon: Shield,
        routeName: 'admin.roles',
        badge: 'Coming Soon',
      },
    ],
  },
]
