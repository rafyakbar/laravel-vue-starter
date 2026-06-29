## 1. Backend: BrowserSessionController

- [x] 1.1 Run `php artisan make:controller BrowserSessionController --no-interaction` to scaffold the controller at `app/Http/Controllers/BrowserSessionController.php`
- [x] 1.2 Add `index(Request $request): JsonResponse` method: query `DB::table('sessions')->where('user_id', auth()->id())->orderByDesc('last_activity')->get()`, map each row to `['id' => $row->id, 'ip_address' => $row->ip_address, 'device' => $this->parseDevice($row->user_agent ?? ''), 'is_current' => $row->id === $request->session()->getId(), 'last_active_at' => Carbon::createFromTimestamp($row->last_activity)->toISOString()]`, and return `response()->json($mapped)`
- [x] 1.3 Add `destroyOthers(Request $request): JsonResponse` method: check `$request->session()->has('auth.password_confirmed_at')` — if missing or older than `config('auth.password_timeout', 900)` seconds, return `response()->json(['message' => 'Password confirmation required.'], 423)`; otherwise call `DB::table('sessions')->where('user_id', auth()->id())->where('id', '!=', $request->session()->getId())->delete()`, then `$request->session()->migrate(true)`, and return `response()->json(['message' => 'Other sessions logged out.'])`
- [x] 1.4 Add private `parseDevice(string $userAgent): string` method with `str_contains` checks for common browsers (Chrome, Firefox, Safari, Edge, Opera) and OS (Windows, Mac, iPhone, iPad, Android, Linux) — return compound label like "Chrome on Windows" or "Safari on iPhone"; return "Unknown Device" as fallback
- [x] 1.5 Add `use Illuminate\Http\{JsonResponse, Request}`, `use Illuminate\Support\Carbon`, `use Illuminate\Support\Facades\DB` imports at the top of the controller
- [x] 1.6 In `routes/api.php`, inside the `auth:sanctum` middleware group, add: `Route::get('/profile/sessions', [BrowserSessionController::class, 'index'])` and `Route::delete('/profile/sessions/others', [BrowserSessionController::class, 'destroyOthers'])`; add `use App\Http\Controllers\BrowserSessionController` import
- [x] 1.7 Run `vendor/bin/pint --dirty --format agent` to format the new controller and updated routes file

## 2. Backend: Pest Tests for Browser Sessions

- [x] 2.1 Run `php artisan make:test --pest BrowserSessionsTest --no-interaction` to scaffold `tests/Feature/BrowserSessionsTest.php`
- [x] 2.2 Write test "authenticated user can list their browser sessions": `actingAsUser()`, `GET /api/profile/sessions`, assert 200, assert response is a JSON array, assert the first item has keys `id`, `ip_address`, `device`, `is_current`, `last_active_at`
- [x] 2.3 Write test "current session is marked as is_current true": seed the sessions table with one row matching `session()->getId()` (or rely on the existing Sanctum-managed session), assert `is_current === true` for exactly one item
- [x] 2.4 Write test "sessions endpoint returns 401 for guest": `GET /api/profile/sessions` with no auth, assert 401
- [x] 2.5 Write test "delete other sessions returns 423 without password confirmation": `actingAsUser()`, `DELETE /api/profile/sessions/others` without setting `auth.password_confirmed_at` in session, assert 423
- [x] 2.6 Write test "delete other sessions succeeds after password confirmation": `actingAsUser()`, manually set `session(['auth.password_confirmed_at' => now()->timestamp])` via `withSession()`, insert a second session row for the user into `DB::table('sessions')`, `DELETE /api/profile/sessions/others`, assert 200, assert that second session row no longer exists in the database
- [x] 2.7 Write test "delete other sessions returns 401 for guest": `DELETE /api/profile/sessions/others` with no auth, assert 401
- [x] 2.8 Write test "sessions list includes correct device label": create a user, perform `actingAs($user)`, `withSession(['_token' => 'test'])`, `GET /api/profile/sessions`, assert `device` field is a non-empty string
- [x] 2.9 Run `php artisan test --compact --filter=BrowserSessionsTest` and confirm all tests pass
- [x] 2.10 Run `vendor/bin/pint --dirty --format agent` on the new test file

## 3. Frontend: Router, Navigation, and All URL References

