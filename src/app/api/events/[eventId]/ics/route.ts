import { NextResponse } from "next/server";
import { buildCommunityEventIcs, getCommunityEventById } from "@/lib/community-events";

type EventIcsRouteProps = {
  params: Promise<{ eventId: string }>;
};

export async function GET(_request: Request, { params }: EventIcsRouteProps) {
  const { eventId } = await params;
  const event = getCommunityEventById(eventId);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return new NextResponse(buildCommunityEventIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`
    }
  });
}
