import Image from "next/image";
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

type ApprovedEvent = NonNullable<ReturnType<typeof getCommunityEventBySlug>>;

export function generateStaticParams() {
  return getApprovedCommunityEvents().map((event) => ({ slug: event.slug }));
}

export default async function CommunityEventDetailPage({ params }: CommunityEventDetailPageProps) {
  const { slug } = await params;
  const event = getCommunityEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const locationDetails = [event.venueAddress, event.cityStateZip].filter(Boolean).join(", ");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Link href="/events" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Events
          </Link>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-goldBright">
                {event.eventType}
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">{event.title}</h1>
              <div className="mt-4 flex items-center gap-3">
                <OrganizationLogo event={event} />
                <p className="text-base font-bold text-purple-100">Hosted by {event.organization}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`/api/events/${event.id}/ics`} className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:bg-parade-goldBright">
                  Add to Calendar <Download className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">
                  Google Calendar <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                {event.ticketUrl ? (
                  <a href={event.ticketUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">
                    {event.ticketLabel ?? "Event / RSVP Link"} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {event.mapUrl ? (
                  <a href={event.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">
                    Map / Directions <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {event.flyerUrl ? (
                  <a href="#event-flyer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">
                    View Flyer
                  </a>
                ) : null}
              </div>
            </div>

            {event.flyerUrl ? (
              <a href="#event-flyer" className="relative block overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-2 shadow-glow backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-parade-purpleDark">
                  <Image
                    src={event.flyerUrl}
                    alt={`${event.title} flyer preview`}
                    fill
                    sizes="(min-width: 1024px) 360px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="mt-2 block text-center text-xs font-black uppercase tracking-wide text-parade-goldBright">
                  Tap to view full flyer
                </span>
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
              <dd className="mt-1 text-base font-bold text-parade-ink">{event.locationLabel ?? event.venueName}</dd>
              {locationDetails ? <dd className="mt-1 text-sm leading-6 text-parade-muted">{locationDetails}</dd> : null}
              {event.mapUrl ? (
                <a href={event.mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-xs font-black text-white hover:bg-parade-purpleDark">
                  Open map / directions <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
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

        {event.flyerUrl ? <EventFlyerSection event={event} /> : null}

        <section className="rounded-[1.5rem] border border-parade-line bg-white p-5 shadow-card">
          <h2 className="text-2xl font-black text-parade-purpleDark">Event details</h2>
          <p className="mt-3 text-sm leading-6 text-parade-muted">{event.description}</p>
          {event.accessibilityNotes ? <DetailBlock title="Accessibility notes" body={event.accessibilityNotes} /> : null}
          {event.parkingNotes ? <DetailBlock title="Parking notes" body={event.parkingNotes} /> : null}
          {event.publicContact ? <DetailBlock title="Public contact" body={event.publicContact} /> : null}
          {event.mapUrl ? <DetailLink title="Map / directions" href={event.mapUrl} label="Open submitted map link" /> : null}
          {event.flyerUrl ? <DetailAnchor title="Event flyer" href="#event-flyer" label="View full flyer on this page" /> : null}
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

function EventFlyerSection({ event }: { event: ApprovedEvent }) {
  return (
    <section id="event-flyer" className="scroll-mt-24 rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-4 text-white shadow-card sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Event flyer</p>
          <h2 className="mt-1 text-2xl font-black text-white">{event.title}</h2>
        </div>
        <p className="text-xs font-bold text-purple-100">Displayed on this page — no download required.</p>
      </div>
      <div className="overflow-hidden rounded-[1.25rem] border border-parade-gold/35 bg-white p-2 shadow-glow">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] bg-white sm:aspect-[3/4]">
          <Image
            src={event.flyerUrl!}
            alt={`${event.title} flyer`}
            fill
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function OrganizationLogo({ event }: { event: ApprovedEvent }) {
  if (!event.organizationLogoUrl) {
    return null;
  }

  return (
    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-parade-gold/40 bg-white shadow-glow">
      <Image src={event.organizationLogoUrl} alt={`${event.organization} logo`} fill sizes="56px" className="object-contain p-1.5" />
    </span>
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

function DetailLink({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="mt-5 border-t border-parade-line pt-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-parade-purple">{title}</h3>
      <a href={href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white hover:bg-parade-purpleDark">
        {label} <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

function DetailAnchor({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="mt-5 border-t border-parade-line pt-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-parade-purple">{title}</h3>
      <a href={href} className="mt-2 inline-flex items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white hover:bg-parade-purpleDark">
        {label}
      </a>
    </div>
  );
}