- [x] 3.1 In `resources/app/router/index.ts`, change the profile route: `path: '/profile'` → `path: '/my-profile'` and `name: 'profile'` → `name: 'my-profile'`; keep `meta: { requiresAuth: true, titleKey: 'breadcrumb.profile' }` unchanged
- [x] 3.2 Add a redirect route entry in the router array immediately before the `my-profile` route: `{ path: '/profile', redirect: '/my-profile' }` — this keeps old bookmarks working via client-side redirect
- [x] 3.3 In `resources/app/components/shared/ProfileDropdown.vue`, update `:to="{ name: 'profile' }"` → `:to="{ name: 'my-profile' }"`
- [x] 3.4 Search `resources/app/` for any other references to `name: 'profile'` or `{ name: \"profile\" }` and update them to `my-profile`
- [x] 3.5 Search `resources/app/` for any hardcoded `'/profile'` path strings and update to `'/my-profile'`

## 4. i18n: English Strings

- [x] 4.1 In `resources/app/locales/en.ts`, update `pages.profile.title` from `'Profile'` to `'My Profile'`
- [x] 4.2 Update `pages.profile.description` from `'Your account information'` to `'Manage your user profile here.'`
- [x] 4.3 Add under `pages.profile`: `personalInfoTitle: 'Personal Information'` and `personalInfoDescription: 'Manage your personal information.'`
- [x] 4.4 Add: `email: 'Email'` and `updateProfile: 'Update'`
- [x] 4.5 Rename (update value) `passwordTitle` from `'Change Password'` to `'Password'`; add `passwordSectionDescription: 'Must be at least 8 characters long.'`; add `updatePassword: 'Update'`
- [x] 4.6 Add: `twoFactorSectionDescription: 'Manage two-factor authentication for your account (recommended).'`, `twoFactorNotEnabled: 'You have not enabled two-factor authentication.'`, `twoFactorExplanation: 'When two-factor authentication is enabled, you will be prompted for a secure, random token during authentication. You may retrieve this token using your phone\'s authenticator application (e.g. Microsoft Authenticator, Google Authenticator).'`, `twoFactorEnableBtn: 'Enable'`
- [x] 4.7 Add: `browserSessionsTitle: 'Browser Sessions'`, `browserSessionsSectionDescription: 'Manage your active sessions.'`
- [x] 4.8 Add: `browserSessionsInfo: 'If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.'`
- [x] 4.9 Add: `logoutOtherSessions: 'Log Out Other Browser Sessions'`, `thisDevice: 'This device'`, `lastActive: 'Last active'`, `browserSessionsLogoutSuccess: 'Other browser sessions have been logged out.'`, `browserSessionsConfirmPassword: 'Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.'`

## 5. i18n: Indonesian Strings

- [x] 5.1 In `resources/app/locales/id.ts`, update `pages.profile.title` → `'Profil Saya'`
- [x] 5.2 Update `pages.profile.description` → `'Kelola profil pengguna Anda di sini.'`
- [x] 5.3 Add: `personalInfoTitle: 'Informasi Pribadi'`, `personalInfoDescription: 'Kelola informasi pribadi Anda.'`, `email: 'Email'`, `updateProfile: 'Perbarui'`
- [x] 5.4 Update `passwordTitle` → `'Kata Sandi'`; add `passwordSectionDescription: 'Minimal 8 karakter.'`, `updatePassword: 'Perbarui'`
- [x] 5.5 Add: `twoFactorSectionDescription: 'Kelola autentikasi dua faktor untuk akun Anda (direkomendasikan).'`, `twoFactorNotEnabled: 'Anda belum mengaktifkan autentikasi dua faktor.'`, `twoFactorExplanation: 'Ketika autentikasi dua faktor diaktifkan, Anda akan diminta token acak yang aman saat autentikasi. Token ini dapat diambil menggunakan aplikasi autentikator di ponsel Anda (mis. Microsoft Authenticator, Google Authenticator).'`, `twoFactorEnableBtn: 'Aktifkan'`
- [x] 5.6 Add: `browserSessionsTitle: 'Sesi Browser'`, `browserSessionsSectionDescription: 'Kelola sesi aktif Anda.'`, `browserSessionsInfo: 'Jika perlu, Anda dapat keluar dari semua sesi browser lain di semua perangkat Anda. Beberapa sesi terbaru Anda terdaftar di bawah ini; namun daftar ini mungkin tidak lengkap. Jika Anda merasa akun Anda telah disusupi, Anda juga harus memperbarui kata sandi.'`, `logoutOtherSessions: 'Keluarkan Sesi Browser Lainnya'`, `thisDevice: 'Perangkat ini'`, `lastActive: 'Terakhir aktif'`, `browserSessionsLogoutSuccess: 'Sesi browser lainnya telah dikeluarkan.'`, `browserSessionsConfirmPassword: 'Masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin keluar dari sesi browser lain di semua perangkat Anda.'`

