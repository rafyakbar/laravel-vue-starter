# PhpStorm Configuration

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/phpstorm

## Laravel Idea Plugin

If you use the Laravel Idea plugin for PhpStorm, all Blade directives from this package are registered automatically. No manual configuration is needed.

## Manual Directive Setup

Without the Laravel Idea plugin, you need to add the directives manually:

1. Open **Preferences** > **Languages & Frameworks** > **PHP** > **Blade**.
2. Navigate to the **Directives** tab.
3. Add each directive listed below.

## Directive List

### Opening Directives (Has Parameter: YES)

These directives accept a parameter expression:

- `role`
- `hasrole`
- `hasanyrole`
- `hasallroles`
- `unlessrole`
- `hasexactroles`

### Closing Directives (Has Parameter: NO)

These directives close their corresponding blocks. Set "has parameter" to **NO** and leave prefix/suffix fields blank:

- `elserole`
- `endrole`
- `endhasrole`
- `endhasanyrole`
- `endhasallroles`
- `endunlessrole`
- `endhasexactroles`

## Configuration Summary

| Directive | Has Parameter | Prefix/Suffix |
|---|---|---|
| `role` | Yes | — |
| `elserole` | No | Blank |
| `endrole` | No | Blank |
| `hasrole` | Yes | — |
| `endhasrole` | No | Blank |
| `hasanyrole` | Yes | — |
| `endhasanyrole` | No | Blank |
| `hasallroles` | Yes | — |
| `endhasallroles` | No | Blank |
| `unlessrole` | Yes | — |
| `endunlessrole` | No | Blank |
| `hasexactroles` | Yes | — |
| `endhasexactroles` | No | Blank |
