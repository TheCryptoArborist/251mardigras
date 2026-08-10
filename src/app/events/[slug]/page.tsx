import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, MapPinned, ShieldCheck } from "lucide-react";
import {
  buildGoogleCalendarUrl,
  formatCommunityEventDate,
  fullEventLocation,
  getApprovedCommunityEvents,
  getCommunityEventBySlug
} from "@/lib/community-events";

type CommunityEventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getApprovedCommunityEvents().map((event) => ({ slug: event.slug }));
}

export default async function CommunityEventDetailPage({ params }: CommunityEventDetailPageProps) {
  const { slug } = await params;
  const event = getCommunityEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-black text-parade-purple hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Community Mardi Gras Events
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-parade-purple">{event.eventType}</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">{event.title}</h1>
          <p className="mt-3 text-base font-bold text-parade-muted">Hosted by {event.organization}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`/api/events/${event.id}/ics`} className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white hover:bg-parade-purpleDark">
              Add to Calendar <Download className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-parade-line bg-white px-5 py-3 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
              Google Calendar <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            {event.ticketUrl ? (
              <a href={event.ticketUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-parade-line bg-white px-5 py-3 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
                Event / RSVP Link <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-black uppercase tracking-wide text-parade-purple">When</dt>
              <dd className="mt-1 text-base font-bold text-parade-ink">{formatCommunityEventDate(event)}</dd>
            </div>
            <div>
              <dt className="text-xs font-black uppercase tracking-wide text-parade-purple">Where</dt>
              <dd className="mt-1 text-base font-bold text-parade-ink">{event.venueName}</dd>
              <dd className="mt-1 text-sm leading-6 text-parade-muted">{event.venueAddress}, {event.cityStateZip}</dd>
            </div>
            {event.cost ? (
              <div>
                <dt className="text-xs font-black uppercase tracking-wide text-parade-purple">Cost</dt>
                <dd className="mt-1 text-sm leading-6 text-parade-muted">{event.cost}</dd>
              </div>
            ) : null}
            {event.audience ? (
              <div>
                <dt className="text-xs font-black uppercase tracking-wide text-parade-purple">Audience</dt>
                <dd className="mt-1 text-sm leading-6 text-parade-muted">{event.audience}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-[1.5rem] border border-parade-line bg-white p-5 shadow-card">
          <h2 className="text-2xl font-black text-parade-purpleDark">Event details</h2>
          <p className="mt-3 text-sm leading-6 text-parade-muted">{event.description}</p>
          {event.accessibilityNotes ? <DetailBlock title="Accessibility notes" body={event.accessibilityNotes} /> : null}
          {event.parkingNotes ? <DetailBlock title="Parking notes" body={event.parkingNotes} /> : null}
          {event.publicContact ? <DetailBlock title="Public contact" body={event.publicContact} /> : null}
        </section>

        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Community-submitted event.</span>{" "}
              Verify event details with the host organization before attending. This is not the official parade schedule.
            </p>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-parade-line bg-white p-5 text-sm leading-6 text-parade-muted shadow-card">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-parade-purple" aria-hidden="true" />
            <p>{fullEventLocation(event)}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-5 border-t border-parade-line pt-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-parade-purple">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{body}</p>
    </div>
  );
}
