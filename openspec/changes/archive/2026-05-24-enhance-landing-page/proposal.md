## Why

The current home page is a minimal placeholder lacking the professional polish and comprehensive information expected from a modern starter template landing page. A compelling landing page that mirrors the README.md structure with 10 key sections is essential for:
- Showcasing the complete tech stack and capabilities at a glance
- Communicating value proposition clearly to developers
- Providing quick start instructions and documentation access
- Highlighting AI agent readiness as a key differentiator
- Driving conversion through strategic CTAs and social proof
- SEO optimization for discoverability (meta tags, structured data, semantic HTML)

## What Changes

- Create `PublicNavbar` component with responsive mobile menu, SEO-optimized structure, **language switcher, and dark mode toggle**
- Create `PublicFooter` component with branding, **GitHub link only**, and renamed navigation columns
- Create `LandingLayout` wrapper for consistent public page structure with SEO meta injection
- Redesign `HomePage` with 10 engaging sections:
  1. **Hero Section** — Headline, subheadline, badges, primary/secondary CTAs
  2. **Tech Stack Section** — Backend/Frontend tables with logos and versions
  3. **Features Section** — Authentication, RBAC, Media, i18n, Dark Mode, Responsive cards
  4. **Why This Starter? Section** — Value props: skip boilerplate, production-ready, AI-optimized
  5. **Architecture Section** — SPA diagram, Service Layer pattern, directory structure
  6. **Testing Section** — Pest + Playwright coverage, commands, test matrix
  7. **AI Agent Ready Section** — Laravel Boost, OpenSpec, agent skills, MCP tools
  8. **Quick Start Section** — Prerequisites, installation, development commands, seeded accounts
  9. **FAQ Section** — Common questions with accordion interactions
  10. **CTA Footer Section** — Final conversion CTA with GitHub stars, documentation links
- Implement comprehensive SEO: meta tags, Open Graph, Twitter Cards, structured data (JSON-LD)
- Add supporting pages: Features (deep dive), About (team/mission)
- Implement scroll animations, theme-aware design, and mobile-first responsive breakpoints
- Use `APP_NAME` from `.env` (VITE_APP_NAME) for dynamic brand name
- Use dynamic copyright year (`new Date().getFullYear()`)

## Capabilities

### New Capabilities
- `public-navigation`: Navbar and footer with SEO optimization, mobile responsiveness, auth awareness
- `landing-page`: 10-section home page with hero, tech stack, features, architecture, testing, AI agent, quick start, FAQ, CTA
- `seo-optimization`: Meta tags, Open Graph, Twitter Cards, JSON-LD structured data, semantic HTML
- `public-pages`: Features and About pages with consistent layout and SEO

### Modified Capabilities
- (none)

## Impact

- New Vue components: `PublicNavbar`, `PublicFooter`, `LandingLayout`, `LandingHero`, `LandingTechStack`, `LandingFeatures`, `LandingWhy`, `LandingArchitecture`, `LandingTesting`, `LandingAIAgent`, `LandingQuickStart`, `LandingFAQ`, `LandingCTA`
- New composables: `useSeoMeta` for dynamic meta tag injection
- Modified: `HomePage.vue` (complete redesign), `App.vue` (SEO meta root)
- New Vue Router routes with meta fields for SEO
- i18n translations for all landing content (EN/ID)
- Tailwind CSS animations, transitions, and responsive utilities
- Lucide Vue Next icons throughout
- JSON-LD structured data for SoftwareApplication schema
- Mobile-responsive design with breakpoints (sm, md, lg, xl, 2xl)
