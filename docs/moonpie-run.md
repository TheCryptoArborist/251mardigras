# MoonPie Run source and release guide

Track the remaining work in the ordered [audit task list](moonpie-run-tasks.md). Before changing or releasing the game, run `npm run verify:baseline` from `games/moonpie-run` to check the protected canonical source.

The corrected original-game reference was separately inspected: see [Deluxe Pacman reference audit](moonpie-run-reference-audit.md) for archive integrity, recovered manual findings, behavior comparisons and four additional regression checks. No gameplay changes resulted.

## Audit and provenance (2026-11-23)

Read issue #42 in full (no comments), the repository README and PROJECT_HANDOFF.md, and the canonical Sites README. No AGENTS.md was present in either source tree. MG251 main was `acbdd49`; its daily check-in work is retained without modification.

The original Sites Git HEAD and latest saved version 15 both identify game v1.14 commit `a346be67e9aae0cf2b6cf4b3672b259711ae150d`. No newer source or saved version existed at retrieval. The first import commit `9cbe858` contains all 140 tracked files, including original artwork, synthesized audio, backend, migrations, tests, lockfile, starter files and licenses. Its `games/moonpie-run` Git tree is exactly the original source tree `d910203511bc7a5b1c0359f8628dc7edb650ed9c`, including executable modes. Subsequent integration changes are separate. No screenshot reconstruction or substitute implementation was used.

Verify the import with `git rev-parse 9cbe858:games/moonpie-run`. Preserve original attribution in the game README and vendored licenses. The module is independently installed and built; it is excluded from the host's TypeScript and ESLint project scans to avoid mixing Next 15 with the game's Vinext/Next 16 dependencies.

## Architecture and ownership

- Public entry: `https://mg251.xyz/arcade/moonpie-run`, served by the MG251 Next.js app on Netlify. No browser redirect.
- `src/app/arcade/moonpie-run/[[...path]]/route.ts` forwards an explicit allowlist to `https://moonpie-run-mobile.arborist63.chatgpt.site`. It injects the asset base, scopes the player cookie, filters forwarded headers/cookies, rejects foreign writes and upstream redirects, and bounds request size/time.
- Editable source now lives in `games/moonpie-run/`. After review/merge, make game changes here through PRs. Sites remains the deployment destination; do not independently edit both repositories. Recheck its remote HEAD before each release and reconcile any new changes.
- Sites project remains `appgprj_6aed45587f3c81918f332344be717052`. Its `.openai/hosting.json` still declares D1 binding `DB`. The existing Sites-managed production database stays attached to that project. MG251 Prisma and daily check-in storage are separate and untouched.
- Game HTML/assets are in `game/`. `prepare-game.mjs` generates `public/` and `app/game-document.ts`. Vinext builds `dist/server/index.js`, client assets, and `dist/.openai` deployment metadata. `app/api/[...path]/route.ts` passes requests to the original score service using `env.DB`.

## API and identity contract

All client requests use same-origin credentials. Public API paths below are prefixed with `/arcade/moonpie-run` on MG251 and have no prefix on the direct Sites origin.

| Endpoint | Behavior |
| --- | --- |
| GET `/api/player` | Restore/create anonymous profile and return current player |
| POST `/api/player` | Set/rename username, retaining ownership |
| GET `/api/player?username=...` | Public profile, stats, badges and recent runs |
| GET `/api/leaderboard?scope=all\|daily\|weekly` | Ranked personal bests |
| POST `/api/runs` | Create a server-owned run |
| POST `/api/runs/finish` | Validate and finish run idempotently |

The authoritative period scope names are defined in `lib/leaderboard-period.mjs`; ranking windows use America/Chicago and Monday local midnight. Run payload/rules remain in `lib/run-rules.mjs`; retry behavior remains in `game/run-outbox.mjs`. No schema, score, badge, local/session storage key, or authentication changes are introduced.

The anonymous `moonpie-player` cookie contains a 64-hex capability. The proxy forwards only that cookie, strips unrelated cookies and platform identity headers, and rewrites its path to `/arcade/moonpie-run`. Direct Sites signed-in identity still takes precedence exactly as before. Never migrate cookie scope, rename cookie/storage keys, trust client identity headers, or move production data into MG251 Prisma.

## Local development

Use Node 22.13+ (validated on Node 24.16) and npm. From the repository root:

```sh
npm ci
node --import tsx --test tests/moonpie-domain.test.ts
cd games/moonpie-run
npm run install:ci
npm test
npm run build
npm run db:local
npm start
```

`npm start` runs the built Worker on loopback (Wrangler prints the port). `npm run dev` runs the editable game on port 5173. `db:local` applies the two original migrations to the local emulator using a placeholder database ID and `.wrangler/state`, with a local migration ledger; rerunning it does not reset data. It never uses `--remote`. The generated build and local migration configurations share the same placeholder ID. No Cloudflare token, production DB export, or runtime secret is needed for these local commands. The backend requires the `DB` binding, not a database URL. Sites provisions the real production binding; never put credentials or real database IDs into the local config.

