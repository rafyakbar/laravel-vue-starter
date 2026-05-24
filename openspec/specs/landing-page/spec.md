## ADDED Requirements

### Requirement: LandingHero displays compelling introduction
The system SHALL display a hero section with shield badges, headline, subheadline, primary/secondary CTAs, and optional hero image/screenshot.

#### Scenario: Hero badges display
- **WHEN** home page loads
- **THEN** hero shows 6 shield.io badges (Laravel 13, Vue 3, TypeScript, Tailwind 4, Pest 4, Playwright)

#### Scenario: Hero headline display
- **WHEN** home page loads
- **THEN** hero displays main headline "🚀 Laravel Vue Starter" and subtitle about production-ready SPA admin dashboard

#### Scenario: Hero primary CTA
- **WHEN** user clicks "Get Started" button
- **THEN** user is scrolled to Quick Start section or navigated to documentation

#### Scenario: Hero secondary CTA
- **WHEN** user clicks "View on GitHub" button
- **THEN** GitHub repository opens in new tab

### Requirement: LandingTechStack displays technology table
The system SHALL display backend and frontend technology tables with logos, names, versions, and purposes.

#### Scenario: Backend stack table
- **WHEN** user scrolls to Tech Stack section
- **THEN** table shows PHP 8.4, Laravel 13, Fortify, Sanctum, Spatie Permission, Spatie Media Library, Pest, Pint with icons and purposes

#### Scenario: Frontend stack table
- **WHEN** user scrolls to Tech Stack section
- **THEN** table shows Vue 3.5, TypeScript 5.9, Vite 8, Tailwind 4, shadcn-vue, Pinia 3, Vue Router 5, vee-validate, Playwright with icons and purposes

#### Scenario: Tech stack responsive layout
- **WHEN** viewport is mobile (< 768px)
- **THEN** backend and frontend tables stack vertically

### Requirement: LandingFeatures displays feature cards
The system SHALL display a grid of feature cards showcasing authentication, RBAC, media management, i18n, dark mode, and responsive design.

#### Scenario: Features grid display
- **WHEN** user scrolls to Features section
- **THEN** 6 feature cards are displayed in responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)

#### Scenario: Authentication feature card
- **WHEN** feature cards render
- **THEN** Auth card shows login with email/username, registration, password reset, email verification, rate limiting, API tokens

#### Scenario: RBAC feature card
- **WHEN** feature cards render
- **THEN** RBAC card shows 3-tier roles (Superadmin, Admin, User), 11 permissions, permission-filtered navigation

#### Scenario: Media feature card
- **WHEN** feature cards render
- **THEN** Media card shows avatar upload, Spatie Media Library, automatic image conversions (300px/600px/1200px)

#### Scenario: Feature card hover effect
- **WHEN** user hovers over feature card
- **THEN** card elevates with shadow and subtle scale animation (transform: translateY(-4px))

### Requirement: LandingWhy displays value propositions
The system SHALL display a "Why This Starter?" section with 3 value proposition cards.

#### Scenario: Value prop cards display
- **WHEN** user scrolls to Why section
- **THEN** 3 cards display: "Skip the Boilerplate", "Production-Ready", "AI-Optimized"

#### Scenario: Skip boilerplate card
- **WHEN** Why section renders
- **THEN** card explains developers can start building features immediately without setup

#### Scenario: Production-ready card
- **WHEN** Why section renders
- **THEN** card explains tested, secure, scalable foundation

#### Scenario: AI-optimized card
- **WHEN** Why section renders
- **THEN** card explains Laravel Boost MCP, OpenSpec, agent skills, MCP tools for AI coding

### Requirement: LandingArchitecture displays system architecture
The system SHALL display architecture section with SPA diagram, Service Layer pattern explanation, and directory structure.

#### Scenario: SPA architecture explanation
- **WHEN** user scrolls to Architecture section
- **THEN** section explains Laravel serves single Blade view + JSON API, Vue handles all UI rendering and routing

#### Scenario: Service Layer pattern
- **WHEN** Architecture section renders
- **THEN** diagram shows Controller → Service → Model flow

#### Scenario: Directory structure display
- **WHEN** Architecture section renders
- **THEN** collapsible code block shows project structure (app/, resources/app/, tests/, openspec/)

### Requirement: LandingTesting displays testing capabilities
The system SHALL display Testing section with Pest backend tests, Playwright E2E tests, commands, and test coverage matrix.

#### Scenario: Pest tests display
- **WHEN** user scrolls to Testing section
- **THEN** section shows 73 backend tests, commands (php artisan test --compact), coverage areas (auth, user CRUD, authorization, avatar upload)

