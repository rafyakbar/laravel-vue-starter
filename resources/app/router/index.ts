import { createRouter, createWebHistory } from 'vue-router'
import { registerGuards } from '@/router/guards'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/pages/HomePage.vue'),
    meta: {
      seo: {
        title: 'Laravel Vue Starter - Production-Ready SPA Admin Dashboard',
        description:
          'A production-ready SPA admin dashboard starter built with Laravel 13 and Vue 3. Provides authentication, role-based access control, media management, and a modern component system.',
      },
    },
  },
  {
    path: '/features',
    name: 'features',
    component: () => import('@/views/pages/public/FeaturesPage.vue'),
    meta: {
      seo: {
        title: 'Features - Laravel Vue Starter',
        description:
          'Authentication with email/username, 3-tier RBAC, media management with Spatie Media Library, internationalization, dark mode, and responsive design.',
      },
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/pages/public/AboutPage.vue'),
    meta: {
      seo: {
        title: 'About - Laravel Vue Starter',
        description:
          'Built for developers who want to ship faster. Our mission is to eliminate boilerplate setup so you can focus on building features that matter.',
      },
    },
  },
  {
    path: '/admin',
    component: () => import('@/views/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresPermission: 'access-admin-panel' },
    redirect: { name: 'admin.dashboard' },
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: () => import('@/views/pages/admin/DashboardPage.vue'),
        meta: { requiresAuth: true, requiresPermission: 'access-admin-panel', titleKey: 'breadcrumb.dashboard' },
      },
      {
        path: 'users',
        name: 'admin.users',
        component: () => import('@/views/pages/admin/UsersPage.vue'),
        meta: { requiresAuth: true, requiresPermission: 'view-users', titleKey: 'breadcrumb.users' },
      },
      {
        path: 'roles',
        name: 'admin.roles',
        component: () => import('@/views/pages/admin/RolesPage.vue'),
        meta: { requiresAuth: true, requiresPermission: 'view-roles', titleKey: 'breadcrumb.roles' },
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/pages/ProfilePage.vue'),
    meta: { requiresAuth: true, titleKey: 'breadcrumb.profile' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/pages/auth/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/pages/auth/RegisterPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/pages/auth/ForgotPasswordPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/pages/auth/ResetPasswordPage.vue'),
    meta: { guest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

registerGuards(router)

export default router
