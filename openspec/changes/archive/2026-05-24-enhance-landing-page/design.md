## Context

The current `HomePage.vue` is a minimal placeholder with just text and buttons using `DefaultLayout` (blank wrapper). The README.md contains comprehensive information about the starter template (277 lines with 10 major sections), but this content is not accessible on the landing page. Developers visiting the site need immediate access to:
- Tech stack overview
- Feature highlights
- Quick start instructions
- Architecture documentation
- Testing capabilities
- AI agent readiness

Additionally, SEO is critical for discoverability but currently missing (no meta tags, Open Graph, structured data).

## Goals / Non-Goals

**Goals:**
- Create `PublicNavbar` with responsive mobile menu (Sheet), auth awareness, SEO-optimized semantic HTML
- Create `PublicFooter` with branding, navigation, social links, copyright
- Create `LandingLayout` with SEO meta injection capability
- Redesign `HomePage` with exactly 10 sections matching README.md structure:
  1. Hero (badges, headline, CTAs)
  2. Tech Stack (backend/frontend tables)
  3. Features (6 feature cards: Auth, RBAC, Media, i18n, Dark Mode, Responsive)
  4. Why This Starter? (3 value props)
  5. Architecture (SPA diagram, directory tree)
  6. Testing (Pest + Playwright commands, coverage matrix)
  7. AI Agent Ready (Laravel Boost, OpenSpec, skills)
  8. Quick Start (prerequisites, install, dev commands, seeded accounts table)
  9. FAQ (accordion with 5-8 common questions)
  10. CTA Footer (final conversion + GitHub stars)
- Implement comprehensive SEO: meta title/description, Open Graph, Twitter Cards, JSON-LD SoftwareApplication schema
- Add supporting pages: Features (deep dive), About
- Mobile-first responsive design with Tailwind breakpoints
- Dark mode compatible throughout
- Scroll animations with Intersection Observer
- i18n ready (EN/ID content in translation files)

**Non-Goals:**
- Backend API changes (all content static/frontend-driven)
- Blog or documentation site (link to README/docs instead)
- Multi-language beyond i18n structure (content in EN/ID only)
- E2E tests for public pages (future change)

## Decisions

### 1. SEO Meta Tag Strategy
**Decision:** Create `useSeoMeta` composable for dynamic meta tag injection using Vue Router navigation guards + component-level meta.

**Implementation:**
```typescript
// composables/useSeoMeta.ts
export function useSeoMeta(options: SeoMetaOptions) {
  const router = useRouter()
  
  router.beforeEach((to) => {
    if (to.meta.seo) {
      updateMetaTags(to.meta.seo)
    }
  })
}

// Component usage
defineOptions({
  meta: {
    seo: {
      title: 'Laravel Vue Starter - Production-Ready SPA Admin Dashboard',
      description: 'Skip the boilerplate. Laravel 13 + Vue 3 + TypeScript + Tailwind + Pest + Playwright.',
    }
  }
})
```

**Rationale:**
- Centralized SEO management
- Per-page meta customization
- Integrates with Vue Router lifecycle
- Follows Vue 3 composition API patterns

**Alternatives considered:**
- `@vueuse/head` → Rejected: adds dependency, overkill for simple meta tags
- Hardcoded meta in index.html → Rejected: not dynamic per route

### 2. JSON-LD Structured Data
**Decision:** Inject JSON-LD SoftwareApplication schema in `App.vue` head.

**Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Laravel Vue Starter",
  "description": "Production-ready SPA admin dashboard starter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Cross-platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "codeRepository": "https://github.com/your-username/laravel-vue-starter",
  "license": "https://opensource.org/licenses/MIT"
}
```

**Rationale:**
- Improves Google search understanding
- Enables rich snippets in search results
- Free SEO boost with minimal effort

### 3. Navbar Mobile Menu
**Decision:** Use shadcn-vue `Sheet` component for mobile drawer.

**Rationale:**
- Accessible (focus trap, escape key, overlay)
- Consistent with admin sidebar pattern
- No additional dependencies

### 4. Section Componentization
**Decision:** Create separate component for each of 10 landing sections.

**Components:**
- `LandingHero.vue` — Hero with badges, headline, subhead, CTAs
- `LandingTechStack.vue` — Backend/Frontend tables with logos
- `LandingFeatures.vue` — 6 feature cards grid
- `LandingWhy.vue` — 3 value proposition cards
- `LandingArchitecture.vue` — SPA diagram + directory tree
- `LandingTesting.vue` — Pest + Playwright commands, matrix table
- `LandingAIAgent.vue` — Laravel Boost, OpenSpec, skills cards
- `LandingQuickStart.vue` — Prerequisites, install steps, commands, accounts table
- `LandingFAQ.vue` — Accordion with common questions
- `LandingCTA.vue` — Final CTA with GitHub stars

**Rationale:**
- Modular and maintainable
- Easy to reorder sections
- Can reuse on Features/About pages
- Better code organization

### 5. Icon Strategy
**Decision:** Use Lucide Vue Next icons + Shields.io badges for tech stack.

**Icons:**
- `Menu`, `X` — Mobile menu
- `Check`, `CheckCircle2` — Features
- `Star` — Testimonials/ratings
- `ArrowRight` — CTAs
- `Github`, `Twitter`, `Linkedin` — Social
- `Zap`, `Shield`, `Users`, `BarChart3`, `Database`, `Palette` — Features
- `ChevronDown` — FAQ accordion

**Tech Stack Badges:**
- Use Shields.io for Laravel, Vue, TypeScript, Tailwind, Pest, Playwright badges
- Consistent with README.md styling

### 6. Scroll Animations
**Decision:** Create `useScrollAnimation` composable with Intersection Observer.

**Implementation:**
```typescript
export function useScrollAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
        }
      })
    },
    { threshold: 0.1 }
  )
}
```

**CSS:**
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.7s ease-out forwards;
}
```

**Rationale:**
- No external animation library needed
- Performance-friendly (native Intersection Observer)
- Respects `prefers-reduced-motion`

### 7. Content Management
**Decision:** Store all landing content in i18n translation files (`locales/en.ts`, `locales/id.ts`).

**Structure:**
```typescript
export default {
  landing: {
    hero: {
      title: 'Production-Ready SPA Starter',
      subtitle: 'Skip the boilerplate...',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'View on GitHub'
    },
    techStack: { ... },
    features: { ... },
    // ... all 10 sections
  }
}
```

**Rationale:**
- Easy content updates without touching components
- Multi-language ready (EN/ID)
- Clean separation of content and presentation
- Follows existing i18n pattern

### 8. Responsive Breakpoints
**Decision:** Use Tailwind v4 breakpoints consistently.

**Breakpoints:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

**Mobile Menu:** `< md` (768px)
**Grid Columns:**
- Mobile: 1 column
- Tablet (`md`): 2 columns
- Desktop (`lg`): 3 columns

### 9. Color Palette
**Decision:** Use shadcn-vue design tokens (CSS variables) for theme awareness.

**Key Variables:**
- `--background`, `--foreground` — Base colors
- `--primary`, `--primary-foreground` — CTA buttons
- `--muted`, `--muted-foreground` — Secondary text
- `--border` — Dividers
- `--accent`, `--accent-foreground` — Hover states

**Rationale:**
- Automatic dark mode support
- Consistent with admin panel
- Easy theme customization

## File Structure

