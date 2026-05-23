<?php

use App\Models\User;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('superadmin holds all defined permissions explicitly', function () {
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    // All defined permissions should pass — granted explicitly via syncPermissions(Permission::all())
    foreach (['view-users', 'create-users', 'update-users', 'delete-users',
        'view-roles', 'create-roles', 'update-roles', 'delete-roles', 'assign-roles',
        'edit-profile', 'access-admin-panel'] as $permission) {
        expect($superadmin->can($permission))->toBeTrue("superadmin should hold {$permission}");
    }
});

it('superadmin does not pass undefined permission checks', function () {
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    // Without Gate::before bypass, undefined permissions return false
    expect($superadmin->can('arbitrary-permission-that-does-not-exist'))->toBeFalse();
});

it('admin role has only its explicit permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    // Admin does not have user management permissions
    expect($admin->can('view-users'))->toBeFalse();
    expect($admin->can('create-users'))->toBeFalse();
    expect($admin->can('delete-users'))->toBeFalse();
    // Admin does have its explicit permissions
    expect($admin->can('access-admin-panel'))->toBeTrue();
    expect($admin->can('edit-profile'))->toBeTrue();
});

it('user without permission is denied', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect($user->can('view-users'))->toBeFalse();
    expect($user->can('create-users'))->toBeFalse();
    expect($user->can('delete-users'))->toBeFalse();
    expect($user->can('access-admin-panel'))->toBeFalse();
});

it('user with explicit permission is allowed', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect($user->can('edit-profile'))->toBeTrue();
});
