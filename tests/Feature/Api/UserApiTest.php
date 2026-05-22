<?php

use App\Models\User;

it('admin can list users', function () {
    actingAsAdmin();
    User::factory(3)->create();

    $this->getJson('/api/users')
        ->assertSuccessful()
        ->assertJsonStructure(['data', 'meta']);
});

it('regular user cannot list users', function () {
    actingAsRegular();

    $this->getJson('/api/users')->assertForbidden();
});

it('unauthenticated request returns 401', function () {
    $this->getJson('/api/users')->assertUnauthorized();
});

it('admin can create a user', function () {
    actingAsAdmin();

    $this->postJson('/api/users', [
        'name' => 'New User',
        'username' => 'newuser',
        'email' => 'newuser@example.com',
        'password' => 'Password1!',
        'roles' => ['regular'],
    ])->assertSuccessful();

    expect(User::where('email', 'newuser@example.com')->exists())->toBeTrue();
});

it('admin can view a user', function () {
    actingAsAdmin();
    $target = User::factory()->create();

    $this->getJson("/api/users/{$target->id}")
        ->assertSuccessful()
        ->assertJsonStructure(['model']);
});

it('admin can update a user', function () {
    actingAsAdmin();
    $target = User::factory()->create();

    $this->putJson("/api/users/{$target->id}", [
        'name' => 'Updated Name',
        'username' => $target->username,
        'email' => $target->email,
        'roles' => ['regular'],
    ])->assertSuccessful();

    expect($target->fresh()->name)->toBe('Updated Name');
});

it('admin can delete a user', function () {
    actingAsAdmin();
    $target = User::factory()->create();

    $this->deleteJson("/api/users/{$target->id}")->assertSuccessful();

    expect(User::find($target->id))->toBeNull();
});

it('regular user cannot delete a user', function () {
    actingAsRegular();
    $target = User::factory()->create();

    $this->deleteJson("/api/users/{$target->id}")->assertForbidden();
});
