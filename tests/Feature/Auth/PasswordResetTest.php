<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('sends a password reset notification', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->postJson('/forgot-password', ['email' => $user->email])
        ->assertSuccessful();

    Notification::assertSentTo($user, ResetPassword::class);
});

it('returns 422 for non-existent email on forgot password', function () {
    $this->postJson('/forgot-password', ['email' => 'nonexistent@example.com'])
        ->assertUnprocessable();
});

it('resets password with a valid token', function () {
    $user = User::factory()->create();
    $token = Password::createToken($user);

    $this->postJson('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertSuccessful();

    expect(Hash::check('NewPassword1!', $user->fresh()->password))->toBeTrue();
});

it('rejects reset with invalid token', function () {
    $user = User::factory()->create();

    $this->postJson('/reset-password', [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertUnprocessable();
});
