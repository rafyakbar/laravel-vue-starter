# Blade Directives

> Source: https://spatie.be/docs/laravel-permission/v7/basic-usage/blade-directives

The package provides Blade directives for checking permissions and roles directly in templates.

## Permission Checks (Recommended)

Prefer permission-based directives over role-based ones. You can use Laravel's native directives:

- `@can('edit articles')` / `@endcan`
- `@cannot('delete articles')` / `@endcannot`
- `@canany(['edit articles', 'delete articles'])` / `@endcanany`
- `@guest` / `@endguest`

The package also provides:

- `@haspermission('name')` / `@endhaspermission`
- `@haspermission('name', 'guard')` — with an explicit guard

## Role Checks

| Directive | Description |
|---|---|
| `@role('writer')` or `@hasrole('writer')` | User has the specified role |
| `@hasanyrole('writer\|admin')` | User has at least one of the listed roles |
| `@hasallroles('writer\|admin')` | User has every listed role |
| `@unlessrole('writer')` | User does **not** have the role |
| `@hasexactroles('writer\|admin')` | User has exactly these roles and no others |

All role directives accept an optional guard name as a second argument.

`@hasanyrole` also accepts a collection of roles instead of a pipe-delimited string.
