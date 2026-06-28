<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

// ---------------------------------------------------------------------------
// GET /api/profile/sessions
// ---------------------------------------------------------------------------

it('authenticated user can list their browser sessions', function () {
    $user = actingAsUser();

    DB::table('sessions')->insert([
        'id' => 'test-session-abc',
        'user_id' => $user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'payload' => base64_encode(serialize([])),
        'last_activity' => time(),
    ]);

    $this->withSession([])
        ->getJson('/api/profile/sessions')
        ->assertOk()
        ->assertJsonIsArray()
        ->assertJsonStructure([['id', 'ip_address', 'device', 'is_current', 'last_active_at']]);
});

it('sessions response contains a device label as a non-empty string', function () {
    $user = actingAsUser();

    DB::table('sessions')->insert([
        'id' => 'test-session-device',
        'user_id' => $user->id,
        'ip_address' => '192.168.1.1',
        'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1 Safari/604.1',
        'payload' => base64_encode(serialize([])),
        'last_activity' => time(),
    ]);

    $response = $this->withSession([])
        ->getJson('/api/profile/sessions')
        ->assertOk();

    $items = $response->json();
    $found = collect($items)->first(fn ($item) => $item['id'] === 'test-session-device');

    expect($found)->not->toBeNull()
        ->and($found['device'])->toBeString()
        ->and(strlen($found['device']))->toBeGreaterThan(0);
});

it('sessions endpoint returns 401 for guest', function () {
    $this->getJson('/api/profile/sessions')->assertUnauthorized();
});

// ---------------------------------------------------------------------------
// DELETE /api/profile/sessions/others
// ---------------------------------------------------------------------------

it('delete other sessions returns 423 without password confirmation', function () {
    actingAsUser();

    $this->withSession([])
        ->deleteJson('/api/profile/sessions/others')
        ->assertStatus(423);
});

it('delete other sessions succeeds after password confirmation and removes other session rows', function () {
    $user = User::factory()->create();

    // Use web guard so the session middleware runs, which makes hasSession() return true
    $this->actingAs($user, 'web');

    DB::table('sessions')->insert([
        'id' => 'other-session-xyz',
        'user_id' => $user->id,
        'ip_address' => '10.0.0.1',
        'user_agent' => 'OtherBrowser/1.0',
        'payload' => base64_encode(serialize([])),
        'last_activity' => time() - 3600,
    ]);

    $this->withSession(['auth' => ['password_confirmed_at' => time()]])
        ->deleteJson('/api/profile/sessions/others')
        ->assertOk()
        ->assertJson(['message' => 'Other sessions logged out.']);

    $this->assertDatabaseMissing('sessions', ['id' => 'other-session-xyz']);
});

it('delete other sessions does not delete the current session row', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web');

    DB::table('sessions')->insert([
        [
            'id' => 'should-be-deleted-other',
            'user_id' => $user->id,
            'ip_address' => '1.2.3.4',
            'user_agent' => 'AnotherBrowser',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time() - 100,
        ],
    ]);

    $this->withSession(['auth' => ['password_confirmed_at' => time()]])
        ->deleteJson('/api/profile/sessions/others')
        ->assertOk();

    $this->assertDatabaseMissing('sessions', ['id' => 'should-be-deleted-other']);
});

it('delete other sessions returns 401 for guest', function () {
    $this->deleteJson('/api/profile/sessions/others')->assertUnauthorized();
});
