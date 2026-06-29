## Context

The profile page currently lives at `/profile` and renders a vertical stack of individual cards — AvatarUpload, ProfileInfoForm, PasswordForm, TwoFactorForm — in both `DefaultLayout` (regular user) and `AdminLayout` (admin/superadmin). The layout is narrow (`max-w-lg`) for regular users. Browser session management does not exist. The sessions table is already database-backed (driver: `database`) with `id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity` columns.

## Goals / Non-Goals

**Goals:**
- Move route to `/my-profile` and update all references
- Redesign layout to a consistent two-column section pattern (35% description / 65% form) for all roles
- Integrate avatar upload into the Personal Information section
- Add read-only email display in the Personal Information form
- Redesign the 2FA "disabled" state with explanation text
- Build browser sessions listing and logout-others feature (backend + frontend)
- Full i18n (EN + ID) for all new strings
- Update all affected tests (Pest + Playwright E2E)

**Non-Goals:**
- Email editing (separate verified flow, out of scope)
- Pagination or search on browser sessions
- Real-time session updates / WebSocket
- Changing the sessions table schema

## Decisions

### 1. Two-column layout pattern — inline divider vs. component

**Decision**: Implement the two-column section pattern as a reusable layout structure directly in `ProfilePage.vue` using a Tailwind grid (`grid grid-cols-[35%_1fr]`), not as a separate wrapper component.

**Rationale**: Only `ProfilePage` uses this pattern. Extracting it to a component would add indirection with no reuse benefit. A simple grid in the page template is readable and direct.

**Alternative considered**: A `<ProfileSection>` wrapper component — rejected as premature abstraction.

---

### 2. AvatarUpload refactor — prop-based vs. slot

**Decision**: Add a `compact` boolean prop to `AvatarUpload`. When `compact=true`, the outer card wrapper and section header are suppressed; only the avatar circle + upload/remove buttons render. `ProfilePage` passes `compact` when embedding it inside the Personal Information column.

**Rationale**: Keeps the component backward-compatible (existing standalone usages in AdminLayout still work without the prop). Clean opt-in, no breaking change.

---

### 3. Browser sessions API — custom routes vs. Fortify feature

**Decision**: Build two custom API routes under the existing `api.php` auth middleware group:
- `GET /api/profile/sessions` — handled by a new `BrowserSessionController@index`
- `DELETE /api/profile/sessions/others` — handled by `BrowserSessionController@destroyOthers`

**Rationale**: Fortify does not provide browser session management (that's Jetstream-only). The sessions table is already accessible via Eloquent (`DB::table('sessions')`). Rolling our own keeps the API consistent with the existing `/api/profile` pattern.

**Password confirmation**: The frontend calls `POST /user/confirm-password` (existing Fortify route) before calling `DELETE /api/profile/sessions/others`. The backend checks `password.confirm` session status on the delete route (via `EnsurePasswordIsConfirmed` middleware or manual check with `session('auth.password_confirmed_at')`).

**Alternative considered**: Using Fortify's `Features::twoFactorAuthentication` approach — not applicable since Fortify has no sessions feature.

---

### 4. Session device parsing — User-Agent string

**Decision**: Parse the `user_agent` string server-side in `BrowserSessionController` to extract a human-readable device label (browser name + OS). Use simple string matching (contains checks) — no external package.

**Rationale**: The sessions table already stores the full user agent string. A lightweight parser (50–80 lines) is sufficient for displaying "Chrome on Windows" or "Safari on iPhone". No package overhead.

**Current session detection**: Compare session `id` with `session()->getId()` to mark the current device.

**Response shape**:
```json
[
  {
    "id": "abc123",
    "ip_address": "127.0.0.1",
    "device": "Chrome on Windows",
    "is_current": true,
    "last_active_at": "2026-06-04T10:30:00Z"
  }
]
```

---

### 5. Logout-others flow — password confirmation UX

**Decision**: Password confirmation uses Fortify's existing `/user/confirm-password` endpoint (already in use for 2FA). The frontend:
1. Shows a modal/inline prompt for the password
2. POSTs to `/user/confirm-password`
3. On success, immediately calls `DELETE /api/profile/sessions/others`

The backend `destroyOthers` action deletes all rows in `sessions` where `user_id = auth()->id()` and `id != session()->getId()`, then calls `session()->migrate(true)` to regenerate the current session ID.

---

### 6. AdminLayout profile — same two-column layout

**Decision**: The `AdminLayout` version of the profile page will use the same two-column section pattern as `DefaultLayout`. The `<BasicPage>` wrapper is retained for the page header, but the body sections switch from the current stacked card layout to the new two-column grid.

**Rationale**: Consistency across roles; the `BasicPage` component handles the page title/description header, while the sections below it adopt the new layout.

---

### 7. i18n keys — additive, no renames

**Decision**: All new i18n strings are added as new keys. Existing keys (`pages.profile.title`, `pages.profile.description`, etc.) are updated in place since their values are changing. No key renames — avoids breaking any external references.

## Risks / Trade-offs

- **Session ID exposure**: We expose session `id` in the API response (needed for `is_current` comparison). IDs are opaque strings (not guessable) and the endpoint is auth-gated. Risk: low.
- **User-Agent parsing accuracy**: Simple string matching may misidentify uncommon browsers. Risk: low — this is display-only, not security-critical.
- **Playwright tests coupled to text**: E2E assertions check heading text; if strings change again, tests break. Mitigation: use `data-testid` for structural assertions, text assertions only for stable labels.
- **BREAKING route change**: Any external bookmark or hardcoded `/profile` link (e.g., email templates, documentation) will 404. Mitigation: add a client-side redirect in the router from `/profile` → `/my-profile`.

## Migration Plan

1. Add router redirect: `{ path: '/profile', redirect: '/my-profile' }` — ensures existing bookmarks still work
2. Deploy backend changes (new controller + routes)
3. Deploy frontend bundle
4. No database migration needed — sessions table already exists with required columns

## Open Questions

- None — all key decisions resolved in exploration phase.
