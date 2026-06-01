<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

// ---------------------------------------------------------------------------
// Upload — per role
// ---------------------------------------------------------------------------

it('superadmin can upload their own avatar', function () {
    $user = actingAsSuperadmin();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();
});

it('admin can upload their own avatar', function () {
    $user = actingAsAdmin();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();
});

it('user role can upload their own avatar', function () {
    $user = actingAsUser();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();
});

// ---------------------------------------------------------------------------
// Upload — response contains avatar_url
// ---------------------------------------------------------------------------

it('upload response contains a non-null avatar_url', function () {
    $user = actingAsUser();

    $response = $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();

    expect($response->json('record.avatar_url'))->not->toBeNull();
});

// ---------------------------------------------------------------------------
// Upload — authorization
// ---------------------------------------------------------------------------

it('user role cannot upload another user avatar', function () {
    actingAsUser();
    $other = User::factory()->create();

    $this->putJson("/api/users/{$other->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertForbidden();
});

it('non-image file is rejected', function () {
    $user = actingAsUser();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
    ])->assertUnprocessable();
});

// ---------------------------------------------------------------------------
// Delete — per role
// ---------------------------------------------------------------------------

it('superadmin can delete their own avatar', function () {
    $user = actingAsSuperadmin();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();

    $this->deleteJson("/api/users/{$user->id}/avatar")->assertOk();

    expect($user->fresh()->avatar_url)->toBeNull();
});

it('admin can delete their own avatar', function () {
    $user = actingAsAdmin();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();

    $this->deleteJson("/api/users/{$user->id}/avatar")->assertOk();

    expect($user->fresh()->avatar_url)->toBeNull();
});

it('user role can delete their own avatar', function () {
    $user = actingAsUser();

    $this->putJson("/api/users/{$user->id}/avatar", [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ])->assertOk();

    $this->deleteJson("/api/users/{$user->id}/avatar")->assertOk();

    expect($user->fresh()->avatar_url)->toBeNull();
});

it('user role cannot delete another user avatar', function () {
    actingAsUser();
    $other = User::factory()->create();

    $this->deleteJson("/api/users/{$other->id}/avatar")->assertForbidden();
});
