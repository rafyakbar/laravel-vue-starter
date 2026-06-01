<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile information.
     *
     * @throws AuthorizationException
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $this->authorize('edit-profile');

        $user = $request->user();
        $user->update($request->validated());

        return $this->responseUpdateSuccess(['record' => new UserResource($user->fresh())]);
    }
}
