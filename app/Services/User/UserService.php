<?php

namespace App\Services\User;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Media\MediaService;
use App\Utilities\Data;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class UserService
{
    protected MediaService $mediaService;

    public function __construct()
    {
        $this->mediaService = new MediaService;
    }

    /**
     * Get a single user resource.
     */
    public function get(User $user): UserResource
    {
        return new UserResource($user);
    }

    /**
     * Get paginated user list.
     *
     * @param  array<string, mixed>  $data
     */
    public function index(array $data): AnonymousResourceCollection
    {
        $query = User::query();

        if (! empty($data['search'])) {
            $query->search($data['search']);
        }

        if (! empty($data['filters'])) {
            $this->filter($query, $data['filters']);
        }

        if (! empty($data['sort_by']) && ! empty($data['sort'])) {
            $query->orderBy($data['sort_by'], $data['sort']);
        } else {
            $query->latest();
        }

        return UserResource::collection($query->paginate(10));
    }

    /**
     * Create a new user.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): ?User
    {
        $data = $this->clean($data);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $data['email_verified_at'] = Carbon::now()->toDateTimeString();
        $roles = Data::take($data, 'roles');
        $avatar = Data::take($data, 'avatar');

        $record = User::query()->create($data);

        if ($record) {
            if (! empty($avatar)) {
                $this->mediaService->replace($avatar, $record, 'avatars');
            }

            if (! empty($roles)) {
                $record->syncRoles($roles);
            }

            return $record->fresh();
        }

        return null;
    }

    /**
     * Update an existing user.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data): bool
    {
        $data = $this->clean($data);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        $roles = Data::take($data, 'roles');
        $permissions = Data::take($data, 'permissions');
        unset($data['email'], $data['password_confirmation']);

        if (isset($data['avatar']) && $data['avatar']) {
            $this->mediaService->replace($data['avatar'], $user, 'avatars');
            unset($data['avatar']);
        }

        if (! empty($roles)) {
            $user->syncRoles($roles);
        }

        if (array_key_exists('permissions', $data) || isset($permissions)) {
            $user->syncPermissions($permissions ?? []);
        }

        return $user->update($data);
    }

    /**
     * Update avatar for the specified user.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateAvatar(User $user, array $data): bool
    {
        if (isset($data['avatar']) && $data['avatar']) {
            $this->mediaService->replace($data['avatar'], $user, 'avatars');

            return true;
        }

        return false;
    }

    /**
     * Delete the avatar for the specified user.
     */
    public function deleteAvatar(User $user): bool
    {
        $user->clearMediaCollection('avatars');

        return true;
    }

    /**
     * Delete a user.
     */
    public function delete(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Clean input data by converting 'null' strings to null.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function clean(array $data): array
    {
        foreach ($data as $i => $row) {
            if ($row === 'null') {
                $data[$i] = null;
            }
        }

        return $data;
    }

    /**
     * Apply filters to the query.
     *
     * @param  array<string, mixed>  $filters
     */
    private function filter(Builder &$query, array $filters): void
    {
        $query->filter(Arr::except($filters, ['role']));

        if (! empty($filters['role'])) {
            $query->role($filters['role']);
        }
    }
}
