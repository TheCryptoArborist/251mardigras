import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, ExternalLink, Landmark, Mail, MapPinned, PartyPopper, ShieldCheck } from "lucide-react";
import { EventCountdown } from "@/components/EventCountdown";
import {
  formatCommunityEventDate,
  fullEventLocation,
  getApprovedCommunityEvents,
  type CommunityEvent
} from "@/lib/community-events";

const officialWebsiteUrl = "https://theetruscans.org";
const officialEmail = "etruscanswebmasters@gmail.com";
const etruscansLogoUrl = "/images/mystic-societies/etruscans-logo.svg";
const etruscansBallDateTime = "2027-01-09T20:00:00-06:00";
const etruscansBallDateLabel = "Saturday, January 9, 2027 • 8:00 PM CT";
const kingQueenPhotoUrl = "data:image/webp;base64,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";
const emblemCouplePhotoUrl = "data:image/webp;base64,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";

export const metadata: Metadata = {
  title: "The Etruscans Mystic Society | Mobile Mardi Gras",
  description:
    "Learn about The Etruscans Mystic Society, a Mobile Mardi Gras husband-and-wife non-parading organization organized in 1950, with a countdown to the 76th Etruscans Mystic Society Ball.",
  alternates: {
    canonical: "/mystic-societies/etruscans"
  }
};

const profileHighlights = [
  {
    label: "Organized",
    value: "1950",
    description: "A long-running Mobile Mardi Gras mystic society with a focus on Carnival fellowship and ball tradition."
  },
  {
    label: "Society type",
    value: "Husband-and-wife non-parading organization",
    description: "The society describes itself as the oldest husband-and-wife, non-parading organization."
  },
  {
    label: "76th ball",
    value: "January 9, 2027",
    description: "The 76th Etruscans Mystic Society Ball is scheduled for 8:00 PM CT."
  }
];

const ballHighlights = [
  {
    label: "75th King and Queen",
    imageUrl: kingQueenPhotoUrl,
    alt: "75th Etruscans Mystic Society Ball King and Queen"
  },
  {
    label: "75th Emblem Couple",
    imageUrl: emblemCouplePhotoUrl,
    alt: "75th Etruscans Mystic Society Ball Emblem Couple"
  }
];

const annualActivities = ["Road Rally", "Poker Crawl", "BINGO", "Summer Party", "Football Pool", "Christmas Party", "Monthly meetings"];

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
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <div>
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
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                The Etruscans Mystic Society
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
                Organized in 1950, The Etruscans Mystic Society is a Mobile Mardi Gras husband-and-wife non-parading organization known for its annual mystic ball, year-round fellowship, and community fundraisers. The 76th Etruscans Mystic Society Ball is scheduled for January 9, 2027 at 8:00 PM CT.
              </p>
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
                  href={`mailto:${officialEmail}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Email The Etruscans <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 shadow-glow backdrop-blur">
              <div className="mb-5 flex items-center gap-4 rounded-[1.25rem] border border-white/15 bg-white/10 p-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-glow">
                  <Image
                    src={etruscansLogoUrl}
                    alt="The Etruscans Mystic Society logo"
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">The Etruscans</p>
                  <p className="mt-1 text-sm font-semibold text-purple-100">Mystic Society</p>
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Quick profile</p>
              <dl className="mt-4 space-y-4 text-sm leading-6">
                <div>
                  <dt className="font-black uppercase text-parade-goldBright">Founded</dt>
                  <dd className="mt-1 text-purple-100">1950</dd>
                </div>
                <div>
                  <dt className="font-black uppercase text-parade-goldBright">Type</dt>
                  <dd className="mt-1 text-purple-100">Husband-and-wife non-parading Mardi Gras organization</dd>
                </div>
                <div>
                  <dt className="font-black uppercase text-parade-goldBright">76th ball</dt>
                  <dd className="mt-1 text-purple-100">January 9, 2027 • 8:00 PM CT</dd>
                </div>
                <div>
                  <dt className="font-black uppercase text-parade-goldBright">Official contact</dt>
                  <dd className="mt-1 text-purple-100">{officialEmail}</dd>
                </div>
              </dl>
            </aside>
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
        />

        <section className="rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">75th ball highlights</p>
              <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Etruscans Mystic Society Ball photos</h2>
            </div>
            <p className="text-sm font-semibold text-parade-muted">75th Etruscans Mystic Society Ball</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {ballHighlights.map((item) => (
              <article key={item.label} className="overflow-hidden rounded-[1.25rem] border border-parade-gold/35 bg-white shadow-civic">
                <div className="relative aspect-[3/4] overflow-hidden bg-parade-purpleDark">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 480px, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <p className="text-lg font-black text-parade-purpleDark">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-parade-muted">75th Etruscans Mystic Society Ball</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {profileHighlights.map((item) => (
            <article key={item.label} className="rounded-[1.35rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
              <p className="text-xs font-black uppercase tracking-wide text-parade-purple">{item.label}</p>
              <h2 className="mt-2 text-2xl font-black text-parade-purpleDark">{item.value}</h2>
              <p className="mt-3 text-sm leading-6 text-parade-muted">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
          <article className="rounded-[1.5rem] border border-parade-line bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
                <Landmark className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">About the society</p>
                <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">A Mobile Mardi Gras ball tradition</h2>
              </div>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-parade-muted">
              <p>
                The Etruscans Mystic Society describes itself as the oldest husband-and-wife, non-parading organization. Its public information emphasizes the society&apos;s annual Mardi Gras Mystic Ball and its role in Mobile&apos;s Carnival culture.
              </p>
              <p>
                The 76th Etruscans Mystic Society Ball is scheduled for Saturday, January 9, 2027 at 8:00 PM CT. The group also maintains a year-round social calendar centered on fellowship, activities, and fundraisers.
              </p>
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
                <PartyPopper className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Events and FUNraisers</p>
                <h2 className="mt-1 text-2xl font-black text-white">Annual activities</h2>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {annualActivities.map((activity) => (
                <span key={activity} className="rounded-full border border-parade-gold/35 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-purple-50">
                  {activity}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-purple-100">
              Event calendars can vary from year to year, so current event and membership information should be verified directly with the society.
            </p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.44fr_0.56fr]">
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
                  <a href={`mailto:${officialEmail}`} className="font-bold text-parade-purple underline decoration-parade-gold/60 underline-offset-4 hover:text-parade-purpleDark">
                    {officialEmail}
                  </a>
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

          <article className="rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
                <CalendarDays className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">MG251 event listings</p>
                <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Etruscans events on the community calendar</h2>
              </div>
            </div>

            {etruscansEvents.length > 0 ? (
              <div className="mt-5 space-y-3">
                {etruscansEvents.map((event) => (
                  <EtruscansEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-parade-muted">
                No current Etruscans community event listings are posted on MG251. Check the official society website for the latest details.
              </p>
            )}
          </article>
        </section>

        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Organization profile note.</span>{" "}
              This MG251 page summarizes public information from The Etruscans Mystic Society&apos;s official website and connects visitors to related community event listings. Verify ball details, membership information, and event updates directly with the society before making plans.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function EtruscansEventCard({ event }: { event: CommunityEvent }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block rounded-2xl border border-parade-gold/30 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldSoft hover:shadow-civic"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-parade-purple">{event.eventType}</p>
          <h3 className="mt-1 text-base font-black text-parade-purpleDark">{event.title}</h3>
          <p className="mt-1 text-sm leading-6 text-parade-muted">{formatCommunityEventDate(event)}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-parade-muted">
            <MapPinned className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
            {fullEventLocation(event)}
          </p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-parade-purple transition group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}