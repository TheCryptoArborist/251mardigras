import assert from "node:assert/strict";
import test from "node:test";
import {
  getApprovedCommunityEvents,
  type CommunityEvent
} from "../src/lib/community-events";
import {
  formatCommunityEventDate,
  fullEventLocation
} from "../src/lib/community-event-format";
import {
  buildCommunityEventCaption,
  buildCommunityEventCardUrl,
  buildCommunityEventShareUrl,
  formatCommunityEventShareDate,
  getCommunityEventCardFilename,
  getCommunityEventShareTitle,
  type CardFormat,
  type SharePlatform
} from "../src/lib/community-event-share";

const events = getApprovedCommunityEvents();
const platforms = ["facebook", "instagram", "x", "tiktok", "youtube", "other"] as const satisfies readonly SharePlatform[];
const formats = ["feed", "story", "preview", "square"] as const satisfies readonly CardFormat[];
const accountMentions: Partial<Record<SharePlatform, string>> = {
  instagram: "@mardi_gras_mobile_alabama",
  tiktok: "@mobilemardigras",
  youtube: "@MobileMardiGras"
};

function eventById(id: string) {
  const event = events.find((item) => item.id === id);
  assert.ok(event, `Missing published fixture ${id}`);
  return event;
}

function captionWeight(caption: string) {
  let weight = 0;
  const text = caption.replace(/https?:\/\/\S+/gu, () => {
    weight += 23;
    return "";
  });
  // Published names use ordinary punctuation and single-code-point emoji.
  // Count X's documented Unicode ranges, rather than JavaScript code units.
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

test("shared event dates retain Central summer and winter times and overnight start dates", () => {
  const cases = [
    ["nocte-revelers-disco-bingo-2026", "Sat, Aug 22, 2026 • 5:30 PM–8:00 PM CT"],
    ["crawl-o-ween-2026", "Sat, Oct 24, 2026 • 12:00 PM–6:00 PM CT"],
    ["mobile-mystics-mardi-gras-ball-2027", "Sat, Jan 30, 2027 • 6:00 PM–12:00 AM CT"],
    ["a-night-of-royalty-2027", "Sat, Feb 6, 2027 • 7:00 PM–2:00 AM CT"]
  ];
  for (const [id, expected] of cases) {
    const event = eventById(id);
    assert.equal(formatCommunityEventDate(event), expected, id);
    assert.equal(formatCommunityEventShareDate(event), expected, id);
  }
});

test("published custom date labels and location overrides survive in shared details", () => {
  for (const event of events.filter((item) => item.dateLabel)) {
    assert.equal(formatCommunityEventShareDate(event), event.dateLabel, event.id);
    for (const platform of platforms) {
      const caption = buildCommunityEventCaption(event, platform, Date.parse(event.startDateTime) - 1);
      assert.ok(caption.includes(event.dateLabel!), `${event.id}: ${platform}`);
    }
  }
  const event = {
    ...eventById("crawl-o-ween-2026"),
    locationLabel: "Meet at the host’s designated downtown check-in"
  };
  assert.equal(fullEventLocation(event), event.locationLabel);
  assert.ok(buildCommunityEventCaption(event, "facebook").includes(event.locationLabel));
  assert.equal(fullEventLocation({ ...event, locationLabel: undefined, venueName: "Community Hall", venueAddress: "12 Main Street", cityStateZip: "Mobile, AL 36602" }), "Community Hall, 12 Main Street, Mobile, AL 36602");
  assert.equal(fullEventLocation({ ...event, locationLabel: undefined, venueName: "Online", venueAddress: "", cityStateZip: "" }), "Online");
});

test("share links use the public slug and platform attribution while card links retain the event ID", () => {
  const event = {
    ...eventById("crawl-o-ween-2026"),
    id: "internal-event-id",
    slug: "public-event-slug"
  };
  for (const source of [...platforms, "share"] as const) {
    const url = new URL(buildCommunityEventShareUrl(event, source));
    assert.equal(url.origin, "https://mg251.xyz");
    assert.equal(url.pathname, "/events/public-event-slug");
    assert.equal(url.searchParams.get("utm_source"), source);
    assert.equal(url.searchParams.get("utm_medium"), "social");
    assert.equal(url.searchParams.get("utm_campaign"), "community_event_share");
    assert.equal(url.searchParams.has("at"), false);
  }
  assert.equal(new URL(buildCommunityEventShareUrl(event)).searchParams.get("utm_source"), "share");
  for (const format of formats) {
    const url = new URL(buildCommunityEventCardUrl(event, format), "https://mg251.xyz");
    assert.equal(url.pathname, "/api/events/internal-event-id/share-card");
    assert.equal(url.searchParams.get("format"), format);
    assert.ok(url.searchParams.get("v"), "A cache version must distinguish card revisions");
    assert.equal(url.searchParams.has("download"), false);
    const download = new URL(buildCommunityEventCardUrl(event, format, true), url.origin);
    assert.equal(download.pathname, url.pathname);
    assert.equal(download.searchParams.get("format"), format);
    assert.equal(download.searchParams.get("download"), "1");
  }
  const encoded = new URL(buildCommunityEventShareUrl({ slug: "event/name?source=other#fragment" }));
  assert.equal(decodeURIComponent(encoded.pathname.slice("/events/".length)), "event/name?source=other#fragment");
  assert.equal(encoded.searchParams.has("source"), false);
  assert.equal(encoded.hash, "");
});

test("every published event keeps its title, host, and date in platform-appropriate captions", () => {
  assert.ok(events.length > 0);
  for (const event of events) {
    for (const now of [Date.parse(event.startDateTime) - 1, Date.parse(event.endDateTime) + 1]) {
      for (const platform of platforms) {
        const context = `${event.id}: ${platform} at ${now}`;
        const caption = buildCommunityEventCaption(event, platform, now);
        const mention = accountMentions[platform];
        assert.ok(caption.includes(event.title), context);
        assert.ok(caption.includes(`Hosted by ${event.organization}`), context);
        assert.ok(caption.includes(formatCommunityEventShareDate(event)), context);
        assert.deepEqual(caption.match(/@[A-Za-z0-9_]+/gu) ?? [], mention ? [mention] : [], context);
        assert.doesNotMatch(caption, /\blink(?:s)?[\s-]+in[\s-]+(?:(?:my|our|the|your)[\s-]+)?bio\b/i, context);
        assert.doesNotMatch(caption, /first downtown parade|Conde Cavaliers|scheduled start reached/i, context);
        const urls = caption.match(/https?:\/\/\S+/gu) ?? [];
        if (mention) {
          assert.deepEqual(urls, [], context);
          assert.doesNotMatch(caption, /[?&]at=|utm_/i, context);
          assert.match(caption, /\bMG251\.xyz\b/, context);
        } else {
          assert.deepEqual(urls, [buildCommunityEventShareUrl(event, platform)], context);
        }
      }
    }
  }
});

test("an overnight event stays active after its start and Central midnight until its end", () => {
  const event = eventById("a-night-of-royalty-2027");
  const start = Date.parse("2027-02-07T01:00:00Z");
  const afterCentralMidnight = Date.parse("2027-02-07T07:00:00Z");
  const end = Date.parse("2027-02-07T08:00:00Z");
  assert.equal(Date.parse(event.startDateTime), start);
  assert.equal(Date.parse(event.endDateTime), end);
  for (const platform of platforms) {
    for (const now of [start - 1, start, afterCentralMidnight, end]) {
      assert.doesNotMatch(buildCommunityEventCaption(event, platform, now), /this event has ended|past community event/i, `${platform} at ${now}`);
    }
    const caption = buildCommunityEventCaption(event, platform, end + 1);
    assert.match(caption, platform === "x" ? /past community event/i : /this event has ended/i, platform);
    assert.doesNotMatch(caption, /save this event|who’s planning to go|who’s going with you|make plans with your/i, platform);
    assert.ok(caption.includes(event.organization), platform);
    assert.ok(caption.includes("7:00 PM–2:00 AM CT"), platform);
  }
});

test("a missing or remote flyer never changes the selected event's card endpoint or caption details", () => {
  const noFlyer = eventById("a-night-of-royalty-2027");
  assert.equal(noFlyer.flyerUrl, undefined);
  const event = eventById("crawl-o-ween-2026");
  for (const flyerUrl of [event.flyerUrl, undefined, "https://www.jotform.com/uploads/unavailable-flyer.jpg"]) {
    const variant = { ...event, flyerUrl };
    assert.equal(buildCommunityEventCardUrl(variant, "feed"), buildCommunityEventCardUrl(event, "feed"));
    assert.equal(buildCommunityEventCaption(variant, "instagram", 0), buildCommunityEventCaption(event, "instagram", 0));
  }
  assert.match(buildCommunityEventCardUrl(noFlyer, "square"), /^\/api\/events\/a-night-of-royalty-2027\/share-card\?/);
  for (const platform of platforms) {
    const caption = buildCommunityEventCaption(noFlyer, platform, Date.parse(noFlyer.startDateTime) - 1);
    assert.ok(caption.includes("Le Mardi Gras of Royalty — Deaf Society"), platform);
    assert.doesNotMatch(caption, /\bflyer\b/i, platform);
  }
});

test("X captions fit the weighted 280-character limit for all published events before and after ending", () => {
  for (const event of events) {
    for (const now of [Date.parse(event.startDateTime) - 1, Date.parse(event.endDateTime) + 1]) {
      const caption = buildCommunityEventCaption(event, "x", now);
      const weight = captionWeight(caption);
      assert.ok(weight <= 280, `${event.id}: ${weight} weighted characters`);
      assert.deepEqual(caption.match(/https?:\/\/\S+/gu), [buildCommunityEventShareUrl(event, "x")]);
    }
  }
});

test("X shortens a reasonably long event without exceeding its weighted limit or losing the date and host", () => {
  const event: CommunityEvent = {
    ...eventById("mobile-mystics-mardi-gras-ball-2027"),
    title: "Mobile Mardi Gras Community Celebration 🎭 and Annual Charitable Fundraising Gala for Local Families",
    organization: "The Greater Mobile Association of Mystic Societies and Community Charitable Organizations",
    venueName: "Mobile Convention Center Grand Ballroom and Waterfront Terrace"
  };
  for (const now of [Date.parse(event.startDateTime) - 1, Date.parse(event.endDateTime) + 1]) {
    const caption = buildCommunityEventCaption(event, "x", now);
    const weight = captionWeight(caption);
    assert.ok(weight <= 280, `${weight} weighted characters: ${caption}`);
    assert.match(caption, /Mobile Mardi Gras Community Celebration/);
    assert.match(caption, /Hosted by The Greater Mobile/);
    assert.ok(caption.includes(formatCommunityEventShareDate(event)));
    assert.deepEqual(caption.match(/https?:\/\/\S+/gu), [buildCommunityEventShareUrl(event, "x")]);
    assert.equal(caption.isWellFormed(), true);
  }
});

test("download filenames retain event identity and format while excluding unsafe path/header characters", () => {
  const event = eventById("mobile-mystics-mardi-gras-ball-2027");
  for (const format of formats) {
    const filename = getCommunityEventCardFilename(event, format);
    assert.equal(filename, `mg251-${event.slug}-${format}.png`);
    assert.notEqual(filename, getCommunityEventCardFilename(eventById("crawl-o-ween-2026"), format));
  }
  for (const slug of ["../../event/name?x=1#fragment", "event\r\nContent-Disposition: attachment;filename=other", "Royalty’s 🎭 Celebration", "community-event-".repeat(30)]) {
    const filename = getCommunityEventCardFilename({ slug }, "story");
    assert.match(filename, /^mg251-[A-Za-z0-9-]+-story\.png$/);
    assert.ok(filename.length <= 120, filename);
  }
  assert.equal(getCommunityEventCardFilename({ slug: "" }, "preview"), "mg251-community-event-preview.png");
  assert.equal(getCommunityEventShareTitle(event), `${event.title} | MG251`);
});
