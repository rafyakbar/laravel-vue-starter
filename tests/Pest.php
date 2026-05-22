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

function actingAsAdmin(): User
{
    seedRolesAndPermissions();
    $user = User::factory()->create();
    $user->assignRole('admin');
    test()->actingAs($user);

    return $user;
}

function actingAsRegular(): User
{
    seedRolesAndPermissions();
    $user = User::factory()->create();
    $user->assignRole('regular');
    test()->actingAs($user);

    return $user;
}
