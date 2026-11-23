import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarCheck, ChevronDown, Download, ExternalLink, MapPinned, ShieldCheck } from "lucide-react";
import { EventFlyerImage } from "@/components/EventFlyerImage";
import { CommunityEventShareButton } from "@/components/CommunityEventShareButton";
import {
  buildGoogleCalendarUrl,
  formatCommunityEventDate,
  getApprovedCommunityEvents,
  getCommunityEventBySlug,
  hasCommunityEventEnded
} from "@/lib/community-events";

// Refresh the archived/upcoming state automatically after the event ends.
export const revalidate = 300;

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
  const hasEnded = hasCommunityEventEnded(event);
  const hasArtwork = Boolean(event.flyerUrl || event.eventArtworkUrl);
  const ticketUrl = hasEnded ? undefined : event.ticketUrl;
  const primaryActionClass = "inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border px-3 py-2 text-center text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright";

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

          {hasEnded ? (
            <div className="mt-6 rounded-2xl border border-parade-gold/50 bg-parade-goldSoft p-4 text-parade-purpleDark sm:p-5">
              <div className="flex items-start gap-3">
                <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-base font-black">This event has ended</p>
                  <p className="mt-1 text-sm leading-6">This page is saved for reference. Find the next parties, fundraisers, and community events on our calendar.</p>
                  <Link href="/events" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white hover:bg-parade-purpleDark">
                    Browse upcoming events <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-5">
            <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-goldBright">
              {event.eventType}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">{event.title}</h1>
            <div className="mt-3 flex items-center gap-3">
              <OrganizationLogo event={event} />
              <p className="text-base font-bold text-purple-100">Hosted by {event.organization}</p>
            </div>

            <dl className="mt-5 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-3 border-y border-white/20 py-4 text-sm sm:gap-x-8">
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-xs font-black uppercase tracking-wide text-parade-goldBright">When</dt>
                <dd className="mt-1 font-bold">{formatCommunityEventDate(event)}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Where</dt>
                <dd className="mt-1 font-bold">{event.locationLabel ?? event.venueName}</dd>
                {locationDetails ? <dd className="text-purple-100">{locationDetails}</dd> : null}
              </div>
              {event.cost ? (
                <div>
                  <dt className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Cost</dt>
                  <dd className="mt-1 text-purple-100">{event.cost}</dd>
                </div>
              ) : null}
              {event.audience ? (
                <div>
                  <dt className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Audience</dt>
                  <dd className="mt-1 text-purple-100">{event.audience}</dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-purple-100 sm:text-base">{event.description}</p>

            {ticketUrl || event.mapUrl ? (
              <div className={`mt-5 grid max-w-md gap-2 ${ticketUrl && event.mapUrl ? "grid-cols-2" : "justify-start"}`}>
                {ticketUrl ? (
                  <a href={ticketUrl} target="_blank" rel="noreferrer" className={`${primaryActionClass} border-parade-gold bg-parade-gold text-parade-purpleDark hover:bg-parade-goldBright`}>
                    {event.ticketLabel ?? "Event / RSVP Link"} <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                ) : null}
                {event.mapUrl ? (
                  <a href={event.mapUrl} target="_blank" rel="noreferrer" className={`${primaryActionClass} border-white/25 bg-white/10 text-white hover:bg-white/20`}>
                    <MapPinned className="h-4 w-4 shrink-0" aria-hidden="true" /> Directions
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="mt-2 flex flex-wrap items-start gap-2">
              <CommunityEventShareButton event={event} variant="dark" label="Share" />
              {!hasEnded ? (
                <details className="group relative">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-white/25 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright [&::-webkit-details-marker]:hidden">
                    Add to Calendar <ChevronDown className="h-4 w-4 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ul className="mt-2 rounded-xl border border-white/25 bg-parade-purpleDeep p-1 text-sm font-bold">
                    <li>
                      <a href={`/api/events/${event.id}/ics`} className="flex min-h-11 items-center gap-2 rounded-lg px-3 hover:bg-white/15">
                        <Download className="h-4 w-4 shrink-0" aria-hidden="true" /> Download .ics
                      </a>
                    </li>
                    <li>
                      <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 rounded-lg px-3 hover:bg-white/15">
                        Google Calendar <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </details>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {hasArtwork ? <EventFlyerSection event={event} /> : null}

        {event.slug === "king-cake-off-2027" || event.accessibilityNotes || event.parkingNotes || event.publicContact ? (
          <section className="rounded-[1.5rem] border border-parade-line bg-white p-5 shadow-card">
            <h2 className="text-2xl font-black text-parade-purpleDark">More event details</h2>
            {event.slug === "king-cake-off-2027" ? (
              <Link href="/kingcakeoff" className="mt-4 inline-flex items-center rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white hover:bg-parade-purpleDark">View &amp; share the King Cake-Off countdown →</Link>
            ) : null}
            {event.accessibilityNotes ? <DetailBlock title="Accessibility notes" body={event.accessibilityNotes} /> : null}
            {event.parkingNotes ? <DetailBlock title="Parking notes" body={event.parkingNotes} /> : null}
            {event.publicContact ? <DetailBlock title="Public contact" body={event.publicContact} /> : null}
          </section>
        ) : null}

        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Community-submitted event.</span>{" "}
              Verify event details with the host organization before attending. This is not the official parade schedule.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function EventFlyerSection({ event }: { event: ApprovedEvent }) {
  const isFullFlyer = Boolean(event.flyerUrl);
  const artwork = event.flyerUrl ?? event.eventArtworkUrl!;
  return (
    <section id={isFullFlyer ? "event-flyer" : "event-artwork"} className="scroll-mt-24 rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-4 text-white shadow-card sm:p-5">
      <h2 className="mb-3 text-lg font-black">{isFullFlyer ? "Event flyer" : "Event artwork"}</h2>
      <a href={artwork} target="_blank" rel="noreferrer" aria-label={isFullFlyer ? "Open full-size event flyer" : "Open full-size event artwork"} className="block max-w-md rounded-[1.25rem] border border-parade-gold/35 bg-white p-2 shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright">
        <EventFlyerImage
          src={artwork}
          alt={`${event.title} ${isFullFlyer ? "flyer" : "event artwork"}`}
          fullSize
          dimensions={event.flyerDimensions ?? (!isFullFlyer ? { width: 1, height: 1 } : undefined)}
          sizes="(min-width: 480px) 448px, 100vw"
          className="object-contain"
        />
        <span className="flex items-center justify-center gap-2 py-2 text-sm font-bold text-parade-purpleDark">
          View full size <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </span>
      </a>
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
