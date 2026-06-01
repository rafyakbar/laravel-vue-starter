<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// ---------------------------------------------------------------------------
// Profile Info Update
// ---------------------------------------------------------------------------

it('superadmin can update their profile info', function () {
    $user = actingAsSuperadmin();

    $this->putJson('/api/profile', [
        'name' => 'Updated Superadmin',
        'username' => $user->username,
    ])->assertOk();

    expect($user->fresh()->name)->toBe('Updated Superadmin');
});

it('admin can update their profile info', function () {
    $user = actingAsAdmin();

    $this->putJson('/api/profile', [
        'name' => 'Updated Admin',
        'username' => $user->username,
    ])->assertOk();

    expect($user->fresh()->name)->toBe('Updated Admin');
});

it('user role can update their profile info', function () {
    $user = actingAsUser();

    $this->putJson('/api/profile', [
        'name' => 'Updated User',
        'username' => $user->username,
    ])->assertOk();

    expect($user->fresh()->name)->toBe('Updated User');
});

it('username belonging to another user is rejected', function () {
    $other = User::factory()->create(['username' => 'taken_username']);
    $user = actingAsUser();

    $this->putJson('/api/profile', [
        'name' => $user->name,
        'username' => 'taken_username',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['username']);
});

it('current user can submit their own username without conflict', function () {
    $user = actingAsUser();

    $this->putJson('/api/profile', [
        'name' => $user->name,
        'username' => $user->username,
    ])->assertOk();
});

// ---------------------------------------------------------------------------
// Password Change
// ---------------------------------------------------------------------------

it('superadmin can change their password', function () {
    $user = actingAsSuperadmin();
    $user->update(['password' => Hash::make('OldPassword1!')]);

    $this->putJson('/user/password', [
        'current_password' => 'OldPassword1!',
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertOk();

    expect(Hash::check('NewPassword1!', $user->fresh()->password))->toBeTrue();
});

it('admin can change their password', function () {
    $user = actingAsAdmin();
    $user->update(['password' => Hash::make('OldPassword1!')]);

    $this->putJson('/user/password', [
        'current_password' => 'OldPassword1!',
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertOk();

    expect(Hash::check('NewPassword1!', $user->fresh()->password))->toBeTrue();
});

it('user role can change their password', function () {
    $user = actingAsUser();
    $user->update(['password' => Hash::make('OldPassword1!')]);

    $this->putJson('/user/password', [
        'current_password' => 'OldPassword1!',
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertOk();

    expect(Hash::check('NewPassword1!', $user->fresh()->password))->toBeTrue();
});

it('wrong current password is rejected for any role', function () {
    $user = actingAsUser();
    $user->update(['password' => Hash::make('OldPassword1!')]);

    $this->putJson('/user/password', [
        'current_password' => 'WrongPassword!',
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['current_password']);
});
