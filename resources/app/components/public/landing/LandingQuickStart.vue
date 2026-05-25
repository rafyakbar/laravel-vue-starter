<script setup lang="ts">
import LandingSection from '@/components/shared/LandingSection.vue'
</script>

<template>
  <LandingSection id="quick-start">
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Quick Start</h2>

      <!-- Prerequisites -->
      <div class="mb-6 rounded-xl border border-border bg-card p-6">
        <h3 class="mb-3 font-semibold">Prerequisites</h3>
        <ul class="space-y-1 text-sm text-muted-foreground">
          <li class="flex items-center gap-2">• PHP 8.3+</li>
          <li class="flex items-center gap-2">• Composer 2.x</li>
          <li class="flex items-center gap-2">• Node.js 20+</li>
          <li class="flex items-center gap-2">• SQLite (default) or MySQL/PostgreSQL</li>
        </ul>
      </div>

      <!-- Install -->
      <div class="mb-6 rounded-xl border border-border bg-card p-6">
        <h3 class="mb-3 font-semibold">Installation</h3>
        <pre class="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed"><code class="text-muted-foreground"># Clone
git clone https://github.com/rafyakbar/laravel-vue-starter.git

# One-line setup (installs deps, generates key, migrates, builds)
composer setup</code></pre>
        <p class="mt-2 text-xs text-muted-foreground">Or step by step:</p>
        <pre class="mt-1 overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed"><code class="text-muted-foreground">composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
npm run build</code></pre>
      </div>

      <!-- Dev -->
      <div class="mb-6 rounded-xl border border-border bg-card p-6">
        <h3 class="mb-3 font-semibold">Development</h3>
        <pre class="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed"><code class="text-muted-foreground"># Start all services concurrently
composer run dev</code></pre>
        <p class="mt-2 text-xs text-muted-foreground">
          This launches: 🖥️ <code class="rounded bg-muted px-1">php artisan serve</code> (Laravel, port 8000),
          ⚙️ queue worker, and ⚡ Vite HMR.
        </p>
      </div>

      <!-- Accounts -->
      <div class="rounded-xl border border-border bg-card p-6">
        <h3 class="mb-3 font-semibold">Seeded Accounts</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-left text-muted-foreground">
                <th class="pb-2 font-medium">Role</th>
                <th class="pb-2 font-medium">Username</th>
                <th class="pb-2 font-medium">Email</th>
                <th class="pb-2 font-medium">Password</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="row in [
                { role: 'Superadmin', username: 'superadmin', email: 'superadmin@example.com', password: '123123' },
                { role: 'Admin', username: 'admin', email: 'admin@example.com', password: '123123' },
                { role: 'User', username: '(20 random)', email: '(random)', password: '(random)' },
              ]" :key="row.role">
                <td class="py-2.5 font-medium">{{ row.role }}</td>
                <td class="py-2.5 text-muted-foreground"><code>{{ row.username }}</code></td>
                <td class="py-2.5 text-muted-foreground"><code>{{ row.email }}</code></td>
                <td class="py-2.5 text-muted-foreground"><code>{{ row.password }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </LandingSection>
</template>