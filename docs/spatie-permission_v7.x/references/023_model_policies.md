# Model Policies

> Source: https://spatie.be/docs/laravel-permission/v7/best-practices/using-policies

Model Policies are the recommended way to centralize authorization logic in a Laravel application.

## Why Use Policies

- They combine application logic with permission checks in a single, organized location.
- Laravel automatically resolves the correct policy for a given model, keeping controllers clean.
- Policies make authorization rules easy to test and maintain.

## Creating a Policy

```bash
php artisan make:policy PostPolicy --model=Post
```

## Integrating with Spatie Permission

Inside policy methods, check permissions rather than roles:

```php
public function update(User $user, Post $post): bool
{
    return $user->can('edit posts');
}
```

## Super Admin Support

Use the `before()` method to grant Super Admin users unrestricted access:

```php
public function before(User $user, string $ability): ?bool
{
    if ($user->hasRole('Super Admin')) {
        return true;
    }

    return null;
}
```

Returning `null` (not `false`) allows the normal policy method to run for non-Super-Admin users.
