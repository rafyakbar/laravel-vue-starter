## Why

`/profile` currently shows only user info (name, email, role badge) with a "Coming Soon" placeholder. All three roles (superadmin, admin, user) already have the `edit-profile` permission via the seeder, but there is no UI to actually use it. The profile page needs to be a fully functional form for editing name, username, password, and avatar — a baseline requirement before this starter kit can serve as a foundation for real projects.

## What Changes

- Implement profile info form (name, username) for all roles
- Implement password change form (current password + new password + confirmation) for all roles
- Implement avatar upload and remove with live preview for all roles
- Extract form logic into three reusable components: `ProfileInfoForm`, `PasswordForm`, `AvatarUpload` — usable independently outside `ProfilePage`
- Refactor `ProfilePage.vue` to use these reusable components, removing the "Coming Soon" placeholder
- `AdminLayout` retained for admin/superadmin, `DefaultLayout` for user role
- Add EN/ID translations for all new strings
- Add Pest tests (backend) per role with run-and-fix loop
- Add Playwright tests (e2e) per role with run-and-fix loop

## Capabilities

### New Capabilities

- `profile-management`: Fully functional profile edit page (info + password + avatar) for all roles, using reusable components and conditional layout per role

### Modified Capabilities

- `authorization`: Add test coverage asserting that `edit-profile` permission works correctly for all three roles — superadmin, admin, and user can each update their own profile, but cannot update another user's profile via the avatar endpoint

## Impact

- `resources/app/views/pages/ProfilePage.vue` — refactored from placeholder to full implementation
- `resources/app/components/profile/` — new directory with `ProfileInfoForm.vue`, `PasswordForm.vue`, `AvatarUpload.vue`
- `resources/app/locales/en.ts` + `id.ts` — add keys under `pages.profile`
- `app/Http/Controllers/UserController.php` — verify `updateAvatar()` uses `edit-profile` (not `update-users`) so all roles can upload their own avatar
- `app/Http/Requests/UpdateUserRequest.php` — verify self-update works without requiring `roles` field (currently required)
- `tests/Feature/Auth/ProfileUpdateTest.php` — expand with per-role tests
- `tests/Feature/Auth/ProfileAvatarTest.php` — new file for avatar-specific tests
- `tests/e2e/tests/user/profile.spec.ts` — expand with form interaction tests
- `tests/e2e/tests/admin/profile.spec.ts` — new file for admin profile tests
- `tests/e2e/tests/superadmin/profile.spec.ts` — new file for superadmin profile tests
