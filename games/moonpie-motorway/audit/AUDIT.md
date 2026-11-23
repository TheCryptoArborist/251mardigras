# MoonPie Motorway — end-to-end development audit

November 23, 2026. Scope: both supplied reference packages and the current local MoonPie Motorway implementation, including the previous pass’s fixes. This is an audit and implementation roadmap, not a claim that optimization or release testing is complete. No runtime game files or deployment settings were changed during this audit.

## Assessment

Keep the original browser implementation and its detailed Mobile artwork. The next pass should correct timing, input/state transitions, and visual/world-coordinate consistency before adding more detail. The biggest graphics opportunity is integrating the existing artwork more consistently across aspect ratios, not replacing it wholesale. Keep purple/gold branding and the approved billboard information hierarchy.

The current game has a complete start-to-finish simulation, but it is not yet verified as a polished public release. Previous full-Cup completion tests remove traffic, so their success does not establish real game balance. Actual browser performance and device behavior are still unmeasured.

## What the two reference uploads contain

| Supplied package | Inspected contents | What it supports |
| --- | --- | --- |
| Pole Position (1986).exe | 1,455,221-byte Windows PE self-extractor, with a 7-Zip payload; bundled Windows DOSBox; `DRIVE.COM` (65,024 bytes), `CARS.GRF`, `HILLS.GRF`, `BLIMP.GRF`, character and panel/loading files | A compiled DOS-game reference, with separate graphics resources |
| Pole Position II (1988).exe | 1,508,612-byte Windows PE self-extractor, with a 7-Zip payload; bundled Windows DOSBox; `POLE2.EXE` (8,048 bytes), `PPEGA.EXE` (49,367 bytes), additional `.EGA` resources, city/desert/fair/hills sets and selection screens | A richer reference for environment variety and alternate graphics assets |

Both payloads were extracted for inspection without running their Windows executables or batch files. Neither contains original editable game source. The bundled DOSBox documentation is emulator documentation, not the racing game’s source. The wrapper’s PE timestamp is 2010; filenames alone should not be treated as authenticated release provenance.

Five game resources are byte-identical between the packages: `CARS.GRF`, `BLIMP.GRF`, `HILLS.GRF`, `CHARSET`, and `PANEL.PCX`. This is useful evidence of shared material; it does not prove identical physics or rendering. The second package genuinely includes additional scenery resources. Exact inventories and hashes are in `reference-inventory.json`.

The DOSBox configurations request `hq3x` scaling and `aspect=false`. Therefore even a future run of these wrappers may not show native pixel/aspect presentation. No compatible native DOS emulator or Wine was available. Pillow could not decode the supplied PCX modes. Neither reference was played, and their machine code was not decompiled; exact handling, collision, timing, and visual comparisons remain open. Do not transplant their binaries or artwork into the MG251 distribution.

Upload SHA-256:

- 1986: `5cc81a4860a37450adb0b8bc6df3b1a98927a7496fb45c6e335605f49861b70e`
- 1988: `22e56790866ec29cfefe562bc43c6f0f7e0e57c8117f76a20e608b52074d2961`

## Current implementation and evidence

Buildless Canvas/HTML/CSS; 190 projected road segments in view; fixed three-pose player car; three rival liveries; nine roadside prop types; one skyline with stage tinting; procedurally generated road, gantries, pickups, and billboard panels. Carnival Cup uses three stages, three lives and 75 seconds per stage. Scenic Cruise has unlimited lives and no countdown clock.

Reviewed all runtime scripts, page/styles, fonts, parade data structure, smoke/regression tests, original artwork atlases, and MG251’s arcade registry. Original assets were viewed directly, but these are not gameplay screenshots. `source-hashes.json` identifies the audited runtime files.

Validation performed:

