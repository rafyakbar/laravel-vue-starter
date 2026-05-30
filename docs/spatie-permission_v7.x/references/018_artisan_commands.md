# Artisan Commands

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/artisan

The package ships with several Artisan commands for managing roles and permissions from the CLI.

## Creating Roles and Permissions

```bash
# Create a role
php artisan permission:create-role writer

# Create a permission
php artisan permission:create-permission "edit articles"

# Specify a guard
php artisan permission:create-role writer web

# Create a role with permissions (pipe-delimited)
php artisan permission:create-role writer web "create articles|edit articles"
```

## Teams Support

When teams are enabled, pass the team ID:

```bash
php artisan permission:create-role --team-id=1 writer
```

## Display and Cache

```bash
# Show a table of all roles and permissions
php artisan permission:show

# Manually reset the permission cache
php artisan permission:cache-reset
```

**Note:** The cache resets automatically when you use the package's built-in manipulation methods (e.g., `givePermissionTo`, `assignRole`). Manual resets are only needed when modifying the database directly.
