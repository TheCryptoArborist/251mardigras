export const FIRST_DOWNTOWN_PARADE_TARGET = "2027-01-22T18:30:00-06:00";
export const COUNTDOWN_PROGRESS_START = "2026-02-17T00:00:00-06:00";
export const TARGET_EVENT_NAME = "Conde Cavaliers";
export const TARGET_FULL_DATE_LABEL = "January 22, 2027 • 6:30 PM CT";
export const TARGET_SHORT_DATE_LABEL = "Jan. 22, 2027 • 6:30 PM CT";
export const COUNTDOWN_SHARE_TITLE = "Mobile Mardi Gras Countdown";

export const COUNTDOWN_SHARE_PLATFORMS = ["facebook", "instagram", "x", "tiktok", "youtube", "other"] as const;
export type SharePlatform = (typeof COUNTDOWN_SHARE_PLATFORMS)[number];
export type CardFormat = "feed" | "story" | "preview" | "square";

export const COUNTDOWN_CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  preview: { width: 1200, height: 630 },
  square: { width: 1080, height: 1080 }
};

export const COUNTDOWN_PLATFORM_PRESETS: Record<SharePlatform, { label: string; defaultFormat: CardFormat; formats: CardFormat[]; includeLinkInCaption: boolean }> = {
  facebook: { label: "Facebook", defaultFormat: "preview", formats: ["preview", "feed", "story"], includeLinkInCaption: true },
  instagram: { label: "Instagram", defaultFormat: "feed", formats: ["feed", "story"], includeLinkInCaption: false },
  x: { label: "X", defaultFormat: "preview", formats: ["preview"], includeLinkInCaption: true },
  tiktok: { label: "TikTok", defaultFormat: "story", formats: ["story"], includeLinkInCaption: false },
  youtube: { label: "YouTube", defaultFormat: "square", formats: ["square"], includeLinkInCaption: false },
  other: { label: "Other apps", defaultFormat: "square", formats: ["square", "feed", "story", "preview"], includeLinkInCaption: true }
};

export type TimeRemaining = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CountdownEvent = {
  /** Present only when sharing an individual entry from the parade schedule. */
  paradeId?: string;
  name: string;
  date: string;
  dateLabel: string;
  shortDateLabel: string;
  weekdayDateLabel: string;
  fullDateLabel: string;
  timeLabel: string;
  startsAt: number | null;
  route?: string;
};

export const DEFAULT_COUNTDOWN_EVENT: CountdownEvent = {
  name: TARGET_EVENT_NAME,
  date: "2027-01-22",
  dateLabel: "January 22, 2027",
  shortDateLabel: "Jan. 22, 2027",
  weekdayDateLabel: "Friday, January 22, 2027",
  fullDateLabel: TARGET_FULL_DATE_LABEL,
  timeLabel: "6:30 PM CT",
  startsAt: Date.parse(FIRST_DOWNTOWN_PARADE_TARGET)
};

