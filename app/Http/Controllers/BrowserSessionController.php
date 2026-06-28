<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class BrowserSessionController extends Controller
{
    /**
     * List all active browser sessions for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $currentId = $request->hasSession() ? $request->session()->getId() : null;

        $sessions = DB::table('sessions')
            ->where('user_id', auth()->id())
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'ip_address' => $row->ip_address,
                'device' => $this->parseDevice($row->user_agent ?? ''),
                'is_current' => $currentId !== null && $row->id === $currentId,
                'last_active_at' => Carbon::createFromTimestamp($row->last_activity)->toISOString(),
            ]);

        return response()->json($sessions);
    }

    /**
     * Log out all browser sessions except the current one.
     * Requires recent password confirmation.
     */
    public function destroyOthers(Request $request): JsonResponse
    {
        // The session must exist and contain a recent password confirmation.
        // Fortify stores this via session()->put('auth.password_confirmed_at', ...).
        // When the session is not available (e.g. token-only auth), treat as unconfirmed.
        $confirmedAt = $request->hasSession()
            ? $request->session()->get('auth.password_confirmed_at', 0)
            : 0;

        $timeout = config('auth.password_timeout', 900);

        if (! $confirmedAt || (time() - (int) $confirmedAt) > $timeout) {
            return response()->json(['message' => 'Password confirmation required.'], 423);
        }

        $currentId = $request->session()->getId();

        DB::table('sessions')
            ->where('user_id', auth()->id())
            ->where('id', '!=', $currentId)
            ->delete();

        $request->session()->migrate(true);

        return response()->json(['message' => 'Other sessions logged out.']);
    }

    /**
     * Parse a User-Agent string into a human-readable device label.
     */
    private function parseDevice(string $userAgent): string
    {
        // Detect OS
        $os = match (true) {
            str_contains($userAgent, 'iPhone') => 'iPhone',
            str_contains($userAgent, 'iPad') => 'iPad',
            str_contains($userAgent, 'Android') => 'Android',
            str_contains($userAgent, 'Windows') => 'Windows',
            str_contains($userAgent, 'Macintosh') || str_contains($userAgent, 'Mac OS') => 'Mac',
            str_contains($userAgent, 'Linux') => 'Linux',
            default => null,
        };

        // Detect browser — order matters (Edge contains Chrome, Chrome contains Safari)
        $browser = match (true) {
            str_contains($userAgent, 'Edg/') || str_contains($userAgent, 'Edge/') => 'Edge',
            str_contains($userAgent, 'OPR/') || str_contains($userAgent, 'Opera') => 'Opera',
            str_contains($userAgent, 'Firefox') => 'Firefox',
            str_contains($userAgent, 'Chrome') => 'Chrome',
            str_contains($userAgent, 'Safari') => 'Safari',
            default => null,
        };

        if ($browser && $os) {
            return "{$browser} on {$os}";
        }

        return $browser ?? $os ?? 'Unknown Device';
    }
}
