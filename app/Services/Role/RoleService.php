<?php

namespace App\Services\Role;

use App\Http\Resources\RoleResource;
use App\Utilities\Data;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Role;

class RoleService
{
    /**
     * Get a single role resource.
     */
    public function get(Role $role): RoleResource
    {
        $role->load('permissions');
        $role->users_count = $role->users()->count();

        return new RoleResource($role);
    }

    /**
     * Get paginated role list with search.
     *
     * @param  array<string, mixed>  $data
     */
    public function index(array $data): AnonymousResourceCollection
    {
        $query = Role::query()->with('permissions');
        $perPage = isset($data['per_page']) && is_numeric($data['per_page']) ? intval($data['per_page']) : 10;

        if (! empty($data['search'])) {
            $query->where('name', 'LIKE', '%'.$data['search'].'%');
        }

        if (! empty($data['sort_by']) && ! empty($data['sort'])) {
            $query->orderBy($data['sort_by'], $data['sort']);
        } else {
            $query->orderBy('id', 'asc');
        }

        $roles = $query->paginate($perPage);

        // Manually set users_count for each role without breaking eager loaded relationships
        foreach ($roles as $role) {
            $role->users_count = $role->users()->count();
        }

        return RoleResource::collection($roles);
    }

    /**
     * Create a new role.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): ?Role
    {
        $permissions = Data::take($data, 'permissions');

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

        if ($role && ! empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        return $role?->fresh()->load('permissions');
    }

    /**
     * Update an existing role.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Role $role, array $data): bool
    {
        $permissions = Data::take($data, 'permissions');

        $updated = $role->update(['name' => $data['name']]);

        if ($updated && isset($permissions)) {
            $role->syncPermissions($permissions);
        }

        return $updated;
    }

    /**
     * Delete a role.
     */
    public function delete(Role $role): bool
    {
        return $role->delete();
    }
}