- Existing smoke and regression suites pass.
- Added `tests/audit.cjs`: observational probes of actual game.js, with mocked browser APIs. Output is saved in `probes.json`. These probes intentionally describe current defects; a successful probe run is not a release acceptance pass.
- Ran timing cases at simulated 10/20/30/60/120 Hz and six complete-or-terminal driving simulations with traffic present.
- Retried managed browser preview. It failed with `relay could not open browser port 4173: timed out waiting for relay readiness`; status reported stopped. Sustained browser gameplay, screenshots, measured FPS, audio listening, physical controls and video capture remain blocked.

## Prioritized findings

### 1. Escape from the parade list unexpectedly resumes the race — high priority

`dist/game.js:161` and `:168`. The document key handler closes the list, restores the paused state, then the same bubbling Escape event reaches the window handler and resumes play. Reproduced: pause → parade list → Escape leaves `state=racing`, with both dialogs hidden.

Use a single state-aware Escape handler, or consume the handled event. Acceptance: Escape closes the list into the pause menu; only a separate explicit resume action starts driving. Cover lists opened from garage, countdown, race, pause, and results.

### 2. Letter-key steering can remain held after releasing Shift — high priority

`dist/game.js:8`, `:160–162`. Held input is keyed by case-sensitive `event.key`. A keydown of `A`, followed by Shift release and keyup of `a`, does not remove `A`. Reproduced turn remains -1. Blur/pause clears it, but the race can keep steering before that happens.

Use stable physical `event.code` identifiers or normalized keys consistently at press and release. Retain support for overlapping keys and pointers from the previous fix. Verify Caps Lock and alternate keyboard layouts.

### 3. Game time slows when frames exceed 50 ms — high priority

`dist/game.js:159`. The frame loop discards elapsed time above 0.05 seconds. Ten wall-clock seconds at simulated 10 Hz advance only five game seconds; 20–120 Hz advance ten. This affects speed, the Cup clock, score opportunity and cross-device comparability.

Adopt a bounded fixed-step accumulator with an explicit long-stall/pause policy. Avoid an unlimited catch-up loop. Acceptance: equivalent active elapsed time and route progress across supported frame rates, plus clean tab/background resume. This is timing correctness evidence, not proof that the game currently runs at 10 FPS on any device.

### 4. Start/checkpoint/finish artwork and logical events disagree — high priority

`dist/game.js:53`, `:81–82`, `:119`. Logical checkpoints are at 445,000 and 895,000; corresponding gantries are 9,000 units later. The finish gantry is at 1,367,000, the stripe starts at 1,368,500, but results do not trigger until 1,380,000. At normal Cup speed, roughly 1.5 seconds of driving remains after the visible stripe. At cruise speed it is roughly 2.25 seconds.

Define shared world positions for visible milestones and their triggers, accounting consistently for the car’s world position relative to the camera. Preserve all parade encounters and ensure the final billboard and finish remain readable. Verify winning, timeout, last-life loss, checkpoint recovery, replay, and final score storage at the boundaries.

### 5. Aspect ratio changes the player’s apparent scale relative to rivals — medium priority

`dist/game.js:84`, `:87`, `:139`; `dist/art.js:18`, `:59–61`. World sprites scale with viewport width; player width is capped by viewport height. At 844×390, the formulas give a player about 101 CSS pixels wide and a rival at 1,500 units about 154 pixels wide. At 1360×936 they are much closer in size. Collision checks still use the same world offsets and widths.

This is a calculated inconsistency, not an observed browser collision complaint. Establish one camera/player-depth model and tune a documented hitbox against the actual tire footprint. Inspect hills, overtaking, guardrails and edge lanes in portrait, landscape and desktop views.

The car crop maps 512×430 to 256×180, compressing height by about 16% relative to uniform scaling. The 3:1 skyline also stretches on wide viewports because its width and height are selected independently. Preserve source aspect ratios with suitable crop/letterbox decisions; compare before/after images before adopting changes.

### 6. Cruise boost has no boost-specific visual feedback — medium priority

