<?php

use App\Models\User;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('registers a new user and assigns the user role', function () {
    $this->postJson('/register', [
        'name' => 'John Doe',
        'username' => 'johndoe',
        'email' => 'john@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSuccessful();

    $user = User::where('email', 'john@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->hasRole('user'))->toBeTrue();
});

it('rejects registration with duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->postJson('/register', [
        'name' => 'Jane Doe',
        'username' => 'janedoe',
        'email' => 'taken@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('rejects registration with duplicate username', function () {
    User::factory()->create(['username' => 'takenuser']);

    $this->postJson('/register', [
        'name' => 'Jane Doe',
        'username' => 'takenuser',
        'email' => 'jane@example.com',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['username']);
});

it('rejects registration with missing required fields', function () {
    $this->postJson('/register', [])->assertUnprocessable();
});
