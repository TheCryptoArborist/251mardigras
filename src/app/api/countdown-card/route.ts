import { renderCountdownCard } from "@/lib/countdown-card";
import { isValidCountdownSnapshotTimestamp, parseCountdownSnapshot, type CardFormat } from "@/lib/countdown-share";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORMATS: CardFormat[] = ["feed", "story", "preview"];
// OpenNext otherwise varies Netlify's cache only by framework query parameters.
const NETLIFY_VARY = "query=at|format|download";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "feed";
  if (!FORMATS.includes(format as CardFormat)) {
    return Response.json({ error: "Choose a card format: feed, story, or preview." }, { status: 400, headers: { "Cache-Control": "no-store", "Netlify-CDN-Cache-Control": "no-store", "Netlify-Vary": NETLIFY_VARY } });
  }

  const now = Date.now();
  const value = url.searchParams.get("at") ?? undefined;
  const snapshot = parseCountdownSnapshot(value, now);
  const frozenSnapshot = isValidCountdownSnapshotTimestamp(value, now);
  const headers: HeadersInit = {
    "Content-Type": "image/png",
    "Cache-Control": frozenSnapshot ? "public, max-age=3600, immutable" : "no-store",
    "Netlify-CDN-Cache-Control": frozenSnapshot ? "public, durable, s-maxage=3600" : "no-store",
    "Netlify-Vary": NETLIFY_VARY,
    "X-Content-Type-Options": "nosniff"
  };

  if (url.searchParams.get("download") === "1") {
    const label = snapshot.expired ? "parade-plans" : snapshot.days === 0 ? "under-1-day" : `${snapshot.days}-days`;
    headers["Content-Disposition"] = `attachment; filename="mg251-${label}-${format}-${snapshot.dateKey}.png"`;
  }

  return renderCountdownCard(snapshot, format as CardFormat, headers);
}
