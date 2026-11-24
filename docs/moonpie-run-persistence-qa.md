# Local persistence integration — 2026-11-23

Task 3 is partially complete. These checks use the built Vinext Worker and actual local D1 via HTTP, with two separate cookie jars. They do not use production, browser automation or private player exports.

## Reproduced defect and fix

The original API adapter repeatedly produced local 503 responses during rapid POST sequences. Wrangler reported `Can't read from request stream after response has been sent`, followed by `Your worker restarted mid-request`. This affected finish submissions and, in one sequence, run creation. Disabling HTTP connection reuse did not resolve it.

The POST adapter now consumes the incoming body before the score service's D1 awaits/early responses, then passes a fresh Request with the same URL, method, headers and body. The score service, identity resolution, cookie policy, validation rules, database schema and original tests are unchanged. The canonical-source guard explicitly records this fourth integration exception (136 other original files remain checked, including the narrowly normalized HTML link).

After the fix, the integration script completed with no runtime retries. A temporary diagnostic retry was removed: any unexpected HTTP status fails the committed script. This establishes a local fix, not a claim about the production runtime.

## Evidence

- Profile creation, rename and restoration through a repeat GET using the same cookie.
- A separate cookie jar cannot claim the name (case-insensitive 409) or finish another profile's run (404).
- Parallel identical finish requests produce exactly one run and one coin in lifetime statistics. Repeating the accepted payload returns `alreadySaved`; changing its otherwise valid result returns 409.
- The original `RunOutbox` submits through HTTP. A simulated response loss after the server commits leaves two queued scores. Reconstructing the queue from Storage and draining saves both exactly once: three total completed runs/coins, not four.
- An invalid score remains blocked with its error while a later valid score saves. Final profile has four completed runs and four coins; public recent runs has four entries.
- Public profile omits private identifier/token/payload fields and exposes all twelve badge entries, with only First Throw earned for these fixtures.
- Daily, weekly and all-time HTTP rankings each return the correct personal score and America/Chicago time zone.
- 37 game tests pass, including a new independent table of all twelve medal unlock thresholds and capped progress. Existing deterministic tests cover Chicago daylight-saving days, Monday/year boundaries and period filtering. These are unit/service checks, not time-travelled HTTP fixtures.

## Repeat locally

From `games/moonpie-run`, run `npm run build`, then `npm run db:local`, then `npm start -- --port 8791`. In another terminal run:

```sh
node scripts/check-local-persistence.mjs
npm test
npm run verify:baseline
```

The integration origin is hard-coded to `http://127.0.0.1:8791`, redirects are rejected, and there is no production-URL option. Start the local Worker as documented; never tunnel this port to production. Each execution creates uniquely named local QA profiles and retains them. No database reset or fixture deletion is required.

## Still open

Real browser sessionStorage/reload, separate-tab behavior and rendered pending-error UI still need browser verification. The queue integration uses an in-memory Storage adapter and simulates lost responses, not a physical network disconnect. Actual separate-browser cookie behavior is supported by the earlier UI checks and service tests, but two HTTP cookie jars are not two browser engines.

Physical-device/lifecycle/sharing checks from task 2 and production continuity/recovery checks remain open. No merge or deployment is authorized by this report.

## Ranking integration follow-up

`node scripts/check-local-rankings.mjs` now verifies deterministic fixtures through the built HTTP API. It creates a fresh local D1 directory beneath `.wrangler/ranking-qa-<uuid>`, applies the original migrations, seeds synthetic records and starts its own loopback Worker on port 8792. It stops that process tree on exit and retains the ignored fixtures for inspection. No existing local or production database is reset. Run `npm run build` first; port 8792 must be free.

Passed for daily, weekly and all-time scopes:

- Exact start timestamp included; one millisecond before start and the exact end timestamp excluded where applicable. Period metadata matches America/Chicago.
- A player's older 200-point record wins all-time, while the current 50-point record wins the current daily/weekly period. Each player appears once; total-player count and sequential ranks agree.
- Equal scores break ties by routes cleared, shorter active duration, earlier finish timestamp, then ascending run ID.
- All twelve lifetime medals remain counted when the period's selected run has fewer achievements.
- Public recent runs return only the latest ten, newest first, with descending run-ID ordering for identical timestamps.

The fixture rows intentionally bypass score submission validation to isolate ranking reads, including future end-boundary timestamps. They are not claims that those synthetic runs could be submitted through the game. Period expectations use the existing period helper; independent DST/Monday/year-boundary expectations remain covered by the 37-test game suite. The final ranking script and canonical-source guard pass. No runtime change was needed for these checks, so the previously passing build and game suite were not repeated.
