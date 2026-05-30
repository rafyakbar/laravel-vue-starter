# Example / Demo App

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/new-app

Building a small demo application is a practical way to test the package and troubleshoot issues.

## Steps

1. **Create a fresh Laravel project:**

```bash
laravel new mypermissionsdemo
```

Choose SQLite as the database for simplicity.

2. **Install the package**, publish its configuration, and run migrations:

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

3. **Add the `HasRoles` trait** to your `User` model.

4. **Scaffold authentication** (optional) using `laravel/ui` or another starter kit to enable login functionality.

5. **Create seeders** for your roles and permissions to populate the database with test data.

## Purpose

A minimal reproduction app is invaluable when:

- Troubleshooting unexpected behavior
- Requesting support from the package maintainers
- Experimenting with configuration options before applying changes to your main project
