<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Services\Role\RoleService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Constructor.
     */
    public function __construct(private RoleService $roleService) {}

    /**
     * Display a listing of roles.
     *
     * @throws AuthorizationException
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('view-roles');

        return $this->roleService->index($request->all());
    }

    /**
     * Store a newly created role.
     *
     * @throws AuthorizationException
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        $this->authorize('create-roles');

        $record = $this->roleService->create($request->validated());

        if ($record) {
            return $this->responseStoreSuccess(['record' => $this->roleService->get($record)]);
        }

        return $this->responseStoreFail();
    }

    /**
     * Display the specified role.
     *
     * @throws AuthorizationException
     */
    public function show(Role $role): JsonResponse
    {
        $this->authorize('view-roles');

        $model = $this->roleService->get($role);

        return $this->responseDataSuccess(['model' => $model]);
    }

    /**
     * Update the specified role.
     *
     * @throws AuthorizationException
     */
    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $this->authorize('update-roles');

        if ($this->roleService->update($role, $request->validated())) {
            return $this->responseUpdateSuccess(['record' => $this->roleService->get($role->fresh())]);
        }

        return $this->responseUpdateFail();
    }

    /**
     * Remove the specified role.
     *
     * @throws AuthorizationException
     */
    public function destroy(Role $role): JsonResponse
    {
        $this->authorize('delete-roles');

        if ($this->roleService->delete($role)) {
            return $this->responseDeleteSuccess(['record' => $role]);
        }

        return $this->responseDeleteFail();
    }

    /**
     * Search roles (for dropdowns/selects).
     */
    public function search(Request $request): AnonymousResourceCollection
    {
        return $this->roleService->index($request->all());
    }
}
