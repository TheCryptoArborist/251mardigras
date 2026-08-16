import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Download, ExternalLink, PlusCircle, ShieldCheck } from "lucide-react";
import { CommunityEventsMonthCalendar } from "@/components/CommunityEventsMonthCalendar";
import {
  buildGoogleCalendarUrl,
  formatCommunityEventDate,
  fullEventLocation,
  getApprovedCommunityEvents,
  type CommunityEvent
} from "@/lib/community-events";

export const dynamic = "force-dynamic";

export default function CommunityEventsPage() {
  const events = getApprovedCommunityEvents();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-line bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-parade-goldBright shadow-glow">
            Community-submitted calendar
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            Community Mardi Gras Events
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
            Find Mardi Gras balls, fundraisers, watch parties, organization events, and Carnival-related happenings submitted by local groups.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/submit-event" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
              Submit an Event <PlusCircle className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="/api/events/calendar.ics" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15">
              Subscribe / Download Calendar <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Community-submitted Mardi Gras-related events.</span>{" "}
              Verify event details with the host organization before attending. This is not the official parade schedule.
            </p>
          </div>
        </section>

        {events.length > 0 ? (
          <>
            <CommunityEventsMonthCalendar events={events} />

            <section id="community-event-listings">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-parade-purpleDark">Community event listings</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
                  Browse the posted events and open any listing for its flyer, venue, map, RSVP link, public contact, and add-to-calendar options.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-[1.5rem] border border-dashed border-parade-line bg-white p-6 text-center shadow-card">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-parade-goldSoft text-parade-purple ring-1 ring-parade-gold/40">
              <CalendarDays className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-parade-purpleDark">No community events are posted yet</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-parade-muted">
              Organization-submitted events will appear here after review. If your group has a Mardi Gras or Carnival-related event, submit it for consideration.
            </p>
            <Link href="/submit-event" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-parade-purpleDark">
              Submit a Community Event <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: CommunityEvent }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist shadow-card">
      <EventCardMedia event={event} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <OrganizationLogo event={event} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wide text-parade-purple">{event.eventType}</p>
            <h2 className="mt-2 text-2xl font-black text-parade-purpleDark">{event.title}</h2>
            <p className="mt-1 text-sm font-bold text-parade-muted">Hosted by {event.organization}</p>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-sm leading-6 text-parade-muted">
          <div>
            <dt className="font-black uppercase text-parade-purple">When</dt>
            <dd>{formatCommunityEventDate(event)}</dd>
          </div>
          <div>
            <dt className="font-black uppercase text-parade-purple">Where</dt>
            <dd>{fullEventLocation(event)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-parade-muted">{event.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white hover:bg-parade-purpleDark">
            Event details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a href={`/api/events/${event.id}/ics`} className="inline-flex items-center gap-2 rounded-full border border-parade-line bg-white px-4 py-2 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
            Add to Calendar <Download className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-parade-line bg-white px-4 py-2 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
            Google Calendar <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          {event.mapUrl ? (
            <a href={event.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-parade-line bg-white px-4 py-2 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
              Map / Directions <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
          {event.flyerUrl ? (
            <Link href={`/events/${event.slug}#event-flyer`} className="inline-flex items-center gap-2 rounded-full border border-parade-line bg-white px-4 py-2 text-sm font-black text-parade-purple hover:bg-parade-purpleSoft">
              View Flyer <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EventCardMedia({ event }: { event: CommunityEvent }) {
  if (!event.flyerUrl) {
    return null;
  }

  return (
    <Link href={`/events/${event.slug}#event-flyer`} className="relative block h-56 overflow-hidden border-b border-parade-line bg-parade-purpleDark sm:h-64">
      <Image
        src={event.flyerUrl}
        alt={`${event.title} flyer`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition duration-300 hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-parade-purpleDeep/55 via-transparent to-transparent" aria-hidden="true" />
      <span className="absolute bottom-3 left-3 rounded-full bg-parade-gold px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purpleDark shadow-glow">
        Event Flyer
      </span>
    </Link>
  );
}

function OrganizationLogo({ event }: { event: CommunityEvent }) {
  if (!event.organizationLogoUrl) {
    return null;
  }

  return (
    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-parade-gold/40 bg-white shadow-sm">
      <Image src={event.organizationLogoUrl} alt={`${event.organization} logo`} fill sizes="56px" className="object-contain p-1.5" />
    </span>
  );
}