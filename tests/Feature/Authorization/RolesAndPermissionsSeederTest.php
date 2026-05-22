<?php

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('creates admin and regular roles', function () {
    expect(Role::where('name', 'admin')->exists())->toBeTrue();
    expect(Role::where('name', 'regular')->exists())->toBeTrue();
});

it('creates all expected permissions', function () {
    $permissions = ['view-users', 'create-users', 'update-users', 'delete-users', 'edit-profile'];

    foreach ($permissions as $permission) {
        expect(Permission::where('name', $permission)->exists())
            ->toBeTrue("Permission '{$permission}' should exist");
    }
});

it('assigns edit-profile permission to regular role', function () {
    $regular = Role::findByName('regular');

    expect($regular->hasPermissionTo('edit-profile'))->toBeTrue();
});

it('does not assign user management permissions to regular role', function () {
    $regular = Role::findByName('regular');

    expect($regular->hasPermissionTo('view-users'))->toBeFalse();
    expect($regular->hasPermissionTo('create-users'))->toBeFalse();
    expect($regular->hasPermissionTo('update-users'))->toBeFalse();
    expect($regular->hasPermissionTo('delete-users'))->toBeFalse();
});
