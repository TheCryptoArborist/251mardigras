import assert from "node:assert/strict";
import test from "node:test";
import {
  FIRST_DOWNTOWN_PARADE_TARGET,
  buildCountdownCaption,
  buildCountdownCardUrl,
  buildCountdownShareUrl,
  createCountdownSnapshot,
  getTimeRemaining,
  parseCountdownSnapshot
} from "../src/lib/countdown-share";

const target = Date.parse("2027-01-23T00:30:00Z");
const minute = 60_000;
const day = 86_400_000;
const now = Date.parse("2026-10-20T15:25:00Z");

test("the live countdown uses the actual first parade instant and floors partial days", () => {
  assert.equal(Date.parse(FIRST_DOWNTOWN_PARADE_TARGET), target);
  assert.deepEqual(getTimeRemaining(target - day), {
    totalMilliseconds: day,
    days: 1,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  assert.deepEqual(getTimeRemaining(target - day + 1), {
    totalMilliseconds: day - 1,
    days: 0,
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  assert.deepEqual(getTimeRemaining(target - day - 1), {
    totalMilliseconds: day + 1,
    days: 1,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
});

test("the timer reaches zero at the target without negative units or an early expired state", () => {
  assert.deepEqual(getTimeRemaining(target - 1), {
    totalMilliseconds: 1,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const zero = { totalMilliseconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  assert.deepEqual(getTimeRemaining(target), zero);
  assert.deepEqual(getTimeRemaining(target + day), zero);
  assert.equal(createCountdownSnapshot(target - minute).expired, false);
  assert.equal(createCountdownSnapshot(target).expired, true);
  assert.equal(createCountdownSnapshot(target + day).expired, true);
});

test("a seconds-based snapshot preserves the live day count across a shared-link round trip", () => {
  // Capturing the actual second avoids retaining yesterday's day count for the
  // first minute after a boundary. Card, caption, and crawler stay consistent.
  const capturedAt = target - day + 30_000;
  const snapshot = createCountdownSnapshot(capturedAt);
  assert.equal(getTimeRemaining(capturedAt).days, 0);
  assert.equal(snapshot.at, capturedAt / 1000);
  assert.equal(snapshot.days, getTimeRemaining(capturedAt).days);
  assert.deepEqual(parseCountdownSnapshot(String(snapshot.at), capturedAt), snapshot);
  assert.equal(createCountdownSnapshot(target - day + minute).days, 0);
});

test("snapshot labels use Central dates in both daylight and standard time", () => {
  assert.match(createCountdownSnapshot(Date.parse("2027-01-23T05:30:00Z")).dateLabel, /Jan(?:uary|\.)?\s+22,?\s+2027/);
  assert.match(createCountdownSnapshot(Date.parse("2027-01-23T06:30:00Z")).dateLabel, /Jan(?:uary|\.)?\s+23,?\s+2027/);
  assert.match(createCountdownSnapshot(Date.parse("2026-07-04T04:30:00Z")).dateLabel, /Jul(?:y|\.)?\s+3,?\s+2026/);
  assert.match(createCountdownSnapshot(Date.parse("2026-07-04T05:30:00Z")).dateLabel, /Jul(?:y|\.)?\s+4,?\s+2026/);
  const beforeSpringChange = createCountdownSnapshot(Date.parse("2026-03-08T07:59:00Z")).dateLabel;
  const afterSpringChange = createCountdownSnapshot(Date.parse("2026-03-08T08:01:00Z")).dateLabel;
  assert.match(beforeSpringChange, /1:59\s*AM\s*CT$/);
  assert.match(afterSpringChange, /3:01\s*AM\s*CT$/);
  assert.equal(
    createCountdownSnapshot(Date.parse("2026-11-01T06:30:00Z")).dateLabel,
    createCountdownSnapshot(Date.parse("2026-11-01T07:30:00Z")).dateLabel
  );
});

test("valid historical snapshot links stay historical while malformed or impossible timestamps fall back to now", () => {
  const historical = createCountdownSnapshot(Date.parse("2026-09-20T18:42:39Z"));
  assert.deepEqual(parseCountdownSnapshot(String(historical.at), now), historical);
  const current = createCountdownSnapshot(now);
  const validAt = String(current.at);
  const invalidValues = [
    undefined,
    "",
    " ",
    `${validAt}junk`,
    `${validAt}.0`,
    ` ${validAt}`,
    `${validAt} `,
    `+${validAt}`,
    `0${validAt}`,
    "1e9",
    "NaN",
    "Infinity",
    "-1",
    "9007199254740992",
    String(Date.parse("2026-02-16T00:00:00Z") / 1000),
    String((now + 5 * minute + 1000) / 1000)
  ];
  for (const value of invalidValues) {
    assert.deepEqual(parseCountdownSnapshot(value, now), current, `Unexpected acceptance of ${String(value)}`);
  }
  const allowedClockSkew = createCountdownSnapshot(now + 5 * minute);
  assert.deepEqual(parseCountdownSnapshot(String(allowedClockSkew.at), now), allowedClockSkew);
});

test("Facebook and Instagram captions return visitors to the exact snapshot used by their cards", () => {
  const snapshot = createCountdownSnapshot(now);
  for (const platform of ["facebook", "instagram"] as const) {
    const returnUrl = new URL(buildCountdownShareUrl(snapshot, platform));
    assert.equal(returnUrl.origin, "https://mg251.xyz");
    assert.equal(returnUrl.pathname, "/countdown");
    assert.equal(returnUrl.searchParams.get("at"), String(snapshot.at));
    assert.equal(returnUrl.searchParams.get("utm_source"), platform);
    assert.equal(returnUrl.searchParams.get("utm_medium"), "social");
    assert.equal(returnUrl.searchParams.get("utm_campaign"), "mardi_gras_countdown");

    const caption = buildCountdownCaption(snapshot, platform);
    assert.ok(caption.includes(returnUrl.toString()));
    assert.match(caption, new RegExp(`\\b${snapshot.days}\\s+days?\\b`, "i"));
    assert.match(caption, /first downtown/i);
    assert.match(caption, /Conde Cavaliers/i);
    assert.match(caption, /Jan(?:uary|\.)?\s+22,?\s+2027/);
    assert.match(caption, /6:30\s*PM\s*CT/i);

    for (const format of ["feed", "story", "preview"] as const) {
      const card: URL = new URL(buildCountdownCardUrl(snapshot, format), returnUrl.origin);
      assert.equal(card.pathname, "/api/countdown-card");
      assert.equal(card.searchParams.get("at"), returnUrl.searchParams.get("at"));
      assert.equal(card.searchParams.get("format"), format);
      assert.deepEqual(parseCountdownSnapshot(card.searchParams.get("at") ?? undefined, now), snapshot);
    }
  }
});

test("share and X URLs preserve attribution and downloaded cards retain the same captured instant", () => {
  const snapshot = createCountdownSnapshot(now);
  for (const source of ["share", "x"] as const) {
    const url = new URL(buildCountdownShareUrl(snapshot, source));
    assert.equal(url.searchParams.get("utm_source"), source);
    assert.equal(url.searchParams.get("at"), String(snapshot.at));
  }
  for (const format of ["feed", "story"] as const) {
    const download = new URL(buildCountdownCardUrl(snapshot, format, true), "https://mg251.xyz");
    assert.equal(download.searchParams.get("at"), String(snapshot.at));
    assert.equal(download.searchParams.get("format"), format);
    assert.ok(download.searchParams.has("download"));
    assert.equal(new URL(buildCountdownCardUrl(snapshot, format), "https://mg251.xyz").searchParams.has("download"), false);
  }
});

test("captions stop promising a future parade once the scheduled start has arrived", () => {
  const snapshot = createCountdownSnapshot(target + minute);
  for (const platform of ["facebook", "instagram"] as const) {
    const caption = buildCountdownCaption(snapshot, platform);
    assert.doesNotMatch(caption, /\b0\s+days?\s+(?:until|to go)\b/i);
    assert.match(caption, /arrived|passed|schedule/i);
    assert.match(caption, /Conde Cavaliers/i);
    assert.ok(caption.includes(buildCountdownShareUrl(snapshot, platform)));
  }
});
