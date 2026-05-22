<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('updates profile information', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->putJson('/user/profile-information', [
        'name' => 'Updated Name',
        'email' => $user->email,
    ])->assertSuccessful();

    expect($user->fresh()->name)->toBe('Updated Name');
});

it('updates password with correct current password', function () {
    $user = User::factory()->create(['password' => Hash::make('OldPassword1!')]);
    $this->actingAs($user);

    $this->putJson('/user/password', [
        'current_password' => 'OldPassword1!',
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertSuccessful();

    expect(Hash::check('NewPassword1!', $user->fresh()->password))->toBeTrue();
});

it('rejects password update with incorrect current password', function () {
    $user = User::factory()->create(['password' => Hash::make('OldPassword1!')]);
    $this->actingAs($user);

    $this->putJson('/user/password', [
        'current_password' => 'WrongPassword!',
        'password' => 'NewPassword1!',
        'password_confirmation' => 'NewPassword1!',
    ])->assertUnprocessable();
});
