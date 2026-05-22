# Database Schema

## Background

This project uses SQLite as the default database engine. The schema is managed through Laravel migrations and includes tables for users, authentication, roles/permissions (Bouncer via Spatie), media management (Spatie Media Library), and Laravel infrastructure (jobs, cache, sessions).

## Engine

- **Database**: SQLite
- **Migration tool**: Laravel Migrations (`php artisan migrate`)
- **Configurable**: Can be swapped to MySQL/PostgreSQL via `.env`

## Entity Relationship Diagram (Simplified)

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────┐
│    users     │──1:N──│ assigned_roles   │──N:1──│  roles   │
└──────────────┘       └─────────────────┘       └──────────┘
       │                                                │
       │ 1:N                                           │ 1:N
       ▼                                               ▼
┌──────────────┐                              ┌─────────────────┐
│    media     │                              │   permissions   │
└──────────────┘                              └─────────────────┘
       │                                               │
       │                                          N:1  │
       │                                               ▼
       │                                       ┌──────────────┐
       │                                       │  abilities   │
       │                                       └──────────────┘
       │
       │ polymorphic (model_type + model_id)
       ▼
┌──────────────────────────────┐
│ Any Eloquent Model with      │
│ InteractsWithMedia trait     │
└──────────────────────────────┘
```

## Core Tables

### users

Primary table for storing user data.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK, auto-increment |
| first_name | varchar | NO | |
| last_name | varchar | NO | |
| middle_name | varchar | YES | |
| email | varchar | NO | UNIQUE |
| email_verified_at | datetime | YES | |
| password | varchar | NO | Hashed (bcrypt) |
| remember_token | varchar | YES | |
| two_factor_secret | text | YES | Encrypted TOTP secret |
| two_factor_recovery_codes | text | YES | Encrypted JSON array |
| two_factor_confirmed_at | datetime | YES | |
| created_at | datetime | YES | |
| updated_at | datetime | YES | |

**Indexes**: `users_email_unique`

### roles

Role definitions for the RBAC system.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK, auto-increment |
| name | varchar | NO | UNIQUE (with scope) |
| title | varchar | YES | Human-readable label |
| scope | integer | YES | Multi-tenant support |
| created_at | datetime | YES | |
| updated_at | datetime | YES | |

**Indexes**: `roles_name_unique` (name + scope), `roles_scope_index`

### assigned_roles

Pivot table linking roles to entities (polymorphic).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK |
| role_id | integer | NO | FK → roles.id |
| entity_id | integer | NO | User ID (polymorphic) |
| entity_type | varchar | NO | Model class name |
| restricted_to_id | integer | YES | Scope restriction |
| restricted_to_type | varchar | YES | |
| scope | integer | YES | |

**Foreign Keys**: `role_id → roles.id` (cascade delete)

### abilities

Permission/ability definitions that can be granted to roles or users.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK |
| name | varchar | NO | e.g., "view-users", "create-users" |
| title | varchar | YES | Human-readable label |
| entity_id | integer | YES | Scoped ability |
| entity_type | varchar | YES | |
| only_owned | tinyint(1) | NO | Default: 0 |
| options | text | YES | JSON options |
| scope | integer | YES | |
| created_at | datetime | YES | |
| updated_at | datetime | YES | |

### permissions

Permission assignments (abilities) to entities.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK |
| ability_id | integer | NO | FK → abilities.id |
| entity_id | integer | YES | Polymorphic target |
| entity_type | varchar | YES | |
| forbidden | tinyint(1) | NO | Default: 0 (deny flag) |
| scope | integer | YES | |

**Foreign Keys**: `ability_id → abilities.id` (cascade delete)

### media

Spatie Media Library storage — polymorphic association to any model.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK |
| model_type | varchar | NO | Eloquent model class |
| model_id | integer | NO | Model instance ID |
| uuid | varchar | YES | UNIQUE, for URL generation |
| collection_name | varchar | NO | e.g., "avatars" |
| name | varchar | NO | Human-readable name |
| file_name | varchar | NO | Physical filename on disk |
| mime_type | varchar | YES | |
| disk | varchar | NO | Storage disk name |
| conversions_disk | varchar | YES | |
| size | integer | NO | File size in bytes |
| manipulations | text | NO | JSON |
| custom_properties | text | NO | JSON |
| generated_conversions | text | NO | JSON |
| responsive_images | text | NO | JSON |
| order_column | integer | YES | |
| created_at | datetime | YES | |
| updated_at | datetime | YES | |

**Indexes**: `media_model_type_model_id_index`, `media_uuid_unique`, `media_order_column_index`

## Infrastructure Tables

### sessions

Session storage for authenticated users.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | varchar | NO | PK |
| user_id | integer | YES | Linked user |
| ip_address | varchar | YES | |
| user_agent | text | YES | |
| payload | text | NO | Serialized session data |
| last_activity | integer | NO | Unix timestamp |

### personal_access_tokens

Sanctum API tokens for mobile/external clients.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | integer | NO | PK |
| tokenable_type | varchar | NO | Polymorphic |
| tokenable_id | integer | NO | |
| name | text | NO | Device/token name |
| token | varchar | NO | UNIQUE, hashed token |
| abilities | text | YES | JSON array of abilities |
| last_used_at | datetime | YES | |
| expires_at | datetime | YES | |
| created_at | datetime | YES | |
| updated_at | datetime | YES | |

### password_reset_tokens

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| email | varchar | NO | PK |
| token | varchar | NO | Hashed token |
| created_at | datetime | YES | |

### jobs / failed_jobs / job_batches

Standard Laravel queue tables for background job processing.

### cache / cache_locks

Laravel cache driver tables (database driver).

## Model Relations

### User Model Relations

```php
User::class
├── HasApiTokens (Sanctum)    → personal_access_tokens
├── HasRoles (Spatie)         → assigned_roles → roles
├── InteractsWithMedia        → media (collection: 'avatars')
├── Filterable (trait)        → Dynamic query filters
└── Searchable (trait)        → Search across: name, username, email
```

### Media Conversions (User Avatar)

```php
// Registered on User model
'small_thumb'  → 300x300 crop (non-queued)
'medium_thumb' → 600x600 crop (non-queued)
'large_thumb'  → 1200x1200 crop (non-queued)
```

## Notes

- SQLite does not enforce foreign keys by default. Relations are maintained at the application level.
- 2FA columns are added in a separate migration and are nullable (optional feature).
- The `scope` column on roles/abilities/permissions is used for multi-tenancy (optional, default null).
