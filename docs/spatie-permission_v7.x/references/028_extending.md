# Extending the Package

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/extending

## Adding Custom Fields

You can add extra columns to the roles and permissions tables through migrations. For example, adding a `description` column is a common requirement. The package omits a description field by default to minimize memory overhead when loading permission data into cache.

## Multi-Language Descriptions

For applications requiring translated descriptions, consider adding a `description_key` field instead and leveraging Laravel's localization features to resolve the appropriate translation at runtime.

## User Model Requirements

Any user model that interacts with this package must implement the `Illuminate\Contracts\Auth\Access\Authorizable` contract.

## Child User Models and Permission Inheritance

If you have child models extending a base User model, you can override `getMorphClass()` on the child to return the parent's class name. This causes the child to inherit the parent's role and permission assignments, though it sacrifices the child model's ability to have independent permissions.

## Extending Role and Permission Models

To create custom Role or Permission models:

1. Extend `Spatie\Permission\Models\Role` or `Spatie\Permission\Models\Permission`.
2. Implement all required contracts and interfaces from the package.
3. Update `config/permission.php` to reference your new model class names in the `models` array.
