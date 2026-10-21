import type { CommunityEvent } from "@/lib/community-events";

/** Keep calendar pages and shared posts on the same published Central Time labels. */
export function formatCommunityEventDate(event: Pick<CommunityEvent, "startDateTime" | "endDateTime" | "dateLabel">) {
  if (event.dateLabel) return event.dateLabel;

  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago"
  });
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago"
  });
  return `${date.format(start)} • ${time.format(start)}–${time.format(end)} CT`;
}

export function fullEventLocation(event: Pick<CommunityEvent, "locationLabel" | "venueName" | "venueAddress" | "cityStateZip">) {
  if (event.locationLabel) return event.locationLabel;
  return [event.venueName, event.venueAddress, event.cityStateZip].filter(Boolean).join(", ");
}
