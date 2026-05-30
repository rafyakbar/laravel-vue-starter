# Events

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/events

## Enabling Events

Events are turned off by default. To activate them, set the following in your configuration file:

```php
'events_enabled' => true,
```

## Available Event Classes (v7)

The package dispatches the following events when roles or permissions are attached or detached:

| Event Class | Triggered When |
|---|---|
| `\Spatie\Permission\Events\RoleAttachedEvent` | A role is assigned to a model |
| `\Spatie\Permission\Events\RoleDetachedEvent` | A role is removed from a model |
| `\Spatie\Permission\Events\PermissionAttachedEvent` | A permission is granted to a model |
| `\Spatie\Permission\Events\PermissionDetachedEvent` | A permission is revoked from a model |

## Naming Convention Changes

In versions v6.15 through v7, event classes used names without the "Event" suffix (e.g., `RoleAttached` instead of `RoleAttachedEvent`). The current v7 release uses the "Event" suffix consistently.

## Event Payload Variability

Event listeners should be prepared to handle different data types. The event may receive a model ID, a full Eloquent model instance, an array, or a collection. Always inspect the parameter type before processing it in your listener logic.
