import communityEventsJson from "../../data/community-events.json";

export type CommunityEventStatus = "pending" | "approved" | "rejected" | "needs_info" | "archived";

export type CommunityEvent = {
  id: string;
  slug: string;
  status: CommunityEventStatus;
  title: string;
  organization: string;
  eventType: string;
  startDateTime: string;
  endDateTime: string;
  venueName: string;
  venueAddress: string;
  cityStateZip: string;
  description: string;
  mapUrl?: string;
  ticketUrl?: string;
  cost?: string;
  audience?: string;
  publicContact?: string;
  accessibilityNotes?: string;
  parkingNotes?: string;
  flyerUrl?: string;
  organizationLogoUrl?: string;
};

export const COMMUNITY_EVENT_SUBMISSION_FORM_URL = "https://form.jotform.com/262217749749067";
export const COMMUNITY_EVENTS_CALENDAR_TITLE = "Community Mardi Gras Events";

const communityEvents = communityEventsJson as CommunityEvent[];

export function getApprovedCommunityEvents() {
  return communityEvents
    .filter((event) => event.status === "approved")
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
}

export function getCommunityEventBySlug(slug: string) {
  return getApprovedCommunityEvents().find((event) => event.slug === slug || event.id === slug) ?? null;
}

export function getCommunityEventById(eventId: string) {
  return getApprovedCommunityEvents().find((event) => event.id === eventId || event.slug === eventId) ?? null;
}

export function formatCommunityEventDate(event: CommunityEvent) {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago"
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago"
  });

  return `${dateFormatter.format(start)} • ${timeFormatter.format(start)}–${timeFormatter.format(end)} CT`;
}

export function buildGoogleCalendarUrl(event: CommunityEvent) {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("dates", `${formatGoogleDate(event.startDateTime)}/${formatGoogleDate(event.endDateTime)}`);
  url.searchParams.set("details", buildCalendarDescription(event));
  url.searchParams.set("location", fullEventLocation(event));

  return url.toString();
}

export function buildCommunityEventIcs(event: CommunityEvent) {
  const now = formatIcsDate(new Date().toISOString());
  const uid = `${event.id}@mg251.xyz`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mardi Gras Mobile AL//Community Mardi Gras Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(event.startDateTime)}`,
    `DTEND:${formatIcsDate(event.endDateTime)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(buildCalendarDescription(event))}`,
    `LOCATION:${escapeIcsText(fullEventLocation(event))}`,
    event.ticketUrl ? `URL:${event.ticketUrl}` : event.mapUrl ? `URL:${event.mapUrl}` : event.flyerUrl ? `URL:${event.flyerUrl}` : null,
    "END:VEVENT",
    "END:VCALENDAR"
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function buildCommunityCalendarIcs(events = getApprovedCommunityEvents()) {
  const now = formatIcsDate(new Date().toISOString());
  const eventBlocks = events.map((event) =>
    [
      "BEGIN:VEVENT",
      `UID:${event.id}@mg251.xyz`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatIcsDate(event.startDateTime)}`,
      `DTEND:${formatIcsDate(event.endDateTime)}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      `DESCRIPTION:${escapeIcsText(buildCalendarDescription(event))}`,
      `LOCATION:${escapeIcsText(fullEventLocation(event))}`,
      event.ticketUrl ? `URL:${event.ticketUrl}` : event.mapUrl ? `URL:${event.mapUrl}` : event.flyerUrl ? `URL:${event.flyerUrl}` : null,
      "END:VEVENT"
    ]
      .filter(Boolean)
      .join("\r\n")
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mardi Gras Mobile AL//Community Mardi Gras Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${COMMUNITY_EVENTS_CALENDAR_TITLE}`,
    ...eventBlocks,
    "END:VCALENDAR"
  ].join("\r\n");
}

export function fullEventLocation(event: CommunityEvent) {
  return [event.venueName, event.venueAddress, event.cityStateZip].filter(Boolean).join(", ");
}

function buildCalendarDescription(event: CommunityEvent) {
  return [
    event.description,
    event.cost ? `Cost: ${event.cost}` : null,
    event.audience ? `Audience: ${event.audience}` : null,
    event.publicContact ? `Public contact: ${event.publicContact}` : null,
    event.ticketUrl ? `Event / RSVP link: ${event.ticketUrl}` : null,
    event.mapUrl ? `Map / directions: ${event.mapUrl}` : null,
    event.flyerUrl ? `Event flyer: ${event.flyerUrl}` : null,
    "Verify event details with the host organization before attending. This is a community-submitted Mardi Gras-related event, not the official parade schedule."
  ]
    .filter(Boolean)
    .join("\n\n");
}

function formatGoogleDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function formatIcsDate(value: string) {
  return formatGoogleDate(value);
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}