## 6. Frontend: AvatarUpload Component Refactor

- [x] 6.1 In `resources/app/components/profile/AvatarUpload.vue`, add `compact: { type: Boolean, default: false }` to `defineProps`
- [x] 6.2 Wrap the outer `<div class="rounded-lg border bg-card p-6 space-y-4">` and the inner title+description block with a `v-if="!compact"` guard: when `compact` is `false` (default), render the full standalone card as before; when `compact` is `true`, render only the avatar circle and the upload/remove button row directly, without any card wrapper or section header
- [x] 6.3 Extract the avatar + buttons markup into a shared inner template so it's rendered in both modes — avoid duplicating the avatar/button HTML

## 7. Frontend: ProfileInfoForm — Strip Header, Add Read-Only Email

- [x] 7.1 In `resources/app/components/profile/ProfileInfoForm.vue`, remove the outer `<div class="rounded-lg border bg-card p-6 space-y-4">` card wrapper and the inner `<div>` containing `<h3>` title and `<p>` description — the component now renders only the `<form>` element
- [x] 7.2 Add a read-only email field after the Username `<FormField>`: a `<FormItem>` with `<FormLabel>{{ t('pages.profile.email') }}</FormLabel>` and `<Input type="email" :value="props.user.email" disabled class="cursor-not-allowed opacity-60" />`; no `v-bind="componentField"` since it is not part of the submitted form
- [x] 7.3 Change the submit button label from `t('pages.profile.saveChanges')` and `t('pages.profile.saving')` to `t('pages.profile.updateProfile')` and `t('common.saving')`

## 8. Frontend: PasswordForm — Strip Header, Update Button Label

- [x] 8.1 In `resources/app/components/profile/PasswordForm.vue`, remove the outer `<div class="rounded-lg border bg-card p-6 space-y-4">` card wrapper and the inner `<div>` containing `<h3>` and `<p>`
- [x] 8.2 Change the submit button label from `t('pages.profile.saveChanges')` / `t('pages.profile.saving')` to `t('pages.profile.updatePassword')` / `t('common.saving')`

## 9. Frontend: TwoFactorForm — Remove Card Wrapper, Redesign Disabled State

- [x] 9.1 In `resources/app/components/profile/TwoFactorForm.vue`, remove the outer `<div class="rounded-lg border bg-card p-6 space-y-4">` card wrapper and the inner header block (h3 title, description paragraph, and status badge row) — keep only the step-based content blocks
- [x] 9.2 Replace the `<!-- Step: disabled -->` block entirely with the new design:
  ```html
  <div v-if="step === 'disabled'" class="space-y-4">
    <div class="flex items-start gap-3">
      <AlertCircle class="size-5 mt-0.5 text-amber-500 shrink-0" />
      <h3 class="text-base font-semibold">{{ t('pages.profile.twoFactorNotEnabled') }}</h3>
    </div>
    <p class="text-sm text-muted-foreground">{{ t('pages.profile.twoFactorExplanation') }}</p>
    <Button :disabled="loading" @click="startEnable">{{ t('pages.profile.twoFactorEnableBtn') }}</Button>
  </div>
  ```
- [x] 9.3 Add `AlertCircle` to the Lucide imports at the top of the script: `import { AlertCircle } from 'lucide-vue-next'`
- [x] 9.4 Keep all other step blocks (`confirm-password`, `setup`, `recovery-codes`, `enabled`) unchanged in logic; they now render without an outer card since the card is provided by `ProfilePage`

## 10. Frontend: BrowserSessionsForm — New Component

