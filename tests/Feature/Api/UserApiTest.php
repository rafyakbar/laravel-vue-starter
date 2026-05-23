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
