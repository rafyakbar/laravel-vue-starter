<script setup lang="ts">
import LandingSection from '@/components/shared/LandingSection.vue'
</script>

<template>
  <LandingSection>
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Stack</h2>

      <div class="grid gap-8 md:grid-cols-2">
        <!-- Backend -->
        <div class="rounded-xl border border-border bg-card p-6">
          <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
            <span>🖥️</span>
            <span>Backend</span>
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border text-left text-muted-foreground">
                  <th class="pb-2 font-medium">Technology</th>
                  <th class="pb-2 font-medium">Version</th>
                  <th class="pb-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-for="row in [
                  { tech: '🐘 PHP', ver: '8.4', purpose: 'Runtime' },
                  { tech: '🏗️ Laravel', ver: '13', purpose: 'Backend framework' },
                  { tech: '🔐 Fortify', ver: '1.x', purpose: 'Headless authentication' },
                  { tech: '🍪 Sanctum', ver: '4.x', purpose: 'SPA auth + API tokens' },
                  { tech: '🛡️ Spatie Permission', ver: '7.x', purpose: 'RBAC' },
                  { tech: '🖼️ Spatie Media', ver: '11.x', purpose: 'File uploads & conversions' },
                  { tech: '🧪 Pest', ver: '4.x', purpose: 'PHP testing' },
                  { tech: '✨ Pint', ver: '1.x', purpose: 'Code style formatting' },
                ]" :key="row.tech">
                  <td class="py-2.5 font-medium">{{ row.tech }}</td>
                  <td class="py-2.5 text-muted-foreground">{{ row.ver }}</td>
                  <td class="py-2.5 text-muted-foreground">{{ row.purpose }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Frontend -->
        <div class="rounded-xl border border-border bg-card p-6">
          <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
            <span>🎨</span>
            <span>Frontend</span>
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border text-left text-muted-foreground">
                  <th class="pb-2 font-medium">Technology</th>
                  <th class="pb-2 font-medium">Version</th>
                  <th class="pb-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-for="row in [
                  { tech: '💚 Vue', ver: '3.5', purpose: 'Reactive UI (Composition API)' },
                  { tech: '📘 TypeScript', ver: '5.9', purpose: 'Static typing' },
                  { tech: '⚡ Vite', ver: '8.x', purpose: 'Bundler with HMR' },
                  { tech: '🎨 Tailwind CSS', ver: '4.x', purpose: 'Utility-first styling' },
                  { tech: '🧩 shadcn-vue', ver: '2.7', purpose: 'Accessible UI components' },
                  { tech: '🗂️ Pinia', ver: '3.x', purpose: 'State management' },
                  { tech: '🧭 Vue Router', ver: '5.x', purpose: 'Client-side routing' },
                  { tech: '📝 vee-validate', ver: '4.x', purpose: 'Form validation' },
                  { tech: '🎭 Playwright', ver: '1.60', purpose: 'E2E browser testing' },
                ]" :key="row.tech">
                  <td class="py-2.5 font-medium">{{ row.tech }}</td>
                  <td class="py-2.5 text-muted-foreground">{{ row.ver }}</td>
                  <td class="py-2.5 text-muted-foreground">{{ row.purpose }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LandingSection>
</template>