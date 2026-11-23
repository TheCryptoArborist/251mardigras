# Leaderboards and sharing

Implemented locally on November 23, 2026. Not deployed to MG251 or the private Sites preview.

## Player experience

Completed Carnival Cups can be saved under a public nickname. Weekly and season boards show each racer's best score, the top 25 racers, and the player's position and next target. Weeks begin Monday in America/Chicago. Ties use completion time, then submission time. Scenic Cruise and incomplete Cups do not enter rankings.

The results screen offers score sharing; the leaderboard offers board sharing. Native sharing, Facebook's share dialog, copyable links, and square image downloads point back to https://mg251.xyz/play/moonpie-motorway. Verified score links and board links have server-generated social preview images. Social networks may cache their previews. Sharing requires a player's action and does not automatically post anything.

YouTube and Facebook links appear outside racing, so players can watch parades and subscribe after playing. Opening the leaderboard pauses play. If the service is unavailable, racing and the local best remain available.

## Storage and validation

The Next.js game route serves the API using `@netlify/database`. The migration is `netlify/database/migrations/20261123170000_motorway_leaderboard.sql`. It creates a separate table and does not change the website's Prisma tables.

A random HttpOnly browser cookie identifies a racer; only its hash is stored in the database. Nicknames, scores, completion times, and ranks are public. No account or email is required. Clearing cookies or using a different browser creates another racer; there is no cross-device recovery. Nicknames are not unique.

The server creates a run session before play, binds it to the current rules, and replays recorded controls against the actual game physics to calculate the score. Client-supplied score values are ignored. Ownership, origin, request size, recording length, elapsed time, session expiry, and submission frequency are checked. Duplicate completed submissions are idempotent.

This prevents simple fabricated score submissions; it does not prove human play or prevent someone from creating multiple browser identities. Competitive prizes would require stronger identity and abuse controls. Changing the rules while a run is in progress requires that player to start a new run.

Rows support a `hidden` flag for moderation. Hidden scores are excluded from rankings and public score lookup. There is no moderation dashboard yet. Public nicknames have length and character restrictions and are rendered as text; automated profanity filtering is not included.

## Validation and release status

Run `npm run test:motorway` from the website root. The suite covers game regressions, asset routing, social metadata and PNG generation, a complete Cup replay, actual queries in disposable local Postgres, score forgery, ownership, retries, expiry, period selection, hidden entries, and players outside the top 25. Mocked UI checks cover recording, saving, rankings, sharing, and service outage recovery.

All these tests passed. Targeted TypeScript and lint checks passed. The generic social PNG was rendered and visually inspected. A subsequent real Chromium check against the local Next.js server and disposable Postgres passed at desktop (1440 × 1000), phone (390 × 844), and landscape (844 × 390) sizes. It exercised empty standings, run registration, pause/dialog behavior, verified score saving, weekly/season ranking display, image download, social metadata, and service outage recovery. The test feeds an actual winning physics recording into the community UI and ages only its disposable local session; it is not a full manual driving or physical-device test. Phone layout screenshots were visually inspected.

Run `npm run test:motorway:browser` for this check. Install the Playwright Chromium browser, or set `CHROMIUM_PATH` to an installed Chromium executable. It starts and tears down its own Next.js server and local database; screenshots are written to the ignored `artifacts/` directory. No hosted data is read or modified.

The full website build compiled but then failed type checking at the existing `src/app/admin/page.tsx:64` implicit-any callback. Prisma client generation had previously failed with an engine-download HTTP 403 in this environment. That unrelated page was not changed to conceal the failure. A fresh normal and escalated generation attempt still received HTTP 403 from the official Prisma binary host. The terminal GitHub API check was blocked by environment network policy, not proof of a revoked token. Git HTTPS access and the connected GitHub plugin were subsequently verified. The connected Netlify project still reports its existing published deploy as ready; no deployment was attempted.

Before release:

1. Restore successful Prisma generation and the full website build.
2. Confirm Netlify Database is available for the site's plan and provision it through the supported Netlify workflow. No hosted database was provisioned by this change.
3. Deploy a Netlify preview with the migration and check gameplay, saving, ranking, mobile dialogs, and social previews against its backend.
4. Release to MG251 and verify the canonical share links on the public domain.

A static server or the existing static Sites preview can play the game, but cannot provide shared rankings. Those previews show an unavailable-service message rather than invented scores. Never label the browser-only local best as a shared leaderboard.
