<?php

namespace App\Services\Role;

use App\Http\Resources\RoleResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Role;

class RoleService
{
    /**
     * Get paginated role list with search.
     *
     * @param  array<string, mixed>  $data
     */
    public function index(array $data): AnonymousResourceCollection
    {
        $query = Role::query();
        $perPage = isset($data['per_page']) && is_numeric($data['per_page']) ? intval($data['per_page']) : 10;

        if (! empty($data['search'])) {
            $query->where('name', 'LIKE', '%'.$data['search'].'%');
        }

        if (! empty($data['sort_by']) && ! empty($data['sort'])) {
            $query->orderBy($data['sort_by'], $data['sort']);
        }

        return RoleResource::collection($query->paginate($perPage));
    }
}
