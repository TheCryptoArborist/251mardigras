import type { Metadata } from "next";
import { notFound } from "next/navigation";
import paradeSchedule2027 from "../../../../data/parade-schedule-2027.json";
import { ScheduleRouteViewer, type ParadeSchedule } from "@/components/ScheduleRouteViewer";
import { absoluteUrl, createPageMetadata, jsonLdScript } from "@/lib/seo";
import { COUNTDOWN_CARD_SIZES, buildCountdownCardUrl, createParadeShareEvent, formatCountdownRemaining, parseCountdownSnapshot } from "@/lib/countdown-share";
import { getParadeShareEvent } from "@/lib/parade-share";

const schedule = paradeSchedule2027 as ParadeSchedule;
const parades = schedule.days.flatMap((day) => day.parades.map((parade) => ({ parade, day })));

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return parades.map(({ parade }) => ({ paradeId: parade.id }));
}

type ParadePageProps = {
  params: Promise<{ paradeId: string }>;
  searchParams: Promise<{ at?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: ParadePageProps): Promise<Metadata> {
  const [{ paradeId }, query] = await Promise.all([params, searchParams]);
  const event = getParadeShareEvent(paradeId);

  if (!event) {
    return createPageMetadata({
      title: "Mobile Mardi Gras Parade",
      description: "Mobile Mardi Gras parade schedule details.",
      path: `/schedule/${paradeId}`,
      noIndex: true
    });
  }

  const snapshot = parseCountdownSnapshot(typeof query.at === "string" ? query.at : undefined, Date.now(), event);
  const remaining = formatCountdownRemaining(snapshot);
  const description = `${event.name} — ${event.weekdayDateLabel} • ${event.timeLabel} • ${event.route}. ${remaining}${!snapshot.expired && snapshot.hasScheduledTime ? " until the scheduled start" : ""}. View this parade’s schedule and route map on MG251. As of ${snapshot.dateLabel}.`;
  const imageAlt = `${event.name} — ${event.fullDateLabel} — ${event.route} — ${remaining}`;
  const imageUrl = absoluteUrl(buildCountdownCardUrl(snapshot, "preview"));
  const metadata = createPageMetadata({
    title: `${event.name} — ${event.dateLabel}`,
    description,
    path: `/schedule/${event.paradeId}`,
    image: imageUrl,
    imageAlt
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      url: absoluteUrl(`/schedule/${event.paradeId}?at=${snapshot.at}`),
      images: [{ url: imageUrl, ...COUNTDOWN_CARD_SIZES.preview, type: "image/png", alt: imageAlt }]
    }
  };
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
  const event = createParadeShareEvent(parade, { date });

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: parade.name,
    startDate: event.startsAt === null ? event.date : new Date(event.startsAt).toISOString(),
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
