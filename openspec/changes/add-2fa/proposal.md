## Why

Users and administrators have no second factor of authentication beyond password, creating a security gap for accounts with elevated privileges. Adding TOTP-based 2FA via Fortify closes this gap with minimal infrastructure overhead since the database columns already exist.

## What Changes

- Enable `Features::twoFactorAuthentication()` in Fortify config (currently commented out)
- Add `TwoFactorAuthenticatable` trait to `User` model
- Update `authStore.login()` to detect Fortify's `{ two_factor: true }` response and hold a pending-challenge state
- Add `/two-factor-challenge` route and page (TOTP code or recovery code input)
- Update Vue Router guards to handle the 2FA-pending state
- Add 2FA management section to Profile page: enable (QR setup + confirmation), disable, view/regenerate recovery codes
- All sensitive 2FA management actions (enable, disable, view/regenerate codes) require password confirmation via `POST /user/confirm-password`

## Capabilities

### New Capabilities

- `two-factor-backend`: Fortify 2FA backend — enable/disable endpoints, QR code, secret key, recovery codes, and challenge verification via `POST /two-factor-challenge`; password confirmation guard
- `two-factor-auth-flow`: Frontend login challenge flow — auth store pending state, `TwoFactorChallengePage`, Vue Router guard for the challenge route
- `two-factor-profile`: Profile page 2FA management section — step-by-step enable flow (QR + confirm), disable, view and regenerate recovery codes

### Modified Capabilities

- `spa-auth-flow`: `authStore.login()` now detects `{ two_factor: true }` response and sets `requiresTwoFactor` state instead of calling `fetchUser()`; router guards updated to redirect to challenge when 2FA is pending
- `auth-backend`: Fortify `twoFactorAuthentication` feature enabled; `User` model uses `TwoFactorAuthenticatable` trait; password confirmation rate-limited at `POST /user/confirm-password`

## Impact

- `config/fortify.php` — uncomment `Features::twoFactorAuthentication([confirm: true, confirmPassword: true])`
- `app/Models/User.php` — add `use TwoFactorAuthenticatable` trait
- `resources/app/stores/auth.ts` — add `requiresTwoFactor` ref, update `login()`
- `resources/app/router/index.ts` — add `/two-factor-challenge` route
- `resources/app/router/guards.ts` — add `twoFactorOnly` guard and 2FA intercept
- `resources/app/views/pages/auth/TwoFactorChallengePage.vue` — new page
- `resources/app/views/pages/ProfilePage.vue` + new `TwoFactorForm` component
- `resources/app/types/auth.ts` — add `TwoFactorChallengePayload` type
- `resources/app/locales/en.ts` + `id.ts` — new translation keys
- No new packages required (Fortify 2FA is built-in)
- No new migrations required (columns already exist from `add_two_factor_columns_to_users_table`)
