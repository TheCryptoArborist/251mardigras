import { renderCountdownCard } from "@/lib/countdown-card";
import { COUNTDOWN_CARD_SIZES, DEFAULT_COUNTDOWN_EVENT, getCountdownCardFilename, isValidCountdownSnapshotTimestamp, parseCountdownSnapshot, type CardFormat } from "@/lib/countdown-share";
import { getParadeShareEvent } from "@/lib/parade-share";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORMATS = Object.keys(COUNTDOWN_CARD_SIZES) as CardFormat[];
// OpenNext otherwise varies Netlify's cache only by framework query parameters.
const NETLIFY_VARY = "query=at|parade|format|download|v";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "feed";
  if (!FORMATS.includes(format as CardFormat)) {
    return Response.json({ error: "Choose a card format: feed, story, preview, or square." }, { status: 400, headers: { "Cache-Control": "no-store", "Netlify-CDN-Cache-Control": "no-store", "Netlify-Vary": NETLIFY_VARY } });
  }

  const paradeId = url.searchParams.get("parade");
  const event = paradeId === null ? DEFAULT_COUNTDOWN_EVENT : getParadeShareEvent(paradeId);
  if (!event) {
    return Response.json({ error: "This parade was not found in the schedule." }, { status: 404, headers: { "Cache-Control": "no-store", "Netlify-CDN-Cache-Control": "no-store", "Netlify-Vary": NETLIFY_VARY } });
  }

  const now = Date.now();
  const value = url.searchParams.get("at") ?? undefined;
  const snapshot = parseCountdownSnapshot(value, now, event);
  const frozenSnapshot = isValidCountdownSnapshotTimestamp(value, now);
  const headers: HeadersInit = {
    "Content-Type": "image/png",
    "Cache-Control": frozenSnapshot ? "public, max-age=3600, immutable" : "no-store",
    "Netlify-CDN-Cache-Control": frozenSnapshot ? "public, durable, s-maxage=3600" : "no-store",
    "Netlify-Vary": NETLIFY_VARY,
    "X-Countdown-Snapshot-At": String(snapshot.at),
    "X-Countdown-Parade-Id": event.paradeId ?? "first-downtown",
    "X-Content-Type-Options": "nosniff"
  };

  if (url.searchParams.get("download") === "1") {
    headers["Content-Disposition"] = `attachment; filename="${getCountdownCardFilename(snapshot, format as CardFormat)}"`;
  }

  return renderCountdownCard(snapshot, format as CardFormat, headers);
}
