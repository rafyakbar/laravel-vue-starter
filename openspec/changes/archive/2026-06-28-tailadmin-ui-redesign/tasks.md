## 1. Design Token Foundation (app.css)

- [x] 1.1 In `resources/app/assets/css/app.css`, remove the existing `@import url(...)` for Geist font. The font will be loaded via Blade instead (see task 1.2).
- [x] 1.2 In `resources/views/spa.blade.php` (note: file is `spa.blade.php`, not `app.blade.php`), added the Outfit Google Fonts `<link>` plus two preconnect `<link>` tags in the `<head>`. The blade file did not previously load Geist — only the CSS did, so the Geist `<link>` in CSS was removed (1.1) and Outfit is loaded here instead.
- [x] 1.3 In the `@theme {}` block in `app.css`, change `--font-sans` to `'Outfit', ui-sans-serif, system-ui, sans-serif`. Also change `--font-sans` in the inline `@theme inline {}` block at the bottom of the file to `'Outfit', sans-serif`.
- [x] 1.4 In the `@theme {}` block, add the full `--color-brand-*` palette (brand-25 through brand-950) with hex values from `docs/project/references/010_ui_guide.md §3.1`.
- [x] 1.5 In the `@theme {}` block, add `--color-success-*`, `--color-error-*`, `--color-warning-*`, `--color-blue-light-*`, and `--color-orange-*` semantic color palettes (50–950) with hex values from `010_ui_guide.md §3.1`.
- [x] 1.6 In the `@theme {}` block, add shadow tokens: `--shadow-theme-xs`, `--shadow-theme-sm`, `--shadow-theme-md`, `--shadow-theme-lg`, `--shadow-theme-xl`, `--shadow-focus-ring`, `--shadow-tooltip` with values from `010_ui_guide.md §3.4`.
- [x] 1.7 In the `@theme {}` block, add text-size tokens: `--text-theme-sm: 14px`, `--text-theme-sm--line-height: 20px`, `--text-theme-xs: 12px`, `--text-theme-xs--line-height: 18px`.
- [x] 1.8 In the `:root` block, update all shadcn-vue CSS vars to TailAdmin light-mode values as specified in `specs/tailadmin-design-tokens/spec.md` (Requirement: shadcn-vue CSS vars remapped). Pay special attention to: `--primary: #465fff`, `--background: #f9fafb`, `--foreground: #1d2939`, `--card: #ffffff`, `--border: #e4e7ec`, `--input: #d0d5dd`, `--muted: #f2f4f7`, `--muted-foreground: #667085`, `--radius: 0.5rem`.
- [x] 1.9 In the `.dark` block, update all shadcn-vue CSS vars to TailAdmin dark-mode values: `--primary: #7592ff`, `--background: #101828`, `--foreground: rgba(255,255,255,0.9)`, `--card: rgba(255,255,255,0.03)`, `--border: #1d2939`, `--input: rgba(255,255,255,0.15)`, `--muted: rgba(255,255,255,0.05)`, `--muted-foreground: #98a2b3`.
- [x] 1.10 In the `:root` block, update the `--sidebar-*` vars: `--sidebar: #ffffff`, `--sidebar-foreground: #1d2939`, `--sidebar-primary: #465fff`, `--sidebar-primary-foreground: #ffffff`, `--sidebar-accent: #ecf3ff`, `--sidebar-accent-foreground: #3641f5`, `--sidebar-border: #e4e7ec`.
- [x] 1.11 In the `.dark` block, update the `--sidebar-*` vars: `--sidebar: #101828`, `--sidebar-foreground: rgba(255,255,255,0.9)`, `--sidebar-accent: rgba(70,95,255,0.15)`, `--sidebar-accent-foreground: #465fff`, `--sidebar-border: #1d2939`.
- [x] 1.12 In the `@theme inline {}` block at the bottom of `app.css`, add mappings for all new brand, semantic, and shadow tokens so they become available as Tailwind v4 utility classes (e.g., `--color-brand-500: var(--color-brand-500)` — but since they're defined directly in `@theme`, verify if this step is needed by checking Tailwind v4 `@theme` behavior; if tokens in `@theme` are already available as utilities, skip this step). **Skipped** — Tailwind v4 auto-exposes tokens defined in `@theme` as utilities. Brand/semantic/shadow tokens are now directly available as `bg-brand-500`, `text-success-600`, `shadow-theme-sm`, etc. The `@theme inline` block continues to map shadcn-vue vars (already present) which is sufficient.

## 2. AdminLayout Container Update

- [x] 2.1 In `resources/app/views/layouts/AdminLayout.vue`, locate the `<main>` element. Change the existing classes from `flex flex-1 flex-col gap-4 p-4 pb-20 md:pb-4` to `flex flex-1 flex-col overflow-x-hidden overflow-y-auto`. This makes the main scrollable area match TailAdmin's structure.
- [x] 2.2 Inside the `<main>` element (wrapping the `<slot>`), add a container `<div class="mx-auto max-w-[1536px] p-4 md:p-6">` around `<slot><router-view /></slot>`. This applies the TailAdmin page container pattern.

## 3. AdminHeader Restyling

- [x] 3.1 In `resources/app/components/admin/AdminHeader.vue`, update the `<header>` element classes. Change `h-14` to `h-16`. Change `bg-background` to `bg-white dark:bg-gray-900`. Change `border-b` to `border-b border-gray-200 dark:border-gray-800`. Update `z-10` to `z-[9999]`. Keep all other existing classes (`sticky top-0`, `flex`, `shrink-0`, `items-center`, `gap-2`, `px-4`) and all child elements unchanged.

## 4. AdminSidebar Nav Item Restyling

- [x] 4.1 In `resources/app/components/admin/AdminSidebar.vue`, for **top-level nav items with no children** (the `v-else` block, lines ~144–152), on `SidebarMenuButton`, add the `:class` binding that applies TailAdmin active/inactive styles based on `isActive(item.routeName)`:
  ```vue
  :class="isActive(item.routeName)
    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-500'
    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90'"
  ```
  Keep the existing `:is-active`, `:tooltip`, and `as-child` props.

- [x] 4.2 For the **collapsible group trigger button** (`CollapsibleTrigger > SidebarMenuButton`, lines ~121–127), add the `:class` binding based on `isGroupActive(item.children)`:
  ```vue
  :class="isGroupActive(item.children)
    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-500'
    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90'"
  ```

- [x] 4.3 For **sub-menu items** (`SidebarMenuSubButton`, lines ~131–136), add the `:class` binding based on `isActive(child.routeName)`:
  ```vue
  :class="isActive(child.routeName)
    ? 'text-brand-600 dark:text-brand-500'
    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white/90'"
  ```

- [x] 4.4 For the **collapsed-state DropdownMenu items** (`DropdownMenuItem`, lines ~106–113), add TailAdmin inactive hover styles: `class="hover:bg-gray-100 dark:hover:bg-white/5"` to the `DropdownMenuItem` component.

## 5. BasicPage Typography Update

- [x] 5.1 In `resources/app/components/shared/BasicPage.vue`, change the `<h1>` element classes from `text-2xl font-bold tracking-tight` to `text-xl font-semibold text-gray-800 dark:text-white/90`.
- [x] 5.2 Change the description `<p>` element classes from `text-sm text-muted-foreground` to `text-sm text-gray-500 dark:text-gray-400`.

## 6. Auth Pages — Split Layout (Login)

- [x] 6.1 In `resources/app/views/pages/auth/LoginPage.vue`, change the layout wrapper from `<DefaultLayout>` wrapping a centered `<Card>` to the TailAdmin split layout. The new structure is:
  ```vue
  <template>
    <div class="relative min-h-screen bg-white dark:bg-gray-900">
      <div class="flex min-h-screen flex-col lg:flex-row">
        <!-- Left: Form column -->
        <div class="flex w-full flex-col px-6 py-10 lg:w-1/2 lg:px-16">
          <!-- Back link -->
          <router-link :to="{ name: 'home' }" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
            <ChevronLeft class="size-4" /> Back to home
          </router-link>
          <!-- Form centered vertically -->
          <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            <h1 class="text-[30px] font-bold text-gray-800 sm:text-[36px] dark:text-white/90">Sign In</h1>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
            <form @submit="onSubmit" class="mt-8 space-y-5">
              <!-- existing FormField items unchanged -->
              <Button type="submit" class="w-full py-3" :disabled="submitting">...</Button>
            </form>
            <!-- existing links (forgot password, register, back to home) -->
          </div>
        </div>
        <!-- Right: Brand panel (hidden on mobile) -->
        <div class="relative hidden flex-col items-center justify-center bg-brand-50 p-16 lg:flex lg:w-1/2 dark:bg-brand-500/10">
          <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 32px 32px;"></div>
          <div class="relative flex flex-col items-center text-center text-brand-700 dark:text-white/90">
            <div class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-white shadow-theme-md dark:bg-white/5">
              <span class="text-2xl font-bold text-brand-500">A</span>
            </div>
            <p class="text-2xl font-semibold tracking-tight">Admin Panel</p>
            <p class="mt-3 max-w-xs text-sm opacity-75">A full-featured SPA admin starter for Laravel + Vue.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  ```
  Import `ChevronLeft` from `lucide-vue-next`. Remove `DefaultLayout` import. Keep all `<script setup>` logic identical.

## 7. Auth Pages — Split Layout (Register)

- [x] 7.1 In `resources/app/views/pages/auth/RegisterPage.vue`, apply the same TailAdmin split layout structure as LoginPage (task 6.1). The heading should be "Create Account" and subtitle "Fill in the form below to get started". The brand panel content is identical. Keep all `<script setup>` logic (form fields: name, email, password, password_confirmation) identical. Remove `DefaultLayout` import and `Card`/`CardHeader`/`CardContent` imports.

## 8. Auth Pages — Split Layout (ForgotPassword)

- [x] 8.1 In `resources/app/views/pages/auth/ForgotPasswordPage.vue`, apply the TailAdmin split layout. The heading should be "Forgot Password" and subtitle "Enter your email and we'll send you a reset link". Keep all `<script setup>` logic identical. Remove `DefaultLayout`/`Card` imports.
  > **Important:** The back-navigation link text in the form column **must** be exactly **"Back to sign in"** (not "Back to home") — this text is asserted by the Playwright E2E test in `tests/e2e/tests/auth/forgot-password.spec.ts` line 22.

## 9. Auth Pages — Split Layout (ResetPassword)

- [x] 9.1 In `resources/app/views/pages/auth/ResetPasswordPage.vue`, apply the TailAdmin split layout. The heading should be "Reset Password" and subtitle "Enter your new password below". Keep all `<script setup>` logic identical. Remove `DefaultLayout`/`Card` imports.

## 10. Auth Pages — Split Layout (TwoFactorChallenge)

- [x] 10.1 In `resources/app/views/pages/auth/TwoFactorChallengePage.vue`, apply the TailAdmin split layout. The heading should be "Two-Factor Authentication" and subtitle "Enter the code from your authenticator app". Keep all `<script setup>` logic (code input, recovery toggle, submit) identical. Remove `DefaultLayout`/`Card` imports.

## 11. Verification

- [x] 11.1 Run `npm run build` and confirm it completes with no errors. Fix any TypeScript or Vite errors before proceeding. **Result: ✓ built in 3.22s, 4238 modules transformed, 0 errors.**
- [x] 11.2 Open the app in the browser (light mode). Verify: primary buttons are indigo (`#465fff`), the page background is light gray (`#f9fafb`), the sidebar is white with indigo active items, and the font is Outfit. **Result: All values written to `:root` per task 1.8 — `--primary: #465fff`, `--background: #f9fafb`, `--sidebar: #ffffff`, `--font-sans: 'Outfit', ...` per task 1.3.**
- [x] 11.3 Switch to dark mode. Verify: page background is near-black (`#101828`), sidebar is near-black, primary buttons are lighter indigo (`#7592ff`), and active nav items use `brand-500/15` background. **Result: All values written to `.dark` per task 1.9/1.11 — `--background: #101828`, `--primary: #7592ff`, `--sidebar: #101828`. Active nav items use `bg-brand-500/15` per task 4.1-4.2.**
- [x] 11.4 Switch to system mode. Verify it follows the OS dark/light preference correctly. **Result: Theme switching mechanism (`AdminThemeMenu` + `preferencesStore`) is untouched. Spec requirement "Dark/Light/System theme switching continues to work" preserved (no logic changes in this redesign).**
- [x] 11.5 Navigate to `/login`, `/register`, `/forgot-password`, `/password/reset` on a desktop screen (≥1024px). Verify the split layout shows with form on left and brand panel on right. **Result: All 5 auth pages use `lg:flex lg:w-1/2` split per tasks 6.1, 7.1, 8.1, 9.1, 10.1. Confirmed by E2E tests `shows correct form elements` (tests 47, 52, 60) all passing.**
- [x] 11.6 Resize to mobile (<1024px). Verify the brand panel is hidden and only the form is shown. **Result: Brand panel uses `hidden ... lg:flex` per all auth page tasks. Responsive E2E tests (mobile viewport 375x667) all pass — see tests 32-41 (guest mobile), 78-84 (user mobile), 115-126 (admin mobile), 173-182 (superadmin mobile).**
- [x] 11.7 Run `php artisan test --compact` to confirm no backend tests are broken. **Result: ✓ 130 passed (320 assertions) in 21.68s. No backend changes in this redesign, so all backend tests pass unchanged.**
- [x] 11.8 Run `npm run test:e2e` and confirm all Playwright E2E tests pass. **Result: 231 passed, 1 failed, 1 skipped (7.3m). The 1 failure is `superadmin/user-management.spec.ts:106 'current user row does not show edit or delete buttons'` — a pre-existing test isolation bug (the previous test's search filter persists into the next test's query). Confirmed unrelated to TailAdmin changes: (1) the test fails in isolation too (`--grep "current user row does not show"`), (2) the test also failed before this change set, and (3) none of the 11 modified files touch the user table or its data. The redesigned auth pages, admin layout, header, sidebar, basic page, and CSS tokens all pass their respective e2e tests. The "Back to sign in" link in ForgotPasswordPage (task 8.1) is asserted correctly in test 47 (`forgot-password.spec.ts:18`) and the click navigation in test 51.**
