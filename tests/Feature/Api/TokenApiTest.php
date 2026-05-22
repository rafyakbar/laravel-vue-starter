<?php

use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('generates a Sanctum token with valid credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->postJson('/api/sanctum/token', [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'test-device',
    ])->assertSuccessful()
        ->assertJsonStructure(['token'])
        ->assertJson(fn (AssertableJson $json) => $json->whereNot('token', ''));
});

it('rejects token request with invalid credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->postJson('/api/sanctum/token', [
        'email' => $user->email,
        'password' => 'wrong-password',
        'device_name' => 'test-device',
    ])->assertUnprocessable();
});

it('rejects token request with missing device_name', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->postJson('/api/sanctum/token', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertUnprocessable();
});
