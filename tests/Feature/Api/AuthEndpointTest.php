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
                'avatar_url',
                'avatar_thumb_url',
            ],
        ]);
});

it('returns 401 for unauthenticated request', function () {
    $this->getJson('/api/users/auth')->assertUnauthorized();
});
