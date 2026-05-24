<script setup lang="ts">
</script>

<template>
  <section data-animate class="px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Testing</h2>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Pest -->
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-3 flex items-center gap-2">
            <span>🧪</span>
            <h3 class="font-semibold">Pest — 73 Backend Tests</h3>
          </div>
          <pre class="mb-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground"><code># Run all
php artisan test --compact

# By filter
php artisan test --compact --filter=UserApiTest

# By directory
php artisan test --compact tests/Feature/Authorization/</code></pre>
          <p class="text-sm text-muted-foreground">
            Covers: authentication flows, user CRUD, role/permission enforcement, avatar upload, API endpoints.
          </p>
        </div>

        <!-- Playwright -->
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="mb-3 flex items-center gap-2">
            <span>🎭</span>
            <h3 class="font-semibold">Playwright — 79 E2E Tests</h3>
          </div>
          <pre class="mb-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground"><code># Headless
npm run test:e2e

# Visible browser
npm run test:e2e:headed

# Interactive UI
npm run test:e2e:ui</code></pre>
          <p class="text-sm text-muted-foreground">
            Covers: login/register/forgot-password, navigation guards, sidebar, i18n, dark mode, guest restrictions.
          </p>
        </div>
      </div>

      <!-- Test matrix -->
      <div class="mt-6 overflow-x-auto rounded-xl border border-border bg-card p-6">
        <h3 class="mb-4 font-semibold">Test Projects</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-left text-muted-foreground">
              <th class="pb-2 font-medium">Project</th>
              <th class="pb-2 font-medium">Scope</th>
              <th class="pb-2 font-medium">Auth State</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="row in [
              { project: 'guest', scope: 'Navigation guards, page accessibility', auth: 'Unauthenticated' },
              { project: 'auth', scope: 'Login, register, forgot-password forms', auth: 'Unauthenticated' },
              { project: 'user', scope: 'Home, profile, restricted pages', auth: 'User role' },
              { project: 'admin', scope: 'Dashboard, sidebar, i18n, theme', auth: 'Admin role' },
              { project: 'superadmin', scope: 'Full access, settings group, i18n', auth: 'Superadmin role' },
            ]" :key="row.project">
              <td class="py-2.5 font-medium">{{ row.project }}</td>
              <td class="py-2.5 text-muted-foreground">{{ row.scope }}</td>
              <td class="py-2.5 text-muted-foreground">{{ row.auth }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
