# Initial recovery pass — November 23, 2026

Historical record. The follow-up implementation and current validation status are in [DEVELOPMENT.md](DEVELOPMENT.md).

## Delivered

Recovered the actual v3 source at published commit `d1de4d4434b038086c7905b038c3efaf2f9af4a1` using a short-lived authorized Sites credential. No credentials are included in the package.

- Track held keyboard keys and pointer IDs independently. Releasing A while Arrow Left is still held, releasing a keyboard key during touch steering, or lifting only one of two fingers no longer cancels the remaining input. Pause, blur, and restart clear all input sources.
- Stop the simulation update immediately after a fatal guardrail collision, before pickups, progress, or the timer can change the completed result.
- Accept complete lineups of at least three entries, derive counters and three stage groups from their length, and position checkpoint gantries at those boundaries.
- Apply the standard gamepad button layout only to controllers advertising standard mapping.
- Preserve original artwork bytes, purple/gold decoration, billboard drawing/layout, and the 75-second Cup stage clock.

## Checks performed

- Original v3 smoke suite passed before edits.
- Updated game.js and art.js syntax checks passed.
- Existing smoke suite passed after edits, including a simulated full Cup run (182 seconds), collisions, steering, brake, boost, pickups, checkpoints, and completion.
- New regression suite passed for 3, 44, 45, 46, and 60 parade entries, including simulated full Scenic Cruise completion and both checkpoints.
- Regression suite against original v3 failed at “arrow remains held after A released,” confirming the input defect predates these changes.
- Standard-controller axes, dead zone, boost, and brake were tested with a mock Gamepad API only.

These are mocked simulation checks, not sustained browser or real-device playtests.

## Blocked verification and media

The managed preview command failed with `relay could not open browser port 4173: timed out waiting for relay readiness`. Status subsequently reported the preview stopped. No substitute browser infrastructure was installed. Consequently, frame rate, revised touch behavior on devices, scenery perspective, animation, billboard readability, and game balance remain unverified in this pass. Physical-controller hardware was unavailable.

No updated gameplay screenshots or genuine 10-second video captures were produced. Existing website promotional media was left untouched and is not presented as evidence of these changes.

Both direct retrieval and the web tool failed to retrieve https://mg251.xyz/schedule. The November 5 snapshot and its October 20 source-verification date remain unchanged. A changed lineup must also be checked for chronological ordering, correct season/date copy, and Cup time balance before publication.

## MG251 integration

The website currently registers Motorway in `src/lib/arcade.ts` with `playUrl: null`; its established page is `/play/moonpie-motorway`. No playable racer route currently exists. MoonPie Run has a separate existing route; it was not changed.

Keep Motorway’s eventual play experience on MG251.xyz, with assets served on that origin and without a redirect to ChatGPT hosting. The recovered static game is saved in `games/moonpie-motorway` for this integration, but no production route has been invented or activated. Select the route in the website’s deployment workflow after browser QA, serve this static bundle with its relative assets and JSON resolving correctly, then update the existing arcade registry entry. Check direct entry, trailing-slash handling, embedding (if chosen), and touch safe areas before launch.

No Site publication, sharing change, website deployment, or remote source push was performed. The original Site identity and deployment manifest are retained inside the game package; the website’s deployment configuration is unchanged.
