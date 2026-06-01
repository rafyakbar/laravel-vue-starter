## 1. Backend — Audit Existing Endpoints

- [x] 1.1 Read `app/Actions/Fortify/UpdateUserProfileInformation.php` — confirm it handles `name` field (single field, no first/last split)
- [x] 1.2 Read `app/Http/Requests/UpdateUserRequest.php` — confirm `roles` is required, which makes it unsuitable for self-update (profile page must not require `roles`)
- [x] 1.3 Read `app/Http/Controllers/UserController.php` `updateAvatar()` — confirm it uses `$this->authorize('edit-profile')` not `update-users`
- [x] 1.4 Read `app/Http/Resources/UserResource.php` — confirm `name`, `username`, and avatar URL fields are exposed for use in the profile form

## 2. Backend — Create UpdateProfileRequest

- [x] 2.1 Run `php artisan make:request UpdateProfileRequest --no-interaction`
- [x] 2.2 Add validation rules: `name` required string max:255, `username` required string max:255 unique:users,username ignoring the current user's ID
- [x] 2.3 Do NOT include `roles`, `permissions`, `password`, or `email` — this request is strictly for profile self-update
- [x] 2.4 Run `vendor/bin/pint --dirty --format agent`

## 3. Backend — Wire Self-Update Route

- [x] 3.1 Check `routes/api.php` — determine if `PUT /api/users/{user}` can be reused with `UpdateProfileRequest` for self-update, or if a dedicated `PUT /api/profile` route is needed
- [x] 3.2 If reusing existing route: update `UserController@update` to accept either `UpdateUserRequest` (admin flow) or `UpdateProfileRequest` (self-update) based on whether the target user is the authenticated user — or use a separate controller method
- [x] 3.3 If adding new route: add `Route::put('/profile', [ProfileController::class, 'update'])` with `auth:sanctum` middleware, create `ProfileController` via `php artisan make:controller ProfileController --no-interaction`
- [x] 3.4 Run `vendor/bin/pint --dirty --format agent`

## 4. Backend — Pest Tests: Seeder Coverage

- [x] 4.1 Open `tests/Feature/Authorization/RolesAndPermissionsSeederTest.php` (or create it via `php artisan make:test --pest RolesAndPermissionsSeederTest --no-interaction`)
- [x] 4.2 Add test: `it('superadmin has edit-profile permission after seeding')` — seed, create superadmin user, assert `$user->can('edit-profile')` is true
- [x] 4.3 Add test: `it('admin has edit-profile permission after seeding')` — seed, create admin user, assert `$user->can('edit-profile')` is true
- [x] 4.4 Add test: `it('user role has edit-profile permission after seeding')` — seed, create user, assert `$user->can('edit-profile')` is true
- [x] 4.5 Run `php artisan test --compact --filter=RolesAndPermissionsSeederTest` — fix any failures before proceeding

## 5. Backend — Pest Tests: Profile Info Update Per Role

- [x] 5.1 Open `tests/Feature/Auth/ProfileUpdateTest.php`
- [x] 5.2 Replace generic `User::factory()->create()` tests with role-explicit versions using `actingAsSuperadmin()`, `actingAsAdmin()`, `actingAsUser()` helpers from `tests/Pest.php`
- [x] 5.3 Add test: `it('superadmin can update their profile info')` — PUT to profile update endpoint, assert 200, assert name updated in DB
- [x] 5.4 Add test: `it('admin can update their profile info')` — same pattern
- [x] 5.5 Add test: `it('user role can update their profile info')` — same pattern
- [x] 5.6 Add test: `it('username belonging to another user is rejected')` — assert 422 with error on username field
- [x] 5.7 Add test: `it('current user can submit their own username without conflict')` — assert 200
- [x] 5.8 Run `php artisan test --compact --filter=ProfileUpdateTest` — fix any failures before proceeding

## 6. Backend — Pest Tests: Password Change Per Role

- [x] 6.1 Add test: `it('superadmin can change their password')` — PUT `/user/password` with correct current_password, assert 200, assert new password hashes correctly
- [x] 6.2 Add test: `it('admin can change their password')` — same pattern
- [x] 6.3 Add test: `it('user role can change their password')` — same pattern
- [x] 6.4 Add test: `it('wrong current password is rejected for any role')` — assert 422 on `current_password` field
- [x] 6.5 Run `php artisan test --compact --filter=ProfileUpdateTest` — fix any failures before proceeding

## 7. Backend — Pest Tests: Avatar Per Role

