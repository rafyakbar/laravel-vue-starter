<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/

function seedRolesAndPermissions(): void
{
    (new RolesAndPermissionsSeeder)->run();
}

/**
 * Create and authenticate a superadmin user.
 * Superadmin bypasses all permission checks via Gate::before.
 */
function actingAsSuperadmin(): User
{
    seedRolesAndPermissions();
    $user = User::factory()->create();
    $user->assignRole('superadmin');
    test()->actingAs($user);

    return $user;
}

/**
 * Create and authenticate an admin user.
 * Admin has access-admin-panel and edit-profile permissions.
 * Admin does NOT have user/role management permissions.
 */
function actingAsAdmin(): User
{
    seedRolesAndPermissions();
    $user = User::factory()->create();
    $user->assignRole('admin');
    test()->actingAs($user);

    return $user;
}

/**
 * Create and authenticate a user with the default 'user' role.
 * User has only edit-profile permission and no admin-panel access.
 */
function actingAsUser(): User
{
    seedRolesAndPermissions();
    $user = User::factory()->create();
    $user->assignRole('user');
    test()->actingAs($user);

    return $user;
}
