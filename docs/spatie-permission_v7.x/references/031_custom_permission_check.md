# Custom Permission Checking

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/custom-permission-check

## Default Behavior

By default, the package registers a `Gate::before()` callback that checks permissions against the database. This is controlled by the `register_permission_check_method` configuration option, which defaults to `true`.

## Disabling the Default Check

Set `register_permission_check_method` to `false` in the config to bypass the package's built-in gate check. This is necessary when you want to implement your own authorization logic entirely.

## Use Case: Token-Based Permissions

A common scenario is access token authentication where permissions are embedded in the token as custom claims. In this case, you want to check the token's claims rather than querying the database.

## Implementing a Custom Gate Check

After disabling the default, register your own `Gate::before()` in your `AppServiceProvider`:

```php
Gate::before(function ($user, $ability) {
    return $user->hasTokenPermission($ability) ?: null;
});
```

The `hasTokenPermission()` method is a custom method you define on your User model to inspect the token's claims and determine if the requested ability is granted.

Returning `null` when the token doesn't grant the permission allows other gate checks (such as database-based permissions) to still run as a fallback.