export type CountdownSnapshot = TimeRemaining & {
  event: CountdownEvent;
  hasScheduledTime: boolean;
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

/** The published January/February 2027 schedule is in Central Standard Time. */
export function parseParadeStartTime(date: string, time: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const calendarDate = new Date(`${date}T12:00:00-06:00`);
  if (!Number.isFinite(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== date) return null;
  const value = time.trim();
  if (value.toLowerCase() === "noon") return calendarDate.getTime();
  const match = value.match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  if (hour < 1 || hour > 12) return null;
  if (hour === 12) hour = 0;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return Date.parse(`${date}T${String(hour).padStart(2, "0")}:${match[2]}:00-06:00`);
}

export function createParadeShareEvent(
  parade: { id: string; name: string; time: string; route: string },
  day: { date: string }
): CountdownEvent {
  const calendarDate = new Date(`${day.date}T12:00:00-06:00`);
  const dateOptions = { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" } as const;
  const dateLabel = new Intl.DateTimeFormat("en-US", dateOptions).format(calendarDate);
  const shortDateLabel = new Intl.DateTimeFormat("en-US", { ...dateOptions, month: "short" }).format(calendarDate).replace(/^([A-Za-z]{3}) /, "$1. ");
  const weekdayDateLabel = new Intl.DateTimeFormat("en-US", { ...dateOptions, weekday: "long" }).format(calendarDate);
  const startsAt = parseParadeStartTime(day.date, parade.time);
  const timeLabel = startsAt === null ? parade.time.trim() || "Time not listed" : `${parade.time.trim()} CT`;
  return {
    paradeId: parade.id,
    name: parade.name,
    date: day.date,
    dateLabel,
    shortDateLabel,
    weekdayDateLabel,
    fullDateLabel: `${dateLabel} • ${timeLabel}`,
    timeLabel,
    startsAt,
    route: parade.route
  };
}

export function getTimeRemaining(now: number = Date.now(), target: number = TARGET_MILLISECONDS): TimeRemaining {
  const timestamp = Number.isFinite(now) ? now : Date.now();
  const totalMilliseconds = Math.max(target - timestamp, 0);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);

  return {
    totalMilliseconds,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

export function createCountdownSnapshot(now: number = Date.now(), event: CountdownEvent = DEFAULT_COUNTDOWN_EVENT): CountdownSnapshot {
  const timestamp = Number.isFinite(now) ? now : Date.now();
  const at = Math.floor(timestamp / 1000);
  const date = new Date(at * 1000);
  const hasScheduledTime = event.startsAt !== null && Number.isFinite(event.startsAt);
  const remaining = hasScheduledTime
    ? getTimeRemaining(date.getTime(), event.startsAt!)
    : { totalMilliseconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const parts = SNAPSHOT_DATE_PARTS.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  const dateKey = `${part("year")}-${part("month")}-${part("day")}`;

  return {
    ...remaining,
    event,
    hasScheduledTime,
    at,
    expired: hasScheduledTime ? remaining.totalMilliseconds === 0 : dateKey > event.date,
    dateLabel: `${SNAPSHOT_DATE_FORMAT.format(date)} CT`,
    dateKey
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

export function parseCountdownSnapshot(value: string | undefined, now: number = Date.now(), event: CountdownEvent = DEFAULT_COUNTDOWN_EVENT): CountdownSnapshot {
  return isValidCountdownSnapshotTimestamp(value, now)
    ? createCountdownSnapshot(Number(value) * 1000, event)
    : createCountdownSnapshot(now, event);
}

export function formatCountdownRemaining(snapshot: CountdownSnapshot, compact = false) {
  if (!snapshot.hasScheduledTime) {
    if (snapshot.expired) return "Parade date passed";
    return /^following\b/i.test(snapshot.event.timeLabel) ? "Follows preceding parade" : "Start time not listed";
  }
  if (snapshot.expired) return "Scheduled start reached";
  if (snapshot.totalMilliseconds < 60_000) return compact ? "<1m" : "Less than a minute";

  const units = [
    { value: snapshot.days, label: "day", short: "d" },
    { value: snapshot.hours, label: "hour", short: "h" },
    { value: snapshot.minutes, label: "minute", short: "m" }
  ];
  const first = snapshot.days > 0 ? 0 : snapshot.hours > 0 ? 1 : 2;
  return units.slice(first).map(({ value, label, short }) => compact
    ? `${value}${short}`
    : `${value} ${label}${value === 1 ? "" : "s"}`
  ).join(compact ? " " : ", ");
}

export function buildCountdownShareUrl(snapshot: CountdownSnapshot, source: SharePlatform | "share" = "share") {
  const path = snapshot.event.paradeId ? `/schedule/${encodeURIComponent(snapshot.event.paradeId)}` : "/countdown";
  const url = new URL(path, "https://mg251.xyz");
  url.searchParams.set("at", String(snapshot.at));
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", snapshot.event.paradeId ? "parade_share" : "mardi_gras_countdown");
  return url.toString();
}

export function buildCountdownCardUrl(snapshot: CountdownSnapshot, format: CardFormat, download = false) {
  const params = new URLSearchParams({ at: String(snapshot.at), format, v: "4" });
  if (snapshot.event.paradeId) params.set("parade", snapshot.event.paradeId);
  if (download) params.set("download", "1");
  return `/api/countdown-card?${params.toString()}`;
}

export function getCountdownShareTitle(snapshot: CountdownSnapshot) {
  return snapshot.event.paradeId ? `${snapshot.event.name} | Mobile Mardi Gras` : COUNTDOWN_SHARE_TITLE;
}

export function getCountdownCardFilename(snapshot: CountdownSnapshot, format: CardFormat) {
  const parade = snapshot.event.paradeId?.replace(/[^a-z0-9-]/gi, "-").slice(0, 100);
  const label = snapshot.expired ? "parade-plans" : !snapshot.hasScheduledTime ? "parade-details" : snapshot.totalMilliseconds < 60_000 ? "under-1-minute" : `${snapshot.days}d-${snapshot.hours}h-${snapshot.minutes}m`;
  return `mg251-${parade ? `${parade}-` : ""}${label}-${format}-${snapshot.dateKey}-${snapshot.at}.png`;
}

export function buildCountdownCaption(snapshot: CountdownSnapshot, platform: SharePlatform) {
  const remaining = formatCountdownRemaining(snapshot, platform === "x");
  const url = buildCountdownShareUrl(snapshot, platform);
  const selectedEvent = snapshot.event;
  const individual = Boolean(selectedEvent.paradeId);
  const route = selectedEvent.route ? `\n📍 ${selectedEvent.route}` : "";
  if (platform === "x") {
    if (individual) {
      const heading = snapshot.expired
        ? `🎭 ${remaining}. See the latest schedule.`
        : snapshot.hasScheduledTime ? `🎭 ${remaining} until parade time!` : "🎭 Make your parade plans!";
      return `${heading}\n${selectedEvent.name}\n${selectedEvent.shortDateLabel} • ${selectedEvent.timeLabel}${selectedEvent.route ? ` • ${selectedEvent.route}` : ""}\n${url}\nAs of ${snapshot.dateLabel}. #MG251`;
    }
    const heading = snapshot.expired
      ? "🎭 The first downtown parade’s scheduled start has arrived! Check the Mobile Mardi Gras schedule."
      : `🎭 ${remaining} until Mobile’s first downtown parade!`;
    return `${heading}\n${TARGET_EVENT_NAME} • Jan. 22, 2027 • 6:30 PM CT\n${url}\nAs of ${snapshot.dateLabel}. #MG251`;
  }

  const heading = snapshot.expired || !snapshot.hasScheduledTime
    ? "🎭 Make your Mobile Mardi Gras plans!"
    : individual ? `🎭 ${remaining} until ${selectedEvent.name}!` : `🎭 ${remaining} until Mobile’s first downtown Mardi Gras parade!`;
  const event = snapshot.expired
    ? `The ${snapshot.hasScheduledTime ? "scheduled start" : "date"} of ${selectedEvent.name} — ${selectedEvent.fullDateLabel} — has passed. Check the current schedule for what’s next.${route}`
    : `🎉 ${selectedEvent.name}\n📅 ${selectedEvent.weekdayDateLabel} • ${selectedEvent.timeLabel}${route}`;
  const invitations: Record<Exclude<SharePlatform, "x">, string> = {
    facebook: "Who’s ready to catch some throws? Share this with your parade crew! Find the schedule, route maps, and live coverage at MG251:",
    instagram: "Save this countdown and tag your parade crew! 🎭\n\nFollow @mardi_gras_mobile_alabama for Mobile Mardi Gras updates.\nVisit MG251.xyz for the parade schedule, route maps, and live coverage.",
    tiktok: "Who’s catching the first throws with you? Send this to your parade crew! 🎉\n\nFollow @mobilemardigras for parade clips and updates.\nPlan your visit at MG251.xyz.",
    youtube: "Who’s counting down with us? Tell us your favorite parade in the comments!\n\nSubscribe to @MobileMardiGras for parade videos and live coverage.\nVisit MG251.xyz for the countdown, parade schedule, and route maps.",
    other: "Bring your parade crew! Find the live countdown, parade schedule, route maps, and coverage at MG251:"
  };
  // Public captions must also work when shared by visitors whose profile has no
  // MG251 bio link. Keep the full snapshot URL separate on these platforms.
  const link = COUNTDOWN_PLATFORM_PRESETS[platform].includeLinkInCaption ? `\n${url}` : "";
  const hashtags = platform === "instagram" || platform === "tiktok"
    ? "\n\n#MobileMardiGras #MardiGras2027 #MG251 #MobileAlabama"
    : "";

  return `${heading}\n\n${event}\n\n${invitations[platform]}${link}\n\n${snapshot.hasScheduledTime ? "Countdown" : "Details"} as of ${snapshot.dateLabel}.${hashtags}`;
}