- [x] 7.1 Run `php artisan make:test --pest ProfileAvatarTest --no-interaction`
- [x] 7.2 Add test: `it('superadmin can upload their own avatar')` — PUT `/api/users/{self->id}/avatar` with `UploadedFile::fake()->image('avatar.jpg')`, assert 200
- [x] 7.3 Add test: `it('admin can upload their own avatar')` — same pattern
- [x] 7.4 Add test: `it('user role can upload their own avatar')` — same pattern
- [x] 7.5 Add test: `it('user role cannot upload another user avatar')` — PUT `/api/users/{other->id}/avatar`, assert 403
- [x] 7.6 Add test: `it('non-image file is rejected')` — upload `.pdf`, assert 422
- [x] 7.7 Run `php artisan test --compact --filter=ProfileAvatarTest` — fix any failures before proceeding

## 8. Backend — Full Test Suite Verification

- [x] 8.1 Run `php artisan test --compact` — all tests pass, zero regressions
- [x] 8.2 If any tests fail, fix them before moving to frontend work

## 9. Frontend — Translations

- [x] 9.1 Open `resources/app/locales/en.ts`, update `pages.profile` section — remove `comingSoon` and `comingSoonText`, add:
  - `infoTitle: 'Profile Information'`, `infoDescription: 'Update your name and username'`
  - `name: 'Name'`, `username: 'Username'`
  - `passwordTitle: 'Change Password'`, `passwordDescription: 'Ensure your account uses a strong password'`
  - `currentPassword: 'Current Password'`, `newPassword: 'New Password'`, `confirmPassword: 'Confirm Password'`
  - `avatarTitle: 'Avatar'`, `avatarDescription: 'Upload a photo to personalize your account'`
  - `uploadAvatar: 'Upload Avatar'`, `changeAvatar: 'Change Avatar'`, `removeAvatar: 'Remove Avatar'`
  - `saveChanges: 'Save Changes'`, `saving: 'Saving...'`
  - `updateSuccess: 'Profile updated successfully'`, `passwordSuccess: 'Password changed successfully'`
  - `avatarSuccess: 'Avatar updated successfully'`, `avatarRemoved: 'Avatar removed'`
- [x] 9.2 Update `resources/app/locales/id.ts` — add identical keys with Indonesian translations
- [x] 9.3 Run `npx vue-tsc --noEmit` — TypeScript must pass (locale shape is type-checked)

## 10. Frontend — ProfileInfoForm Component

