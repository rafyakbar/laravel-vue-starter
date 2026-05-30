<?php

use Spatie\Permission\Models\Role;

it('superadmin can list roles', function () {
    actingAsSuperadmin();

    $this->getJson('/api/roles')
        ->assertSuccessful()
        ->assertJsonStructure(['data', 'meta']);
});

it('admin cannot list roles', function () {
    actingAsAdmin();

    $this->getJson('/api/roles')->assertForbidden();
});

it('user cannot list roles', function () {
    actingAsUser();

    $this->getJson('/api/roles')->assertForbidden();
});

it('unauthenticated role list returns 401', function () {
    $this->getJson('/api/roles')->assertUnauthorized();
});

it('superadmin can view a role', function () {
    actingAsSuperadmin();
    $role = Role::findByName('admin', 'web');

    $this->getJson("/api/roles/{$role->id}")
        ->assertSuccessful()
        ->assertJsonStructure(['model']);
});

it('superadmin can create a role', function () {
    actingAsSuperadmin();

    $this->postJson('/api/roles', [
        'name' => 'editor',
        'permissions' => ['edit-profile'],
    ])->assertSuccessful();

    expect(Role::where('name', 'editor')->where('guard_name', 'web')->exists())->toBeTrue();
    expect(Role::findByName('editor', 'web')->hasPermissionTo('edit-profile'))->toBeTrue();
});

it('superadmin can create a role without permissions', function () {
    actingAsSuperadmin();

    $this->postJson('/api/roles', [
        'name' => 'viewer',
    ])->assertSuccessful();

    expect(Role::where('name', 'viewer')->where('guard_name', 'web')->exists())->toBeTrue();
});

it('admin cannot create a role', function () {
    actingAsAdmin();

    $this->postJson('/api/roles', [
        'name' => 'editor',
    ])->assertForbidden();
});

it('create role requires name', function () {
    actingAsSuperadmin();

    $this->postJson('/api/roles', [])
        ->assertUnprocessable()
        ->assertInvalid('name');
});

it('create role requires unique name', function () {
    actingAsSuperadmin();

    $this->postJson('/api/roles', [
        'name' => 'admin',
    ])->assertUnprocessable()
        ->assertInvalid('name');
});

it('create role validates permissions exist', function () {
    actingAsSuperadmin();

    $this->postJson('/api/roles', [
        'name' => 'editor',
        'permissions' => ['non-existent-permission'],
    ])->assertUnprocessable()
        ->assertInvalid('permissions.0');
});

it('superadmin can update a role', function () {
    actingAsSuperadmin();
    $role = Role::create(['name' => 'editor']);

    $this->putJson("/api/roles/{$role->id}", [
        'name' => 'senior-editor',
        'permissions' => ['edit-profile', 'view-users'],
    ])->assertSuccessful();

    expect($role->fresh()->name)->toBe('senior-editor');
    expect($role->fresh()->hasPermissionTo('view-users'))->toBeTrue();
});

it('superadmin can update role permissions only', function () {
    actingAsSuperadmin();
    $role = Role::create(['name' => 'editor']);
    $role->givePermissionTo('edit-profile');

    $this->putJson("/api/roles/{$role->id}", [
        'name' => 'editor',
        'permissions' => ['view-users'],
    ])->assertSuccessful();

    $fresh = $role->fresh();
    expect($fresh->hasPermissionTo('view-users'))->toBeTrue();
    expect($fresh->hasPermissionTo('edit-profile'))->toBeFalse();
});

it('admin cannot update a role', function () {
    actingAsAdmin();
    $role = Role::findByName('user', 'web');

    $this->putJson("/api/roles/{$role->id}", [
        'name' => 'modified',
    ])->assertForbidden();
});

it('update role requires unique name excluding self', function () {
    actingAsSuperadmin();
    $role = Role::findByName('admin', 'web');

    $this->putJson("/api/roles/{$role->id}", [
        'name' => 'superadmin',
    ])->assertUnprocessable()
        ->assertInvalid('name');
});

it('superadmin can delete a role', function () {
    actingAsSuperadmin();
    $role = Role::create(['name' => 'temp-role']);

    $this->deleteJson("/api/roles/{$role->id}")->assertSuccessful();

    expect(Role::find($role->id))->toBeNull();
});

it('admin cannot delete a role', function () {
    actingAsAdmin();
    $role = Role::findByName('user', 'web');

    $this->deleteJson("/api/roles/{$role->id}")->assertForbidden();
});

it('user cannot delete a role', function () {
    actingAsUser();
    $role = Role::findByName('admin', 'web');

    $this->deleteJson("/api/roles/{$role->id}")->assertForbidden();
});

it('search roles returns paginated results', function () {
    actingAsSuperadmin();

    $this->getJson('/api/roles/search?search=admin')
        ->assertSuccessful()
        ->assertJsonStructure(['data']);
});

it('search roles returns 401 for unauthenticated request', function () {
    $this->getJson('/api/roles/search')->assertUnauthorized();
});

it('role list includes permissions', function () {
    actingAsSuperadmin();

    $response = $this->getJson('/api/roles')
        ->assertSuccessful();

    $data = $response->json('data');
    $superadmin = collect($data)->firstWhere('name', 'superadmin');

    expect($superadmin['permissions'])->toBeArray();
    expect($superadmin['permissions'])->not->toBeEmpty();
});

it('role detail includes permissions and users count', function () {
    actingAsSuperadmin();
    $role = Role::findByName('superadmin', 'web');

    $this->getJson("/api/roles/{$role->id}")
        ->assertSuccessful()
        ->assertJsonStructure([
            'model' => ['id', 'name', 'permissions', 'users_count'],
        ]);
});
