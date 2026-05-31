<?php

use App\Models\User;

it('superadmin can list users', function () {
    actingAsSuperadmin();
    User::factory(3)->create();

    $this->getJson('/api/users')
        ->assertSuccessful()
        ->assertJsonStructure(['data', 'meta']);
});

it('admin cannot list users', function () {
    actingAsAdmin();

    $this->getJson('/api/users')->assertForbidden();
});

it('user cannot list users', function () {
    actingAsUser();

    $this->getJson('/api/users')->assertForbidden();
});

it('unauthenticated request returns 401', function () {
    $this->getJson('/api/users')->assertUnauthorized();
});

it('superadmin can create a user', function () {
    actingAsSuperadmin();

    $this->postJson('/api/users', [
        'name' => 'New User',
        'username' => 'newuser',
        'email' => 'newuser@example.com',
        'password' => 'Password1!',
        'roles' => ['user'],
    ])->assertSuccessful();

    expect(User::where('email', 'newuser@example.com')->exists())->toBeTrue();
});

it('superadmin can view a user', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();

    $this->getJson("/api/users/{$target->id}")
        ->assertSuccessful()
        ->assertJsonStructure(['model']);
});

it('superadmin can update a user', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();

    $this->putJson("/api/users/{$target->id}", [
        'name' => 'Updated Name',
        'username' => $target->username,
        'email' => $target->email,
        'roles' => ['user'],
    ])->assertSuccessful();

    expect($target->fresh()->name)->toBe('Updated Name');
});

it('superadmin can delete a user', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();

    $this->deleteJson("/api/users/{$target->id}")->assertSuccessful();

    expect(User::find($target->id))->toBeNull();
});

it('user cannot delete a user', function () {
    actingAsUser();
    $target = User::factory()->create();

    $this->deleteJson("/api/users/{$target->id}")->assertForbidden();
});

it('superadmin can assign direct permissions to user', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();

    $this->putJson("/api/users/{$target->id}", [
        'name' => $target->name,
        'username' => $target->username,
        'email' => $target->email,
        'roles' => ['user'],
        'permissions' => ['edit-profile'],
    ])->assertSuccessful();

    expect($target->fresh()->hasDirectPermission('edit-profile'))->toBeTrue();
});

it('superadmin can clear direct permissions with empty array', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();
    $target->givePermissionTo('edit-profile');

    $this->putJson("/api/users/{$target->id}", [
        'name' => $target->name,
        'username' => $target->username,
        'email' => $target->email,
        'roles' => ['user'],
        'permissions' => [],
    ])->assertSuccessful();

    expect($target->fresh()->getDirectPermissions())->toBeEmpty();
});

it('update without permissions field does not change existing direct permissions', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();
    $target->givePermissionTo('edit-profile');

    $this->putJson("/api/users/{$target->id}", [
        'name' => 'Updated Name',
        'username' => $target->username,
        'email' => $target->email,
        'roles' => ['user'],
    ])->assertSuccessful();

    expect($target->fresh()->hasDirectPermission('edit-profile'))->toBeTrue();
});

it('update with invalid permission name returns 422', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();

    $this->putJson("/api/users/{$target->id}", [
        'name' => $target->name,
        'username' => $target->username,
        'email' => $target->email,
        'roles' => ['user'],
        'permissions' => ['nonexistent-perm'],
    ])->assertUnprocessable();
});

it('UserResource includes direct_permissions on show', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();
    $target->givePermissionTo('edit-profile');

    $this->getJson("/api/users/{$target->id}")
        ->assertSuccessful()
        ->assertJsonStructure(['model' => ['direct_permissions']])
        ->assertJsonPath('model.direct_permissions', ['edit-profile']);
});
