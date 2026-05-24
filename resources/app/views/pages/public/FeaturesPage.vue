<script setup lang="ts">
import LandingLayout from '@/views/layouts/LandingLayout.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

useSeoMeta({
  title: 'Features - Laravel Vue Starter',
  description:
    'Authentication with email/username, 3-tier RBAC, media management with Spatie Media Library, internationalization, dark mode, and responsive design.',
})
</script>

<template>
  <LandingLayout>
    <section class="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        <h1 class="text-center text-4xl font-bold tracking-tight">Features</h1>
        <p class="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Everything you need to build a modern admin panel.
        </p>

        <div class="mt-12 space-y-12">
          <div class="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 class="text-2xl font-bold">🔐 Authentication</h2>
              <p class="mt-2 text-muted-foreground">
                Login with email or username, registration with unique validation,
                password reset via email link, email verification support, and
                rate-limited login (5 attempts per minute per email + IP).
                API token generation for mobile or external clients.
              </p>
            </div>
            <div class="rounded-xl border border-border bg-card p-6">
              <p class="text-sm text-muted-foreground">Fortify handles the backend auth logic. Sanctum provides cookie-based SPA auth + token issuance.</p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2 md:items-center">
            <div class="order-2 md:order-1 rounded-xl border border-border bg-card p-6">
              <p class="text-sm text-muted-foreground">Spatie Permission provides role & permission management. Frontend guards check permissions before rendering routes.</p>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-2xl font-bold">🛡️ Role-Based Access Control</h2>
              <p class="mt-2 text-muted-foreground">
                3-tier roles: Superadmin (11 permissions), Admin (content manager),
                User (profile only). Permission-filtered navigation, frontend + backend
                route guards. No Gate::before bypass — uniform permissions across all roles.
              </p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 class="text-2xl font-bold">🖼️ Media Management</h2>
              <p class="mt-2 text-muted-foreground">
                User avatar upload with automatic image conversions at 300px, 600px,
                and 1200px. Powered by Spatie Media Library with responsive image
                support and easy file association with Eloquent models.
              </p>
            </div>
            <div class="rounded-xl border border-border bg-card p-6">
              <p class="text-sm text-muted-foreground">Add media collections to any model with spatie/laravel-medialibrary.</p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2 md:items-center">
            <div class="order-2 md:order-1 rounded-xl border border-border bg-card p-6">
              <p class="text-sm text-muted-foreground">Type-safe locale system with dot-notation keys. Language switcher in admin header, persists to localStorage.</p>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-2xl font-bold">🌐 i18n</h2>
              <p class="mt-2 text-muted-foreground">
                English and Indonesian language support. Type-safe locale system,
                language switcher in admin header, and persistence to localStorage.
                Easy to add more languages.
              </p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 class="text-2xl font-bold">🌗 Dark Mode</h2>
              <p class="mt-2 text-muted-foreground">
                Light, Dark, and System theme options. Applied before Vue mounts
                to prevent flash of unstyled content. Persists to localStorage
                and follows system preference.
              </p>
            </div>
            <div class="rounded-xl border border-border bg-card p-6">
              <p class="text-sm text-muted-foreground">Uses class strategy on &lt;html&gt; element. shadcn-vue tokens handle all color transitions.</p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2 md:items-center">
            <div class="order-2 md:order-1 rounded-xl border border-border bg-card p-6">
              <p class="text-sm text-muted-foreground">Dialog on desktop, Drawer on mobile — responsive components that adapt to viewport.</p>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-2xl font-bold">📱 Responsive Design</h2>
              <p class="mt-2 text-muted-foreground">
                Mobile-first approach with Tailwind breakpoints. Dialog on desktop,
                Drawer on mobile for sidebar and modals. Responsive grids, tables,
                and navigation across all device sizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>
