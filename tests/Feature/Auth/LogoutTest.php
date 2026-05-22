<?php

use App\Models\User;

beforeEach(function () {
    seedRolesAndPermissions();
});

it('logs out an authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->postJson('/logout')->assertSuccessful();

    $this->assertGuest();
});
