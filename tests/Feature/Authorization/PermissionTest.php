<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('regular role has edit-profile permission', function () {
    $regular = Role::findByName('regular');

    expect($regular->hasPermissionTo('edit-profile'))->toBeTrue();
});

it('regular role does not have user management permissions', function () {
    $user = User::factory()->create();
    $user->assignRole('regular');

    expect($user->can('view-users'))->toBeFalse();
    expect($user->can('create-users'))->toBeFalse();
    expect($user->can('update-users'))->toBeFalse();
    expect($user->can('delete-users'))->toBeFalse();
});

it('admin role has all permissions via Gate::before', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    foreach (['view-users', 'create-users', 'update-users', 'delete-users', 'edit-profile'] as $permission) {
        expect($user->can($permission))->toBeTrue();
    }
});
