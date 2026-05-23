<?php

use App\Models\User;

if (! function_exists('default_route_for_user')) {
    /**
     * Return the default route path for a user based on their permissions.
     *
     * Used for login redirect logic and admin-area gating.
     * - Users with `access-admin-panel` permission → `/admin`
     * - All other users (including unauthenticated) → `/`
     */
    function default_route_for_user(?User $user): string
    {
        if ($user && $user->can('access-admin-panel')) {
            return '/admin';
        }

        return '/';
    }
}
