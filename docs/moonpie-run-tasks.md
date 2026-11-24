# MoonPie Run audit task list

Work in this order. A checked item has recorded evidence, not merely a proposed implementation. This list combines the [source/release audit](moonpie-run.md) and [Deluxe Pacman comparison](moonpie-run-reference-audit.md). The reference did not establish a gameplay defect or authorize additional modes. Preserve the approved v1.14 experience, production data/identity, MG251 address and unrelated features. Merge/deployment still require the owner's review.

## Completed foundation

- [x] Read issue #42 and repository/source instructions; map Netlify proxy, Sites Worker and D1 ownership.
- [x] Retrieve all 140 canonical files; prove exact import with Git tree hash; retain all assets, licenses, backend, migrations and tests.
- [x] Establish independent local game build and local-only D1 migrations; verify migration rerun is a no-op.
- [x] Add explicit API-base configuration with legacy-client compatibility and a staged release/rollback plan.
- [x] Inspect the corrected Deluxe Pacman archive/manual without execution; distinguish compiled/trainer-bearing reference from missing assembler source.
- [x] Compare original features with approved MoonPie scope; add regression checks for buffering, reversal, capture chains and pause.
- [x] Prepare draft PR #43; original game/host builds passed. Record three unrelated host test failures reproduced on original main.

## 1. Preserve the approved source during remaining work

- [x] Isolate MoonPie work from the concurrently edited Float Rider checkout.
- [x] Confirm PR #43 is still open/draft at `8c8ce75`; latest saved Sites version remains 15 at `a346be67…` on 2026-11-23. This saved-version check does not reverify unpublished Sites HEAD.
- [x] Run the repeatable canonical-source guard and all game/proxy regressions in the isolated checkout; record results below.
- [x] Check that the guard rejects a deliberate temporary change and passes again after exact restoration.

Acceptance: preserved source/assets/migrations/identity have no unexplained differences, regressions pass, and no unrelated changes are staged. Command: `npm run verify:baseline` from `games/moonpie-run`. This guard deliberately fixes the approved baseline; future authorized gameplay changes must update its policy explicitly.

## 2. Exercise browser gameplay and mobile layout

Status: local browser pass performed; see [browser QA evidence and remaining checks](moonpie-run-browser-qa.md). Two responsive-layout defects were corrected. The broad items below remain open where only partially exercised.

- [ ] Local browser: title/start, three-route progression, visible controls, keyboard, buffered turns, swipes/direction buttons, pause/resume, restart and result panel.
- [ ] Viewports: narrow phone portrait, phone landscape and desktop; inspect maze/control fit, overflow, resizing and safe-area behavior.
- [ ] Lifecycle: background/foreground, open/close player panel, audio unlock/mute, interrupted death/capture sequences.
- [ ] Sharing: saved run and personal-best cards, download fallback, native-share cancellation/failure handling.
- [ ] Physical iOS Safari, Android Chrome and social-app browser checks. Desktop emulation does not close these items.

Acceptance: record browser/device, viewport, steps and result for each check. Fix only reproducible defects, with regression coverage where useful. Keep real production scores untouched by using local D1.

## 3. Verify complete player persistence through the local integration

Status: [HTTP/local D1 evidence](moonpie-run-persistence-qa.md) passes after correcting an API request-stream lifetime failure. Deterministic ranking integration now passes too; browser/tab recovery checks remain open.

- [ ] Exercise real local Worker HTTP flow with a browser cookie: create profile, choose/rename username, create/finish run, reload and reopen profile.
- [x] Retry the same finish request, including interrupted responses; verify one completed run and one lifetime-stat increment. Real HTTP/D1 plus simulated response loss and parallel submissions.
- [ ] Queue multiple pending scores; restore after reload/offline recovery; verify per-tab behavior and visible permanent errors.
- [ ] Verify separate browsers cannot claim ownership and public profiles exclude private identifiers.
- [x] Check ranking ties, daily/weekly/all-time boundaries, recent runs and all 12 badge progress/earned states against deterministic test data. Isolated local D1 HTTP fixtures plus medal-threshold and calendar unit tests; see persistence QA report for limits.

Acceptance: local end-to-end evidence supplements the existing passing unit tests. Never reinterpret local success as proof of production continuity.

