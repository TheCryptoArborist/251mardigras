# MoonPie Motorway

Current implementation and validation status: [DEVELOPMENT.md](DEVELOPMENT.md). Leaderboard implementation and release requirements: [LEADERBOARD.md](LEADERBOARD.md).

An original browser arcade racer for MG251, inspired by the behind-the-car perspective of classic racing games. No executable, source code, or assets from Pole Position II are included.

## Play

Serve `dist/` with a static HTTP server. There is no build step or dependency installation. Fonts and artwork are included locally.

- Carnival Cup: three stages, three lives, 75 seconds per stage, one life restored at a checkpoint.
- Scenic Cruise: slower speed, no timer, unlimited lives.
- Arrows or A/D steer; down or S brakes; Space boosts; P pauses.
- Touch buttons support simultaneous steering and pedals.
- Standard gamepad D-pad / left stick steer, A boosts, B brakes.
- Sound starts muted; enable the speaker button for synthesized engine and pickup sounds.
- A personal best is saved in this browser’s local storage. The integrated website also supports shared weekly and season rankings for verified completed Cups; deployment is pending (see LEADERBOARD.md).

## Parade data

`dist/parades.json` contains all 45 entries retrieved from https://mg251.xyz/schedule on November 5, 2026. The source lists October 20, 2026 as its last verification date. Times are America/Chicago (Central Time). The game contains a snapshot; it does not automatically refresh from MG251. The loader accepts at least three complete parade records. Counts, finish detection, and the two stage boundaries derive from the lineup length (three groups as even as possible). A larger lineup still needs a Carnival Cup pacing review: the clock remains 75 seconds per stage. Season, date-range and snapshot copy now derive from the JSON metadata. Dates, times, ordering, duplicate entries and Central Time metadata are validated before play.

Each billboard displays only the organization name (at most two lines) and one date/time line. The pause-screen list preserves full names, route letters, and start times. Stage names describe a fantasy course; these are not street-accurate parade route maps.

## Checks

Run `node --check dist/game.js`, `node tests/smoke.cjs`, `node tests/regressions.cjs`, and `node tests/correctness.cjs` from this directory. Use `PARADE_COUNT=46 node tests/regressions.cjs` to exercise a different lineup size. Smoke checks exercise the actual game logic in a mocked canvas environment, including steering, boost, collisions, life depletion, checkpoints, full-route completion, and finite drawing coordinates. The previous version’s browser QA inspected desktop, 390 × 844 phone, and 844 × 390 landscape layouts. This development pass could not repeat browser QA because the managed preview relay failed; see QA.md. Hardware controller behavior still requires a physical-device playtest.

## Artwork and fonts

The art overhaul uses original raster sprite atlases: open-wheel race cars with three steering poses and three rival liveries; detailed Mobile brick and stucco buildings; live oaks and Spanish moss; grandstands, crowds, floats, pit tents, and ornate lamps; and a textured Mobile skyline. The road uses an arcade framebuffer with sharp native-resolution parade lettering. Metal guardrails contain the car at the road edge. Artwork asset paths and prompt briefs are in ARTWORK.md. Barlow and Barlow Condensed are distributed with their OFL licenses in `dist/assets/`.

## Recovered source and local run

Recovered through authenticated Sites Git access from `main`, commit
`d1de4d4434b038086c7905b038c3efaf2f9af4a1`, on November 23, 2026.
The original assets, licenses, and `.openai/hosting.json` are retained.
This directory is a self-contained source package. The parent Next.js website now serves its contents at the established `/play/moonpie-motorway` address, with local assets and no upstream redirect. This change has not been deployed.

From the MG251 repository root:

```sh
python3 -m http.server 8080 --directory games/moonpie-motorway/dist
```

Then open http://localhost:8080 on the same machine. From an extracted standalone
package, run `python3 -m http.server 8080 --directory dist` instead.

See QA.md for this pass’s evidence and the remaining MG251 integration work.

From the website root, `npm run test:motorway` also exercises the same-origin Next.js route. Font packaging can be reproduced with `python3 games/moonpie-motorway/tools/prepare-fonts.py` (requires fontTools only at build time); original TTF masters and licenses remain included.