```
resources/app/
├── components/
│   ├── public/
│   │   ├── PublicNavbar.vue
│   │   ├── PublicFooter.vue
│   │   └── landing/
│   │       ├── LandingHero.vue
│   │       ├── LandingTechStack.vue
│   │       ├── LandingFeatures.vue
│   │       ├── LandingWhy.vue
│   │       ├── LandingArchitecture.vue
│   │       ├── LandingTesting.vue
│   │       ├── LandingAIAgent.vue
│   │       ├── LandingQuickStart.vue
│   │       ├── LandingFAQ.vue
│   │       └── LandingCTA.vue
├── composables/
│   ├── useSeoMeta.ts
│   └── useScrollAnimation.ts
├── views/
│   ├── layouts/
│   │   └── LandingLayout.vue
│   └── pages/
│       ├── HomePage.vue (redesigned with 10 sections)
│       ├── FeaturesPage.vue
│       └── AboutPage.vue
├── locales/
│   ├── en.ts (updated with landing.* keys)
│   └── id.ts (updated with landing.* keys)
└── router/
    └── index.ts (updated with public routes + meta)
```

## Vue Router Configuration

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomePage,
    name: 'home',
    meta: {
      layout: 'landing',
      seo: {
        title: 'Laravel Vue Starter - Production-Ready SPA Admin Dashboard',
        description: 'Skip the boilerplate. Laravel 13 + Vue 3 + TypeScript + Tailwind + Pest + Playwright.',
        canonical: 'https://your-domain.com/'
      }
    }
  },
  {
    path: '/features',
    component: FeaturesPage,
    name: 'features',
    meta: {
      layout: 'landing',
      seo: {
        title: 'Features - Laravel Vue Starter',
        description: 'Authentication, RBAC, Media Library, i18n, Dark Mode, Responsive Design.'
      }
    }
  },
  {
    path: '/about',
    component: AboutPage,
    name: 'about',
    meta: {
      layout: 'landing',
      seo: {
        title: 'About - Laravel Vue Starter',
        description: 'Built for developers who want to ship faster.'
      }
    }
  },
]
```

## Tailwind Animation Classes

Add to `app.css`:

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: fade-in-up 0.7s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-fade-in {
    animation: none;
    opacity: 1;
  }
}
```

## SEO Meta Tags

**Standard Meta:**
- `<title>` — Page title (50-60 chars)
- `<meta name="description">` — Description (150-160 chars)
- `<link rel="canonical">` — Canonical URL
- `<meta name="robots">` — Index, follow

**Open Graph:**
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta property="og:type" content="website">`
- `<meta property="og:url">`
- `<meta property="og:image">` — 1200x630px social share image

**Twitter Cards:**
- `<meta name="twitter:card" content="summary_large_image">`
- `<meta name="twitter:title">`
- `<meta name="twitter:description">`
- `<meta name="twitter:image">`

## Risks / Trade-offs

**[Risk]** Too many sections make page feel long and overwhelming.
**Mitigation:** Use visual hierarchy, section dividers, table of contents with jump links, keep content concise.

**[Risk]** SEO meta tags might not update on client-side navigation.
**Mitigation:** Use Vue Router navigation guards + `useHead` pattern to update meta on route change.

**[Risk]** Mobile menu Sheet conflicts with existing Sheet imports.
**Mitigation:** Import directly from `@/components/ui/sheet`, use unique component names.

**[Risk]** Landing content hardcoded becomes hard to maintain.
**Mitigation:** Store all content in i18n translation files (already planned).

**[Risk]** Scroll animations cause performance issues.
**Mitigation:** Use `will-change` CSS, respect `prefers-reduced-motion`, throttle Intersection Observer.

**[Trade-off]** Static content vs CMS-driven.
**Decision:** Static for now (faster, simpler, no backend). Can add CMS later if needed.

**[Trade-off]** Custom animations vs animation library.
**Decision:** Custom Tailwind animations (lighter bundle, no dependencies).

## Open Questions

1. **GitHub stars badge:** Use dynamic badge from Shields.io or static?
   - **Decision:** Dynamic Shields.io badge: `https://img.shields.io/github/stars/rafyakbar/laravel-vue-starter`

3. **FAQ content:** How many questions?
   - **Decision:** Start with 5-8 most common questions from README/issues.

4. **Hero image/illustration:** Use custom illustration or screenshot?
   - **Decision:** Screenshot of admin dashboard + code snippet visual.
