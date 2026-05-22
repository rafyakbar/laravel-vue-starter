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
        $data['is_admin'] = $this->is_admin;
        $data['is_owner'] = Auth::check() && Auth::user()->id === $this->id;
        $data['roles'] = $this->getRoleNames();
        $data['permissions'] = $this->getAllPermissions()->pluck('name');
        $data['created_at'] = $this->resource->created_at?->diffForHumans();
        $data['updated_at'] = $this->resource->updated_at?->diffForHumans();

        if (isset($data['avatar'])) {
            unset($data['avatar']);
        }

        return $data;
    }
}
