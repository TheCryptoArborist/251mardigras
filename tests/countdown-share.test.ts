import assert from "node:assert/strict";
import test from "node:test";
import {
  COUNTDOWN_PLATFORM_PRESETS,
  COUNTDOWN_PROGRESS_START,
  FIRST_DOWNTOWN_PARADE_TARGET,
  buildCountdownCaption,
  buildCountdownCardUrl,
  buildCountdownShareUrl,
  createCountdownSnapshot,
  formatCountdownRemaining,
  getTimeRemaining,
  parseCountdownSnapshot,
  type CardFormat,
  type SharePlatform
} from "../src/lib/countdown-share";

const target = Date.parse("2027-01-23T00:30:00Z");
const minute = 60_000;
const hour = 60 * minute;
const day = 86_400_000;
const now = Date.parse("2026-10-20T15:25:00Z");
const platforms = ["facebook", "instagram", "x", "tiktok", "youtube", "other"] as const satisfies readonly SharePlatform[];
const formats = ["feed", "story", "preview", "square"] as const satisfies readonly CardFormat[];

function defaultXCaptionWeight(caption: string) {
  let weight = 0;
  const text = caption.replace(/https?:\/\/\S+/gu, () => {
    weight += 23;
    return "";
  });
  // X's weight-one Unicode ranges; other code points (including the single
  // emoji in our default copy) weigh two. This is not a user-edit validator.
  for (const character of text.normalize("NFC")) {
    const point = character.codePointAt(0)!;
    const weighsOne = point <= 0x10ff
      || (point >= 0x2000 && point <= 0x200d)
      || (point >= 0x2010 && point <= 0x201f)
      || (point >= 0x2032 && point <= 0x2037);
    weight += weighsOne ? 1 : 2;
  }
  return weight;
}

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

test("each platform starts with a suitable format that is available in its format choices", () => {
  const defaults: Record<SharePlatform, CardFormat> = {
    facebook: "preview",
    instagram: "feed",
    x: "preview",
    tiktok: "story",
    youtube: "square",
    other: "square"
  };
  assert.deepEqual(Object.keys(COUNTDOWN_PLATFORM_PRESETS).sort(), [...platforms].sort());
  for (const platform of platforms) {
    const preset = COUNTDOWN_PLATFORM_PRESETS[platform];
    assert.equal(preset.defaultFormat, defaults[platform], platform);
    assert.ok(preset.formats.includes(preset.defaultFormat), `${platform} must offer its default format`);
    for (const format of preset.formats) {
      assert.ok(formats.includes(format), `${platform} offers an unsupported format: ${format}`);
    }
  }
});

test("remaining-time copy handles singular, plural, and exact day/hour/minute boundaries", () => {
  const cases = [
    { remaining: day + hour + minute, full: "1 day, 1 hour, 1 minute", compact: "1d 1h 1m" },
    { remaining: 2 * day + 2 * hour + 2 * minute, full: "2 days, 2 hours, 2 minutes", compact: "2d 2h 2m" },
    { remaining: day, full: "1 day, 0 hours, 0 minutes", compact: "1d 0h 0m" },
    { remaining: day - 1000, full: "23 hours, 59 minutes", compact: "23h 59m" },
    { remaining: hour, full: "1 hour, 0 minutes", compact: "1h 0m" },
    { remaining: hour - 1000, full: "59 minutes", compact: "59m" },
    { remaining: minute + 59_000, full: "1 minute", compact: "1m" },
    { remaining: minute, full: "1 minute", compact: "1m" }
  ];
  for (const { remaining, full, compact } of cases) {
    const snapshot = createCountdownSnapshot(target - remaining);
    assert.equal(formatCountdownRemaining(snapshot), full);
    assert.equal(formatCountdownRemaining(snapshot, true), compact);
  }
});

test("the last partial minute stays upcoming in the formatter and every platform caption", () => {
  for (const capturedAt of [target - minute + 1000, target - 1]) {
    const snapshot = createCountdownSnapshot(capturedAt);
    assert.equal(snapshot.expired, false);
    assert.equal(formatCountdownRemaining(snapshot), "Less than a minute");
    assert.equal(formatCountdownRemaining(snapshot, true), "<1m");
    for (const platform of platforms) {
      const caption = buildCountdownCaption(snapshot, platform);
      assert.ok(caption.includes(platform === "x" ? "<1m until" : "Less than a minute until"), platform);
      assert.ok(caption.includes(buildCountdownShareUrl(snapshot, platform)), platform);
      assert.doesNotMatch(caption, /scheduled start[^\n]*(?:arrived|passed|reached)/i);
    }
  }
});

