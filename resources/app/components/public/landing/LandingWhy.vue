<script setup lang="ts">
import LandingSection from '@/components/shared/LandingSection.vue'
</script>

<template>
  <LandingSection>
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Why This Starter?</h2>

      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
            ⏱️
          </div>
          <h3 class="mb-2 font-semibold">Skip the Boilerplate</h3>
          <p class="text-sm text-muted-foreground">
            Authentication, RBAC, media management, and i18n already set up. Start
            building your features immediately instead of configuring infrastructure.
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
            🏭
          </div>
          <h3 class="mb-2 font-semibold">Production-Ready</h3>
          <p class="text-sm text-muted-foreground">
            Tested with 73 Pest tests and 79 Playwright E2E tests. Rate-limited auth,
            permission guards, secure defaults — built for production from day one.
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
            🤖
          </div>
          <h3 class="mb-2 font-semibold">AI-Optimized</h3>
          <p class="text-sm text-muted-foreground">
            Laravel Boost MCP server, OpenSpec spec-driven planning, agent skills for
            every domain — designed from the ground up for AI pair programming.
          </p>
        </div>
      </div>
    </LandingSection>
</template>