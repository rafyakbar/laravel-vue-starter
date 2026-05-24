## 1. Fixes Based on User Feedback

- [x] 1.1 Remove Contact page (delete file, remove route, remove nav/footer links, remove i18n)
- [x] 1.2 Fix footer: rename "Product" → "Links", "Company" → "More"
- [x] 1.3 Fix footer: remove Twitter icon, update GitHub URL to rafyakbar/laravel-vue-starter
- [x] 1.4 Fix footer: remove contact link from footer columns
- [x] 1.5 Add language switcher (AdminLanguageMenu pattern) to PublicNavbar
- [x] 1.6 Add dark mode toggle (AdminThemeMenu pattern) to PublicNavbar
- [x] 1.7 Use APP_NAME from VITE_APP_NAME env variable instead of hardcoded
- [x] 1.8 Remove contact nav link from PublicNavbar
- [x] 1.9 Update i18n keys: remove contact, rename footer sections
- [x] 1.10 Fix circular dependency: router eager-imports HomePage → auth store → router
- [x] 1.11 Make home route lazy-loaded to break the import cycle
- [x] 1.12 Build verification (npm run build + php artisan test)

## 2. Project Structure

- [x] 2.1 Create component directories
- [x] 2.2 Create composables directory

## 3. SEO Foundation

- [x] 3.1 Create useSeoMeta composable
- [x] 3.2 Add Open Graph + Twitter Card support
- [x] 3.3 Create useJsonLd composable
- [x] 3.4 Add SEO meta to router config

## 4. Navigation Components

- [x] 4.1 Create PublicNavbar with desktop/mobile nav
- [x] 4.2 Add auth-aware buttons (Login/Register vs Profile/Logout/Admin)
- [x] 4.3 Add language switcher dropdown
- [x] 4.4 Add dark mode toggle dropdown
- [x] 4.5 Add scroll-aware background transition
- [x] 4.6 Create PublicFooter with GitHub link only
- [x] 4.7 Add dynamic copyright year
- [x] 4.8 Use APP_NAME from env variable

## 5. Landing Sections

- [x] 5.1 Create LandingLayout
- [x] 5.2 Create LandingHero (badges, headline, CTAs)
- [x] 5.3 Create LandingTechStack (backend/frontend tables)
- [x] 5.4 Create LandingFeatures (6 feature cards)
- [x] 5.5 Create LandingWhy (3 value props)
- [x] 5.6 Create LandingArchitecture (SPA + directory)
- [x] 5.7 Create LandingTesting (Pest + Playwright)
- [x] 5.8 Create LandingAIAgent (Boost, OpenSpec, skills)
- [x] 5.9 Create LandingQuickStart (prereqs, install, accounts)
- [x] 5.10 Create LandingFAQ (7 accordion questions)
- [x] 5.11 Create LandingCTA (final CTA with GitHub stars)

## 6. Pages and Routing

- [x] 6.1 Redesign HomePage with all 10 sections
- [x] 6.2 Create FeaturesPage
- [x] 6.3 Create AboutPage
- [x] 6.4 Configure Vue Router with public routes

## 7. i18n and Styling

- [x] 7.1 Update en.ts with landing/footer translations
- [x] 7.2 Update id.ts with landing/footer translations
- [x] 7.3 Add CSS animations to app.css
- [x] 7.4 Build verification
