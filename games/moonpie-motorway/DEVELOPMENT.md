# Audit follow-up implementation — November 23, 2026

The original detailed artwork and approved billboard drawing routine are preserved. This is a runnable development revision, not a validated production release.

## Changes

- Fixed Escape bubbling from the parade list into an unintended resume, and normalized letter-key releases across Shift/Caps Lock changes. Existing overlapping keyboard and pointer support remains.
- Added 60 Hz fixed-step simulation. Active time is consistent at simulated 10–120 Hz; a foreground stall longer than half a second pauses the run rather than dropping time or processing a large burst of unseen collisions.
- Tied visible checkpoint gantries and the finish stripe to their simulation positions, including the player's distance ahead of the camera. The last billboard remains before the finish.
- Made traffic collision suppression temporary after separation and prevented invulnerable contact from permanently disabling an opponent's collision.
- Unified world/player horizontal projection scale across aspect ratios. Preserved the car crop's native proportions and the skyline's 3:1 aspect ratio. These visual changes need browser review.
- Enabled actual boost feedback in both modes. Paused animation uses simulation time, and paused/results scenes no longer redraw continuously.
- Honored the initial system reduced-motion preference for shake, flashes, car blinking, bounce and speed streaks. Kept the car visible during recovery in reduced-motion mode.
- Made background controls inert during dialogs and restored focus to the pause control on resume. The active race fits the usable viewport, with safe-area-aware controls and larger phone labels.
- Validated schedule dates, start times (including Noon), ordering, duplicates, season and Central Time metadata. Season/range/snapshot copy now comes from the data. Scenery groups follow stage boundaries. The 45-entry November 5 snapshot remains unchanged because the live schedule could not be fetched.
- Prevented starting before load completes and recovered gracefully from corrupted local best-score values.
- Packaged lossless WOFF fonts: 382,532 bytes versus 773,340 bytes of original TTF files (50.5% smaller for those served font resources). Original font masters and licenses remain. Image bytes have not been changed.

## MG251 integration

The existing `/play/moonpie-motorway` page address now has a local Next.js route handler for the game and its relative assets. HTML receives a same-origin base URL. The arcade registry points to this established address. The generic preview page's static parameters omit Motorway to avoid generating the previous preview over the game route.

No new public game address is proposed. The handler does not contact or redirect to ChatGPT hosting. It rejects unknown files and traversal, supplies appropriate content types, and supports HEAD requests. The Next.js output trace includes all 28 static bundle files. Unrelated redirects, Netlify settings, MoonPie Run, and the original Sites hosting manifest remain unchanged. No publication, remote push, or access-setting change was performed.

## Validation

Passing checks:

- `npm run test:motorway`: original smoke suite, input/collision regressions, new correctness tests, and four Next.js route integration tests.
- Complete Scenic Cruise simulation and checkpoint/count checks for 3, 44, 45, 46 and 60 records. These use synthetic expanded fixtures, not refreshed schedule data.
- Correctness coverage includes bubbling Escape, mixed-case releases, inert dialog background, equal timing/progress at five frame rates, long-stall pause/resume, Cruise boost, invulnerable contact, finish/checkpoint positions, and player/rival scale at 320×568, 390×844, 844×390 and 1920×1080.
- Invalid schedules rejected; successful pickup awards once, charge caps at 100, corrupted best-score storage recovers.
- Direct TypeScript checking of the local game-file server passes.
- Next.js optimized production compilation succeeds, and its file trace contains all game assets.
- The original WebP images and Sites hosting manifest match the pre-change copies byte-for-byte.

`audit/probes.json` retains the original audit evidence. `audit/after-fixes.json` records current observational probes. `tests/audit.cjs` is a diagnostic harness; it is not a browser benchmark. `audit/source-hashes.json` identifies the original audited state, not this revision.

## Remaining gates

- Managed preview again failed: `relay could not open browser port 4173: timed out waiting for relay readiness`. Browser visuals, actual frame-time/memory profiling, sustained human playthroughs, audio listening, physical touch/controller testing and the two genuine 10-second MP4 captures remain unverified/unproduced. No screenshots are presented as updated gameplay evidence.
- The full website build is not green. Dependency installation reached Prisma generation, where the schema-engine checksum request returned HTTP 403. Next.js compiled the website but its type-check phase stopped at the untouched `src/app/admin/page.tsx:64` with an implicit-any `snapshot` parameter. This is consistent with the missing generated Prisma types; unrelated source was not changed to hide the failure.
- The live MG251 schedule request failed, so no new schedule freshness claim is made. Larger lineups still need Cup balance review; the current game's three 75-second stages are preserved.
- Human balance, billboard readability while moving, hills/guardrail occlusion, alpha edges, deeper rendering optimizations, additional animation/audio polish, and production deployment remain pending the browser/device gates. No measured device-FPS improvement is claimed.

## Run locally

From the website root, after its normal dependencies and Prisma client are available, use `npm run dev` and visit `/play/moonpie-motorway` on the printed local origin.

The independent game has no dependency installation or build step:

```sh
python3 -m http.server 8080 --directory games/moonpie-motorway/dist
```

Open `http://localhost:8080` on that machine. In the extracted standalone package, use `--directory dist` from its `moonpie-motorway` folder. This is a local run instruction, not a hosted test link.
