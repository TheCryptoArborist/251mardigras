# MoonPie Run browser QA — 2026-11-23

Task 2 is partially complete. Tested the built local Worker at `127.0.0.1:8791` with local D1 in the Codex in-app browser. No production requests or database writes were used for these scenarios. Desktop viewport overrides are not physical-device tests.

## Reproduced and corrected

- At 320 × 568, pause-overlay content overflowed horizontally (194 px available, 212 px content) because buttons had a fixed minimum width. Constrain overlay buttons to available width.
- Starting/resizing the portrait game could leave its scoreboard above the visible area. Anchor the active mobile cabinet to the viewport.
- At 844 × 390, the original breakpoint selected desktop layout: direction controls disappeared and the maze extended below the viewport. Short landscape phones now use a three-column layout with score/profile controls left, maze center and direction/sound/pause controls right. The player controls use two rows so badges do not overlap scores.

The fixes are isolated in `game/layout-fixes.css`; original styles, artwork, audio and gameplay remain intact. The source guard permits only the exact additional stylesheet link in the original HTML. The proxy allowlist must ship before the updated Sites HTML, consistent with the existing deployment order.

## Observed checks

| Check | Result |
| --- | --- |
| Title/start, collecting coins and MoonPie | Observed during local play. |
| Direction button, arrow keyboard input, keyboard pause, restart | Exercised; pause panel and score changes observed. |
| 320 × 568 portrait | Maze bottom 387, direction controls bottom 547; both inside 568 px height. Overlay no longer horizontally overflows. |
| 390 × 844 portrait | Maze bottom 594, direction controls bottom 823; sound/pause bottom 795. No measured horizontal overflow in these elements. |
| 667 × 375 landscape | Maze y12–363; direction controls y179–273; pause bottom356. Badge button bottom72, scoreboard starts77; no overlap. |
| 844 × 390 landscape | Maze y12–378; direction controls bottom280; pause bottom371. All fit. |
| 1280 × 720 desktop | Original scrollable desktop layout retained; maze extends below fold. Full desktop playthrough is not closed by this check. |
| Local player panel | Saved LocalQA1123, reopened player profile, observed 140-point recent run, 9 doubloons and two earned badges. |
| Trophy room | All 12 entries rendered; First Throw and MoonPie Moment earned, other progress displayed. |
| Reload | Same username and 2/12 badges remained. Local personal-best display was 150; this display alone is not evidence of server persistence for that second run. |
| Sound toggle | Enabled state changed and persisted on reload. Audible output/native audio unlock not verified. |
| Browser console | No warnings/errors returned in the final bounded inspection. |

## Remaining checks

- Complete three routes and inspect final results through real UI play; unit coverage is not a substitute. Verify buffered turns, actual touch swipes, background/foreground, pause/resume during death/capture and audible sound on devices.
- Sharing: the personal-best share action was attempted, but the browser download listener stalled and its execution context expired. The recovered profile panel supplied no conclusive download/native-share result. Do not count sharing as passed. Test saved-run and best cards, fallback download and native-share cancellation/failure.
- Physical iOS Safari, Android Chrome and social-app browsers: browser chrome resizing, notches/safe areas, touch and audio. No devices were available in this session.
- Full persistence/retry/ownership/ranking integration remains task 3. These exploratory local profile observations do not close that task or establish production continuity.

Validation: 36/36 game tests, 5/5 proxy tests, game production build and canonical-source guard pass. The guard checks 137 baseline files, allowing only the exact added stylesheet link in HTML; dependency/runtime declarations are unchanged. Proxy coverage includes serving the new stylesheet verbatim. MG251's full build/suite was not repeated for this CSS/allowlist change; prior host results and unrelated failures remain in the source runbook. `git diff --check` passes.

No merge or deployment performed. Keep this PR in draft pending remaining release checks and owner review.