- [x] 10.1 Create `resources/app/components/profile/BrowserSessionsForm.vue` with `<script setup lang="ts">`; import `ref, onMounted` from `vue`, `useI18n`, `apiGet`, `apiPost`, `apiDelete`, `ApiError` from `@/services/api`, and Lucide icons `Monitor`, `Smartphone`, `Loader2`
- [x] 10.2 Define reactive state: `sessions` ref (array), `loading` ref (boolean), `showPasswordConfirm` ref (boolean), `passwordInput` ref (string), `confirmLoading` ref (boolean), `confirmError` ref (string), `successMessage` ref (string)
- [x] 10.3 Define a `SessionItem` type: `{ id: string; ip_address: string; device: string; is_current: boolean; last_active_at: string }`
- [x] 10.4 Implement `fetchSessions()`: call `apiGet<SessionItem[]>('/api/profile/sessions')`, assign result to `sessions`, handle errors gracefully (catch and ignore)
- [x] 10.5 Implement `formatLastActive(isoString: string): string`: compute relative time using `Intl.RelativeTimeFormat` — calculate diff in seconds from `new Date(isoString)` to `Date.now()`, choose appropriate unit (seconds/minutes/hours/days), return formatted string like "2 hours ago"
- [x] 10.6 Implement `isMobile(device: string): boolean`: return `true` if device string contains "iPhone", "iPad", or "Android"
- [x] 10.7 Implement `confirmLogout()`: call `apiPost('/user/confirm-password', { password: passwordInput.value })`, on success call `apiDelete('/api/profile/sessions/others')`, then `fetchSessions()`, set `successMessage`, reset `showPasswordConfirm` and `passwordInput`; on 422 error set `confirmError` from response errors
- [x] 10.8 Call `fetchSessions()` in `onMounted()`
- [x] 10.9 Build the template: description paragraph `{{ t('pages.profile.browserSessionsInfo') }}`; sessions list (each row: icon + device label + IP address + `lastActive` text + "This device" Badge if `is_current`); `<Button>` "Log Out Other Browser Sessions" that sets `showPasswordConfirm = true`; password confirmation inline block (visible when `showPasswordConfirm`) with `<Label>`, password `<Input>`, confirm `<Button>`, cancel `<Button>`, and error message; success message display
- [x] 10.10 Add `data-testid="browser-sessions-form"` on the root element and `data-testid="session-item"` on each session row `<div>` for Playwright

## 11. Frontend: ProfilePage Full Redesign

- [x] 11.1 In `resources/app/views/pages/ProfilePage.vue`, import `BrowserSessionsForm` from `@/components/profile/BrowserSessionsForm.vue`; ensure all existing imports (`AvatarUpload`, `ProfileInfoForm`, `PasswordForm`, `TwoFactorForm`) remain present
- [x] 11.2 **DefaultLayout branch**: Change the outer container from `max-w-lg` to `max-w-4xl`; update the `<h1>` text to use `t('pages.profile.title')` (no change needed since key is already used, but the value now returns "My Profile"); update the description `<p>` to `t('pages.profile.description')`
- [x] 11.3 Replace the DefaultLayout body (`<div v-if="authStore.user" class="space-y-6">` containing `AvatarUpload`, `ProfileInfoForm`, `PasswordForm`, `TwoFactorForm`) with a `<div class="divide-y">` container holding four section rows, each using `<div class="grid grid-cols-1 gap-6 py-8 md:grid-cols-[35%_1fr]">`
- [x] 11.4 **Section 1 — Personal Information**: left col: `<div data-testid="section-description"><h2 class="text-lg font-semibold">{{ t('pages.profile.personalInfoTitle') }}</h2><p class="mt-1 text-sm text-muted-foreground">{{ t('pages.profile.personalInfoDescription') }}</p></div>`; right col: `<div data-testid="section-form"><div class="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]"><AvatarUpload :compact="true" :user-id="authStore.user.id" :current-avatar-url="authStore.user.avatar_url" :name="authStore.user.name" @uploaded="onAvatarUploaded" @removed="onAvatarRemoved" /><ProfileInfoForm :user="authStore.user" @saved="onProfileSaved" /></div></div>`
- [x] 11.5 **Section 2 — Password**: left col: `<div data-testid="section-description"><h2>{{ t('pages.profile.passwordTitle') }}</h2><p>{{ t('pages.profile.passwordSectionDescription') }}</p></div>`; right col: `<div data-testid="section-form"><PasswordForm /></div>`
- [x] 11.6 **Section 3 — Two-Factor Authentication**: left col: `<div data-testid="section-description"><h2>{{ t('pages.profile.twoFactorSectionTitle') }}</h2><p>{{ t('pages.profile.twoFactorSectionDescription') }}</p></div>`; right col: `<div data-testid="section-form"><TwoFactorForm :is-two-factor-enabled="isTwoFactorEnabled" /></div>`; note: use new key `twoFactorSectionTitle` for the h2 (the old `twoFactorTitle` key was used inside the component which is now removed)
- [x] 11.7 **Section 4 — Browser Sessions**: left col: `<div data-testid="section-description"><h2>{{ t('pages.profile.browserSessionsTitle') }}</h2><p>{{ t('pages.profile.browserSessionsSectionDescription') }}</p></div>`; right col: `<div data-testid="section-form"><BrowserSessionsForm /></div>`
- [x] 11.8 **AdminLayout branch**: Replace the existing `<BasicPage>` body (AvatarUpload + grid-cols-2 + TwoFactorForm stack) with the same four-section `<div class="divide-y">` pattern from steps 11.3–11.7; the `<BasicPage>` wrapper provides the page title/description header, so remove the inline h1/p from this branch
- [x] 11.9 Update the `<BasicPage>` `:title` prop to use `t('pages.profile.title')` and `:description` to use `t('pages.profile.description')` so AdminLayout shows "My Profile" heading