`dist/game.js:78`, `:147–155`. Cruise boost reaches 6,732 world units/second, but flames and speed streaks require more than 7,800. Reproduced after one second: speed 6,732, charge about 77, no possible threshold crossing under normal Cruise rules.

Drive visual effects from an explicit active-boost state, with effect strength relative to each mode’s speed. Keep effects clear of billboards. Verify that brake, empty charge and pause stop them consistently.

### 7. Invulnerable contact permanently disables a rival’s collision — medium priority

`dist/game.js:79`. Traffic is marked `hit=true` before `hit()` decides whether invulnerability should ignore the contact. Reproduced with two seconds of invulnerability: the rival becomes permanently marked hit without life loss.

Decide whether traffic should only be ignored during recovery or become non-collidable for the rest of the run. Prefer temporary separation/recovery logic with an explicit collision outcome; avoid silently changing the object forever. Test being overtaken after braking and meeting that rival again.

### 8. Short-view and modal accessibility need a browser acceptance pass — medium priority

`dist/index.html:10–28`, `dist/game.js:168`. The app has 600/640-pixel minimum heights; short viewports can put bottom controls below the visible screen. Phone HUD labels can be 7 pixels. Focus handling wraps first/last dialog elements but does not make background controls inert, so programmatic or pointer focus can escape the modal. There is no reduced-motion option for flashing/shake.

Make the race surface fit the usable viewport, respect safe areas, keep critical labels readable, and implement a complete modal focus lifecycle. Test 320×568, 390×844, 844×390, desktop, browser zoom, keyboard-only navigation and a real notched phone. These layout consequences are inferred from CSS; browser screenshots are still required.

### 9. Schedule flexibility is only partially finished — medium priority

Counts and logical checkpoint grouping now adapt, but scenery regions still switch every 450,000 units (`game.js:49`), and season/date/snapshot wording is repeated in HTML. Loader validation checks nonempty strings, not valid dates, chronological start times or duplicate events. The 75-second Cup clock does not scale with longer lineups.

Centralize season metadata and stage definitions; validate the data before generating the course. Preserve the approved name/date/time-only roadside panels. Refresh the schedule from verified MG251 data, then test Cup pacing for the actual lineup. The existing November 5 snapshot is unchanged; this audit does not assert it is current.

### 10. Optimization needs measurement before architectural changes — medium priority

The static bundle totals 6,122,762 bytes; the three WebP images account for 5,276,038 bytes, and nine TTF files total 773,340 bytes. This is file inventory, not measured network transfer. The three source images require approximately 18 MiB as RGBA; 45 cached 440×315 billboard canvases add roughly 23.8 MiB before browser overhead, display buffers, atlas-derived sprites, and other textures.

Cars are reduced to 256×180 and props to 280 pixels wide at runtime despite shipping larger atlases. Evaluate build-time cropped, baseline-aligned atlas frames, WOFF2 fonts, and perceptually checked image compression. Keep original masters and licenses. Do not sacrifice car detail or billboard lettering merely to meet a size target.

The render loop filters and sorts arrays every frame, redraws the background and road while paused, and repeatedly submits geometry and HUD updates. Begin with browser profiling; then cache static layers, index roadside objects by segment, reuse visible-object buffers, and stop unnecessary paused redraws where justified. Canvas2D remains a reasonable choice; there is no measured case yet for a WebGL rewrite.

## Graphics direction to preserve and improve

Keep: open-wheel silhouettes, three steering poses, purple/gold livery, architectural masonry and iron balconies, mossy oaks, skyline landmarks, crowds, floats, curbs and gantries. The supplied artwork has substantially more detail than its current small render sizes can expose.

Improve in this order:

