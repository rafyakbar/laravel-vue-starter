<?php

namespace App\Http\Controllers;

use App\Services\Role\RoleService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleController extends Controller
{
    /**
     * Constructor.
     */
    public function __construct(private RoleService $roleService) {}

    /**
     * Search roles.
     */
    public function search(Request $request): AnonymousResourceCollection
    {
        return $this->roleService->index($request->all());
    }
}
