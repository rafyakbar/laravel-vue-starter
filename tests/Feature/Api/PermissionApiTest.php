<?php

it('superadmin can list permissions', function () {
    actingAsSuperadmin();

    $this->getJson('/api/permissions')
        ->assertSuccessful()
        ->assertJsonStructure(['data']);
});

it('admin cannot list permissions', function () {
    actingAsAdmin();

    $this->getJson('/api/permissions')->assertForbidden();
});

it('user cannot list permissions', function () {
    actingAsUser();

    $this->getJson('/api/permissions')->assertForbidden();
});

it('unauthenticated permission list returns 401', function () {
    $this->getJson('/api/permissions')->assertUnauthorized();
});

it('permission list returns all seeded permissions', function () {
    actingAsSuperadmin();

    $response = $this->getJson('/api/permissions')
        ->assertSuccessful();

    $data = $response->json('data');
    $names = collect($data)->pluck('name')->toArray();

    expect($names)->toContain('view-users');
    expect($names)->toContain('create-roles');
    expect($names)->toContain('access-admin-panel');
    expect($names)->toContain('edit-profile');
});
