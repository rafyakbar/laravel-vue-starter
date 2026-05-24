<script setup lang="ts">
import { onMounted } from 'vue'
import LandingLayout from '@/views/layouts/LandingLayout.vue'
import LandingHero from '@/components/public/landing/LandingHero.vue'
import LandingTechStack from '@/components/public/landing/LandingTechStack.vue'
import LandingFeatures from '@/components/public/landing/LandingFeatures.vue'
import LandingWhy from '@/components/public/landing/LandingWhy.vue'
import LandingArchitecture from '@/components/public/landing/LandingArchitecture.vue'
import LandingTesting from '@/components/public/landing/LandingTesting.vue'
import LandingAIAgent from '@/components/public/landing/LandingAIAgent.vue'
import LandingQuickStart from '@/components/public/landing/LandingQuickStart.vue'
import LandingFAQ from '@/components/public/landing/LandingFAQ.vue'
import LandingCTA from '@/components/public/landing/LandingCTA.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useJsonLd } from '@/composables/useJsonLd'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()

useSeoMeta({
  title: 'Laravel Vue Starter - Production-Ready SPA Admin Dashboard',
  description:
    'A production-ready SPA admin dashboard starter built with Laravel 13 and Vue 3. Provides authentication, role-based access control, media management, and a modern component system.',
})

const { injectSoftwareSchema, injectBreadcrumbSchema } = useJsonLd()

onMounted(() => {
  injectSoftwareSchema()
  injectBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ])
})
</script>

<template>
  <LandingLayout>
    <LandingHero />
    <LandingTechStack />
    <LandingFeatures />
    <LandingWhy />
    <LandingArchitecture />
    <LandingTesting />
    <LandingAIAgent />
    <LandingQuickStart />
    <LandingFAQ />
    <LandingCTA />
  </LandingLayout>
</template>
