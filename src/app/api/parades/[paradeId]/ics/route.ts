import { NextResponse } from "next/server";
import paradeSchedule2027 from "../../../../../../data/parade-schedule-2027.json";
import type { ParadeSchedule } from "@/components/ScheduleRouteViewer";

const schedule = paradeSchedule2027 as ParadeSchedule;

export async function GET(_request: Request, { params }: { params: Promise<{ paradeId: string }> }) {
  const { paradeId } = await params;
  const match = schedule.days.flatMap((day) => day.parades.map((parade) => ({ parade, day }))).find(({ parade }) => parade.id === paradeId);

  if (!match) {
    return NextResponse.json({ error: "Parade not found" }, { status: 404 });
  }

  const start = getParadeStart(match.day.date, match.parade.time);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const paradeUrl = `https://mg251.xyz/schedule/${encodeURIComponent(match.parade.id)}`;
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MG251//Mobile Mardi Gras Parade Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${match.parade.id}@mg251.xyz`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeIcs(match.parade.name)}`,
    `DESCRIPTION:${escapeIcs(`Mobile Mardi Gras 2027 parade. ${match.parade.route}. Verify schedule details before attending. ${paradeUrl}`)}`,
    `LOCATION:${escapeIcs(`Mobile, Alabama — ${match.parade.route}`)}`,
    `URL:${paradeUrl}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return new NextResponse(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${match.parade.id}.ics"`,
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function getParadeStart(date: string, time: string) {
  const { hour, minute } = parseTime(time);
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-06:00`);
}

function parseTime(value: string) {
  if (value.toLowerCase() === "noon") return { hour: 12, minute: 0 };
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hour: 12, minute: 0 };
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
  if (match[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
  return { hour, minute };
}

function formatUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
