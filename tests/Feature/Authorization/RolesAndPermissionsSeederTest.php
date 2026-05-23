<?php

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('creates superadmin, admin, and user roles', function () {
    expect(Role::where('name', 'superadmin')->exists())->toBeTrue();
    expect(Role::where('name', 'admin')->exists())->toBeTrue();
    expect(Role::where('name', 'user')->exists())->toBeTrue();
});

it('does not create the old regular role', function () {
    expect(Role::where('name', 'regular')->exists())->toBeFalse();
});

it('creates all user management permissions', function () {
    foreach (['view-users', 'create-users', 'update-users', 'delete-users'] as $permission) {
        expect(Permission::where('name', $permission)->exists())
            ->toBeTrue("Permission '{$permission}' should exist");
    }
});

it('creates all role management permissions', function () {
    foreach (['view-roles', 'create-roles', 'update-roles', 'delete-roles', 'assign-roles'] as $permission) {
        expect(Permission::where('name', $permission)->exists())
            ->toBeTrue("Permission '{$permission}' should exist");
    }
});

it('creates profile and admin-panel permissions', function () {
    expect(Permission::where('name', 'edit-profile')->exists())->toBeTrue();
    expect(Permission::where('name', 'access-admin-panel')->exists())->toBeTrue();
});

it('assigns access-admin-panel and edit-profile to admin role', function () {
    $admin = Role::findByName('admin');

    expect($admin->hasPermissionTo('access-admin-panel'))->toBeTrue();
    expect($admin->hasPermissionTo('edit-profile'))->toBeTrue();
});

it('does not assign user management permissions to admin role', function () {
    $admin = Role::findByName('admin');

    expect($admin->hasPermissionTo('view-users'))->toBeFalse();
    expect($admin->hasPermissionTo('create-users'))->toBeFalse();
    expect($admin->hasPermissionTo('update-users'))->toBeFalse();
    expect($admin->hasPermissionTo('delete-users'))->toBeFalse();
});

it('assigns only edit-profile to user role', function () {
    $user = Role::findByName('user');

    expect($user->hasPermissionTo('edit-profile'))->toBeTrue();
    expect($user->hasPermissionTo('access-admin-panel'))->toBeFalse();
});

it('does not assign user management permissions to user role', function () {
    $user = Role::findByName('user');

    expect($user->hasPermissionTo('view-users'))->toBeFalse();
    expect($user->hasPermissionTo('create-users'))->toBeFalse();
    expect($user->hasPermissionTo('update-users'))->toBeFalse();
    expect($user->hasPermissionTo('delete-users'))->toBeFalse();
});

it('assigns all permissions to superadmin role', function () {
    $superadmin = Role::findByName('superadmin');
    $totalPermissions = Permission::count();

    expect($superadmin->permissions->count())->toBe($totalPermissions);

    // Spot-check a few specific permissions
    expect($superadmin->hasPermissionTo('view-users'))->toBeTrue();
    expect($superadmin->hasPermissionTo('access-admin-panel'))->toBeTrue();
    expect($superadmin->hasPermissionTo('edit-profile'))->toBeTrue();
    expect($superadmin->hasPermissionTo('assign-roles'))->toBeTrue();
});
