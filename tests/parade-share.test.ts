import assert from "node:assert/strict";
import test from "node:test";
import paradeSchedule from "../data/parade-schedule-2027.json";
import {
  COUNTDOWN_PROGRESS_START,
  buildCountdownCaption,
  buildCountdownCardUrl,
  buildCountdownShareUrl,
  createCountdownSnapshot,
  createParadeShareEvent,
  formatCountdownRemaining,
  parseCountdownSnapshot,
  type CardFormat,
  type SharePlatform
} from "../src/lib/countdown-share";
import { getParadeShareEvent } from "../src/lib/parade-share";

const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;
const now = Date.parse("2026-10-20T15:25:00Z");
const platforms = ["facebook", "instagram", "x", "tiktok", "youtube", "other"] as const satisfies readonly SharePlatform[];
const formats = ["feed", "story", "preview", "square"] as const satisfies readonly CardFormat[];
const listings = paradeSchedule.days.flatMap((paradeDay) => paradeDay.parades.map((parade) => ({ parade, paradeDay })));
const fixtureDay = { date: "2027-02-09", label: "Tuesday, February 9", parades: [] };

function eventWithTime(time: string) {
  return createParadeShareEvent({ id: "test-parade", name: "Test Parade", time, route: "Route I" }, fixtureDay);
}

