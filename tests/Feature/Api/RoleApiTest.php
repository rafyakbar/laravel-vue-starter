<?php

it('returns roles list for authenticated user', function () {
    actingAsAdmin();

    $this->getJson('/api/roles/search')
        ->assertSuccessful()
        ->assertJsonStructure(['data']);
});

it('returns 401 for unauthenticated role search', function () {
    $this->getJson('/api/roles/search')->assertUnauthorized();
});
