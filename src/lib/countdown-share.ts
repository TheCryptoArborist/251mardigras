export const FIRST_DOWNTOWN_PARADE_TARGET = "2027-01-22T18:30:00-06:00";
export const COUNTDOWN_PROGRESS_START = "2026-02-17T00:00:00-06:00";
export const TARGET_EVENT_NAME = "Conde Cavaliers";
export const TARGET_FULL_DATE_LABEL = "January 22, 2027 • 6:30 PM CT";
export const TARGET_SHORT_DATE_LABEL = "Jan. 22, 2027 • 6:30 PM CT";
export const COUNTDOWN_SHARE_TITLE = "Mobile Mardi Gras Countdown";

export type SharePlatform = "facebook" | "instagram";
export type CardFormat = "feed" | "story" | "preview";

export type TimeRemaining = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CountdownSnapshot = TimeRemaining & {
  /** Unix seconds, matching the live countdown's one-second resolution. */
  at: number;
  expired: boolean;
  /** Human-readable snapshot time in America/Chicago. */
  dateLabel: string;
  /** Calendar date in America/Chicago, suitable for a download filename. */
  dateKey: string;
};

const TARGET_MILLISECONDS = new Date(FIRST_DOWNTOWN_PARADE_TARGET).getTime();
const FIRST_SNAPSHOT_SECOND = new Date(COUNTDOWN_PROGRESS_START).getTime() / 1000;
const SNAPSHOT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago"
});
const SNAPSHOT_DATE_PARTS = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "America/Chicago"
});

export function getTimeRemaining(now: number = Date.now()): TimeRemaining {
  const timestamp = Number.isFinite(now) ? now : Date.now();
  const totalMilliseconds = Math.max(TARGET_MILLISECONDS - timestamp, 0);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);

  return {
    totalMilliseconds,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

export function createCountdownSnapshot(now: number = Date.now()): CountdownSnapshot {
  const timestamp = Number.isFinite(now) ? now : Date.now();
  const at = Math.floor(timestamp / 1000);
  const date = new Date(at * 1000);
  const remaining = getTimeRemaining(date.getTime());
  const parts = SNAPSHOT_DATE_PARTS.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";

  return {
    ...remaining,
    at,
    expired: remaining.totalMilliseconds === 0,
    dateLabel: `${SNAPSHOT_DATE_FORMAT.format(date)} CT`,
    dateKey: `${part("year")}-${part("month")}-${part("day")}`
  };
}

export function isValidCountdownSnapshotTimestamp(value: string | undefined, now: number = Date.now()): value is string {
  if (value === undefined || !/^(?:0|[1-9]\d*)$/.test(value)) return false;
  const seconds = Number(value);
  const timestamp = Number.isFinite(now) ? now : Date.now();
  return Number.isSafeInteger(seconds)
    && seconds >= FIRST_SNAPSHOT_SECOND
    && seconds <= Math.floor(timestamp / 1000) + 5 * 60;
}

export function parseCountdownSnapshot(value: string | undefined, now: number = Date.now()): CountdownSnapshot {
  return isValidCountdownSnapshotTimestamp(value, now)
    ? createCountdownSnapshot(Number(value) * 1000)
    : createCountdownSnapshot(now);
}

export function buildCountdownShareUrl(snapshot: CountdownSnapshot, source: SharePlatform | "share" | "x" = "share") {
  const url = new URL("https://mg251.xyz/countdown");
  url.searchParams.set("at", String(snapshot.at));
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "mardi_gras_countdown");
  return url.toString();
}

export function buildCountdownCardUrl(snapshot: CountdownSnapshot, format: CardFormat, download = false) {
  const params = new URLSearchParams({ at: String(snapshot.at), format });
  if (download) params.set("download", "1");
  return `/api/countdown-card?${params.toString()}`;
}

export function buildCountdownCaption(snapshot: CountdownSnapshot, platform: SharePlatform) {
  const heading = snapshot.expired
    ? "🎭 Make your Mobile Mardi Gras plans!"
    : snapshot.days === 0
      ? "🎭 LESS THAN 1 DAY TO GO!"
      : `🎭 ${snapshot.days} ${snapshot.days === 1 ? "DAY" : "DAYS"} TO GO!`;
  const event = snapshot.expired
    ? `This countdown tracked the first downtown parade: ${TARGET_EVENT_NAME} — ${TARGET_FULL_DATE_LABEL}.`
    : `Mobile’s first downtown Mardi Gras parade is getting closer!\n\n🎉 ${TARGET_EVENT_NAME}\n📅 Friday, ${TARGET_FULL_DATE_LABEL}`;
  const invitation = platform === "instagram"
    ? "Tag your parade crew! Find the parade schedule, route maps, and live coverage at MG251.xyz."
    : "Who’s ready to catch some throws? Share this with your parade crew, then plan your day with the parade schedule, route maps, and live coverage:";
  const hashtags = platform === "instagram" ? "\n\n#MobileMardiGras #MardiGras2027 #MG251 #MobileAlabama" : "";

  return `${heading}\n\n${event}\n\n${invitation}\n${buildCountdownShareUrl(snapshot, platform)}\n\nCountdown as of ${snapshot.dateLabel}.${hashtags}`;
}
