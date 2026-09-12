import type { Metadata } from "next";
import { notFound } from "next/navigation";
import paradeSchedule2027 from "../../../../data/parade-schedule-2027.json";
import { ScheduleRouteViewer, type ParadeSchedule } from "@/components/ScheduleRouteViewer";
import { absoluteUrl, createPageMetadata, jsonLdScript } from "@/lib/seo";

const schedule = paradeSchedule2027 as ParadeSchedule;
const parades = schedule.days.flatMap((day) => day.parades.map((parade) => ({ parade, day })));

export function generateStaticParams() {
  return parades.map(({ parade }) => ({ paradeId: parade.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ paradeId: string }> }): Promise<Metadata> {
  const { paradeId } = await params;
  const match = parades.find(({ parade }) => parade.id === paradeId);

  if (!match) {
    return createPageMetadata({
      title: "Mobile Mardi Gras Parade",
      description: "Mobile Mardi Gras parade schedule details.",
      path: `/schedule/${paradeId}`,
      noIndex: true
    });
  }

  return createPageMetadata({
    title: `${match.parade.name} — ${match.day.label}`,
    description: `${match.parade.name} rolls ${match.day.label}, 2027 at ${match.parade.time} on ${match.parade.route}. View the schedule and route map on MG251.`,
    path: `/schedule/${match.parade.id}`
  });
}

export default async function ParadeScheduleDetailPage({ params }: { params: Promise<{ paradeId: string }> }) {
  const { paradeId } = await params;
  const match = parades.find(({ parade }) => parade.id === paradeId);

  if (!match) {
    notFound();
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(paradeJsonLd(match.parade, match.day.date))} />
      <ScheduleRouteViewer schedule={schedule} focusParadeId={match.parade.id} />
    </>
  );
}

function paradeJsonLd(parade: (typeof parades)[number]["parade"], date: string) {
  const start = getParadeStart(date, parade.time);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: parade.name,
    startDate: start.toISOString(),
    endDate: new Date(start.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absoluteUrl(`/schedule/${parade.id}`),
    location: {
      "@type": "Place",
      name: `${parade.route}, Mobile Mardi Gras`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mobile",
        addressRegion: "AL",
        addressCountry: "US"
      }
    }
  };
}

function getParadeStart(date: string, time: string) {
  if (time.toLowerCase() === "noon") return new Date(`${date}T12:00:00-06:00`);
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return new Date(`${date}T12:00:00-06:00`);
  let hour = Number(match[1]);
  if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
  if (match[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${match[2]}:00-06:00`);
}
