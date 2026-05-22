# Authentication & Authorization

## Background

The authentication system uses two layers: Laravel Fortify for auth flows (login, register, password reset, etc.) and Laravel Sanctum for API token/session management. Authorization uses Spatie Permission (Bouncer) with ability-based access control.

## Authentication Stack

| Package | Purpose |
|---------|---------|
| Laravel Fortify v1 | Headless auth backend (routes + controllers) |
| Laravel Sanctum v4 | Session-based (SPA) + token-based (mobile) auth |
| Spatie Permission v7 | Role & permission management |

## Authentication Methods

### 1. SPA Cookie-based Auth (Primary)

For the Vue SPA frontend running on the same domain:

```text
1. GET  /sanctum/csrf-cookie          → Set XSRF-TOKEN cookie
2. POST /login                         → Authenticate, create session
3. GET  /api/users/auth               → Fetch user data (with cookie)
4. POST /logout                        → Destroy session
```

**Sanctum Stateful Configuration:**

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```

### 2. Token-based Auth (Mobile/External)

For clients that cannot use cookies:

```text
1. POST /api/sanctum/token             → Obtain bearer token
2. GET  /api/users (Authorization: Bearer {token})  → Request with token
```

## Fortify Configuration

```php
// config/fortify.php
'guard' => 'web',
'username' => 'email',
'lowercase_usernames' => true,
'views' => false,   // Headless mode (no views rendered)
'home' => env('APP_URL') . '/panel/dashboard',

'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    // Features::twoFactorAuthentication([...]),  // Ready to enable
],
```

### Custom Authentication Logic

Login supports both email and username:

```php
// FortifyServiceProvider.php
Fortify::authenticateUsing(function (Request $request) {
    $login = $request->input(Fortify::username());
    $field = str_contains($login, '@') ? 'email' : 'username';

    $user = User::where($field, $login)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        return $user;
    }
    return null;
});
```

## Fortify Actions

Business logic for auth operations is placed in `app/Actions/Fortify/`:

| Action | Purpose |
|--------|---------|
| `CreateNewUser` | Register new user (validate + create) |
| `UpdateUserProfileInformation` | Update profile (name, email) |
| `UpdateUserPassword` | Update password (validate current) |
| `ResetUserPassword` | Reset password via token |

## Rate Limiting

```php
// Login: 5 attempts per minute per email+IP
RateLimiter::for('login', function (Request $request) {
    $key = Str::lower($request->input(Fortify::username())) . '|' . $request->ip();
    return Limit::perMinute(5)->by($key);
});

// 2FA: 5 attempts per minute per session
RateLimiter::for('two-factor', function (Request $request) {
    return Limit::perMinute(5)->by($request->session()->get('login.id'));
});
```

## Two-Factor Authentication (2FA)

Ready to enable but currently commented out. The database already provides the columns:
- `two_factor_secret` — Encrypted TOTP secret
- `two_factor_recovery_codes` — Encrypted JSON recovery codes
- `two_factor_confirmed_at` — Confirmation timestamp

To enable, uncomment in `config/fortify.php`:

```php
Features::twoFactorAuthentication([
    'confirm' => true,
    'confirmPassword' => true,
]),
```

## Authorization (RBAC)

### Structure

```text
User ──has──→ Roles ──has──→ Abilities (Permissions)
```

### Abilities in Use

| Ability | Description |
|---------|-------------|
| `view-users` | View user list & details |
| `create-users` | Create new users |
| `update-users` | Modify user data |
| `delete-users` | Delete users |
| `edit-profile` | Update own avatar/profile |

### Authorization in Controllers

```php
public function index(Request $request): AnonymousResourceCollection
{
    $this->authorize('view-users');
    return $this->userService->index($request->all());
}
```

### Frontend Permission Checking

AuthController returns user roles and permissions:

```json
{
  "roles": ["admin"],
  "permissions": ["view-users", "create-users", "update-users", "delete-users"]
}
```

The frontend can use this data to:
- Show/hide menu items
- Disable/enable action buttons
- Guard route access

## SPA Auth Flow (Frontend)

### Login Flow

```text
1. User fills login form
2. Frontend POST /sanctum/csrf-cookie (get CSRF token)
3. Frontend POST /login (email + password)
4. On success → redirect to dashboard
5. Frontend GET /api/users/auth (fetch user + permissions)
6. Store user data in Pinia store
```

### Route Guard Pattern

```typescript
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})
```

### Logout Flow

```text
1. Frontend POST /logout
2. Clear Pinia store
3. Redirect to login page
```

## Session Configuration

- **Driver**: database (sessions table)
- **Lifetime**: Configurable via `.env` (`SESSION_LIFETIME`)
- **Same-site**: lax (default Laravel)
- **Secure cookies**: Based on APP_URL scheme (https = secure)

## Security Best Practices

1. **CSRF Protection**: All mutating requests require CSRF token
2. **Password Hashing**: bcrypt (via Laravel `hashed` cast)
3. **Rate Limiting**: Login throttled per email+IP combination
4. **Email Verification**: Users must verify email before full access
5. **Token Scoping**: API tokens support abilities/scopes
6. **Session Regeneration**: Session is regenerated after login
7. **Sanctum Middleware**: `AuthenticateSession` + `EncryptCookies` + `ValidateCsrfToken`
