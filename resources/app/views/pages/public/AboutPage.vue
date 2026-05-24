<script setup lang="ts">
import LandingLayout from '@/views/layouts/LandingLayout.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

useSeoMeta({
  title: 'About - Laravel Vue Starter',
  description:
    'Built for developers who want to ship faster. Our mission is to eliminate boilerplate setup so you can focus on building features that matter.',
})
</script>

<template>
  <LandingLayout>
    <section class="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <h1 class="text-center text-4xl font-bold tracking-tight">About</h1>
        <p class="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Built for developers who want to ship faster.
        </p>

        <div class="mt-12 space-y-10">
          <div class="rounded-xl border border-border bg-card p-8">
            <h2 class="mb-3 text-xl font-semibold">Our Mission</h2>
            <p class="text-muted-foreground leading-relaxed">
              To eliminate the boilerplate setup that plagues every new project.
              Authentication, authorization, media management, internationalization,
              and theming should not require months of setup. We provide a
              production-ready foundation so you can focus on building features
              that matter.
            </p>
          </div>

          <div>
            <h2 class="mb-6 text-center text-xl font-semibold">Values</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-border bg-card p-6 text-center">
                <div class="mb-2 text-2xl">💻</div>
                <h3 class="font-semibold">Developer Experience</h3>
                <p class="mt-1 text-sm text-muted-foreground">Clean code, TypeScript, modern tooling. A joy to work with.</p>
              </div>
              <div class="rounded-xl border border-border bg-card p-6 text-center">
                <div class="mb-2 text-2xl">✅</div>
                <h3 class="font-semibold">Code Quality</h3>
                <p class="mt-1 text-sm text-muted-foreground">73 backend tests, 79 E2E tests, strict type checking.</p>
              </div>
              <div class="rounded-xl border border-border bg-card p-6 text-center">
                <div class="mb-2 text-2xl">🤖</div>
                <h3 class="font-semibold">AI-First</h3>
                <p class="mt-1 text-sm text-muted-foreground">Optimized for AI pair programming with MCP, OpenSpec, and skills.</p>
              </div>
              <div class="rounded-xl border border-border bg-card p-6 text-center">
                <div class="mb-2 text-2xl">🔓</div>
                <h3 class="font-semibold">Open Source</h3>
                <p class="mt-1 text-sm text-muted-foreground">MIT licensed. Free for personal and commercial use.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </LandingLayout>
</template>
