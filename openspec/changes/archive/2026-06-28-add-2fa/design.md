## Context

Laravel Fortify ships with full TOTP-based 2FA support (enable, QR setup, confirmation, recovery codes, challenge verification). The database migration has already run — columns `two_factor_secret`, `two_factor_recovery_codes`, and `two_factor_confirmed_at` exist. The feature is only disabled in `config/fortify.php` and the `User` model lacks the required trait. The frontend has no 2FA-aware login flow or profile management UI.

The app is a headless SPA (Vue 3 + Sanctum cookie-based auth). Fortify's `views: false` is already set, so all Fortify endpoints respond with JSON — suitable for SPA consumption.

## Goals / Non-Goals

**Goals:**
- Enable and expose all Fortify 2FA endpoints
- Auth store detects `{ two_factor: true }` on login and holds a pending-challenge state
- Dedicated `/two-factor-challenge` page for TOTP code or recovery code input
- Profile page 2FA section: enable (QR + confirm), disable, view/regenerate recovery codes
- Password confirmation required before all sensitive 2FA management actions
- 2FA is optional — users choose to enable it

**Non-Goals:**
- Mandatory 2FA enforcement for specific roles
- SMS/email OTP (only TOTP via authenticator app)
- Passkey/WebAuthn 2FA
- Admin ability to force-enable 2FA for other users

## Decisions

### 1. Use Fortify's built-in 2FA endpoints, not custom ones
**Decision**: All 2FA management and challenge logic uses Fortify endpoints directly.
**Rationale**: Fortify handles all complexity — TOTP secret generation, QR code SVG, recovery code hashing, challenge verification. Writing custom equivalents would duplicate well-tested cryptographic code.
**Endpoints used:**
- `POST /user/two-factor-authentication` — enable
- `DELETE /user/two-factor-authentication` — disable
- `GET /user/two-factor-qr-code` — SVG QR for setup
- `GET /user/two-factor-secret-key` — plaintext secret for manual entry
- `POST /user/confirmed-two-factor-authentication` — confirm setup with TOTP code
- `GET /user/two-factor-recovery-codes` — list recovery codes
- `POST /user/two-factor-recovery-codes` — regenerate codes
- `POST /two-factor-challenge` — verify code during login

### 2. `requiresTwoFactor` state lives only in authStore (not persisted)
**Decision**: A `requiresTwoFactor` ref in authStore, cleared on success or logout.
**Rationale**: If the user refreshes the page during the 2FA challenge, they should start login from scratch — this is secure by design. sessionStorage persistence would add complexity with no meaningful UX benefit (the challenge page is a few seconds of interaction).

### 3. `login()` inspects POST /login response body for `{ two_factor: true }`
**Decision**: `authStore.login()` checks the JSON response from `POST /login`. If `two_factor === true`, it sets `requiresTwoFactor = true` and returns without calling `fetchUser()`. The caller (LoginPage) checks the flag and navigates to `/two-factor-challenge`.
**Rationale**: Fortify guarantees this response shape for SPA requests (requests with `Accept: application/json` or `X-Requested-With`). The current `apiPost()` already sends `X-Requested-With: XMLHttpRequest`.

### 4. `/two-factor-challenge` route is `twoFactorOnly` meta
**Decision**: A new route meta flag `twoFactorOnly: true`. The guard redirects to `/login` if `requiresTwoFactor` is false.
**Rationale**: The challenge page is only meaningful mid-login-flow. Without the guard, a user could navigate to it directly at any time.

### 5. Password confirmation before 2FA management actions
**Decision**: Fortify's `confirmPassword: true` config option is enabled. Before calling enable/disable/view codes, the frontend posts to `POST /user/confirm-password` and handles the response. A `password_confirmation_timeout` session window (Fortify default: 10800s / 3h) means the user won't be asked again within the same session.
**Rationale**: Standard security practice for sensitive account actions. Consistent with how Fortify documents this pattern.

### 6. TwoFactorForm component in Profile page (not a separate page)
**Decision**: A `TwoFactorForm.vue` component alongside the existing `ProfileInfoForm` and `PasswordForm`, rendered in a card on the same Profile page.
**Rationale**: 2FA management is an account setting — it belongs on the profile page with other security settings. A separate page would fragment the settings UX.

### 7. Enable flow is multi-step within TwoFactorForm (not a dialog)
**Decision**: Inline step progression inside the card component.
```
Step 0 (disabled):  [Enable 2FA] btn
Step 1 (confirming password): password input
Step 2 (setup):     QR code + manual secret + TOTP confirm input
Step 3 (codes):     Recovery codes display + [Done] btn → back to enabled state
Enabled state:      Status badge + [Regenerate Codes] + [Disable 2FA]
```
**Rationale**: The setup flow has clear linear steps. Inline progression avoids the UX overhead of dialogs while keeping the flow visible. Recovery codes MUST be shown immediately after confirmation — the user cannot miss this step.

## Risks / Trade-offs

- **[Risk] User loses phone/authenticator** → Mitigation: Recovery codes shown during setup and regeneratable. Users should save them. The profile page makes regeneration accessible.
- **[Risk] Frontend shows recovery codes in plaintext** → Mitigation: This is intentional and expected — Fortify provides them once during setup. The frontend fetches them via `GET /user/two-factor-recovery-codes`, which requires an active session.
- **[Risk] `two_factor: true` response not detected if API wrapper changes** → Mitigation: `authStore.login()` will explicitly type the login response and check the field. If structure changes, TypeScript will surface it.
- **[Risk] Confirm password window expiry mid-flow** → Mitigation: If a 2FA management endpoint returns 423 (password confirmation required), frontend re-prompts password confirmation.

## File Paths

**Backend (modified):**
- `config/fortify.php` — uncomment `twoFactorAuthentication`
- `app/Models/User.php` — add `TwoFactorAuthenticatable` trait

**Frontend (new):**
- `resources/app/views/pages/auth/TwoFactorChallengePage.vue`
- `resources/app/components/profile/TwoFactorForm.vue`

**Frontend (modified):**
- `resources/app/stores/auth.ts` — `requiresTwoFactor` ref + updated `login()`
- `resources/app/router/index.ts` — new route
- `resources/app/router/guards.ts` — `twoFactorOnly` guard + 2FA intercept
- `resources/app/views/pages/ProfilePage.vue` — add `TwoFactorForm`
- `resources/app/types/auth.ts` — add `TwoFactorChallengePayload`
- `resources/app/locales/en.ts` + `id.ts`

**Tests:**
- `tests/Feature/TwoFactorTest.php` — Pest feature tests
- `tests/e2e/tests/superadmin/two-factor.spec.ts` — E2E full flow