## 12. E2E: Update Existing profile.spec.ts Files

- [x] 12.1 In `tests/e2e/tests/user/profile.spec.ts`, change `page.goto('/profile')` → `page.goto('/my-profile')` in `beforeEach`; change the heading assertion from `'Profile'` (exact) to `'My Profile'` (exact)
- [x] 12.2 Update the user profile spec section heading assertions: `'Profile Information'` → `'Personal Information'`, `'Change Password'` → `'Password'`
- [x] 12.3 Add new tests to user profile spec: (a) `'browser sessions section heading is visible'` — `expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible()`; (b) `'log out other browser sessions button is visible'` — `expect(page.getByRole('button', { name: 'Log Out Other Browser Sessions' })).toBeVisible()`; (c) `'2FA Enable button is visible when 2FA not enabled'` — `expect(page.getByRole('button', { name: 'Enable' })).toBeVisible()`; (d) `'2FA explanation text is visible when 2FA not enabled'` — `expect(page.getByText('You have not enabled two-factor authentication.')).toBeVisible()`
- [x] 12.4 In `tests/e2e/tests/admin/profile.spec.ts`, change `page.goto('/profile')` → `page.goto('/my-profile')` in `beforeEach`; change the heading assertion from `'Profile'` (exact) to `'My Profile'`; update section heading assertions as in 12.2; add the same four new tests from 12.3
- [x] 12.5 In `tests/e2e/tests/superadmin/profile.spec.ts`, apply the same changes as 12.1–12.3; change `page.goto('/profile')` → `page.goto('/my-profile')` and update all heading assertions; add the same four new tests from 12.3

## 13. E2E: Update All Other Test Files Referencing /profile

- [x] 13.1 In `tests/e2e/tests/user/home.spec.ts` line ~32: change `await expect(page).toHaveURL('/profile')` → `await expect(page).toHaveURL('/my-profile')`
- [x] 13.2 In `tests/e2e/tests/user/responsive.spec.ts` lines ~39 and ~91: change `await expect(page).toHaveURL('/profile')` → `await expect(page).toHaveURL('/my-profile')`
- [x] 13.3 In `tests/e2e/tests/admin/restricted-pages.spec.ts` line ~28: change `page.goto('/profile')` → `page.goto('/my-profile')`
- [x] 13.4 In `tests/e2e/tests/guest/landing.spec.ts` line ~78: change `page.goto('/profile')` → `page.goto('/my-profile')`
- [x] 13.5 In `tests/e2e/tests/guest/navigation-guards.spec.ts` line ~26: update the test `'visiting /profile redirects to login with redirect param'` — change `page.goto('/profile')` to `page.goto('/my-profile')` and update the test description to `'visiting /my-profile redirects to login with redirect param'`; add a second test `'visiting /profile (old URL) also redirects to login'` that does `page.goto('/profile')` and asserts `toHaveURL(/\/login/)`
- [x] 13.6 In `tests/e2e/tests/superadmin/admin-pages.spec.ts` line ~32: change `page.goto('/profile')` → `page.goto('/my-profile')`
- [x] 13.7 In `tests/e2e/tests/superadmin/two-factor.spec.ts`, change all six occurrences of `page.goto('/profile')` → `page.goto('/my-profile')`

## 14. E2E: New profile-responsive.spec.ts for User Role

