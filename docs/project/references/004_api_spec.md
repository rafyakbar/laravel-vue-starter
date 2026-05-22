# API Specification

## Background

The backend provides a REST API consumed by the frontend SPA. All API endpoints live under the `/api` prefix and are protected by Sanctum authentication (except token generation and Fortify auth routes).

## Base URL

```
/api
```

## Authentication

- **SPA (Cookie-based)**: Sanctum stateful authentication via session cookie. The frontend must first request a CSRF cookie from `/sanctum/csrf-cookie`.
- **Mobile/External (Token-based)**: Bearer token via `Authorization: Bearer {token}` header. Tokens are obtained from `/api/sanctum/token`.

## Response Format

### Success Response

```json
{
  "message": "Record created successfully.",
  "record": { ... }
}
```

### Data Response (no message)

```json
{
  "message": "",
  "model": { ... }
}
```

### Paginated Response (via Laravel API Resource)

```json
{
  "data": [ ... ],
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 10,
    "to": 10,
    "total": 50
  }
}
```

### Error Response

```json
{
  "message": "Failed to create record."
}
```

### Validation Error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

## Endpoints

### Authentication (Fortify)

Fortify provides auth routes without views (headless mode). All routes use `web` middleware.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Login (email/username + password) |
| POST | `/logout` | Logout (destroy session) |
| POST | `/register` | Register new user |
| POST | `/forgot-password` | Send password reset link |
| POST | `/reset-password` | Reset password with token |
| POST | `/email/verification-notification` | Resend verification email |
| GET | `/email/verify/{id}/{hash}` | Verify email |
| POST | `/user/profile-information` | Update profile info |
| PUT | `/user/password` | Update password |

### Token Generation

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/sanctum/token` | None | Generate API token for mobile/external |

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "iPhone 15"
}
```

**Response (200):**

```json
{
  "token": "1|abc123def456..."
}
```

### Auth User

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/auth` | sanctum | Get current authenticated user |

**Response (200):** UserResource

```json
{
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "middle_name": null,
    "email": "john@example.com",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "avatar_url": "http://localhost/storage/media/1/avatar.jpg",
    "avatar_thumb_url": "http://localhost/storage/media/1/conversions/avatar-small_thumb.jpg",
    "is_admin": true,
    "is_owner": true,
    "roles": ["admin"],
    "permissions": ["view-users", "create-users", "update-users", "delete-users"],
    "created_at": "2 hours ago",
    "updated_at": "1 hour ago"
  }
}
```

### Users CRUD

All endpoints require `auth:sanctum` middleware.

| Method | Path | Auth | Permission | Description |
|--------|------|------|-----------|-------------|
| GET | `/api/users` | sanctum | view-users | List users (paginated) |
| POST | `/api/users` | sanctum | create-users | Create new user |
| GET | `/api/users/{user}` | sanctum | view-users | Get single user |
| PUT | `/api/users/{user}` | sanctum | update-users | Update user |
| DELETE | `/api/users/{user}` | sanctum | delete-users | Delete user |
| PUT | `/api/users/{user}/avatar` | sanctum | edit-profile | Update user avatar |

#### GET /api/users (Index)

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| search | string | Search across name, username, email |
| sort_by | string | Column to sort by |
| sort | string | `asc` or `desc` |
| filters[role] | string | Filter by role name |
| filters[*] | string | Dynamic column filters |
| page | integer | Page number |

**Response (200):** Paginated UserResource collection

#### POST /api/users (Store)

**Request Body (multipart/form-data):**

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| first_name | string | yes | |
| last_name | string | yes | |
| middle_name | string | no | |
| email | string | yes | unique:users |
| password | string | yes | min:8 |
| roles | array | no | Role names |
| avatar | file | no | image, max:2MB |

**Response (200):**

```json
{
  "message": "Record created successfully.",
  "record": { ... }
}
```

#### PUT /api/users/{user} (Update)

**Request Body:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| first_name | string | no | |
| last_name | string | no | |
| middle_name | string | no | |
| password | string | no | Empty = not changed |
| roles | array | no | Sync roles |
| avatar | file | no | Replace existing |

**Note:** Email cannot be changed via update.

#### PUT /api/users/{user}/avatar

**Request Body (multipart/form-data):**

| Field | Type | Required |
|-------|------|----------|
| avatar | file | yes |

### Roles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/roles/search` | sanctum | Search roles (rate limited: 400/min) |

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| search | string | Search role names |

**Response:** Paginated role collection

## Middleware

| Middleware | Description |
|-----------|-------------|
| `auth:sanctum` | Authentication required |
| `apply_locale` | Set app locale from request |
| `throttle:400,1` | Rate limit (roles search) |

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 401 | Unauthenticated |
| 403 | Forbidden (no permission) |
| 404 | Resource not found |
| 422 | Validation error |
| 429 | Rate limited |
| 500 | Server error |

## Rate Limiting

- Login: 5 attempts per minute per email+IP
- Two-factor: 5 attempts per minute per session
- Role search: 400 requests per minute