Local preview includes the original Sites mock sign-in behavior. Use the built Worker and fresh local cookies to exercise anonymous profiles. Local cookies/data cannot prove production ownership continuity. The MG251 proxy still targets production by design: do not submit test scores through the MG251 local host. Use the standalone local game for writes; proxy tests mock upstream fetch.

Root `npm run build` validates MG251 separately. Root `node --import tsx --test tests/*.test.ts` runs host tests. Game tests use in-memory SQLite and include identity, score validation/idempotency, pending retries, period/DST boundaries, full playthrough, controls, and animation/audio timing.

## Explicit API base and staged compatibility

The proxy injects `<meta name="moonpie-api-base" content="/arcade/moonpie-run">`. The imported client reads this setting; an absent setting means the origin root, preserving standalone Sites/local operation. It never changes credentials behavior.

The proxy serves the config-aware `progress.js` verbatim. During the review/deployment gap, the live Sites version still uses `fetch(path,{...)`, so the old rewrite remains exclusively as a compatibility fallback. Removing it now would break live v1.14. The old proxy rejects the new client because its integration guard cannot find the legacy call. Therefore deploy the proxy first, then Sites. Remove the legacy branch only in a later PR after both rollout and rollback retention have been verified. Asset caching is five minutes; wait for it to expire during verification.

## Release procedure — approval required before merge/deployment

1. Review this PR and validation limits. No production publication has been performed. Confirm a backup/recovery point for the existing Sites D1 database through its authorized administration workflow; this task did not export private player data or inspect production rows.
2. Re-fetch MG251 main and Sites source. Confirm the Sites baseline above still matches, or reconcile newer changes. Re-run tests/builds. Verify both existing migration SQL files and their journal are unchanged. Do not recreate the Site or DB, seed production, or run local migration commands against production.
3. After approval, merge/release the MG251 proxy first. It supports the currently deployed legacy client and the new configured client. Smoke-check the public address with an existing profile without clearing cookies. Check usernames, scores, recent runs and badges.
4. Export ONLY the reviewed module into a fresh, authorized Sites source checkout. For example, from MG251 run `git archive --format=tar -o <outside-checkout>/moonpie-release.tar <reviewed-commit>:games/moonpie-run`, then extract into the opened Sites checkout (preserve its `.git`, never use a destructive mirror). Verify its diff contains only this PR's game integration files and unchanged original migrations/assets/backend. Do not copy MG251's root or local state. If future releases remove files, review those removals explicitly.
5. Use the Sites skill source workflow with the SAME project ID: open source, install dependencies, run tests/build, then package/push the reviewed source and save the returned exact commit/archive as a version. Use the returned version/deployment identifiers for the public-site deployment. Do not enable publish-on-push. Never put temporary source credentials in files, shell arguments or logs. Record the MG251 release SHA, resulting Sites commit and saved version in release notes.
6. After separately approved deployment, verify `/arcade/moonpie-run` still stays on MG251; cookies retain ownership; daily/weekly/all-time rankings, profiles, medallions, sharing, controls, pause and audio work. Test pending retry without duplicating scores. Perform physical iOS Safari/Android checks and wait for old asset caches to expire. No new schema migration is intended; stop if deployment proposes a different database or unexpected migrations.
7. Rollback: keep the compatible proxy and restore Sites saved version 15 if needed, without reverting/resetting the DB. If also rolling back the proxy, restore the old Sites client FIRST. New configured client behind old proxy is unsupported. Keep old migrations immutable. Remove compatibility code only after the rollback window closes.

The Sites release remains independent of Netlify: merging this module does not by itself publish the game or move its backend. Exported game README links back to this repository's integration guide; use this file as the release runbook.

## Validation recorded for this PR

- Exact import: Git tree hash matches the canonical Sites tree, including all assets and executable modes.
- Original game suite: 32/32 pass on Node 24.16.
- Proxy/configuration suite: 4/4 pass, including the real configured client, standalone and MG251 API paths, unchanged credentials, legacy client compatibility, cookie filtering/path, foreign writes and redirect rejection.
- Game Vinext production build: pass. MG251 Next production build: pass (94 static pages); existing `no-img-element` warnings remain in unrelated Open Graph routes.
- Local D1: both existing migrations applied; a second application reports no pending migrations. Built local Worker returns HTTP 200 for the game document, anonymous player initialization and daily leaderboard.
- Full MG251 suite: 37/40 pass. Three failures in `tests/community-event-share.test.ts` reproduce against a separate export of untouched `origin/main` (`acbdd49`): Night of Royalty now ends at midnight rather than the test's 2 AM and has a flyer where a test expects none. Event data/tests were not changed in this PR.
- `git diff --check`: pass. No production migrations, production writes, Sites pushes/publications, or merges were performed.
- Not verified: physical iOS/Android/social-app rendering and audio, live existing-browser ownership and pending-score continuity after rollout, production D1 recovery readiness. These remain release checks; mocked tests/local SQLite are not evidence that production has been migrated or validated.