- [x] 14.1 Create `tests/e2e/tests/user/profile-responsive.spec.ts`
- [x] 14.2 Add `test.describe('User Profile — Mobile (375x667)')` with `test.use({ viewport: { width: 375, height: 667 } })`; `beforeEach`: `page.goto('/my-profile')` + `waitForLoadState('networkidle')`
- [x] 14.3 Mobile test: `'all four section headings are visible on mobile'` — assert `getByRole('heading', { name: 'Personal Information' })`, `getByRole('heading', { name: 'Password' })`, `getByRole('heading', { name: 'Two-Factor Authentication' })`, `getByRole('heading', { name: 'Browser Sessions' })` are all visible
- [x] 14.4 Mobile test: `'form fields are accessible on mobile'` — assert Name, Username, Email (disabled), Current Password, New Password, Confirm Password labels are all visible
- [x] 14.5 Mobile test: `'description column renders above form column on mobile'` — get bounding boxes: `const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()` and `const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()`; assert `descBox!.y + descBox!.height <= formBox!.y` (description ends before form starts = stacked)
- [x] 14.6 Mobile test: `'no horizontal overflow on mobile'` — assert `page.evaluate(() => document.documentElement.scrollWidth <= 375)` is true
- [x] 14.7 Mobile test: `'2FA disabled state shows Enable button on mobile'` — assert `getByRole('button', { name: 'Enable' })` is visible
- [x] 14.8 Mobile test: `'Browser Sessions Log Out button is visible on mobile'` — assert `getByRole('button', { name: 'Log Out Other Browser Sessions' })` is visible
- [x] 14.9 Add `test.describe('User Profile — Tablet (769x1024)')` with `test.use({ viewport: { width: 769, height: 1024 } })`; `beforeEach` same as 14.2
- [x] 14.10 Tablet test: `'two-column layout is active on tablet'` — get bounding boxes of first `[data-testid="section-description"]` and `[data-testid="section-form"]`; assert `descBox!.x + descBox!.width < formBox!.x + 10` (description is to the left of form = side by side)
- [x] 14.11 Tablet test: `'all section headings and form fields are visible on tablet'` — same assertions as 14.3 + 14.4
- [x] 14.12 Tablet test: `'avatar is visible in personal information section on tablet'` — assert `getByRole('button', { name: /Upload Avatar|Change Avatar/i })` is visible
- [x] 14.13 Add `test.describe('User Profile — Desktop (1280x800)')` with `test.use({ viewport: { width: 1280, height: 800 } })`; `beforeEach` same as 14.2
- [x] 14.14 Desktop test: `'two-column layout is active on desktop'` — same bounding box check as 14.10
- [x] 14.15 Desktop test: `'personal information section shows avatar alongside form fields on desktop'` — assert both `getByRole('button', { name: /Upload Avatar|Change Avatar/i })` and `getByLabel('Name', { exact: true })` are visible simultaneously
- [x] 14.16 Desktop test: `'page heading is My Profile on desktop'` — assert `getByRole('heading', { name: 'My Profile', level: 1 })` is visible

## 15. E2E: New profile-responsive.spec.ts for Admin Role

- [x] 15.1 Create `tests/e2e/tests/admin/profile-responsive.spec.ts`
- [x] 15.2 Add `test.describe('Admin Profile — Mobile (375x667)')` with `test.use({ viewport: { width: 375, height: 667 } })`; `beforeEach`: `page.goto('/my-profile')` + `waitForLoadState('networkidle')`
- [x] 15.3 Mobile test: `'admin bottom nav is visible on profile page mobile'` — assert `page.locator('nav.md\\:hidden')` is visible
- [x] 15.4 Mobile test: `'all four section headings are visible on mobile'` — same as 14.3
- [x] 15.5 Mobile test: `'description column stacks above form column on mobile'` — same bounding box check as 14.5
- [x] 15.6 Mobile test: `'no horizontal overflow on mobile for admin'` — assert `scrollWidth <= 375`
- [x] 15.7 Mobile test: `'Browser Sessions and 2FA sections visible on mobile for admin'` — assert Browser Sessions heading and "Log Out Other Browser Sessions" button visible
- [x] 15.8 Add `test.describe('Admin Profile — Tablet (769x1024)')` with `test.use({ viewport: { width: 769, height: 1024 } })`; `beforeEach` same
- [x] 15.9 Tablet test: `'sidebar is visible on tablet for admin profile'` — assert `page.locator('[data-sidebar="content"]')` is visible
- [x] 15.10 Tablet test: `'bottom nav is hidden on tablet for admin profile'` — assert `page.locator('nav.md\\:hidden')` is NOT visible
- [x] 15.11 Tablet test: `'two-column layout is active on tablet for admin'` — same bounding box check as 14.10
- [x] 15.12 Add `test.describe('Admin Profile — Desktop (1280x800)')` with `test.use({ viewport: { width: 1280, height: 800 } })`; `beforeEach` same
- [x] 15.13 Desktop test: `'two-column layout on desktop for admin'` — bounding box check
- [x] 15.14 Desktop test: `'My Profile heading visible on desktop for admin'` — assert `h1` "My Profile" visible

