import type { CommunityEvent } from "@/lib/community-events";
import { formatCommunityEventDate, fullEventLocation } from "@/lib/community-event-format";
import {
  COUNTDOWN_CARD_SIZES,
  COUNTDOWN_PLATFORM_PRESETS,
  COUNTDOWN_SHARE_PLATFORMS,
  type CardFormat,
  type SharePlatform
} from "@/lib/countdown-share";

export const EVENT_CARD_SIZES = COUNTDOWN_CARD_SIZES;
export const EVENT_PLATFORM_PRESETS = COUNTDOWN_PLATFORM_PRESETS;
export const EVENT_SHARE_PLATFORMS = COUNTDOWN_SHARE_PLATFORMS;
export { formatCommunityEventDate as formatCommunityEventShareDate };
export type { CardFormat, SharePlatform };

export function buildCommunityEventShareUrl(event: Pick<CommunityEvent, "slug">, source: SharePlatform | "share" = "share") {
  const url = new URL(`/events/${encodeURIComponent(event.slug)}`, "https://mg251.xyz");
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "community_event_share");
  return url.toString();
}

export function buildCommunityEventCardUrl(event: Pick<CommunityEvent, "id">, format: CardFormat, download = false) {
  const params = new URLSearchParams({ format, v: "1" });
  if (download) params.set("download", "1");
  return `/api/events/${encodeURIComponent(event.id)}/share-card?${params}`;
}

export function getCommunityEventCardFilename(event: Pick<CommunityEvent, "slug">, format: CardFormat) {
  const slug = event.slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 100) || "community-event";
  return `mg251-${slug}-${format}.png`;
}

export function getCommunityEventShareTitle(event: Pick<CommunityEvent, "title">) {
  return `${event.title} | MG251`;
}

export function buildCommunityEventCaption(event: CommunityEvent, platform: SharePlatform, now = Date.now()) {
  const ended = Date.parse(event.endDateTime) < now;
  const date = formatCommunityEventDate(event);
  const location = fullEventLocation(event);
  const url = buildCommunityEventShareUrl(event, platform);
  const detailsLabel = event.flyerUrl ? "details and flyer" : "event details";

  if (platform === "x") return buildXCaption(event, date, url, ended);

  const details = [
    `🎭 ${event.title}`,
    `Hosted by ${event.organization}`,
    ended ? "This event has ended. Details are saved for reference." : null,
    `📅 ${date}`,
    location ? `📍 ${location}` : null,
    event.cost ? `🎟️ ${event.cost}` : null,
    event.audience ? event.audience : null
  ].filter(Boolean).join("\n");

  const invitations: Record<Exclude<SharePlatform, "x">, string> = {
    facebook: ended
      ? "Find this event’s saved details and more community events on MG251:"
      : `Make plans with your Mardi Gras crew—share this event and tag who you’re bringing! Find the ${detailsLabel} on MG251:`,
    instagram: `${ended ? "Find more community events" : "Save this event and send it to your Mardi Gras crew"}!\n\nFollow @mardi_gras_mobile_alabama for Mobile Mardi Gras updates. Find event details at MG251.xyz.`,
    tiktok: `${ended ? "Explore more Mobile Mardi Gras events" : "Who’s going with you? Share this with your Mardi Gras crew"}!\n\nFollow @mobilemardigras for local clips and updates. Event details at MG251.xyz.`,
    youtube: `${ended ? "Explore more events on the MG251 community calendar." : "Who’s planning to go? Tell us in the comments!"}\n\nSubscribe to @MobileMardiGras for Mardi Gras videos and live coverage. Find event details at MG251.xyz.`,
    other: ended ? "Saved event details and the community calendar:" : `Here’s an event for our Mardi Gras plans. Find the ${detailsLabel}:`
  };
  const link = EVENT_PLATFORM_PRESETS[platform].includeLinkInCaption ? `\n${url}` : "";
  const tags = platform === "instagram" || platform === "tiktok" ? "\n\n#MobileMardiGras #MobileAlabama #MG251" : "";
  return `${details}\n\n${invitations[platform]}${link}${tags}`;
}

function conservativeTextWeight(value: string) {
  // Counting each non-ASCII code point twice also leaves room for Unicode
  // punctuation and emoji without undercounting X's weighted text limit.
  return Array.from(value).reduce((weight, character) => weight + (character.codePointAt(0)! <= 0x7f ? 1 : 2), 0);
}

function shorten(value: string, limit: number) {
  if (conservativeTextWeight(value) <= limit) return value;
  let shortened = "";
  let weight = 0;
  for (const character of value) {
    const nextWeight = conservativeTextWeight(character);
    if (weight + nextWeight > limit - 2) break;
    shortened += character;
    weight += nextWeight;
  }
  return `${shortened.trimEnd()}…`;
}

function buildXCaption(event: CommunityEvent, date: string, url: string, ended: boolean) {
  const status = ended ? "Past community event\n" : "";
  const venue = event.locationLabel || event.venueName;
  let title = event.title;
  let organization = event.organization;
  let dateLine = date;
  let venueLine = venue ? `\n📍 ${venue}` : "";
  const body = () => `${status}${title}\nHosted by ${organization}\n${dateLine}${venueLine}`;
  // Reserve 23 for the shared URL, two newlines, and six for #MG251.
  const bodyLimit = 248;
  const excess = () => conservativeTextWeight(body()) - bodyLimit;
  if (excess() > 0) venueLine = "";
  if (excess() > 0) organization = shorten(organization, Math.max(24, conservativeTextWeight(organization) - excess()));
  if (excess() > 0) title = shorten(title, Math.max(32, conservativeTextWeight(title) - excess()));
  if (excess() > 0) dateLine = shorten(dateLine, Math.max(24, conservativeTextWeight(dateLine) - excess()));
  return `${body()}\n${url}\n#MG251`;
}