test("all platform captions return visitors to the exact snapshot used by every card format", () => {
  const snapshot = createCountdownSnapshot(now);
  for (const platform of platforms) {
    const returnUrl = new URL(buildCountdownShareUrl(snapshot, platform));
    assert.equal(returnUrl.origin, "https://mg251.xyz");
    assert.equal(returnUrl.pathname, "/countdown");
    assert.equal(returnUrl.searchParams.get("at"), String(snapshot.at));
    assert.equal(returnUrl.searchParams.get("utm_source"), platform);
    assert.equal(returnUrl.searchParams.get("utm_medium"), "social");
    assert.equal(returnUrl.searchParams.get("utm_campaign"), "mardi_gras_countdown");

    const caption = buildCountdownCaption(snapshot, platform);
    assert.ok(caption.includes(returnUrl.toString()));
    assert.ok(caption.includes(platform === "x" ? "94d 9h 5m" : "94 days, 9 hours, 5 minutes"), platform);
    assert.ok(caption.includes(snapshot.dateLabel), platform);
    assert.match(caption, /first downtown/i);
    assert.match(caption, /Conde Cavaliers/i);
    assert.match(caption, /Jan(?:uary|\.)?\s+22,?\s+2027/);
    assert.match(caption, /6:30\s*PM\s*CT/i);

    for (const format of formats) {
      const card: URL = new URL(buildCountdownCardUrl(snapshot, format), returnUrl.origin);
      assert.equal(card.pathname, "/api/countdown-card");
      assert.equal(card.searchParams.get("at"), returnUrl.searchParams.get("at"));
      assert.equal(card.searchParams.get("format"), format);
      assert.equal(card.searchParams.get("v"), "2");
      assert.deepEqual(parseCountdownSnapshot(card.searchParams.get("at") ?? undefined, now), snapshot);
    }
  }
});

test("share URLs preserve attribution and downloaded cards retain the same captured instant and cache version", () => {
  const snapshot = createCountdownSnapshot(now);
  for (const source of ["share", ...platforms] as const) {
    const url = new URL(buildCountdownShareUrl(snapshot, source));
    assert.equal(url.searchParams.get("utm_source"), source);
    assert.equal(url.searchParams.get("at"), String(snapshot.at));
  }
  for (const format of formats) {
    const download = new URL(buildCountdownCardUrl(snapshot, format, true), "https://mg251.xyz");
    assert.equal(download.searchParams.get("at"), String(snapshot.at));
    assert.equal(download.searchParams.get("format"), format);
    assert.equal(download.searchParams.get("v"), "2");
    assert.ok(download.searchParams.has("download"));
    assert.equal(new URL(buildCountdownCardUrl(snapshot, format), "https://mg251.xyz").searchParams.has("download"), false);
  }
});

test("captions stop promising a future parade once the scheduled start has arrived", () => {
  for (const capturedAt of [target, target + minute, target + day]) {
    const snapshot = createCountdownSnapshot(capturedAt);
    assert.equal(formatCountdownRemaining(snapshot), "Scheduled start reached");
    assert.equal(formatCountdownRemaining(snapshot, true), "Scheduled start reached");
    for (const platform of platforms) {
      const caption = buildCountdownCaption(snapshot, platform);
      assert.doesNotMatch(caption, /\buntil\b|\bto go\b|(?:^|\s)-\d/i);
      assert.match(caption, /arrived|passed|schedule/i);
      assert.match(caption, /Conde Cavaliers/i);
      assert.ok(caption.includes(snapshot.dateLabel), platform);
      assert.ok(caption.includes(buildCountdownShareUrl(snapshot, platform)), platform);
    }
  }
});

test("default X captions fit within 280 weighted characters, including the snapshot URL and emoji", () => {
  const capturedTimes = [
    Date.parse(COUNTDOWN_PROGRESS_START),
    now,
    target - day - hour - minute,
    target - day + 1000,
    target - minute,
    target - 1,
    target,
    target + day
  ];
  for (const capturedAt of capturedTimes) {
    const snapshot = createCountdownSnapshot(capturedAt);
    const caption = buildCountdownCaption(snapshot, "x");
    assert.equal(caption.match(/https?:\/\/\S+/gu)?.length, 1);
    assert.ok(caption.includes(buildCountdownShareUrl(snapshot, "x")));
    const weight = defaultXCaptionWeight(caption);
    assert.ok(weight < 280, `Default X caption weighs ${weight} characters at ${snapshot.dateLabel}`);
  }
});
