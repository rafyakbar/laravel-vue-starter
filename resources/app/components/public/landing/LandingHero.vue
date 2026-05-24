<script setup lang="ts">
</script>

<template>
  <section
    data-animate
    class="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8"
  >
    <!-- Background gradient -->
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--primary)/8%,transparent_60%)]"
    />

    <div class="mx-auto max-w-5xl text-center">
      <!-- Badges -->
      <div class="mb-6 flex flex-wrap items-center justify-center gap-2">
        <img
          src="https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square&logo=laravel"
          alt="Laravel 13"
        />
        <img
          src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js"
          alt="Vue 3"
        />
        <img
          src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript"
          alt="TypeScript"
        />
        <img
          src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss"
          alt="Tailwind 4"
        />
        <img
          src="https://img.shields.io/badge/Pest-4-F9322C?style=flat-square&logo=pest"
          alt="Pest 4"
        />
        <img
          src="https://img.shields.io/badge/Playwright-1.60-2EAD33?style=flat-square&logo=playwright"
          alt="Playwright"
        />
      </div>

      <h1
        class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
      >
        🚀 Laravel Vue Starter
      </h1>

      <p
        class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl"
      >
        A production-ready <strong class="text-foreground">SPA admin dashboard</strong> starter
        built with Laravel 13 and Vue 3. Provides authentication, role-based access control,
        media management, and a modern component system — so you can skip the boilerplate
        and start building features immediately.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href="#quick-start">
          <button
            class="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:translate-y-px"
          >
            Get Started
          </button>
        </a>
        <a
          href="https://github.com/rafyakbar/laravel-vue-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            class="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium transition-all hover:bg-muted active:translate-y-px"
          >
            View on GitHub
          </button>
        </a>
      </div>
    </div>
  </section>
</template>
