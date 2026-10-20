import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Acceptance fixture transcribed from the City of Mobile's 2027 StoryMap on
// October 20, 2026. Update this fixture only after checking that official source.
// Run: node scripts/verify-parade-schedule.mjs [http://localhost:3000]
const sourceUrl = "https://storymaps.arcgis.com/stories/aa1969cf3b68462a8676acdfb4839ad4";
const sourceRows = `
2027-01-22|6:30 PM|Conde Cavaliers|A
2027-01-23|2:00 PM|Bayport Parading Society|A
2027-01-23|2:30 PM|Mystic DJ Riders|A
2027-01-23|6:30 PM|Pharaohs’ Mystic Society|A
2027-01-23|7:00 PM|Conde Explorers|A
2027-01-28|6:30 PM|Order of Polka Dots|A
2027-01-29|6:30 PM|Order of Inca|A
2027-01-30|1:00 PM|Mobile Mystics|A
2027-01-30|1:30 PM|Mobile Mystical Revelers|A
2027-01-30|2:00 PM|Mobile Mystical Friends|A
2027-01-30|6:30 PM|Maids of Mirth|G
2027-01-30|6:30 PM|Order of Butterfly Maidens|A
2027-01-30|7:30 PM|Krewe of Marry Mates|A
2027-01-31|6:30 PM|Neptune’s Daughters|A
2027-01-31|7:00 PM|Order of Isis|A
2027-02-01|6:30 PM|Order of Venus|A
2027-02-01|7:30 PM|Order of Many Faces|A
2027-02-02|6:30 PM|Order of LaShe’s|A
2027-02-02|7:00 PM|Order of Olympia|A
2027-02-04|6:30 PM|Mystic Stripers Society|A
2027-02-05|6:30 PM|Crewe of Columbus|A
2027-02-06|Noon|Floral Parade|I
2027-02-06|12:30 PM|Knights of Mobile|A
2027-02-06|1:00 PM|Mobile Mystical Ladies|A
2027-02-06|1:30 PM|Order of Angels|A
2027-02-06|2:00 PM|Joy of Life|A
2027-02-06|5:45 PM|Mystics of Time|H
2027-02-07|2:00 PM|King Elexis I|E
2027-02-07|2:30 PM|Joe Cain Marchers|A
2027-02-07|3:00 PM|Joe Cain Society|A
2027-02-07|4:00 PM|Krewe de Bienville|A
2027-02-07|5:00 PM|Krewe de Secondline|A
2027-02-07|6:00 PM|Order of Kahos|A
2027-02-08|11:30 AM|King Felix III & Floral Parade|I
2027-02-08|2:00 PM|MLK Business & Civic Organization Parade|D
2027-02-08|2:30 PM|Monday Mystics|D
2027-02-08|3:00 PM|Northside Merchants|D
2027-02-08|6:30 PM|Infant Mystics|F
2027-02-08|7:00 PM|Order of Doves|F
2027-02-09|10:30 AM|Order of Athena|A
2027-02-09|12:30 PM|Knights of Revelry|A
2027-02-09|1:00 PM|King Felix III Parade|A
2027-02-09|1:30 PM|Comic Cowboys|A
2027-02-09|2:00 PM|MAMGA Mammoth|B
2027-02-09|6:00 PM|Order of Myths|C
`.trim().split("\n");

const schedule = JSON.parse(await readFile(new URL("../data/parade-schedule-2027.json", import.meta.url), "utf8"));
const entries = schedule.days.flatMap((day) => day.parades.map((parade) => ({ ...parade, date: day.date })));
const actualRows = entries.map((entry) => `${entry.date}|${entry.time}|${entry.name}|${entry.route.replace("Route ", "")}`);

assert.equal(schedule.source.url, sourceUrl);
assert.equal(schedule.lastTranscribedAt, "2026-10-20");
assert.deepEqual(actualRows, sourceRows, "Public schedule differs from the checked official source.");
assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length, "Parade IDs must be unique.");
assert.equal(entries.find((entry) => entry.name === "Joy of Life")?.id, "joy-of-life-2027");

for (const day of schedule.days) {
  const label = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Chicago" })
    .format(new Date(`${day.date}T12:00:00-06:00`));
  assert.equal(day.label, label, `Incorrect weekday or display date for ${day.date}.`);
}

console.log(`Verified ${entries.length} official entries across ${schedule.days.length} dates, including Routes G and I.`);

const baseUrl = process.argv[2];
if (baseUrl) {
  for (let offset = 0; offset < entries.length; offset += 4) {
    await Promise.all(entries.slice(offset, offset + 4).map(async (entry) => {
      const response = await fetch(new URL(`/api/parades/${encodeURIComponent(entry.id)}/ics`, baseUrl));
      assert.equal(response.status, 200, `Calendar export failed for ${entry.id}.`);
      assert.match(response.headers.get("content-type") ?? "", /^text\/calendar/);
      const calendar = (await response.text()).replace(/\r?\n[ \t]/g, "");
      const fields = new Map(calendar.split(/\r?\n/).map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator), line.slice(separator + 1)];
      }));
      const start = scheduledStart(entry);
      assert.equal(fields.get("DTSTART"), calendarUtc(start), `Wrong calendar start for ${entry.id}.`);
      assert.equal(fields.get("DTEND"), calendarUtc(new Date(start.getTime() + 3 * 60 * 60 * 1000)), `Wrong planning window for ${entry.id}.`);
      assert.equal(fields.get("UID"), `${entry.id}@mg251.xyz`);
      assert.equal(fields.get("SUMMARY"), escapeIcs(entry.name));
      assert.equal(fields.get("LOCATION"), escapeIcs(`Mobile, Alabama — ${entry.route}`));
    }));
  }
  const routeMap = await fetch(new URL("/api/route-maps/i", baseUrl));
  assert.equal(routeMap.status, 200, "Route I map is unavailable.");
  assert.match(routeMap.headers.get("content-type") ?? "", /application\/pdf/);
  const mapBytes = new Uint8Array(await routeMap.arrayBuffer());
  assert.equal(new TextDecoder().decode(mapBytes.slice(0, 5)), "%PDF-", "Route I must return an actual PDF.");
  console.log(`Verified all ${entries.length} calendar exports and the Route I PDF endpoint.`);
} else {
  console.log("Pass a running site URL to verify calendar exports and the Route I PDF endpoint.");
}

function scheduledStart(entry) {
  const match = entry.time === "Noon" ? [null, "12", "00", "PM"] : entry.time.match(/^(\d+):(\d+) (AM|PM)$/);
  assert.ok(match, `Unsupported official start time: ${entry.time}`);
  const hour = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
  return new Date(`${entry.date}T${String(hour).padStart(2, "0")}:${match[2]}:00-06:00`);
}

function calendarUtc(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
