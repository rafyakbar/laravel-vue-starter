# Backend Guidelines

## Background

The backend is built with Laravel 13 following framework conventions and established best practices. The architecture uses a Service Layer pattern where controllers remain thin and all business logic resides in service classes.

## Architecture Layers

```text
Route → Controller → Service → Model → Database
              ↑
         Form Request (validation)
              ↓
         API Resource (response transformation)
```

### Controller (Thin)

Controllers are only responsible for:
1. Authorization check (`$this->authorize('ability-name')`)
2. Calling the service method
3. Returning response using helper methods

```php
class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('view-users');
        return $this->userService->index($request->all());
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create-users');
        $record = $this->userService->create($request->validated());

        if ($record) {
            return $this->responseStoreSuccess(['record' => $record]);
        }
        return $this->responseStoreFail();
    }
}
```

### Service Layer

Service classes handle all business logic:

```php
namespace App\Services\User;

class UserService
{
    public function index(array $data): AnonymousResourceCollection
    {
        $query = User::query();

        if (!empty($data['search'])) {
            $query->search($data['search']);
        }

        if (!empty($data['filters'])) {
            $this->filter($query, $data['filters']);
        }

        if (!empty($data['sort_by']) && !empty($data['sort'])) {
            $query->orderBy($data['sort_by'], $data['sort']);
        }

        return UserResource::collection($query->paginate(10));
    }
}
```

### Form Request (Validation)

Each mutation operation has a dedicated Form Request:

```php
namespace App\Http\Requests;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }
}
```

### API Resource (Response)

Use Eloquent API Resources for response transformation:

```php
namespace App\Http\Resources;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'is_admin' => $this->is_admin,
            'roles' => $this->getRoleNames(),
            'permissions' => $this->getAllPermissions()->pluck('name'),
        ];
    }
}
```

## Base Controller Response Helpers

The base Controller class provides consistent response helpers:

| Method | HTTP Code | Usage |
|--------|-----------|-------|
| `responseDataSuccess(array $data)` | 200 | Return data without message |
| `responseStoreSuccess(array $data)` | 200 | Record created successfully |
| `responseStoreFail(array $data)` | 422 | Failed to create record |
| `responseUpdateSuccess(array $data)` | 200 | Record updated successfully |
| `responseUpdateFail(array $data)` | 422 | Failed to update record |
| `responseDeleteSuccess(array $data)` | 200 | Record deleted successfully |
| `responseDeleteFail(array $data)` | 422 | Failed to delete record |

## Model Conventions

### Traits

| Trait | Purpose |
|-------|---------|
| `Filterable` | Dynamic where clauses from filter arrays |
| `Searchable` | Search across defined `$searchFields` |
| `HasApiTokens` | Sanctum token support |
| `HasRoles` | Spatie role/permission |
| `InteractsWithMedia` | Spatie media attachment |

### Guarded vs Fillable

This project uses `$guarded` (blacklist) instead of `$fillable` (whitelist):

```php
protected $guarded = ['id'];
```

### Accessors & Appends

```php
protected $appends = ['avatar_url', 'avatar_thumb_url'];

public function getAvatarUrlAttribute(): ?string
{
    return $this->avatar()?->getFullUrl();
}
```

## Service Class Structure

```text
app/Services/
├── Media/
│   └── MediaService.php     # Upload, replace, delete media
├── Role/
│   └── RoleService.php      # Role listing & search
└── User/
    └── UserService.php      # User CRUD + avatar + roles
```

### Service Conventions

- One service per domain/resource
- Constructor injection for dependencies
- Explicit return types
- Method naming: `index()`, `get()`, `create()`, `update()`, `delete()`

## Utilities

### Data Utility

```php
namespace App\Utilities;

class Data
{
    /**
     * Take a key from array and remove it (array_pull).
     */
    public static function take(array &$data, string $key): mixed
    {
        $value = $data[$key] ?? null;
        unset($data[$key]);
        return $value;
    }
}
```

## Coding Standards

### PHP Style

- PHP 8.4 features used (constructor promotion, match, named arguments)
- PSR-12 compliant (enforced via Laravel Pint)
- Curly braces required for all control structures
- Explicit return type declarations
- Type hints for all parameters

### Pint Configuration

```bash
# Format changed files only
vendor/bin/pint --dirty --format agent

# Format all files
vendor/bin/pint --format agent
```

Always run Pint after modifying PHP files.

### PHPDoc

- Use PHPDoc blocks for complex methods
- Array shape type definitions for parameter/return arrays:

```php
/**
 * Create a new user.
 *
 * @param  array<string, mixed>  $data
 */
public function create(array $data): ?User
```

## Testing

- Framework: PHPUnit
- Location: `tests/Feature/`, `tests/Unit/`
- Run: `php artisan test --compact`

### Test Conventions

```bash
# Run all tests
php artisan test --compact

# Run specific test file
php artisan test --compact tests/Feature/UserTest.php

# Run specific test method
php artisan test --compact --filter=testCanCreateUser
```

## Artisan Commands

```bash
# Create controller
php artisan make:controller UserController --no-interaction

# Create model with all
php artisan make:model Product -mfs --no-interaction

# Create form request
php artisan make:request StoreUserRequest --no-interaction

# Create resource
php artisan make:resource UserResource --no-interaction

# Create test
php artisan make:test UserTest --no-interaction
```

## Best Practices

1. **Thin controllers**: Maximum 5-10 lines per method
2. **Service layer required**: All business logic in services, never in controllers
3. **Form requests**: Validation always in Form Request, never in controller
4. **API Resources**: Response transformation always via Resource class
5. **Authorization**: Use `$this->authorize()` at the controller level
6. **No raw queries**: Use Eloquent/Query Builder
7. **Dependency injection**: Inject services via constructor
8. **Consistent responses**: Use response helpers from base controller
9. **Guard against mass assignment**: Always define `$guarded` or `$fillable`
10. **Run Pint**: Before committing, ensure code is formatted