1. Camera, horizon, car dimensions and tire-contact anchors across aspect ratios.
2. Near/far sprite scale, hill occlusion, guardrail layering and billboard approach visibility. The billboard layout is approved; tune placement and resolution without adding text.
3. Consistent pixel density and alpha-edge cleanup. The atlases contain many near-transparent pixels and mostly near-opaque rather than fully opaque object pixels; inspect actual compositing before deciding whether this creates visible fringes.
4. Steering transitions, speed-linked suspension/wheel cues, recovery animation and boost feedback. Three poses are a useful base; avoid adding animation that makes steering less legible.
5. Distinct stage compositions and a deliberate finish celebration, using existing Mobile scenery before commissioning more assets. Currently roadside props are static; stage distinction relies mainly on repeating arrangements and tinting.
6. Optional restrained engine/skid/boost/checkpoint audio and a reduced-effects setting. Existing audio is a simple synthesized engine and tones, muted initially; quality was not auditioned in this audit.

## Balance and test coverage

With all traffic retained, a simple lane-following controller (no obstacle avoidance or boost) loses Cup runs at 33–46 seconds, after 8–11 parades. That is expected evidence that dodging matters, not proof that Cup is too hard. Three Scenic Cruise runs finish with traffic at 274–275 seconds and all 45 parades. Existing traffic-free Cup completion is about 182 seconds.

Before calling the game balanced, run real novice and experienced players through all three stages. Record collision frequency, remaining time at each checkpoint, pickup totals, billboard reading opportunity and successful completion rate. Ensure crashes feel visually fair before adjusting lives or difficulty.

Expand automated coverage for bubbling DOM events, real input dispatch, traffic overtaking, pickups and charge caps, low-FPS timing, checkpoint/finish boundaries, asset-load failures, malformed schedules, saved-score corruption, modal focus and replay state. The current mock canvas cannot reveal incorrect images, unreadable text, clip defects or actual frame time. The previous QA note’s generic “pickups” coverage should not be read as a comprehensive successful-pickup test: the regression specifically verifies that a fatal hit does not collect one afterward.

## Implementation order and completion gates

| Pass | Work | Exit evidence |
| --- | --- | --- |
| 1 — correctness | Input normalization, Escape handling, simulation timing, collision outcomes, shared milestone positions | Regression tests reproduce each old failure and pass after fixes; unchanged approved billboard layout |
| 2 — visual integration | Unified scale/anchors, skyline proportions, billboard approach, pause/recovery/boost animation, viewport layout | Actual before/after gameplay screenshots at desktop, portrait and landscape; full-route visual review |
| 3 — measured optimization | Asset delivery, memory, cached layers and object indexing where profiling supports them | Representative real-device frame-time profiles, startup/load measurements, no visible quality regression |
| 4 — balance and finish | Full Cup/Cruise playtests, score/replay checks, audio/accessibility and finish polish | Successful start-to-end human runs, all 45 billboards accounted for, documented remaining device limits |
| 5 — MG251 release and media | Same-origin game integration, arcade entry, deployment checks and capture | Playable MG251 URL with no ChatGPT redirect; two genuine 10-second MP4 highlights |

Suggested performance goals, not measured results: target smooth 60 FPS on representative supported devices; record median and p95 frame intervals, long tasks, and memory across a full route and repeated replays. Provide a tested quality fallback if a target device cannot maintain that. Choose startup budgets against an agreed mobile network profile rather than asserting an arbitrary universal loading time.

The website registry still has `playUrl: null` for Motorway (`src/lib/arcade.ts:20`), while `/play/moonpie-motorway` is its established preview page. Keep the eventual playable URL on MG251.xyz. No public play path was invented, no deployment or sharing settings changed, and no reference binaries/assets were added to the game package.

## Remaining evidence gaps

Live browser gameplay/performance, actual reference-game sessions, current schedule verification, keyboard/touch on physical devices, hardware controllers, audio listening, finished screenshots, and both 10-second gameplay clips remain outstanding. The preview infrastructure failure prevents closing these gaps here; it does not establish that gameplay or rendering is correct. Complete these gates before describing the game as fully optimized or launch-ready.
