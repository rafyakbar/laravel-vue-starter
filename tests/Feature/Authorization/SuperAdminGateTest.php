<?php

use App\Models\User;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('admin passes any can() check via Gate::before', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    expect($admin->can('view-users'))->toBeTrue();
    expect($admin->can('create-users'))->toBeTrue();
    expect($admin->can('delete-users'))->toBeTrue();
    expect($admin->can('arbitrary-permission-that-does-not-exist'))->toBeTrue();
});

it('non-admin without permission is denied', function () {
    $user = User::factory()->create();
    $user->assignRole('regular');

    expect($user->can('view-users'))->toBeFalse();
    expect($user->can('create-users'))->toBeFalse();
    expect($user->can('delete-users'))->toBeFalse();
});

it('non-admin with explicit permission is allowed', function () {
    $user = User::factory()->create();
    $user->assignRole('regular');

    expect($user->can('edit-profile'))->toBeTrue();
});
