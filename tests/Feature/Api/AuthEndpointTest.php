<?php

it('returns authenticated user data with roles and permissions', function () {
    $user = actingAsAdmin();

    $this->getJson('/api/users/auth')
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'roles',
                'permissions',
                'is_superadmin',
                'is_admin',
                'is_user',
                'avatar_url',
                'avatar_thumb_url',
            ],
        ]);
});

it('returns correct flags for admin user', function () {
    actingAsAdmin();

    $response = $this->getJson('/api/users/auth')->assertSuccessful();

    expect($response->json('data.is_admin'))->toBeTrue();
    expect($response->json('data.is_superadmin'))->toBeFalse();
    expect($response->json('data.is_user'))->toBeFalse();
    expect($response->json('data.permissions'))->toContain('access-admin-panel');
});

it('returns correct flags for superadmin user', function () {
    actingAsSuperadmin();

    $response = $this->getJson('/api/users/auth')->assertSuccessful();

    expect($response->json('data.is_superadmin'))->toBeTrue();
    expect($response->json('data.is_admin'))->toBeFalse();
    expect($response->json('data.is_user'))->toBeFalse();
});

it('returns correct flags for user role', function () {
    actingAsUser();

    $response = $this->getJson('/api/users/auth')->assertSuccessful();

    expect($response->json('data.is_user'))->toBeTrue();
    expect($response->json('data.is_admin'))->toBeFalse();
    expect($response->json('data.is_superadmin'))->toBeFalse();
});

it('returns 401 for unauthenticated request', function () {
    $this->getJson('/api/users/auth')->assertUnauthorized();
});
