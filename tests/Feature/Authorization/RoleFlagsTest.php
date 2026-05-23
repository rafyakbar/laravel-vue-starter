<?php

use App\Models\User;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('is_superadmin returns true only for superadmin role', function () {
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    expect($superadmin->is_superadmin)->toBeTrue();
    expect($superadmin->is_admin)->toBeFalse();
    expect($superadmin->is_user)->toBeFalse();
});

it('is_admin returns true only for admin role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($admin->is_admin)->toBeTrue();
    expect($admin->is_superadmin)->toBeFalse();
    expect($admin->is_user)->toBeFalse();
});

it('is_user returns true only for user role', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect($user->is_user)->toBeTrue();
    expect($user->is_admin)->toBeFalse();
    expect($user->is_superadmin)->toBeFalse();
});

it('flags are independent for users with multiple roles', function () {
    $user = User::factory()->create();
    $user->assignRole('superadmin');
    $user->assignRole('admin');

    expect($user->is_superadmin)->toBeTrue();
    expect($user->is_admin)->toBeTrue();
    expect($user->is_user)->toBeFalse();
});
