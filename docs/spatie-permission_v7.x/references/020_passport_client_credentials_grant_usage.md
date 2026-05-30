# Passport Client Credentials Grant Usage

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/passport

Integrating with Laravel Passport's Client Credentials grant (requires Laravel 9+ and Passport 11+).

## Setup

1. **Extend Passport's Client model** and add the required traits:

```php
use Laravel\Passport\Client as PassportClient;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Foundation\Auth\Access\Authorizable;

class Client extends PassportClient
{
    use HasRoles, Authorizable;

    protected $guard_name = 'api';
}
```

2. **Register your custom Client model** in a service provider:

```php
Passport::useClientModel(\App\Models\Client::class);
```

3. **Enable in config** (`config/permission.php`):

```php
'use_passport_client_credentials' => true,
```

## Route Protection

Use the package's middleware with the Client model. Wrap routes in the `client` middleware only — do **not** combine with `auth:api`:

```php
Route::middleware(['client'])->group(function () {
    // Protected routes
});
```

This allows machine-to-machine API consumers to be authorized based on their assigned roles and permissions.
