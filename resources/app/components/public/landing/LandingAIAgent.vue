<script setup lang="ts">
</script>

<template>
  <section data-animate class="px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">
        🤖 AI Agent
      </h2>
      <p class="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
        This project is optimized for AI coding agents. It includes:
      </p>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- Laravel Boost -->
        <div class="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 text-2xl">🚀</div>
          <h3 class="mb-2 font-semibold">Laravel Boost</h3>
          <p class="text-sm text-muted-foreground">
            MCP server with 15+ tools for Laravel-aware AI assistance.
            Search docs, inspect schemas, run queries — all from your AI agent.
          </p>
        </div>

        <!-- OpenSpec -->
        <div class="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 text-2xl">📋</div>
          <h3 class="mb-2 font-semibold">OpenSpec</h3>
          <p class="text-sm text-muted-foreground">
            Spec-driven planning framework. Propose changes, design solutions,
            create specs, and implement with structured AI collaboration.
          </p>
        </div>

        <!-- Agent Skills -->
        <div class="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-3 text-2xl">🧠</div>
          <h3 class="mb-2 font-semibold">Agent Skills</h3>
          <p class="text-sm text-muted-foreground">
            Domain-specific instructions for Fortify, Pest, Vue components,
            Tailwind, SPA auth, and more — loaded automatically for each task.
          </p>
        </div>
      </div>

      <!-- Quick commands -->
      <div class="mt-6 rounded-xl border border-border bg-card p-6">
        <h3 class="mb-3 font-semibold">Quick Commands for AI Agents</h3>
        <pre class="overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground"><code># Propose a new feature
/openspec-propose &lt;change-name&gt;

# Implement planned tasks
/openspec-apply &lt;change-name&gt;

# Commit changes
/git-commit</code></pre>
      </div>
    </div>
  </section>
</template>
