<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('user role has edit-profile permission', function () {
    $userRole = Role::findByName('user');

    expect($userRole->hasPermissionTo('edit-profile'))->toBeTrue();
});

it('user role does not have user management permissions', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect($user->can('view-users'))->toBeFalse();
    expect($user->can('create-users'))->toBeFalse();
    expect($user->can('update-users'))->toBeFalse();
    expect($user->can('delete-users'))->toBeFalse();
});

it('user role does not have access-admin-panel permission', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    expect($user->can('access-admin-panel'))->toBeFalse();
});

it('admin role has access-admin-panel permission', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($admin->can('access-admin-panel'))->toBeTrue();
});

it('admin role does not have user management permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($admin->can('view-users'))->toBeFalse();
    expect($admin->can('create-users'))->toBeFalse();
    expect($admin->can('update-users'))->toBeFalse();
    expect($admin->can('delete-users'))->toBeFalse();
});

it('superadmin role has all permissions via explicit grant', function () {
    $superadmin = User::factory()->create();
    $superadmin->assignRole('superadmin');

    foreach (['view-users', 'create-users', 'update-users', 'delete-users', 'edit-profile', 'access-admin-panel'] as $permission) {
        expect($superadmin->can($permission))->toBeTrue();
    }
});
