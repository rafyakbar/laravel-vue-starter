<?php

use App\Models\User;

it('searches users by name', function () {
    actingAsSuperadmin();
    User::factory()->create(['name' => 'John Doe', 'username' => 'johndoe123']);
    User::factory()->create(['name' => 'Jane Smith', 'username' => 'janesmith456']);

    $response = $this->getJson('/api/users?search=John')
        ->assertSuccessful();

    $names = collect($response->json('data'))->pluck('name');
    expect($names)->toContain('John Doe');
    expect($names)->not->toContain('Jane Smith');
});

it('searches users by username', function () {
    actingAsSuperadmin();
    User::factory()->create(['name' => 'Alice', 'username' => 'alice_unique']);
    User::factory()->create(['name' => 'Bob', 'username' => 'bob_unique']);

    $response = $this->getJson('/api/users?search=alice_unique')
        ->assertSuccessful();

    $names = collect($response->json('data'))->pluck('name');
    expect($names)->toContain('Alice');
    expect($names)->not->toContain('Bob');
});

it('filters users by role', function () {
    actingAsSuperadmin();

    $adminUser = User::factory()->create();
    $adminUser->assignRole('admin');

    $regularUser = User::factory()->create();
    $regularUser->assignRole('user');

    $response = $this->getJson('/api/users?filters[role]=admin')
        ->assertSuccessful();

    $ids = collect($response->json('data'))->pluck('id');
    expect($ids)->toContain($adminUser->id);
    expect($ids)->not->toContain($regularUser->id);
});
