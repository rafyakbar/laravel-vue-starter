# Introduction

> Source: https://spatie.be/docs/laravel-permission/v7/introduction

Spatie's `laravel-permission` package provides a straightforward way to manage user permissions and roles stored in the database. With over 97 million downloads and nearly 13,000 GitHub stars, it is one of the most widely adopted authorization packages in the Laravel ecosystem.

## Core Capabilities

- **Direct user permissions** — assign permissions straight to a user without a role intermediary:

```php
$user->givePermissionTo('edit articles');
```

- **Role-based permissions** — group permissions under roles and assign roles to users:

```php
$user->assignRole('writer');
$role->givePermissionTo('edit articles');
```

- **Multi-guard support** — each authentication guard maintains its own independent set of roles and permissions.

- **Gate integration** — every permission is automatically registered with Laravel's Gate, so standard authorization checks work out of the box:

```php
$user->can('edit articles');
```

```blade
@can('edit articles')
    <!-- authorized content -->
@endcan
```
