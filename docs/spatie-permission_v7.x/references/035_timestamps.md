# Timestamp Management

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/timestamps

## Hiding Pivot Data from JSON Output

If pivot information appears in your model's JSON serialization and you want to exclude it, extend the `Role` or `Permission` model and add:

```php
protected $hidden = ['pivot'];
```

## Adding Timestamps to Pivot Tables

By default, the pivot tables (`model_has_roles`, `model_has_permissions`, `role_has_permissions`) do not include `created_at` and `updated_at` columns. To add them, follow these steps:

### Step 1: Add Timestamp Columns via Migration

Create a migration that adds `$table->timestamps()` to each relevant pivot table.

### Step 2: Extend Permission and Role Models

Extend the package's `Permission` and `Role` models, then modify their `BelongsToMany` relationship definitions to include `->withTimestamps()`:

```php
public function roles(): BelongsToMany
{
    return parent::roles()->withTimestamps();
}
```

### Step 3: Update User Models

In any User model that uses the `HasRoles` or `HasPermissions` traits, override the relevant `BelongsToMany` relationship methods and append `->withTimestamps()` to each one.

This ensures that Laravel automatically manages the `created_at` and `updated_at` columns on the pivot records whenever roles or permissions are attached, detached, or synced.