#### Scenario: Playwright tests display
- **WHEN** user scrolls to Testing section
- **THEN** section shows 79 E2E tests, commands (npm run test:e2e), test projects (guest, auth, user, admin, superadmin)

#### Scenario: Test matrix display
- **WHEN** Testing section renders
- **THEN** table shows 5 test projects with scope and auth state

### Requirement: LandingAIAgent displays AI readiness
The system SHALL display AI Agent Ready section with Laravel Boost, OpenSpec, agent skills, and MCP tools information.

#### Scenario: Laravel Boost display
- **WHEN** user scrolls to AI Agent section
- **THEN** section explains 15+ MCP tools for Laravel-aware AI assistance

#### Scenario: OpenSpec display
- **WHEN** AI Agent section renders
- **THEN** section explains spec-driven planning framework with /openspec-propose and /openspec-apply commands

#### Scenario: Agent skills display
- **WHEN** AI Agent section renders
- **THEN** section lists skills: Fortify, Pest, Vue components, Tailwind, SPA auth, etc.

### Requirement: LandingQuickStart displays setup instructions
The system SHALL display Quick Start section with prerequisites, installation steps, development commands, and seeded accounts table.

#### Scenario: Prerequisites display
- **WHEN** user scrolls to Quick Start section
- **THEN** section lists PHP 8.3+, Composer 2.x, Node.js 20+, SQLite/MySQL/PostgreSQL

#### Scenario: Installation commands
- **WHEN** Quick Start section renders
- **THEN** code blocks show git clone, composer setup (or step-by-step: composer install, php artisan key:generate, migrate --seed, npm install, npm run build)

#### Scenario: Development commands
- **WHEN** Quick Start section renders
- **THEN** code block shows composer run dev with explanation of concurrent services (serve, queue:listen, npm dev)

#### Scenario: Seeded accounts table
- **WHEN** Quick Start section renders
- **THEN** table shows 3 accounts: Superadmin (superadmin/123123), Admin (admin/123123), User (20 random)

### Requirement: LandingFAQ displays common questions
The system SHALL display FAQ section with accordion-style questions and answers.

#### Scenario: FAQ accordion display
- **WHEN** user scrolls to FAQ section
- **THEN** 5-8 questions are displayed with chevron icons

#### Scenario: FAQ item expand
- **WHEN** user clicks FAQ question
- **THEN** answer expands with smooth animation, chevron rotates 180°

#### Scenario: FAQ item collapse
- **WHEN** user clicks expanded question
- **THEN** answer collapses, chevron rotates back

### Requirement: LandingCTA displays final call-to-action
The system SHALL display final CTA section with headline, description, GitHub stars badge, documentation links, and action buttons.

#### Scenario: CTA content display
- **WHEN** user scrolls to CTA section
- **THEN** section shows "Ready to Get Started?" headline, description, GitHub stars badge, Get Started button, Documentation button

#### Scenario: GitHub stars badge
- **WHEN** CTA section renders
- **THEN** dynamic Shields.io badge shows current GitHub stars count

#### Scenario: CTA button actions
- **WHEN** user clicks Get Started button
- **THEN** user is navigated to Quick Start section or documentation

### Requirement: LandingPage scroll animations
The system SHALL apply scroll-triggered animations to landing page sections.

#### Scenario: Section fade-in animation
- **WHEN** user scrolls and section enters viewport (10% visible)
- **THEN** section fades in with slide-up animation (0.7s ease-out)

#### Scenario: Reduced motion preference
- **WHEN** user has prefers-reduced-motion enabled
- **THEN** scroll animations are disabled, sections appear instantly

### Requirement: LandingPage theme awareness
The system SHALL adapt landing page sections based on current theme.

#### Scenario: Light mode sections
- **WHEN** theme is light mode
- **THEN** sections use light color palette (background, foreground, muted, etc.)

#### Scenario: Dark mode sections
- **WHEN** theme is dark mode
- **THEN** sections use dark color palette with appropriate contrast

### Requirement: LandingPage responsive design
The system SHALL apply mobile-first responsive design throughout landing page.

#### Scenario: Mobile layout (< 768px)
- **WHEN** viewport is mobile
- **THEN** all sections use single-column layout with appropriate padding

#### Scenario: Tablet layout (≥ 768px)
- **WHEN** viewport is tablet
- **THEN** grids use 2 columns, navbar shows desktop navigation

#### Scenario: Desktop layout (≥ 1024px)
- **WHEN** viewport is desktop
- **THEN** grids use 3 columns, full navigation visible
