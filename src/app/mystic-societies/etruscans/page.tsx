import Link from "next/link";
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
const etruscansBallDateTime = "2027-01-09T20:00:00-06:00";
const etruscansBallDateLabel = "Saturday, January 9, 2027 • 8:00 PM CT";

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
