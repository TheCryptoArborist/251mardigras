import { renderCommunityEventCard } from "@/lib/community-event-card";
import { getCommunityEventById } from "@/lib/community-events";
import { EVENT_CARD_SIZES, getCommunityEventCardFilename, type CardFormat } from "@/lib/community-event-share";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORMATS = Object.keys(EVENT_CARD_SIZES) as CardFormat[];
const NETLIFY_VARY = "query=format|download|v";
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Netlify-CDN-Cache-Control": "no-store",
  "Netlify-Vary": NETLIFY_VARY
};

export async function GET(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "feed";
  if (!FORMATS.includes(format as CardFormat)) {
    return Response.json({ error: "Choose a card format: feed, story, preview, or square." }, { status: 400, headers: NO_STORE_HEADERS });
  }
  const { eventId } = await params;
  const event = getCommunityEventById(eventId);
  if (!event) {
    return Response.json({ error: "Event not found." }, { status: 404, headers: NO_STORE_HEADERS });
  }
  const headers: HeadersInit = {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=300",
    "Netlify-CDN-Cache-Control": "public, s-maxage=300",
    "Netlify-Vary": NETLIFY_VARY,
    "X-Community-Event-Id": event.id,
    "X-Community-Event-Format": format,
    "X-Content-Type-Options": "nosniff"
  };
  if (url.searchParams.get("download") === "1") {
    headers["Content-Disposition"] = `attachment; filename="${getCommunityEventCardFilename(event, format as CardFormat)}"`;
  }
  return renderCommunityEventCard(event, format as CardFormat, headers);
}
