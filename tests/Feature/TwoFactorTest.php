<?php

use App\Models\User;

/**
 * Enable 2FA for a user after confirming password.
 * Requires actingAs($user) to be called first.
 */
function enableTwoFactor(User $user): void
{
    test()->postJson('/user/confirm-password', ['password' => 'password'])->assertStatus(201);
    test()->postJson('/user/two-factor-authentication')->assertSuccessful();
}

/**
 * Enable AND confirm 2FA — sets two_factor_confirmed_at directly to bypass TOTP.
 */
function enableAndConfirmTwoFactor(User $user): void
{
    enableTwoFactor($user);
    $user->forceFill(['two_factor_confirmed_at' => now()])->save();
}

it('user can enable 2fa', function () {
    $user = actingAsSuperadmin();
    enableTwoFactor($user);

    expect($user->fresh()->two_factor_secret)->not->toBeNull();
});

it('user can get qr code after enabling', function () {
    $user = actingAsSuperadmin();
    enableTwoFactor($user);

    $this->getJson('/user/two-factor-qr-code')
        ->assertSuccessful()
        ->assertJsonStructure(['svg']);
});

it('user can get secret key after enabling', function () {
    $user = actingAsSuperadmin();
    enableTwoFactor($user);

    $this->getJson('/user/two-factor-secret-key')
        ->assertSuccessful()
        ->assertJsonStructure(['secretKey']);
});

it('user can view recovery codes', function () {
    $user = actingAsSuperadmin();
    enableAndConfirmTwoFactor($user);

    $response = $this->getJson('/user/two-factor-recovery-codes')
        ->assertSuccessful();

    expect($response->json())->toBeArray()->toHaveCount(8);
});

it('user can regenerate recovery codes', function () {
    $user = actingAsSuperadmin();
    enableAndConfirmTwoFactor($user);

    $original = $this->getJson('/user/two-factor-recovery-codes')->json();

    $this->postJson('/user/two-factor-recovery-codes')->assertSuccessful();

    $regenerated = $this->getJson('/user/two-factor-recovery-codes')->json();

    expect($regenerated)->not->toBe($original);
});

it('user can disable 2fa', function () {
    $user = actingAsSuperadmin();
    enableAndConfirmTwoFactor($user);

    $this->deleteJson('/user/two-factor-authentication')->assertSuccessful();

    expect($user->fresh()->two_factor_secret)->toBeNull();
});

it('2fa management requires password confirmation', function () {
    actingAsSuperadmin();

    $this->postJson('/user/two-factor-authentication')->assertStatus(423);
});

it('login with 2fa enabled returns two_factor true', function () {
    seedRolesAndPermissions();

    $user = User::factory()->create([
        'email' => 'twofactor@example.com',
        'password' => bcrypt('Password1!'),
    ]);
    $user->assignRole('user');

    $this->actingAs($user);
    $this->postJson('/user/confirm-password', ['password' => 'Password1!'])->assertStatus(201);
    $this->postJson('/user/two-factor-authentication')->assertSuccessful();
    $user->forceFill(['two_factor_confirmed_at' => now()])->save();

    $this->post('/logout');
    auth()->forgetGuards();

    $this->getJson('/sanctum/csrf-cookie');

    $response = $this->postJson('/login', [
        'email' => 'twofactor@example.com',
        'password' => 'Password1!',
    ])->assertSuccessful();

    expect($response->json('two_factor'))->toBeTrue();
});
