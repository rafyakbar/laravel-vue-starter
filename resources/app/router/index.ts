import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/pages/HomePage.vue'
import { registerGuards } from '@/router/guards'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
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
