import { NextResponse } from "next/server";
import { buildCommunityCalendarIcs } from "@/lib/community-events";

export async function GET() {
  return new NextResponse(buildCommunityCalendarIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=community-mardi-gras-events.ics"
    }
  });
}
