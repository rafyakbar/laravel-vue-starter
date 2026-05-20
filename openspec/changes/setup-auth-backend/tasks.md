## 1. Install Composer Packages

- [ ] 1.1 Install Fortify, Sanctum, Bouncer, and MediaLibrary: `composer require laravel/fortify:^1.36 laravel/sanctum:^4.0 silber/bouncer:^1.0 spatie/laravel-medialibrary:^11.21 --no-interaction`
- [ ] 1.2 Publish Fortify config and migrations: `php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider" --no-interaction`
- [ ] 1.3 Publish Sanctum config: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --no-interaction`
- [ ] 1.4 Publish MediaLibrary migration: `php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations" --no-interaction`
- [ ] 1.5 Publish Bouncer migrations: `php artisan vendor:publish --tag="bouncer.migrations" --no-interaction`

## 2. Database Migrations

- [ ] 2.1 Update `0001_01_01_000000_create_users_table.php` — add `username` unique column after `name`
- [ ] 2.2 Run all migrations: `php artisan migrate --force`

## 3. Configuration Files

- [ ] 3.1 Create `config/fortify.php` — guard: web, views: false, features: registration, resetPasswords, emailVerification, updateProfileInformation, updatePasswords
- [ ] 3.2 Create `config/cors.php` — paths for auth endpoints, supports_credentials: true
- [ ] 3.3 Update `config/sanctum.php` if needed (should be published already)
- [ ] 3.4 Update `bootstrap/app.php` — add `statefulApi()`, `apply_locale` alias, add API routing

## 4. Providers and Auth Actions

- [ ] 4.1 Create `app/Providers/FortifyServiceProvider.php` — register auth actions, rate limiters, custom `authenticateUsing` callback (email or username detection based on `@` in input)
- [ ] 4.2 Register FortifyServiceProvider in `bootstrap/providers.php`
- [ ] 4.3 Create `app/Actions/Fortify/CreateNewUser.php`
- [ ] 4.4 Create `app/Actions/Fortify/PasswordValidationRules.php` — trait with reusable password validation rules
- [ ] 4.5 Create `app/Actions/Fortify/ResetUserPassword.php`
- [ ] 4.6 Create `app/Actions/Fortify/UpdateUserPassword.php`
- [ ] 4.7 Create `app/Actions/Fortify/UpdateUserProfileInformation.php`
- [ ] 4.8 Create `app/Http/Responses/LoginResponse.php` — returns JSON with user data
- [ ] 4.9 Update `app/Providers/AppServiceProvider.php` — bind LoginResponse contract, reset password URL, rate limiters

## 5. Models and Traits

- [ ] 5.1 Update `app/Models/User.php` — add HasApiTokens, HasRolesAndAbilities, InteractsWithMedia, Filterable, Searchable, guarded, hidden, appends, searchFields, avatar methods, registerMediaConversions
- [ ] 5.2 Create `app/Models/Role.php` — extends Bouncer BaseRole with Searchable
- [ ] 5.3 Create `app/Traits/Filterable.php` — scopeFilter for dynamic column filtering
- [ ] 5.4 Create `app/Traits/Searchable.php` — scopeSearch for keyword search
- [ ] 5.5 Create `app/Utilities/Data.php` — helper for array take/manipulation

## 6. Controllers and Middleware

- [ ] 6.1 Update `app/Http/Controllers/Controller.php` — add base response helper methods (responseSuccess, responseStoreSuccess, responseUpdateSuccess, responseDeleteSuccess, responseFail, etc.)
- [ ] 6.2 Create `app/Http/Controllers/AuthController.php` — invokable, returns current user with abilities
- [ ] 6.3 Create `app/Http/Controllers/UserController.php` — full CRUD with authorization
- [ ] 6.4 Create `app/Http/Controllers/RoleController.php` — search endpoint
- [ ] 6.5 Create `app/Http/Controllers/TokenController.php` — generate Sanctum token for mobile clients
- [ ] 6.6 Create `app/Http/Middleware/ApplyLocale.php` — reads X-Locale header
- [ ] 6.7 Create `app/Http/Middleware/RedirectIfAuthenticated.php` — custom redirect for already-authenticated users (JSON response for XHR)

## 7. Services

- [ ] 7.1 Create `app/Services/User/UserService.php` — index, create, update, delete, updateAvatar
- [ ] 7.2 Create `app/Services/Role/RoleService.php` — search roles
- [ ] 7.3 Create `app/Services/Media/MediaService.php` — replace media helper

## 8. Form Requests and API Resources

- [ ] 8.1 Create `app/Http/Requests/BaseRequest.php` — extends FormRequest
- [ ] 8.2 Create `app/Http/Requests/StoreUserRequest.php`
- [ ] 8.3 Create `app/Http/Requests/UpdateUserRequest.php`
- [ ] 8.4 Create `app/Http/Requests/UpdateAvatarRequest.php`
- [ ] 8.5 Create `app/Http/Requests/DestroyUserRequest.php`
- [ ] 8.6 Create `app/Http/Resources/UserResource.php` — transform with avatar URLs, timestamps
- [ ] 8.7 Create `app/Http/Resources/UserBasicResource.php` — simplified resource (id, name, email)
- [ ] 8.8 Create `app/Http/Resources/RoleResource.php` — transform role (id as name, title)

## 9. Routes

- [ ] 9.1 Create `routes/api.php` — sanctum/token, auth group with users resource, roles search, avatar update

## 10. Seeders and Factories

- [ ] 10.1 Create `database/seeders/BouncerSeeder.php` — admin (everything), regular (edit-profile)
- [ ] 10.2 Create `database/seeders/UsersTableSeeder.php` — 1 admin + 20 regular users
- [ ] 10.3 Update `database/seeders/DatabaseSeeder.php` — call BouncerSeeder and UsersTableSeeder
- [ ] 10.4 Update `database/factories/UserFactory.php` — ensure factory uses `name` field correctly

## 11. Verification

- [ ] 11.1 Run `php artisan migrate:fresh --seed` — confirm migrations and seeders work
- [ ] 11.2 Run `vendor/bin/pint --dirty --format agent` — format PHP files
- [ ] 11.3 Run `php artisan test --compact` — confirm tests pass
- [ ] 11.4 Run `php artisan route:list --path=api` — confirm API routes are registered correctly
