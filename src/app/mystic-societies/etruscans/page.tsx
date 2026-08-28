/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, ExternalLink, Mail, ShieldCheck } from "lucide-react";
import { EventCountdown } from "@/components/EventCountdown";
import {
  formatCommunityEventDate,
  fullEventLocation,
  getApprovedCommunityEvents,
  type CommunityEvent
} from "@/lib/community-events";

const officialWebsiteUrl = "https://theetruscans.org";
const officialEmail = "etruscanswebmasters@gmail.com";
const officialEmailComposeUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=etruscanswebmasters%40gmail.com&su=Question%20about%20The%20Etruscans";
const etruscansLogoUrl = "/images/mystic-societies/etruscans-logo.svg";
const etruscansBallDateTime = "2027-01-09T20:00:00-06:00";
const etruscansBallDateLabel = "Saturday, January 9, 2027 • 8:00 PM CT";
const kingQueenPhotoUrl = "https://theetruscans.org/wp-content/uploads/2026/03/IMG_2476-1-576x1024.jpeg";
const emblemCouplePhotoUrl = "https://theetruscans.org/wp-content/uploads/2026/03/Emblem.jpg";

export const metadata: Metadata = {
  title: "The Etruscans Mystic Society | Mobile Mardi Gras",
  description:
    "Learn about The Etruscans Mystic Society, a Mobile Mardi Gras husband-and-wife non-parading organization organized in 1950, with a countdown to the 76th Etruscans Mystic Society Ball.",
  alternates: {
    canonical: "/mystic-societies/etruscans"
  }
};

const ballPhotos = [
  {
    label: "75th King and Queen",
    src: kingQueenPhotoUrl,
    alt: "75th Etruscans Mystic Society King and Queen"
  },
  {
    label: "75th Emblem Couple",
    src: emblemCouplePhotoUrl,
    alt: "75th Etruscans Mystic Society Emblem Couple"
  }
];

const profileFacts = ["Organized 1950", "Husband-and-wife non-parading organization", "76th Ball • January 9, 2027"];

export default function EtruscansMysticSocietyPage() {
  const etruscansEvents = getApprovedCommunityEvents().filter((event) => {
    const searchableText = `${event.organization} ${event.title}`.toLowerCase();
    return searchableText.includes("etruscan");
  });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
            Mystic society spotlight
          </p>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.4rem] border border-parade-gold/45 bg-white p-2 shadow-glow ring-1 ring-white/20">
                  <Image
                    src={etruscansLogoUrl}
                    alt="The Etruscans Mystic Society logo"
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                    priority
                    unoptimized
                  />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Organized 1950</p>
                  <p className="mt-1 text-sm font-bold text-purple-100">Mobile Mardi Gras mystic society</p>
                </div>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">The Etruscans Mystic Society</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
                Organized in 1950, The Etruscans Mystic Society is a Mobile Mardi Gras husband-and-wife non-parading organization known for its annual mystic ball, year-round fellowship, and community fundraisers. The 76th Etruscans Mystic Society Ball is scheduled for January 9, 2027 at 8:00 PM CT.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {profileFacts.map((fact) => (
                  <span key={fact} className="rounded-full border border-parade-gold/35 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-purple-50">
                    {fact}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={officialWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
                >
                  Visit Official Website <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={officialEmailComposeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Email The Etruscans <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <EventCountdown
          eyebrow="Etruscans ball countdown"
          title="Countdown to the 76th Etruscans Mystic Society Ball"
          eventName="The Etruscans Mystic Society"
          targetDateTime={etruscansBallDateTime}
          dateLabel={etruscansBallDateLabel}
          locationLabel="Mobile Mardi Gras mystic ball"
          logoSrc={etruscansLogoUrl}
          logoAlt="The Etruscans Mystic Society logo"
        />

        <section className="rounded-[1.5rem] border border-parade-gold/35 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">75th Ball Highlights</p>
              <h2 className="mt-1 text-3xl font-black text-parade-purpleDark">Into The Wild</h2>
            </div>
            <p className="text-sm font-semibold text-parade-muted">Photos from the Etruscans official website.</p>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {ballPhotos.map((photo) => (
              <BallPhotoCard key={photo.label} photo={photo} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.5rem] border border-parade-line bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-goldSoft text-parade-purple ring-1 ring-parade-gold/40">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Official contact</p>
                <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Connect with The Etruscans</h2>
              </div>
            </div>
            <dl className="mt-5 space-y-4 text-sm leading-6 text-parade-muted">
              <div>
                <dt className="font-black uppercase text-parade-purple">Email</dt>
                <dd className="mt-1">
                  <a
                    href={officialEmailComposeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-parade-purple underline decoration-parade-gold/60 underline-offset-4 hover:text-parade-purpleDark"
                  >
                    {officialEmail}
                  </a>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-parade-muted">
                    Opens a Gmail compose window. You can also copy and paste the address above into any email app.
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-black uppercase text-parade-purple">Mailing address</dt>
                <dd className="mt-1">Etruscans P.O. Box 16312, Mobile, AL 36616</dd>
              </div>
              <div>
                <dt className="font-black uppercase text-parade-purple">Official website</dt>
                <dd className="mt-1">
                  <a href={officialWebsiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-parade-purple underline decoration-parade-gold/60 underline-offset-4 hover:text-parade-purpleDark">
                    theetruscans.org <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </dl>
          </article>

          <EtruscansEventsPanel events={etruscansEvents} />
        </section>

        <section className="rounded-[1.25rem] border border-amber-200 bg-parade-goldSoft p-4 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Organization profile note.</span>{" "}
              This MG251 page summarizes public information from The Etruscans Mystic Society&apos;s official website. Verify ball details, membership information, and event updates directly with the society before making plans.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

type BallPhoto = (typeof ballPhotos)[number];

function BallPhotoCard({ photo }: { photo: BallPhoto }) {
  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-parade-gold/35 bg-parade-purpleDeep shadow-card">
      <div className="aspect-[3/4] w-full overflow-hidden bg-parade-purpleDeep">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="border-t border-parade-gold/35 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">75th Annual Ball</p>
        <h3 className="mt-1 text-xl font-black text-parade-purpleDark">{photo.label}</h3>
      </div>
    </article>
  );
}

function EtruscansEventsPanel({ events }: { events: CommunityEvent[] }) {
  const displayedEvents = events.slice(0, 4);

  return (
    <article className="rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
          <CalendarDays className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">MG251 calendar</p>
          <h2 className="mt-1 text-2xl font-black text-white">Etruscans community events</h2>
        </div>
      </div>

      {displayedEvents.length > 0 ? (
        <div className="mt-5 space-y-3">
          {displayedEvents.map((event) => (
            <EtruscansEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-purple-100">
          No Etruscans community event listings are currently posted on MG251. Check the official society website for the latest updates.
        </p>
      )}

      <Link
        href="/events"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
      >
        Open Community Events <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function EtruscansEventCard({ event }: { event: CommunityEvent }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block rounded-2xl border border-parade-gold/30 bg-white/10 px-4 py-3 text-purple-50 transition hover:-translate-y-0.5 hover:bg-white/15"
    >
      <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-parade-goldBright">{event.eventType}</p>
      <h3 className="mt-1 text-base font-black text-white group-hover:text-parade-goldBright">{event.title}</h3>
      <p className="mt-1 text-sm font-semibold leading-6 text-purple-100">{formatCommunityEventDate(event)}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-purple-200">{fullEventLocation(event)}</p>
    </Link>
  );
}