function defaultXCaptionWeight(caption: string) {
  let weight = 0;
  const text = caption.replace(/https?:\/\/\S+/gu, () => {
    weight += 23;
    return "";
  });
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

test("all 45 current parade IDs resolve to their own trusted schedule details", () => {
  assert.equal(listings.length, 45);
  assert.equal(new Set(listings.map(({ parade }) => parade.id)).size, 45);
  for (const { parade, paradeDay } of listings) {
    const event = getParadeShareEvent(parade.id);
    assert.ok(event, parade.id);
    assert.equal(event.paradeId, parade.id);
    assert.equal(event.name, parade.name);
    assert.equal(event.date, paradeDay.date);
    assert.equal(event.route, parade.route);
    assert.ok(event.timeLabel.includes(parade.time), parade.id);
    assert.ok(event.startsAt !== null && Number.isFinite(event.startsAt), parade.id);
    const snapshot = createCountdownSnapshot(now, event);
    assert.equal(snapshot.hasScheduledTime, true, parade.id);
    assert.equal(snapshot.expired, false, parade.id);
    assert.deepEqual(snapshot.event, event);
  }
});

test("unknown or retired IDs cannot resolve to an unrelated parade", () => {
  for (const id of ["", "unknown-parade", "__proto__", "constructor", "toString", "floral-parade-february-8-2027"]) {
    assert.equal(getParadeShareEvent(id), null, id);
  }
});

test("a later parade counts down to its own Central date and start rather than the first parade", () => {
  const event = getParadeShareEvent("order-of-myths-2027");
  assert.ok(event);
  assert.equal(event.name, "Order of Myths");
  assert.equal(event.date, "2027-02-09");
  assert.equal(event.route, "Route C");
  assert.equal(event.startsAt, Date.parse("2027-02-10T00:00:00Z"));
  assert.match(event.fullDateLabel, /Feb(?:ruary|\.)?\s+9,?\s+2027/);
  assert.match(event.fullDateLabel, /6:00\s*PM\s*CT/);
  const capturedAt = Date.parse("2027-02-08T00:00:00Z");
  const snapshot = createCountdownSnapshot(capturedAt, event);
  assert.equal(createCountdownSnapshot(capturedAt).expired, true);
  assert.equal(snapshot.expired, false);
  assert.equal(snapshot.totalMilliseconds, 2 * day);
  assert.equal(formatCountdownRemaining(snapshot), "2 days, 0 hours, 0 minutes");
});

test("Noon and AM/PM boundaries map to the correct January/February Central instant", () => {
  const cases = [
    ["Noon", "2027-02-09T18:00:00Z"],
    ["12:00 AM", "2027-02-09T06:00:00Z"],
    ["12:00 PM", "2027-02-09T18:00:00Z"],
    ["12:01 AM", "2027-02-09T06:01:00Z"],
    ["11:59 PM", "2027-02-10T05:59:00Z"],
    ["6:30 pm", "2027-02-10T00:30:00Z"]
  ];
  for (const [time, expected] of cases) {
    assert.equal(eventWithTime(time).startsAt, Date.parse(expected), time);
  }
  assert.equal(getParadeShareEvent("floral-parade-february-6-2027")?.startsAt, Date.parse("2027-02-06T18:00:00Z"));
});

test("unrecognized times retain their labels and use only the Central calendar date for past status", () => {
  for (const time of ["Following", "Following Knights of Revelry", "TBA", "TBD", "", "0:30 AM", "13:00 PM", "6:60 PM", "6 PM"]) {
    assert.equal(eventWithTime(time).startsAt, null, time);
  }
  for (const time of ["Following", "TBA"]) {
    const event = eventWithTime(time);
    assert.ok(event.timeLabel.includes(time));
    for (const { capturedAt, expired } of [
      { capturedAt: now, expired: false },
      { capturedAt: Date.parse("2027-02-10T05:59:59Z"), expired: false },
      { capturedAt: Date.parse("2027-02-10T06:00:00Z"), expired: true }
    ]) {
      const snapshot = createCountdownSnapshot(capturedAt, event);
      assert.equal(snapshot.hasScheduledTime, false, time);
      assert.equal(snapshot.expired, expired, time);
      assert.equal(formatCountdownRemaining(snapshot), expired ? "Parade date passed" : time === "Following" ? "Follows preceding parade" : "Start time not listed");
      for (const platform of platforms) {
        const caption = buildCountdownCaption(snapshot, platform);
        assert.ok(caption.includes("Test Parade"), platform);
        assert.ok(caption.includes(time), platform);
        assert.doesNotMatch(caption, /\buntil\b|\bto go\b|\bnoon\b|12:00\s*PM|scheduled start[^\n]*(?:arrived|passed|reached)/i, platform);
      }
    }
  }
});

test("individual parade snapshots distinguish the final minute from the scheduled start", () => {
  const event = getParadeShareEvent("order-of-myths-2027");
  assert.ok(event?.startsAt);
  for (const [offset, expected] of [[-minute, "1 minute"], [-59_000, "Less than a minute"], [-1, "Less than a minute"], [0, "Scheduled start reached"], [day, "Scheduled start reached"]] as const) {
    const snapshot = createCountdownSnapshot(event.startsAt + offset, event);
    assert.equal(snapshot.expired, offset >= 0);
    assert.equal(formatCountdownRemaining(snapshot), expected);
    for (const value of [snapshot.days, snapshot.hours, snapshot.minutes, snapshot.seconds]) assert.ok(value >= 0);
    if (offset >= 0) assert.equal(snapshot.totalMilliseconds, 0);
  }
});

test("parade links, card formats, and timestamp parsing retain the same selected event", () => {
  const event = getParadeShareEvent("mlk-business-civic-organization-2027");
  assert.ok(event);
  const snapshot = createCountdownSnapshot(now, event);
  for (const platform of platforms) {
    const url = new URL(buildCountdownShareUrl(snapshot, platform));
    assert.equal(url.origin, "https://mg251.xyz");
    assert.equal(url.pathname, "/schedule/mlk-business-civic-organization-2027");
    assert.equal(url.searchParams.get("at"), String(snapshot.at));
    assert.equal(url.searchParams.get("utm_source"), platform);
    assert.deepEqual(parseCountdownSnapshot(url.searchParams.get("at") ?? undefined, now + hour, event), snapshot);
  }
  for (const format of formats) {
    const card = new URL(buildCountdownCardUrl(snapshot, format, true), "https://mg251.xyz");
    assert.equal(card.pathname, "/api/countdown-card");
    assert.equal(card.searchParams.get("parade"), event.paradeId);
    assert.equal(card.searchParams.get("at"), String(snapshot.at));
    assert.equal(card.searchParams.get("format"), format);
    assert.equal(card.searchParams.get("v"), "4");
    assert.equal(card.searchParams.get("download"), "1");
    const trustedEvent = getParadeShareEvent(card.searchParams.get("parade")!);
    assert.ok(trustedEvent);
    assert.deepEqual(parseCountdownSnapshot(card.searchParams.get("at") ?? undefined, now + hour, trustedEvent), snapshot);
  }
  const fallback = parseCountdownSnapshot("not-a-timestamp", now + hour, event);
  assert.deepEqual(fallback.event, event);
  assert.equal(fallback.at, (now + hour) / 1000);
});

test("individual captions retain the selected event and platform link policy in every time state", () => {
  const event = getParadeShareEvent("mlk-business-civic-organization-2027");
  assert.ok(event?.startsAt);
  const accountMentions: Partial<Record<SharePlatform, string>> = {
    instagram: "@mardi_gras_mobile_alabama",
    tiktok: "@mobilemardigras",
    youtube: "@MobileMardiGras"
  };
  for (const capturedAt of [event.startsAt - day - hour - minute, event.startsAt - 1, event.startsAt, event.startsAt + day]) {
    const snapshot = createCountdownSnapshot(capturedAt, event);
    for (const platform of platforms) {
      const caption = buildCountdownCaption(snapshot, platform);
      const context = `${platform} at ${snapshot.dateLabel}`;
      const mention = accountMentions[platform];
      assert.ok(caption.includes("MLK Business & Civic Organization Parade"), context);
      assert.match(caption, /Feb(?:ruary|\.)?\s+8,?\s+2027/, context);
      assert.match(caption, /2(?::00)?\s*PM\s*CT/i, context);
      assert.match(caption, /Route D/, context);
      assert.ok(caption.includes(snapshot.dateLabel), context);
      assert.doesNotMatch(caption, /first downtown|Conde Cavaliers/i, context);
      assert.deepEqual(caption.match(/@[A-Za-z0-9_]+/gu) ?? [], mention ? [mention] : [], context);
      assert.doesNotMatch(caption, /\blink(?:s)?[\s-]+in[\s-]+(?:(?:my|our|the|your)[\s-]+)?bio\b/i, context);
      const urls = caption.match(/https?:\/\/\S+/gu) ?? [];
      if (mention) {
        assert.deepEqual(urls, [], context);
        assert.doesNotMatch(caption, /[?&]at=|utm_/i, context);
        assert.match(caption, /\bMG251\.xyz\b/, context);
      } else {
        assert.deepEqual(urls, [buildCountdownShareUrl(snapshot, platform)], context);
      }
      if (capturedAt < event.startsAt - minute) {
        assert.ok(caption.includes(platform === "x" ? "1d 1h 1m" : "1 day, 1 hour, 1 minute"), context);
      } else if (snapshot.expired) {
        assert.doesNotMatch(caption, /\buntil\b|\bto go\b|(?:^|\s)-\d/i, context);
      } else {
        assert.ok(caption.includes(platform === "x" ? "<1m" : "Less than a minute"), context);
      }
    }
  }
});

test("the longest real parade name fits X with its date, route, and one snapshot URL", () => {
  const longest = listings.reduce((current, entry) => entry.parade.name.length > current.parade.name.length ? entry : current);
  assert.equal(longest.parade.name, "MLK Business & Civic Organization Parade");
  const event = getParadeShareEvent(longest.parade.id);
  assert.ok(event?.startsAt);
  for (const capturedAt of [Date.parse(COUNTDOWN_PROGRESS_START), now, event.startsAt - minute, event.startsAt - 1, event.startsAt, event.startsAt + day]) {
    const snapshot = createCountdownSnapshot(capturedAt, event);
    const caption = buildCountdownCaption(snapshot, "x");
    assert.ok(caption.includes(event.name));
    assert.ok(caption.includes(event.route!));
    assert.deepEqual(caption.match(/https?:\/\/\S+/gu), [buildCountdownShareUrl(snapshot, "x")]);
    const weight = defaultXCaptionWeight(caption);
    assert.ok(weight <= 280, `X caption weighs ${weight} characters at ${snapshot.dateLabel}`);
  }
});
