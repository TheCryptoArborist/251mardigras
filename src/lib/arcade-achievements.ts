export const checkInStart = "2026-11-22";
export const checkInStoragePrefix = "mg251:road-to-first-throw:2027:";
export const holidayStart = "2026-12-01";
export const holidayEnd = "2026-12-25";

export const arcadeAchievements = [
  { id: "first-throw", name: "First Throw", goal: 1 },
  { id: "bead-collector", name: "Bead Collector", goal: 7 },
  { id: "christmas-crewe", name: "Christmas Crewe", goal: 12, holiday: true },
  { id: "moonpie-master", name: "MoonPie Master", goal: 21 },
  { id: "carnival-royalty", name: "Carnival Royalty", goal: 30 }
] as const;

export type ArcadeAchievement = (typeof arcadeAchievements)[number];

const mobileDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit"
});

export function mobileDate() {
  const parts = mobileDateFormat.formatToParts();
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value).join("-");
}

export function readArcadeCheckIns(today: string, paradeDay: string) {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(checkInStoragePrefix))
    .map((key) => key.slice(checkInStoragePrefix.length))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= checkInStart && date <= paradeDay && date <= today);
}

export function achievementVisits(achievement: ArcadeAchievement, dates: string[]) {
  return "holiday" in achievement
    ? dates.filter((date) => date >= holidayStart && date <= holidayEnd).length
    : dates.length;
}

export function achievementArtwork(id: ArcadeAchievement["id"]) {
  return `/images/profile-studio/badges/arcade-${id}.webp`;
}
