<script setup lang="ts">
</script>

<template>
  <section data-animate class="px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Features</h2>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Auth -->
        <div class="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span class="text-lg">🔐</span>
          </div>
          <h3 class="mb-2 font-semibold">Authentication</h3>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Login with email/username
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Registration + password reset
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Email verification
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Rate-limited (5/min)
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> API token generation
            </li>
          </ul>
        </div>

        <!-- RBAC -->
        <div class="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span class="text-lg">🛡️</span>
          </div>
          <h3 class="mb-2 font-semibold">Role-Based Access Control</h3>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> 3-tier roles (Superadmin, Admin, User)
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> 11 granular permissions
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Permission-filtered navigation
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Route guards (frontend + backend)
            </li>
          </ul>
        </div>

        <!-- Media -->
        <div class="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span class="text-lg">🖼️</span>
          </div>
          <h3 class="mb-2 font-semibold">Media Management</h3>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Avatar upload with conversions
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Spatie Media Library
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Automatic 300/600/1200px
            </li>
          </ul>
        </div>

        <!-- i18n -->
        <div class="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span class="text-lg">🌐</span>
          </div>
          <h3 class="mb-2 font-semibold">i18n</h3>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> English + Indonesian
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Type-safe locale keys
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Language switcher
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Persists to localStorage
            </li>
          </ul>
        </div>

        <!-- Dark Mode -->
        <div class="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span class="text-lg">🌗</span>
          </div>
          <h3 class="mb-2 font-semibold">Dark Mode</h3>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Light / Dark / System
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> No flash on load
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Persists to localStorage
            </li>
          </ul>
        </div>

        <!-- Responsive -->
        <div class="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span class="text-lg">📱</span>
          </div>
          <h3 class="mb-2 font-semibold">Responsive Design</h3>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Mobile-first approach
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Dialog/Drawer pattern
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-0.5 text-primary">✓</span> Tailwind breakpoints
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
