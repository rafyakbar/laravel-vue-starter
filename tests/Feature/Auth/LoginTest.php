<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('logs in with valid email', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->postJson('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertSuccessful()
        ->assertJsonStructure(['user']);

    $this->assertAuthenticated();
});

it('logs in with valid username', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->postJson('/login', [
        'email' => $user->username,
        'password' => 'password',
    ])->assertSuccessful()
        ->assertJsonStructure(['user']);

    $this->assertAuthenticated();
});

it('rejects login with invalid credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    $this->postJson('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertUnprocessable();

    $this->assertGuest();
});

it('rate limits after too many failed attempts', function () {
    RateLimiter::clear('login');

    $user = User::factory()->create(['password' => bcrypt('password')]);

    foreach (range(1, 5) as $attempt) {
        $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrong',
        ]);
    }

    $this->postJson('/login', [
        'email' => $user->email,
        'password' => 'wrong',
    ])->assertStatus(429);
});
