## 1. Install Composer Packages

- [x] 1.1 Install Fortify, Sanctum, Spatie Permission, and MediaLibrary: `composer require laravel/fortify laravel/sanctum spatie/laravel-permission spatie/laravel-medialibrary --no-interaction`
- [x] 1.2 Publish Fortify config and migrations: `php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider" --no-interaction`
- [x] 1.3 Publish Sanctum config: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --no-interaction`
- [x] 1.4 Publish MediaLibrary migration: `php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations" --no-interaction`
- [x] 1.5 Publish Spatie Permission config and migrations: `php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --no-interaction`

## 2. Database Migrations

- [x] 2.1 Update `0001_01_01_000000_create_users_table.php` — add `username` unique column after `name`
- [x] 2.2 Run all migrations: `php artisan migrate --force`

## 3. Configuration Files

- [x] 3.1 Create `config/fortify.php` — guard: web, views: false, features: registration, resetPasswords, emailVerification, updateProfileInformation, updatePasswords
- [x] 3.2 Create `config/cors.php` — paths for auth endpoints, supports_credentials: true
- [x] 3.3 Update `config/sanctum.php` if needed (should be published already)
- [x] 3.4 Verify `config/permission.php` is published (default settings are sufficient)
- [x] 3.5 Update `bootstrap/app.php` — add `statefulApi()`, `apply_locale` alias, add API routing

## 4. Providers and Auth Actions

- [x] 4.1 Create `app/Providers/FortifyServiceProvider.php` — register auth actions, rate limiters, custom `authenticateUsing` callback (email or username detection based on `@` in input)
- [x] 4.2 Register FortifyServiceProvider in `bootstrap/providers.php`
- [x] 4.3 Create `app/Actions/Fortify/CreateNewUser.php` — assigns `regular` role on registration via `assignRole('regular')`
- [x] 4.4 Create `app/Actions/Fortify/PasswordValidationRules.php` — trait with reusable password validation rules
- [x] 4.5 Create `app/Actions/Fortify/ResetUserPassword.php`
- [x] 4.6 Create `app/Actions/Fortify/UpdateUserPassword.php`
- [x] 4.7 Create `app/Actions/Fortify/UpdateUserProfileInformation.php`
- [x] 4.8 Create `app/Http/Responses/LoginResponse.php` — returns JSON with user data
- [x] 4.9 Update `app/Providers/AppServiceProvider.php` — bind LoginResponse contract, register `Gate::before` for admin role super-access, reset password URL, rate limiters

## 5. Models and Traits

- [x] 5.1 Update `app/Models/User.php` — add HasApiTokens, HasRoles (Spatie), InteractsWithMedia, Filterable, Searchable, guarded, hidden, appends, searchFields, avatar methods, registerMediaConversions
- [x] 5.2 Create `app/Traits/Filterable.php` — scopeFilter for dynamic column filtering
- [x] 5.3 Create `app/Traits/Searchable.php` — scopeSearch for keyword search
- [x] 5.4 Create `app/Utilities/Data.php` — helper for array take/manipulation

## 6. Controllers and Middleware

- [x] 6.1 Update `app/Http/Controllers/Controller.php` — add base response helper methods (responseSuccess, responseStoreSuccess, responseUpdateSuccess, responseDeleteSuccess, responseFail, etc.)
- [x] 6.2 Create `app/Http/Controllers/AuthController.php` — invokable, returns current user with permissions and roles
- [x] 6.3 Create `app/Http/Controllers/UserController.php` — full CRUD with authorization (uses `$this->authorize()` with permission names)
- [x] 6.4 Create `app/Http/Controllers/RoleController.php` — search endpoint using Spatie's Role model
- [x] 6.5 Create `app/Http/Controllers/TokenController.php` — generate Sanctum token for mobile clients
- [x] 6.6 Create `app/Http/Middleware/ApplyLocale.php` — reads X-Locale header
- [x] 6.7 Create `app/Http/Middleware/RedirectIfAuthenticated.php` — custom redirect for already-authenticated users (JSON response for XHR)

## 7. Services

- [x] 7.1 Create `app/Services/User/UserService.php` — index, create, update, delete, updateAvatar, syncRoles
- [x] 7.2 Create `app/Services/Role/RoleService.php` — search roles using Spatie's Role model
- [x] 7.3 Create `app/Services/Media/MediaService.php` — replace media helper

## 8. Form Requests and API Resources

- [x] 8.1 Create `app/Http/Requests/BaseRequest.php` — extends FormRequest
- [x] 8.2 Create `app/Http/Requests/StoreUserRequest.php`
- [x] 8.3 Create `app/Http/Requests/UpdateUserRequest.php`
- [x] 8.4 Create `app/Http/Requests/UpdateAvatarRequest.php`
- [x] 8.5 Create `app/Http/Requests/DestroyUserRequest.php`
- [x] 8.6 Create `app/Http/Resources/UserResource.php` — transform with avatar URLs, timestamps, roles, permissions
- [x] 8.7 Create `app/Http/Resources/UserBasicResource.php` — simplified resource (id, name, email)
- [x] 8.8 Create `app/Http/Resources/RoleResource.php` — transform Spatie role (id, name)

## 9. Routes

- [x] 9.1 Create `routes/api.php` — sanctum/token, auth group with users resource, roles search, avatar update

## 10. Seeders and Factories

- [x] 10.1 Create `database/seeders/RolesAndPermissionsSeeder.php` — creates `admin` and `regular` roles, creates permissions (e.g., `view-users`, `create-users`, `update-users`, `delete-users`, `edit-profile`), assigns `edit-profile` to `regular` role
- [x] 10.2 Create `database/seeders/UsersTableSeeder.php` — 1 admin (assigned `admin` role) + 20 regular users (assigned `regular` role)
- [x] 10.3 Update `database/seeders/DatabaseSeeder.php` — call RolesAndPermissionsSeeder first, then UsersTableSeeder
- [x] 10.4 Update `database/factories/UserFactory.php` — ensure factory uses `name` field correctly

## 11. Verification

- [x] 11.1 Run `php artisan migrate:fresh --seed` — confirm migrations and seeders work
- [x] 11.2 Run `vendor/bin/pint --dirty --format agent` — format PHP files
- [x] 11.3 Run `php artisan test --compact` — confirm tests pass
- [x] 11.4 Run `php artisan route:list --path=api` — confirm API routes are registered correctly
- [x] 11.5 Verify `Gate::before` works — admin user should pass any `$user->can(...)` check
