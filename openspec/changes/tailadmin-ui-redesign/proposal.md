## Why

The current admin UI uses the default shadcn-vue design tokens (neutral grayscale primary, Geist font, generic card styling) and plain centered-card auth pages. The project has a documented UI guide (`docs/project/references/010_ui_guide.md`) based on **TailAdmin** — a modern SaaS admin aesthetic with an indigo brand color, Outfit font, and distinct visual patterns. The UI as-is does not match this guide, creating a gap between documentation and implementation.

## What Changes

- **CSS design tokens** — Remap shadcn-vue CSS vars (`--primary`, `--background`, `--card`, `--border`, etc.) to TailAdmin values. Add `--color-brand-*` palette, `--color-success/error/warning-*` semantic colors, `shadow-theme-*` tokens, and custom text-size tokens (`text-theme-sm`, `text-theme-xs`).
- **Font** — Switch from Geist Variable to **Outfit** (Google Fonts, weights 100–900).
- **Sidebar colors** — Remap `--sidebar-*` vars so the sidebar is `bg-white` (light) / `bg-black` (dark) with brand-colored active nav items, while keeping all existing shadcn-vue Sidebar component logic (collapsible, permission-based, dropdown on icon-collapsed) intact.
- **AdminHeader** — Increase height to `h-16`, tighten border color to match TailAdmin spec, ensure sticky positioning is consistent.
- **AdminLayout** — Update main content container to use `max-w-[1536px] mx-auto p-4 md:p-6` grid pattern.
- **Auth pages (Login, Register, ForgotPassword, ResetPassword, TwoFactorChallenge)** — Replace the current `Card` centered on `DefaultLayout` with a **split 50/50 layout**: left column = form, right column = brand panel (hidden on mobile). No changes to auth logic or API calls.
- **BasicPage component** — Update page title typography to match TailAdmin heading style (`text-xl font-semibold text-gray-800 dark:text-white/90`).

No backend changes. No dependency additions. No changes to auth logic, routing, stores, or API services.

## Capabilities

### New Capabilities

- `tailadmin-design-tokens`: CSS design token system aligned to TailAdmin — brand color palette, semantic colors, shadow tokens, custom text-size tokens, Outfit font, and remapped shadcn-vue vars.
- `tailadmin-admin-layout`: AdminLayout, AdminHeader, AdminSidebar, and BasicPage restyled to TailAdmin visual patterns while keeping all existing functionality (collapsible sidebar, permission-based nav, dark/light/system theme switching).
- `tailadmin-auth-pages`: All five auth pages converted from Card-centered layout to TailAdmin split 50/50 layout (form + brand panel).

### Modified Capabilities

*(none — no spec-level behavior changes)*

## Impact

**Files modified:**
- `resources/app/assets/css/app.css` — Primary token and font changes
- `resources/views/app.blade.php` — Add Outfit font `<link>` preconnect
- `resources/app/views/layouts/AdminLayout.vue` — Container/padding adjustment
- `resources/app/components/admin/AdminHeader.vue` — Height and border classes
- `resources/app/components/admin/AdminSidebar.vue` — Nav item active/inactive class overrides
- `resources/app/components/shared/BasicPage.vue` — Page title typography
- `resources/app/views/pages/auth/LoginPage.vue` — Split layout
- `resources/app/views/pages/auth/RegisterPage.vue` — Split layout
- `resources/app/views/pages/auth/ForgotPasswordPage.vue` — Split layout
- `resources/app/views/pages/auth/ResetPasswordPage.vue` — Split layout
- `resources/app/views/pages/auth/TwoFactorChallengePage.vue` — Split layout

**No new npm/composer packages required.**
**No API, database, or backend changes.**
**Dark/Light/System theme switching remains fully functional.**

**Playwright E2E impact:**
The project has E2E tests in `tests/e2e/`. Most tests use semantic selectors (role, label, text) and `data-slot`/`data-sidebar` attributes from shadcn-vue — these are unaffected. One test requires a text fix:
- `tests/e2e/tests/auth/forgot-password.spec.ts` line 22 expects `getByRole('link', { name: 'Back to sign in' })`. The new split layout's back-navigation link text must match this exactly: **"Back to sign in"** (not "Back to home"). This is the only E2E test that requires a coordinated change between the implementation and the test file.
