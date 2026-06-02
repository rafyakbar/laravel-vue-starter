<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $data = $this->resource->toArray();
        $data['is_superadmin'] = $this->is_superadmin;
        $data['is_admin'] = $this->is_admin;
        $data['is_user'] = $this->is_user;
        $data['is_owner'] = Auth::check() && Auth::user()->id === $this->id;
        $data['roles'] = $this->getRoleNames();
        // All roles (including superadmin) hold explicit permissions,
        // so getAllPermissions() returns a consistent list for everyone.
        $data['permissions'] = $this->getAllPermissions()->pluck('name');
        $data['direct_permissions'] = $this->getDirectPermissions()->pluck('name');
        $data['two_factor_confirmed_at'] = $this->resource->two_factor_confirmed_at?->toIso8601String();
        $data['created_at'] = $this->resource->created_at?->diffForHumans();
        $data['updated_at'] = $this->resource->updated_at?->diffForHumans();

        if (isset($data['avatar'])) {
            unset($data['avatar']);
        }

        return $data;
    }
}
