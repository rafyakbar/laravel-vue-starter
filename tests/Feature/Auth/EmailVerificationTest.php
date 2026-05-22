<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('sends a verification notification to an unverified user', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create();
    $this->actingAs($user);

    $this->postJson('/email/verification-notification')
        ->assertSuccessful();

    Notification::assertSentTo($user, VerifyEmail::class);
});

it('does not send verification to an already verified user', function () {
    Notification::fake();

    $user = User::factory()->create(['email_verified_at' => now()]);
    $this->actingAs($user);

    // Already verified users get a 204 No Content response (Fortify headless behavior)
    $this->postJson('/email/verification-notification')
        ->assertNoContent();

    Notification::assertNotSentTo($user, VerifyEmail::class);
});
