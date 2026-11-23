# MoonPie Run

For this repository's local commands, source provenance, and release procedure, see [the MG251 integration guide](../../docs/moonpie-run.md). The original project documentation below is retained for context; its publication guidance does not authorize deployment without review.

A Mobile, Alabama Mardi Gras maze chase with purple-and-gold pixel art, three parade routes, a shared leaderboard, and twelve achievements.

## Play
Arrow keys or WASD steer; P or Escape pauses. Phones support swipes and direction buttons. Collect the doubloons and four corner MoonPies, catch frightened ghosts, and clear all three routes. Three lives carry across the run. Each lost life freezes the scene, plays a descending chip-style death cue, and folds the character away before respawning or showing the final results. A MoonPie reverses active ghosts, slows them, gives them plain frightened faces, and starts a separate warbling background cue. Their warning flashes stay synchronized. Capturing a ghost freezes movement and gameplay timers briefly around the score popup, then returning eyes get audio priority until they reach home. Scatter/chase phases and four different targeting rules give the ghosts different behavior. Sound is optional and remembers the browser preference.

Use the player strip to choose a 2–20 character username. Visitors can play without signing in. A random HttpOnly cookie owns a browser player profile, allowing a username to be chosen after a run and restoring scores and badges on return. Clearing cookies, switching browsers or reaching the one-year profile expiry starts a new visitor profile. Signed-in players keep their existing account records. The leaderboard shows the top 25 personal bests and the player's own rank; renaming keeps records attached to the same player. Badges cover collecting, ghost captures, a four-ghost power chain, route clears, full victories and a victory without losing a life. The end screen recaps doubloons, ghosts, routes and newly earned badges, then shows the player’s personal-best leaderboard rank after saving. Opening player records freezes gameplay and audio. Earlier browser-only personal bests remain local because they have no recorded run statistics to verify.

## Source
- `game/`: canonical HTML, styles, art/audio engines, game logic and player-record UI. Local game art is included under `game/assets/`.
- `app/route.ts`: serves the game document without a client framework wrapper.
- `lib/visitor-profile.mjs`: anonymous browser profile creation and ownership, with existing platform identity taking precedence.
- `lib/score-service.mjs`: username, run, profile and leaderboard endpoints.
- `lib/run-rules.mjs`: run ownership, score arithmetic, timing bounds and collection/capture validation.
- `game/run-outbox.mjs`: queued run persistence, serialized retries and legacy pending-run migration.
- `game/badges.mjs`: shared achievement catalog and progress calculation.
- `db/schema.ts` and `drizzle/`: D1 schema and immutable migrations.
- `scripts/prepare-game.mjs`: generates public assets and the server game document from `game/`.

Signed-in player records use the platform's authenticated Site user ID. Anonymous records use a random browser capability whose hash is stored server-side in `visitor_profiles`; the cookie is host-only, HttpOnly and SameSite=Lax, with Secure enabled on HTTPS. Only chosen usernames appear on the leaderboard. Writes require a valid account or browser profile and reject cross-origin requests. The public game should open as a top-level page from MG251 so browser privacy settings do not block third-party cookies in an embedded frame. Score submission is tied to a server-created run; duplicate completion requests do not add lifetime statistics again. Confirmed scores remain safe to retry after the original submission window closes. Finished runs wait in a per-tab session outbox until acknowledged, so a later run cannot overwrite an earlier waiting score. The outbox retries on reconnection, profile load, starting another run or the Save runs button. Permanent validation errors remain visible until dismissed; unsaved runs still obey the server’s submission window. Checks target a casual arcade leaderboard and do not claim to provide a fully authoritative game simulation.

## Development
Use the Sites workflow to install dependencies, preview, build and publish. The normal scripts prepare the game assets before starting or building the framework. Schema changes use `npm run db:generate`; apply each pending migration once to the local preview as documented by the starter. Hosted migrations apply during publication. Never seed test players into production migrations.

Run the score-service tests with `node --test tests/*.test.mjs`. Tests exercise the actual service against SQLite, covering username ownership/uniqueness, rankings, pending-run saving, idempotency, lifetime achievements and invalid submissions. Outbox tests cover interrupted saves, reloads, concurrent submissions, multiple waiting runs and permanent versus retryable errors. Arcade-feel tests exercise death/respawn/final-results order, power reversal without position jumps, capture freezes, background audio priority, mute, interrupted death cues and shared animation/audio timing. A simulated full playthrough clears all 506 coins and 12 MoonPies through the movement code and validates the final score. Input checks cover swipes, direction buttons and keyboard turns. Physical iPhone and Android testing remains a separate final check; browser viewport checks do not replace it.

## Artwork and audio
The approved Mobile skyline artwork supplies the title banner and corner MoonPies. A transparent pixel-art atlas supplies the downtown facades and Bienville-inspired fountain garden. Art is clipped to the same solid rectangles used by collision checks. The gold player wears a prominent two-eye purple masquerade mask and chomps in its travel direction. Rounded ghosts have distinct frightened, warning and returning-eye states.

Original synthesized Web Audio provides alternating chip-style chomps, a progress-sensitive chase siren, a descending MoonPie cue and frightened-mode warble, an ascending capture chirp, a returning-eye loop, articulated descending death chirps and brass/drum start and victory jingles. Background audio uses one state cue at a time; returning eyes override the frightened loop. Death audio and the fold animation share the same duration, including resuming after the player panel or a hidden-page interruption. Mute, pause, hidden-page and exit events stop loops and scheduled notes.

## Original upload
The supplied Deluxe_Pacman.exe was inspected as an archive without execution. It contains an Amiga disk image, emulator, ROM and launch settings rather than editable source. This project implements original browser code and art; no original executable, ROM, game disk, graphics or audio is redistributed. Game mazes are fictional, not geographic parade directions.