## 16. E2E: New profile-responsive.spec.ts for Superadmin Role

- [x] 16.1 Create `tests/e2e/tests/superadmin/profile-responsive.spec.ts`
- [x] 16.2 Add `test.describe('Superadmin Profile — Mobile (375x667)')` with `test.use({ viewport: { width: 375, height: 667 } })`; `beforeEach`: `page.goto('/my-profile')` + `waitForLoadState('networkidle')`
- [x] 16.3 Mobile test: `'superadmin bottom nav is visible on profile page mobile'` — assert `nav.md\\:hidden` is visible
- [x] 16.4 Mobile test: `'all four section headings are visible on mobile for superadmin'` — same as 14.3
- [x] 16.5 Mobile test: `'description stacks above form on mobile for superadmin'` — same bounding box check
- [x] 16.6 Mobile test: `'no horizontal overflow on mobile for superadmin'` — `scrollWidth <= 375`
- [x] 16.7 Mobile test: `'2FA section visible; Enable button present if 2FA not confirmed'` — for seeded superadmin who may have 2FA: check either Enable button OR regenerate/disable controls are visible (use `or()` locator or conditional)
- [x] 16.8 Add `test.describe('Superadmin Profile — Tablet (769x1024)')` with `test.use({ viewport: { width: 769, height: 1024 } })`; `beforeEach` same
- [x] 16.9 Tablet test: `'sidebar with Settings group visible on tablet for superadmin profile'` — assert `[data-sidebar="content"]` visible and `getByText('Settings')` within sidebar visible
- [x] 16.10 Tablet test: `'bottom nav hidden on tablet for superadmin profile'` — assert `nav.md\\:hidden` NOT visible
- [x] 16.11 Tablet test: `'two-column layout on tablet for superadmin'` — bounding box check as 14.10
- [x] 16.12 Add `test.describe('Superadmin Profile — Desktop (1280x800)')` with `test.use({ viewport: { width: 1280, height: 800 } })`; `beforeEach` same
- [x] 16.13 Desktop test: `'two-column layout on desktop for superadmin'` — bounding box check
- [x] 16.14 Desktop test: `'My Profile h1 heading visible on desktop for superadmin'` — assert `getByRole('heading', { name: 'My Profile', level: 1 })` visible

## 17. Final Verification

- [x] 17.1 Run `vendor/bin/pint --dirty --format agent` to format all modified PHP files (controller, routes, test)
- [x] 17.2 Run `php artisan test --compact --filter=ProfileUpdateTest` to confirm existing profile Pest tests still pass
- [x] 17.3 Run `php artisan test --compact --filter=BrowserSessionsTest` to confirm new browser sessions tests pass
- [x] 17.4 Run `php artisan test --compact --filter=ProfileAvatarTest` to confirm avatar tests still pass
- [x] 17.5 Run `npm run build` and confirm zero TypeScript errors and zero Vite bundling errors
- [x] 17.6 Run `npx playwright test tests/e2e/tests/user/profile.spec.ts tests/e2e/tests/admin/profile.spec.ts tests/e2e/tests/superadmin/profile.spec.ts` and confirm all pass
- [x] 17.7 Run `npx playwright test tests/e2e/tests/user/profile-responsive.spec.ts tests/e2e/tests/admin/profile-responsive.spec.ts tests/e2e/tests/superadmin/profile-responsive.spec.ts` and confirm all pass
- [x] 17.8 Run `npx playwright test tests/e2e/tests/guest/navigation-guards.spec.ts tests/e2e/tests/user/home.spec.ts tests/e2e/tests/user/responsive.spec.ts tests/e2e/tests/superadmin/two-factor.spec.ts` to confirm updated cross-file tests still pass
