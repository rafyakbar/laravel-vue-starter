<?php

namespace App\Http\Controllers;

use App\Services\Permission\PermissionService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionController extends Controller
{
    /**
     * Constructor.
     */
    public function __construct(private PermissionService $permissionService) {}

    /**
     * Display a listing of all permissions.
     *
     * @throws AuthorizationException
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('view-roles');

        return $this->permissionService->index();
    }
}
