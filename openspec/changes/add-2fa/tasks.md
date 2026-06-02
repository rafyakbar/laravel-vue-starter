## 1. Backend — Enable Fortify 2FA

- [x] 1.1 Open `config/fortify.php`, uncomment `Features::twoFactorAuthentication(['confirm' => true, 'confirmPassword' => true])` in the `features` array
- [x] 1.2 Open `app/Models/User.php`, add `use Laravel\Fortify\TwoFactorAuthenticatable;` import and add it to the class `use` statement alongside existing traits
- [x] 1.3 Run `vendor/bin/pint app/Models/User.php --format agent` to format

## 2. Backend — Pest Tests

- [x] 2.1 Run `php artisan make:test --pest TwoFactorTest` to create the test file
- [x] 2.2 Open `tests/Feature/TwoFactorTest.php`, add test: `user can enable 2fa` — actingAsSuperadmin, POST `/user/confirm-password` with `password: '123123'`, POST `/user/two-factor-authentication`, assert 200, assert user's `two_factor_secret` is not null
- [x] 2.3 Add test: `user can get qr code after enabling` — enable 2FA as above, GET `/user/two-factor-qr-code`, assert response has `svg` key
- [x] 2.4 Add test: `user can get secret key after enabling` — enable 2FA, GET `/user/two-factor-secret-key`, assert response has `secretKey` key
- [x] 2.5 Add test: `user can view recovery codes` — enable and confirm 2FA (use `$user->confirmTwoFactorAuthentication()` helper or Fortify's internal method), GET `/user/two-factor-recovery-codes`, assert response is an array with 8 items
- [x] 2.6 Add test: `user can regenerate recovery codes` — GET codes first, POST `/user/two-factor-recovery-codes`, GET again, assert codes changed
- [x] 2.7 Add test: `user can disable 2fa` — enable and confirm 2FA, DELETE `/user/two-factor-authentication`, assert user's `two_factor_secret` is null
- [x] 2.8 Add test: `2fa management requires password confirmation` — enable 2FA without prior confirm-password call, DELETE `/user/two-factor-authentication`, assert 423
- [x] 2.9 Add test: `login with 2fa enabled returns two_factor true` — create a user with confirmed 2FA, POST `/login`, assert response JSON has `two_factor: true`
- [x] 2.10 Run `vendor/bin/pint tests/Feature/TwoFactorTest.php --format agent`
- [x] 2.11 Run `php artisan test --compact --filter=TwoFactorTest` and ensure all pass

## 3. Frontend — Auth Store & Types

- [x] 3.1 Open `resources/app/types/auth.ts`, add `TwoFactorChallengePayload` interface: `{ code?: string; recovery_code?: string }`
- [x] 3.2 Open `resources/app/stores/auth.ts`, add `requiresTwoFactor` ref: `const requiresTwoFactor = ref(false)`
- [x] 3.3 Update `login()` function: after `apiPost('/login', credentials)`, inspect the response — if response body contains `two_factor: true`, set `requiresTwoFactor.value = true` and return early (skip `fetchUser()`); otherwise call `fetchUser()` as before. Note: `apiPost` must return the response body — check if it already does or update it accordingly
- [x] 3.4 Update `logout()` function: add `requiresTwoFactor.value = false` alongside `user.value = null`
- [x] 3.5 Add `completeTwoFactorChallenge(payload: TwoFactorChallengePayload)` async function — `await apiPost('/two-factor-challenge', payload)`, then `await fetchUser()`, then `requiresTwoFactor.value = false`
- [x] 3.6 Export `requiresTwoFactor` and `completeTwoFactorChallenge` from the store's return object

## 4. Frontend — Router & Guards

- [x] 4.1 Open `resources/app/router/index.ts`, add route: `{ path: '/two-factor-challenge', name: 'two-factor-challenge', component: () => import('@/views/pages/auth/TwoFactorChallengePage.vue'), meta: { twoFactorOnly: true } }`
- [x] 4.2 Open `resources/app/router/guards.ts`, update the `requiresAuth` guard block: before redirecting to `login`, check `authStore.requiresTwoFactor`; if true, return `{ name: 'two-factor-challenge' }` instead
- [x] 4.3 Add guard for `twoFactorOnly` routes: if `to.meta.twoFactorOnly && !authStore.requiresTwoFactor`, return `{ name: 'login' }`
- [x] 4.4 Update the `guest` route guard: if `authStore.requiresTwoFactor`, return `{ name: 'two-factor-challenge' }` instead of the normal auth redirect

## 5. Frontend — TwoFactorChallengePage

- [x] 5.1 Create `resources/app/views/pages/auth/TwoFactorChallengePage.vue` — import `DefaultLayout`, `Card*`, `Input`, `Button`, `Label`, `FormField`, `FormItem`, `FormMessage` components, `useAuthStore`, `useRouter`, `ApiError`
- [x] 5.2 Add `useRecovery` ref (boolean) to toggle between TOTP and recovery code modes
- [x] 5.3 Add form with `useForm` (vee-validate) for the code field; field name changes depending on `useRecovery` mode
- [x] 5.4 Implement `onSubmit`: call `authStore.completeTwoFactorChallenge({ code } or { recovery_code })`, on success push to admin or home based on permissions; on 422 call `setErrors()`
- [x] 5.5 Template: DefaultLayout wrapper → Card with title "Two-Factor Confirmation" → input (type="text" for TOTP, type="text" for recovery) → submit button → toggle link between TOTP and recovery mode
- [x] 5.6 Add translation keys `twoFactor.title`, `twoFactor.codeLabel`, `twoFactor.recoveryCodeLabel`, `twoFactor.submit`, `twoFactor.useRecovery`, `twoFactor.useCode`, `twoFactor.description`, `twoFactor.recoveryDescription` to `resources/app/locales/en.ts` and `id.ts`

## 6. Frontend — TwoFactorForm Component (Profile Page)

- [x] 6.1 Create `resources/app/components/profile/TwoFactorForm.vue` — import `Card*`, `Button`, `Input`, `Label`, `Badge` components, `apiGet`, `apiPost`, `apiDelete`, `ApiError`
- [x] 6.2 Define component state: `step` ref (`'disabled' | 'confirm-password' | 'setup' | 'recovery-codes' | 'enabled'`), `qrCode` ref (string), `secretKey` ref (string), `recoveryCodes` ref (string[]), `passwordInput` ref (string), `totpCodeInput` ref (string), `confirmError` ref (string), `totpError` ref (string), `loading` ref (boolean)
- [x] 6.3 Implement `confirmPassword()` — POST `/user/confirm-password` with `{ password: passwordInput }`, on 422 set `confirmError`, on success advance step
- [x] 6.4 Implement `enableTwoFactor()` — POST `/user/two-factor-authentication`, then GET `/user/two-factor-qr-code` and GET `/user/two-factor-secret-key` in parallel, set `qrCode` and `secretKey`, advance to `'setup'` step
- [x] 6.5 Implement `confirmTwoFactor()` — POST `/user/confirmed-two-factor-authentication` with `{ code: totpCodeInput }`, on 422 set `totpError`, on success GET `/user/two-factor-recovery-codes`, set `recoveryCodes`, advance to `'recovery-codes'` step
- [x] 6.6 Implement `fetchRecoveryCodes()` — for "Regenerate" flow: POST `/user/two-factor-recovery-codes`, then GET `/user/two-factor-recovery-codes`, set `recoveryCodes`, advance to `'recovery-codes'` step
- [x] 6.7 Implement `disableTwoFactor()` — DELETE `/user/two-factor-authentication`, reset all state, set step to `'disabled'`
- [x] 6.8 Implement `onMounted` check: GET `/user/confirmed-password-status` — not needed; instead determine initial step based on prop `isTwoFactorEnabled` passed from ProfilePage
- [x] 6.9 Template — `'disabled'` step: status badge "Disabled" + "Enable 2FA" button
- [x] 6.10 Template — `'confirm-password'` step: password input + "Confirm Password" button + error display
- [x] 6.11 Template — `'setup'` step: QR SVG rendered via `v-html`, plaintext secret in monospace box, TOTP code input + "Verify & Activate" button
- [x] 6.12 Template — `'recovery-codes'` step: list of recovery codes in a preformatted box with "Copy All" button + "Done" button (advances to `'enabled'`)
- [x] 6.13 Template — `'enabled'` step: status badge "Enabled" + "Regenerate Recovery Codes" button + "Disable 2FA" button
- [x] 6.14 Add translation keys `twoFactor.*` to `resources/app/locales/en.ts` and `id.ts`: `enable`, `disable`, `enabled`, `disabled`, `confirmPassword`, `confirmPasswordDescription`, `scanQrCode`, `manualEntry`, `verifyCode`, `recoveryCodes`, `saveRecoveryCodes`, `regenerateCodes`, `done`, `status`

## 7. Frontend — Wire TwoFactorForm into ProfilePage

- [x] 7.1 Open `resources/app/views/pages/ProfilePage.vue`, import `TwoFactorForm` from `@/components/profile/TwoFactorForm.vue`
- [x] 7.2 Add `isTwoFactorEnabled` computed: `!!authStore.user?.two_factor_confirmed_at` — this requires the auth User type to expose `two_factor_confirmed_at`
- [x] 7.3 Open `resources/app/types/auth.ts`, add `two_factor_confirmed_at: string | null` to the `User` interface
- [x] 7.4 Open `app/Http/Resources/UserResource.php`, add `two_factor_confirmed_at` to the resource array (check if it's already included; if not, add `'two_factor_confirmed_at' => $this->two_factor_confirmed_at`)
- [x] 7.5 Add `<TwoFactorForm :is-two-factor-enabled="isTwoFactorEnabled" />` in both AdminLayout and DefaultLayout template sections of ProfilePage, alongside the other forms
- [x] 7.6 Run `vendor/bin/pint app/Http/Resources/UserResource.php --format agent`

## 8. Frontend — Update LoginPage for 2FA redirect

- [x] 8.1 Open `resources/app/views/pages/auth/LoginPage.vue`, update `onSubmit`: after `await authStore.login(values)`, check `authStore.requiresTwoFactor`; if true, `router.push({ name: 'two-factor-challenge' })` instead of the normal redirect

## 9. Build Verification

- [x] 9.1 Run `npm run build` and ensure zero TypeScript/build errors

## 10. E2E Tests

- [x] 10.1 Create `tests/e2e/tests/superadmin/two-factor.spec.ts` with `test.describe('Superadmin — Two-Factor Authentication')`
- [x] 10.2 Add test: `can see 2FA section on profile page` — goto `/profile`, assert 2FA card visible, assert "Enable" button visible (superadmin starts without 2FA)
- [x] 10.3 Add test: `can start 2FA enable flow` — click "Enable Two-Factor Authentication", assert password confirmation input visible
- [x] 10.4 Add test: `password confirmation advances to setup step` — click Enable, fill password (`123123`), click Confirm, assert QR code SVG visible, assert TOTP input visible
- [x] 10.5 Add test: `can see manual secret key during setup` — during setup step, assert plaintext secret is visible (non-empty text)
- [x] 10.6 Add test: `two-factor-challenge page is accessible` — manually set up 2FA for a test user via Tinker/seeder, log in, assert redirect to `/two-factor-challenge`, assert code input visible
- [x] 10.7 Run `npx playwright test tests/e2e/tests/superadmin/two-factor.spec.ts --config=tests/e2e/playwright.config.ts` and ensure all pass

## 11. Final Verification

- [x] 11.1 Run `php artisan test --compact --filter=TwoFactorTest` — all pass
- [x] 11.2 Run `npm run build` — zero errors
- [x] 11.3 Run `npx playwright test tests/e2e/tests/superadmin/two-factor.spec.ts --config=tests/e2e/playwright.config.ts` — all pass
