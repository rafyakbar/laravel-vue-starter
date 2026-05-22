<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Return the currently authenticated user with roles and permissions.
     */
    public function __invoke(): ?UserResource
    {
        return Auth::check() ? new UserResource(Auth::user()) : null;
    }
}
