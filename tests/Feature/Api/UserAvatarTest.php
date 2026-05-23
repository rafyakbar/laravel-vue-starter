<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('uploads an avatar for a user', function () {
    Storage::fake('public');

    $superadmin = actingAsSuperadmin();
    $target = User::factory()->create();

    $file = UploadedFile::fake()->image('avatar.jpg', 300, 300);

    $this->putJson("/api/users/{$target->id}/avatar", [
        'avatar' => $file,
    ])->assertSuccessful();

    expect($target->fresh()->getMedia('avatars'))->toHaveCount(1);
});

it('rejects avatar upload without a file', function () {
    actingAsSuperadmin();
    $target = User::factory()->create();

    $this->putJson("/api/users/{$target->id}/avatar", [])
        ->assertUnprocessable();
});
