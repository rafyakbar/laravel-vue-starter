<script setup lang="ts">
</script>

<template>
  <section data-animate class="px-4 py-20 sm:px-6 lg:px-8">
    <div
      class="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-10 text-center shadow-lg sm:p-14"
    >
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--primary)/8%,transparent_60%)]"
      />

      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to Get Started?
      </h2>
      <p class="mx-auto mt-3 max-w-lg text-muted-foreground">
        Clone the repository and have a full-featured admin panel running in minutes.
        Skip the boilerplate and start building your features today.
      </p>

      <!-- GitHub stars badge -->
      <div class="mt-6 flex items-center justify-center">
        <img
          src="https://img.shields.io/github/stars/rafyakbar/laravel-vue-starter?style=for-the-badge&logo=github&color=181717"
          alt="GitHub stars"
          class="h-7"
        />
      </div>

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
            Documentation
          </button>
        </a>
      </div>
    </div>
  </section>
</template>