- [x] 10.1 Create directory `resources/app/components/profile/`
- [x] 10.2 Create `resources/app/components/profile/ProfileInfoForm.vue` with `<script setup lang="ts">`
  - Props: `user: User` (User type from `@/types/auth`)
  - Use vee-validate `useForm` with initial values `{ name: user.name, username: user.username }`
  - Fields: `name` (required), `username` (required)
  - Submit to profile update endpoint with `credentials: 'include'`
  - On success: emit `saved`, show `toast.success(t('pages.profile.updateSuccess'))`, call `authStore.fetchUser()`
  - On 422: call `setErrors(e.response.data.errors)`
  - Use shadcn-vue: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`
  - All labels use `t('pages.profile.*')`
  - Loading state on submit button using `isSubmitting`

## 11. Frontend — PasswordForm Component

- [x] 11.1 Create `resources/app/components/profile/PasswordForm.vue` with `<script setup lang="ts">`
  - No props needed (endpoint always targets the current authenticated user)
  - Fields: `current_password`, `password`, `password_confirmation` — all type `password`
  - Submit to `PUT /user/password`
  - On success: reset form fields, show `toast.success(t('pages.profile.passwordSuccess'))`
  - On 422: call `setErrors(e.response.data.errors)`
  - Loading state on submit button

## 12. Frontend — AvatarUpload Component

- [x] 12.1 Create `resources/app/components/profile/AvatarUpload.vue` with `<script setup lang="ts">`
  - Props: `userId: number`, `currentAvatarUrl: string | null | undefined`
  - Local state: `previewUrl` (starts as `currentAvatarUrl`)
  - Display: if `previewUrl` is set, show `<img>` preview; otherwise show `UserInitials`
  - Hidden `<input type="file" accept="image/*">` triggered by "Change Avatar" / "Upload Avatar" button
  - On file selected: set `previewUrl = URL.createObjectURL(file)` for immediate preview
  - On upload submit: send `FormData` via `PUT /api/users/{userId}/avatar`, emit `uploaded` with new URL, show `toast.success(t('pages.profile.avatarSuccess'))`
  - Remove button: only show when avatar exists, call DELETE avatar endpoint, set `previewUrl = null`, emit `removed`, show `toast.success(t('pages.profile.avatarRemoved'))`
  - Separate loading states for upload and remove actions

## 13. Frontend — Refactor ProfilePage.vue

- [x] 13.1 Open `resources/app/views/pages/ProfilePage.vue`
- [x] 13.2 Import `ProfileInfoForm`, `PasswordForm`, `AvatarUpload` from `@/components/profile/`
- [x] 13.3 In the `AdminLayout` section: replace the "Coming Soon" placeholder with three sections — `AvatarUpload`, `ProfileInfoForm`, `PasswordForm` — using `BasicPage` + consistent card/section spacing
- [x] 13.4 In the `DefaultLayout` section: replace the "Coming Soon" placeholder with the same three components
- [x] 13.5 Wire `AvatarUpload` `uploaded` event → call `authStore.fetchUser()`
- [x] 13.6 Wire `ProfileInfoForm` `saved` event → call `authStore.fetchUser()`
- [x] 13.7 Remove the standalone sign-out button from DefaultLayout section (already handled by layout/navbar)

## 14. Frontend — Build & TypeScript Verification

- [x] 14.1 Run `npx vue-tsc --noEmit` — fix any TypeScript errors before continuing
- [x] 14.2 Run `npm run build` — production build must be clean, fix any errors before continuing

## 15. E2E — Playwright Tests: User Role

- [x] 15.1 Open `tests/e2e/tests/user/profile.spec.ts`
- [x] 15.2 Keep existing tests (layout check, name/email display, Coming Soon → update to reflect new UI)
- [x] 15.3 Add test: `it('profile info form shows current name and username fields')` — assert both input fields are visible and filled
- [x] 15.4 Add test: `it('password form shows three password fields')` — assert current_password, new_password, confirm_password fields are visible
- [x] 15.5 Add test: `it('avatar upload section is visible')` — assert upload/change avatar button is present
- [x] 15.6 Add test: `it('user sees DefaultLayout — no admin sidebar')` — assert Dashboard nav link is not visible
- [x] 15.7 Run `npm run test:e2e -- --grep "User Role.*Profile"` — fix any failures before proceeding

## 16. E2E — Playwright Tests: Admin Role

- [x] 16.1 Create `tests/e2e/tests/admin/profile.spec.ts`
- [x] 16.2 Add `test.use({ storageState: path.join(__dirname, '../../.auth/admin.json') })` at top of describe block
- [x] 16.3 Add `beforeEach`: navigate to `/profile` and wait for `networkidle`
- [x] 16.4 Add test: `it('admin can access /profile')` — assert heading "Profile" is visible
- [x] 16.5 Add test: `it('admin sees AdminLayout with sidebar')` — assert Dashboard nav link is visible in sidebar
- [x] 16.6 Add test: `it('profile info form shows name and username fields')` — assert both fields are visible
- [x] 16.7 Add test: `it('password form is visible')` — assert current_password field is present
- [x] 16.8 Add test: `it('avatar upload section is visible')` — assert upload/change avatar button is present
- [x] 16.9 Run `npm run test:e2e -- --grep "Admin.*Profile"` — fix any failures before proceeding

## 17. E2E — Playwright Tests: Superadmin Role

- [x] 17.1 Create `tests/e2e/tests/superadmin/profile.spec.ts`
- [x] 17.2 Add `test.use({ storageState: path.join(__dirname, '../../.auth/superadmin.json') })` at top of describe block
- [x] 17.3 Add `beforeEach`: navigate to `/profile` and wait for `networkidle`
- [x] 17.4 Add test: `it('superadmin can access /profile')` — assert heading "Profile" is visible
- [x] 17.5 Add test: `it('superadmin sees AdminLayout with sidebar')` — assert Dashboard nav link is visible in sidebar
- [x] 17.6 Add test: `it('profile info form shows name and username fields')` — assert both fields are visible
- [x] 17.7 Add test: `it('password form is visible')` — assert current_password field is present
- [x] 17.8 Add test: `it('avatar upload section is visible')` — assert upload/change avatar button is present
- [x] 17.9 Run `npm run test:e2e -- --grep "Superadmin.*Profile"` — fix any failures before proceeding

## 18. E2E — Full Suite Verification

- [x] 18.1 Run `npm run test:e2e -- --grep "profile|Profile"` — all profile-related tests across all roles pass
- [x] 18.2 Run full `npm run test:e2e` — no regressions in any other test
- [x] 18.3 If any test fails, fix the root cause (do not skip or comment out tests)
