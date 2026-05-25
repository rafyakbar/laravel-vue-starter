<script setup lang="ts">
import LandingSection from '@/components/shared/LandingSection.vue'
import { ref } from 'vue'

const showDirTree = ref(false)

const dirTree = `├── app/
│   ├── Actions/Fortify/         # Auth actions
│   ├── Http/Controllers/        # Thin controllers
│   ├── Http/Resources/          # API resources
│   ├── Models/                  # Eloquent
│   ├── Services/                # Business logic
│   └── Traits/                  # Filterable, Searchable
├── resources/app/               # Vue SPA source
│   ├── components/ui/           # shadcn-vue (reka-ui)
│   ├── components/admin/        # Admin layout
│   ├── composables/             # useI18n, etc.
│   ├── locales/                 # en.ts, id.ts
│   ├── router/                  # Vue Router + guards
│   ├── services/                # API fetch wrapper
│   ├── stores/                  # Pinia (auth, preferences)
│   └── views/                   # Layouts and pages
├── tests/
│   ├── Feature/                 # 73 Pest tests
│   ├── Unit/                    # Unit tests
│   └── e2e/                     # 79 Playwright tests
└── openspec/                    # Spec-driven planning`
</script>

<template>
  <LandingSection>
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Architecture</h2>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- SPA flow -->
        <div class="rounded-xl border border-border bg-card p-6">
          <h3 class="mb-3 font-semibold">SPA Architecture</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Laravel serves a single Blade view (catch-all route) and a JSON API.
            Vue handles all UI rendering and client-side routing via Vue Router.
            Authentication uses Sanctum's cookie-based stateful mechanism.
          </p>

          <div class="mt-4 flex items-center justify-center gap-2 text-xs">
            <span class="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary">Laravel API</span>
            <span class="text-muted-foreground">⟷</span>
            <span class="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary">Sanctum</span>
            <span class="text-muted-foreground">⟷</span>
            <span class="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary">Vue SPA</span>
          </div>
        </div>

        <!-- Service Layer -->
        <div class="rounded-xl border border-border bg-card p-6">
          <h3 class="mb-3 font-semibold">Service Layer Pattern</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Business logic follows a clean separation: Controllers delegate to
            Services, which handle data operations through Eloquent Models.
            Authorization checks via <code class="rounded bg-muted px-1">$this->authorize()</code>.
          </p>

          <div class="mt-4 flex items-center justify-center gap-2 text-xs">
            <span class="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary">Controller</span>
            <span class="text-muted-foreground">→</span>
            <span class="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary">Service</span>
            <span class="text-muted-foreground">→</span>
            <span class="rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary">Model</span>
          </div>
        </div>
      </div>

      <!-- Directory tree -->
      <div class="mt-6 rounded-xl border border-border bg-card p-6">
        <button
          class="mb-2 flex items-center gap-2 text-sm font-semibold"
          @click="showDirTree = !showDirTree"
        >
          <span :class="showDirTree ? 'rotate-90' : ''" class="transition-transform">▶</span>
          Project Structure
        </button>
        <pre
          v-if="showDirTree"
          class="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed text-muted-foreground"
        ><code>{{ dirTree }}</code></pre>
      </div>
    </LandingSection>
</template>