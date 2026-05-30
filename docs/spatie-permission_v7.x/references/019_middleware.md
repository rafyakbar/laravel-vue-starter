# Middleware

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/middleware

Middleware provides route-level and controller-level access control.

## Laravel's Built-in Gate Middleware

```php
Route::group(['middleware' => ['can:publish articles']], function () { ... });
```

## Package Middleware

The package provides three middleware classes:

- `RoleMiddleware`
- `PermissionMiddleware`
- `RoleOrPermissionMiddleware`

### Registering Aliases

Define aliases in `bootstrap/app.php`:

```php
'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
```

**Note:** Since v6 the namespace is singular `Middleware`, not `Middlewares`.

## Route Usage

```php
// Single role
Route::group(['middleware' => ['role:manager']], function () { ... });

// Single permission
Route::group(['middleware' => ['permission:publish articles']], function () { ... });

// OR logic with pipe
Route::group(['middleware' => ['role:manager|writer']], function () { ... });

// With guard
Route::group(['middleware' => ['role:manager,api']], function () { ... });
```

## Controller Usage

Implement `HasMiddleware` on your controller and use the static `using()` method:

```php
public static function middleware(): array
{
    return [
        RoleMiddleware::using('manager'),
    ];
}
```

## Middleware Priority

You may need to register the middleware to run **before** `SubstituteBindings` to ensure a 403 response instead of a 404 when route model binding is involved.