## 4. Establish production recovery readiness

- [ ] Confirm the existing Sites project still owns the intended `DB` binding; inspect metadata only where sufficient.
- [ ] Identify an authorized D1 recovery point and the actual restore procedure without performing a restore/reset.
- [ ] Record the recovery identifier/time and responsible operator in an appropriate private release record, not public credentials or player data.

Dependency: current Sites tools expose database inspection, but no backup/restore operation. Owner/platform administration evidence is needed to close this task. Do not invent a backup, create a replacement DB, or export private player rows as a substitute.

## 5. Final release review

- [ ] Re-fetch both source repositories and reconcile any newer commits; saved-version history alone is insufficient.
- [ ] Re-run affected tests/builds on the exact release commits; retain evidence for existing unrelated failures.
- [ ] Review the source-only export and unchanged production migrations/project identity.
- [ ] Present completed PR, validations, recovery evidence, release order and remaining risks to owner.
- [ ] Obtain merge/deployment approval. This checklist is not approval.

## 6. Approved rollout and live continuity

- [ ] Release compatible MG251 proxy first; verify live legacy client still works at the unchanged URL.
- [ ] Publish reviewed module to the same Sites project after separate approval; record both repository SHAs and saved version.
- [ ] Verify existing-browser usernames/ownership, scores, history, earned badges and pending retries without clearing cookies; inspect daily/weekly/all-time rankings and sharing.
- [ ] Verify assets after the five-minute cache window, plus mobile controls, audio and pause.
- [ ] If needed, restore Sites version 15 with the same DB. Restore old Sites client before rolling back proxy.

## 7. Remove temporary JavaScript-rewrite fallback

- [ ] Close the rollout/rollback retention window with owner.
- [ ] Remove legacy `progress.js` rewriting in a follow-up PR; retain explicit API configuration and all proxy protections.
- [ ] Verify standalone and MG251 clients, cache transitions and rollback compatibility before release.

## 8. Later fidelity work — separate scope decision

- [ ] If exact Deluxe Pacman fidelity is desired, obtain original assembler source or establish a known unmodified reference and controlled observations. Current trainer-bearing package/manual cannot prove exact timing/AI.
- [ ] Measure specified movement/turn/collision/ghost behaviors before proposing numerical changes.
- [ ] Compare specified sound/animation behavior while preserving approved Mardi Gras assets and original Web Audio.
- [ ] Assess score validation and leaderboard comparability before changing mechanics.

Twenty levels, bonus stages, extra lives, special tools, difficulty modes and two-player play are reference differences, not approved tasks to implement. Payments and tournaments remain outside scope. No original ROM/binaries/assets are to be redistributed.

## Execution log

- 2026-11-23: Deterministic ranking integration passes for daily/weekly/all-time filters, all tie-breakers, one entry per player, lifetime badge counts and ten-entry recent-run ordering. Fixtures use a newly created local D1 directory and a self-managed Worker on port 8792. Canonical-source guard passes; no game/runtime changes or production operations.

- 2026-11-23: Task 3 HTTP/local D1 pass. Corrected reproducible POST request-stream interruptions in the adapter; original score/identity service unchanged. Parallel duplicate finish and lost-response recovery count once. Separate-cookie ownership, privacy, recent runs and ranking scopes verified. 37 game tests pass; guard checks 136 protected originals with the adapter recorded as an integration exception. Browser/tab recovery and deterministic HTTP ranking boundaries remain open.

- 2026-11-23: Task 2 local browser pass recorded in `moonpie-run-browser-qa.md`. Fixed narrow overlay overflow and active phone layout/landscape controls. Game tests 36/36, proxy tests 5/5, game production build and baseline guard pass. Physical devices, full UI playthrough, lifecycle/audio and conclusive sharing checks remain open. No production operations.

- 2026-11-23: Task 1 complete in an isolated worktree. Canonical-source guard: 137 protected files match (the three reviewed integration exceptions are README, package scripts and API client); dependencies/runtime declarations also match. Negative check: a temporary audio edit was rejected, original bytes restored, then guard passed again. Game tests: 36/36. Proxy tests: 4/4. `git diff --check` passes. No production operations or changes to Float Rider. Task 2 is next.
