<script setup lang="ts">
import LandingSection from '@/components/shared/LandingSection.vue'
import { ref } from 'vue'
import { ChevronDownIcon } from '@lucide/vue'

const faqs = [
  {
    q: 'What is this starter for?',
    a: 'It is a production-ready SPA admin dashboard starter built with Laravel 13 and Vue 3. It provides authentication, role-based access control, media management, i18n, dark mode, and a modern component system — so you can skip the boilerplate and start building features immediately.',
  },
  {
    q: 'Do I need to pay for this?',
    a: 'No. This project is completely free and open-source under the MIT license. You can use it for personal projects, commercial applications, or anything else.',
  },
  {
    q: 'What database is used?',
    a: 'The default configuration uses SQLite for simplicity. You can easily switch to MySQL or PostgreSQL by updating the .env file.',
  },
  {
    q: 'Is TypeScript required?',
    a: 'Yes, the frontend is fully typed with TypeScript. This provides better IDE support, catch errors early, and improves code quality.',
  },
  {
    q: 'How do I deploy this?',
    a: 'The recommended way is Laravel Cloud, which is the fastest way to deploy and scale production Laravel applications. You can also deploy to any standard Laravel hosting platform.',
  },
  {
    q: 'Are tests included?',
    a: 'Yes! 73 Pest backend tests and 79 Playwright E2E tests are included, covering authentication flows, user CRUD, role/permission enforcement, avatar upload, navigation guards, i18n, and dark mode.',
  },
  {
    q: 'Can I customize the UI?',
    a: 'Absolutely. The project uses shadcn-vue components which are fully customizable. Each component is a local file you can modify directly. Tailwind CSS makes it easy to adjust the design system.',
  },
]

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <LandingSection>
    <div class="mx-auto max-w-3xl">
      <h2 class="mb-10 text-center text-3xl font-bold tracking-tight">FAQ</h2>

      <div class="divide-y divide-border rounded-xl border border-border">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="transition-colors"
        >
          <button
            class="flex w-full items-center justify-between gap-2 px-6 py-4 text-left text-sm font-medium transition-colors hover:bg-muted/50"
            @click="toggle(index)"
          >
            <span>{{ faq.q }}</span>
            <ChevronDownIcon
              :class="openIndex === index ? 'rotate-180' : ''"
              class="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
            />
          </button>
          <div
            v-if="openIndex === index"
            class="px-6 pb-4 text-sm text-muted-foreground leading-relaxed"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </div>
  </LandingSection>
</template>