# Wildcard Permissions

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/wildcard-permissions

Wildcard permissions follow a design inspired by Apache Shiro, allowing flexible pattern-based authorization.

## Enabling

Set the following in `config/permission.php`:

```php
'enable_wildcard_permission' => true,
```

## Syntax

Permissions use dot-separated parts, for example `'posts.create.1'`. The `*` character represents **ALL** (not ANY), so:

```php
$user->givePermissionTo('posts.*');
// Grants every action on posts
```

You must create both the wildcard permission record and the pattern before assigning or checking them.

## Subparts with Commas

Commas allow multiple values within a single part:

| Pattern | Meaning |
|---|---|
| `'posts,users.create,update,view'` | Create, update, and view on both posts and users |
| `'*.create,update,view'` | Create, update, and view on any resource |
| `'posts.*.1,4,6'` | Any action on posts with IDs 1, 4, and 6 |

## Flexibility

There is no limit on the number of parts or subparts you can define, giving you fine-grained control over authorization rules.
