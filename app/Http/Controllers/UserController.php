<?php

namespace App\Http\Controllers;

use App\Http\Requests\DestroyUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateAvatarRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\User\UserService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    /**
     * Constructor.
     */
    public function __construct(private UserService $userService) {}

    /**
     * Display a listing of users.
     *
     * @throws AuthorizationException
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('view-users');

        return $this->userService->index($request->all());
    }

    /**
     * Store a newly created user.
     *
     * @throws AuthorizationException
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create-users');

        $record = $this->userService->create($request->validated());

        if ($record) {
            return $this->responseStoreSuccess(['record' => $record]);
        }

        return $this->responseStoreFail();
    }

    /**
     * Display the specified user.
     *
     * @throws AuthorizationException
     */
    public function show(User $user): JsonResponse
    {
        $this->authorize('view-users');

        $model = $this->userService->get($user);

        return $this->responseDataSuccess(['model' => $model]);
    }

    /**
     * Update the specified user.
     *
     * @throws AuthorizationException
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('update-users');

        if ($this->userService->update($user, $request->validated())) {
            return $this->responseUpdateSuccess(['record' => $user->fresh()]);
        }

        return $this->responseUpdateFail();
    }

    /**
     * Update avatar for the specified user.
     *
     * @throws AuthorizationException
     */
    public function updateAvatar(UpdateAvatarRequest $request, User $user): JsonResponse
    {
        $this->authorize('edit-profile');

        if ($this->userService->updateAvatar($user, $request->validated())) {
            return $this->responseUpdateSuccess(['record' => $user->fresh()]);
        }

        return $this->responseUpdateFail();
    }

    /**
     * Remove the specified user.
     *
     * @throws AuthorizationException
     */
    public function destroy(DestroyUserRequest $request, User $user): JsonResponse
    {
        $this->authorize('delete-users');

        if ($this->userService->delete($user)) {
            return $this->responseDeleteSuccess(['record' => $user]);
        }

        return $this->responseDeleteFail();
    }
}
