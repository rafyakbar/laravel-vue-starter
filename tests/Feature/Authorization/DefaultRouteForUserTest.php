<?php

use App\Models\User;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('returns /admin for admin users', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect(default_route_for_user($admin))->toBe('/admin');
});

it('returns /admin for superadmin users', function () {
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    expect(default_route_for_user($superadmin))->toBe('/admin');
});

it('returns / for users without access-admin-panel', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect(default_route_for_user($user))->toBe('/');
});

it('returns / for null user', function () {
    expect(default_route_for_user(null))->toBe('/');
});
