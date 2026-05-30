# Defining a Super Admin

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/super-admin

A Super Admin is a user who bypasses all authorization checks. The recommended approach uses Laravel's Gate hooks.

## Using Gate::before()

Register in your `AppServiceProvider`:

```php
Gate::before(function ($user, $ability) {
    return $user->hasRole('Super Admin') ? true : null;
});
```

**Critical:** Return `null` (not `false`) when the user is not a Super Admin, so other authorization logic can still run.

## Using Gate::after()

```php
Gate::after(function ($user, $ability) {
    return $user->hasRole('Super Admin');
});
```

This returns a boolean and is useful when you want the Super Admin check to run only if no earlier check has already granted or denied access.

## Policy-Level Alternative

You can add a `before()` method to individual policies instead of using a global Gate hook.

## Important Caveat

The methods `hasPermissionTo()`, `hasAnyPermission()`, and `hasDirectPermission()` bypass the Gate entirely, so they will **not** trigger Super Admin logic. Always use `can()`, `canAny()`, or `cannot()` in your application code to ensure Super Admin checks work correctly.

## Best Practice

Use permission-based controls (`@can`, `$user->can()`) throughout your application rather than role-checking, so the Super Admin pattern works seamlessly.
