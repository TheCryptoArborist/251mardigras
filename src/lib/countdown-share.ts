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

export function formatCountdownRemaining(snapshot: CountdownSnapshot, compact = false) {
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
  const url = new URL("https://mg251.xyz/countdown");
  url.searchParams.set("at", String(snapshot.at));
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "mardi_gras_countdown");
  return url.toString();
}

export function buildCountdownCardUrl(snapshot: CountdownSnapshot, format: CardFormat, download = false) {
  const params = new URLSearchParams({ at: String(snapshot.at), format, v: "3" });
  if (download) params.set("download", "1");
  return `/api/countdown-card?${params.toString()}`;
}

export function buildCountdownCaption(snapshot: CountdownSnapshot, platform: SharePlatform) {
  const remaining = formatCountdownRemaining(snapshot, platform === "x");
  const url = buildCountdownShareUrl(snapshot, platform);
  if (platform === "x") {
    const heading = snapshot.expired
      ? "🎭 The first downtown parade’s scheduled start has arrived! Check the Mobile Mardi Gras schedule."
      : `🎭 ${remaining} until Mobile’s first downtown parade!`;
    return `${heading}\n${TARGET_EVENT_NAME} • Jan. 22, 2027 • 6:30 PM CT\n${url}\nAs of ${snapshot.dateLabel}. #MG251`;
  }

  const heading = snapshot.expired
    ? "🎭 Make your Mobile Mardi Gras plans!"
    : `🎭 ${remaining} until Mobile’s first downtown Mardi Gras parade!`;
  const event = snapshot.expired
    ? `The scheduled start of ${TARGET_EVENT_NAME} — ${TARGET_FULL_DATE_LABEL} — has passed. Check the current schedule for what’s next.`
    : `🎉 ${TARGET_EVENT_NAME}\n📅 Friday, ${TARGET_FULL_DATE_LABEL}`;
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

  return `${heading}\n\n${event}\n\n${invitations[platform]}${link}\n\nCountdown as of ${snapshot.dateLabel}.${hashtags}`;
}
