## Context

`/profile` is currently a placeholder. The backend already has:
- `PUT /user/profile-information` (Fortify) — handles `name` and `email`
- `PUT /user/password` (Fortify) — handles password change
- `PUT /api/users/{user}/avatar` (UserController) — handles avatar upload, uses `edit-profile` permission

The seeder already grants `edit-profile` to all three roles: superadmin (all permissions), admin, and user. No permission or seeder changes are needed.

Key constraint: `UpdateUserRequest` currently requires `roles` field, making it unsuitable for self-update. The `UpdateUserProfileInformation` Fortify action only handles `name` and `email`, and the User model uses a single `name` field (no `first_name`/`last_name` split). Username update will need the existing `PUT /api/users/{user}` endpoint, scoped to self-update only.

## Goals / Non-Goals

**Goals:**
- Functional profile info form (`name`, `username`) for all three roles
- Functional password change form for all three roles
- Avatar upload + remove with live preview for all three roles
- Three reusable components in `resources/app/components/profile/`
- Full EN/ID translations for all new strings
- Pest tests per role (run-and-fix until all pass)
- Playwright tests per role (run-and-fix until all pass)

**Non-Goals:**
- Email change (by design: email is not editable)
- 2FA activation (separate change)
- Admin editing another user's profile via profile page (that is UsersPage)
- Notifications, activity log, session management

## Decisions

### 1. Three reusable components in `resources/app/components/profile/`

- `ProfileInfoForm.vue` — name + username form
- `PasswordForm.vue` — current + new + confirmation password form
- `AvatarUpload.vue` — avatar preview + upload/remove controls

**Rationale**: Each form targets a different endpoint, has independent loading state, and independent validation errors. Splitting keeps each component focused and makes them reusable outside ProfilePage.

### 2. Two endpoints for info update: Fortify for name, API for username

- `PUT /user/profile-information` → updates `name` (Fortify, CSRF-safe)
- `PUT /api/users/{user}` → for username — but `UpdateUserRequest` requires `roles`, which is wrong for self-update

**Resolution**: Update `UpdateUserRequest` to make `roles` nullable/optional for self-update, OR create a dedicated `UpdateProfileRequest` that only validates `name` and `username` without `roles`. Preferred: dedicated `UpdateProfileRequest` to avoid breaking the admin user management flow.

**Alternative considered**: Use only Fortify for everything. Rejected because Fortify action only handles `name` + `email`, not `username`.

### 3. Auth store refreshed after successful updates

After info form or avatar upload succeeds, call `authStore.fetchUser()` to reflect the updated name/avatar in the navbar/header without page reload.

### 4. `ProfilePage.vue` stays a single file with conditional layout

`AdminLayout` for users with `access-admin-panel` permission, `DefaultLayout` for user role. Same form components rendered in both layouts — no duplication.

### 5. `UpdateUserRequest` — use a new `UpdateProfileRequest`

Rather than making `roles` optional in `UpdateUserRequest` (which could accidentally allow partial updates from the admin panel), create `UpdateProfileRequest` with only `name` and `username` rules. This keeps the two flows cleanly separated.

### 6. Pest tests: expand `ProfileUpdateTest.php` + new `ProfileAvatarTest.php`

Keeps file sizes manageable and test intent clear.

### 7. Playwright: one spec file per role

- `tests/e2e/tests/user/profile.spec.ts` — expand existing file
- `tests/e2e/tests/admin/profile.spec.ts` — new
- `tests/e2e/tests/superadmin/profile.spec.ts` — new

## Risks / Trade-offs

- **[Risk] `updateAvatar` authorization check** — verify it uses `edit-profile` not `update-users`, otherwise user role will get 403. → Check `UserController@updateAvatar` before implementation.
- **[Risk] Self-update via `/api/users/{user}`** — currently admin-only flow. Need `UpdateProfileRequest` to avoid requiring `roles`. → Create dedicated request class.
- **[Trade-off] Separate Save buttons per section** — each form saves independently (not one "Save All"). Clearer UX, avoids partial update issues if one section fails.

## Migration Plan

No database migrations needed. All endpoints already exist. Steps:

1. Create `UpdateProfileRequest` 
2. Add route or reuse existing for self-update with new request
3. Build three frontend components
4. Refactor `ProfilePage.vue`
5. Add translations
6. Run Pest tests → fix until pass
7. Run Playwright tests → fix until pass
8. Run `npm run build` + `vue-tsc --noEmit`

## Open Questions

- Does `UserController@updateAvatar` policy correctly allow all roles (not just `update-users`)? → Confirmed: uses `edit-profile`. No change needed.
