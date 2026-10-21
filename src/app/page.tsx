import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Archive,
  ArrowRight,
  CalendarDays,
  Car,
  CloudSun,
  ExternalLink,
  HeartHandshake,
  Landmark,
  MapPinned,
  PlayCircle,
  PlusCircle,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { FeaturedVideo } from "@/components/FeaturedVideo";
import { getUpcomingCommunityEvents, type CommunityEvent } from "@/lib/community-events";
import { CountdownTimer } from "@/components/CountdownTimer";
import { VisitorCounter } from "@/components/VisitorCounter";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import { MG251_SOCIAL_LINKS } from "@/lib/social-links";
import { BUY_ME_COFFEE_URL, PATREON_SUPPORT_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";
import paradeSchedule2027 from "../../data/parade-schedule-2027.json";

export const dynamic = "force-dynamic";

const HOMEPAGE_VIDEO_SRC = "/videos/dragon-home-screen-bg.mp4";
const HOMEPAGE_VIDEO_POSTER = "/videos/dragon-home-screen-poster.jpg";
const FACEBOOK_SUPPORTER_URL = "https://www.facebook.com/mardigrasmobileal/support/?surface=page_top_cta_button&entrypoint_surface=page_top_cta_button";

type HomepageSchedule = {
  mardiGrasDay: string;
};

const homepageSchedule = paradeSchedule2027 as HomepageSchedule;

type VisitorLink = {
  icon: ReactNode;
  title: string;
  href: string;
};

export default async function HomePage() {
  const upcomingEvents = getUpcomingCommunityEvents().slice(0, 3);
  const visitorLinks: VisitorLink[] = [
    {
      icon: <CalendarDays className="h-5 w-5" aria-hidden="true" />,
      title: "Parade Schedule",
      href: "/schedule"
    },
    {
      icon: <MapPinned className="h-5 w-5" aria-hidden="true" />,
      title: "Route Maps",
      href: "/schedule#all-route-maps"
    },
    {
      icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Live",
      href: "/watch"
    },
    {
      icon: <Archive className="h-5 w-5" aria-hidden="true" />,
      title: "Parade Replays",
      href: "/replays"
    },
    {
      icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
      title: "Food & Drink",
      href: "/food-drink"
    },
    {
      icon: <Car className="h-5 w-5" aria-hidden="true" />,
      title: "Parking",
      href: "/parking-access"
    },
    {
      icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
      title: "Weather",
      href: "/weather"
    },
    {
      icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
      title: "Mardi Gras Gear",
      href: "/mardi-gras-gear"
    }
  ];
  return (
    <div className="bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
      <section className="relative isolate overflow-hidden border-b border-parade-line bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-70 motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HOMEPAGE_VIDEO_POSTER}
          aria-hidden="true"
        >
          <source src={HOMEPAGE_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-parade-purpleDeep/90 via-parade-purpleDark/78 to-parade-purple/66" aria-hidden="true" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,201,40,0.24),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,rgba(23,4,47,0.10),rgba(23,4,47,0.46))]" aria-hidden="true" />
        <div className="absolute left-[-6rem] top-[-8rem] z-0 h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] z-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-7 px-4 py-6 sm:px-6 sm:py-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:px-8 lg:py-12">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-parade-goldBright">
              Mobile, Alabama • 2027
            </p>
            <h1 className="mt-3 text-[2rem] font-black leading-[1.08] tracking-tight text-white drop-shadow-lg sm:text-5xl xl:text-6xl">
              <span className="block">Your guide to</span>
              <span className="block">Mobile Mardi Gras</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-purple-100 sm:text-base">
              Find parade schedules, route maps, local events, and live coverage.
            </p>
            <nav aria-label="Start planning" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Link href="/schedule" className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-parade-goldBright px-4 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:bg-parade-goldSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:col-span-1">
                <CalendarDays className="h-4 w-4" aria-hidden="true" /> Parade Schedule
              </Link>
              <Link href="/schedule#all-route-maps" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-parade-gold/50 bg-white/10 px-3 py-3 text-sm font-black text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">
                <MapPinned className="h-4 w-4" aria-hidden="true" /> Route Maps
              </Link>
              <Link href="/watch" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-3 text-sm font-black text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">
                <PlayCircle className="h-4 w-4" aria-hidden="true" /> Watch Live
              </Link>
            </nav>
            <SocialLinksStrip />
            <CountdownTimer mardiGrasDay={homepageSchedule.mardiGrasDay} />
          </div>
          <UpcomingCommunityEvents events={upcomingEvents} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-7 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="text-xl font-bold leading-tight text-white sm:text-2xl">
            Explore Mobile Mardi Gras
          </h2>
          <nav aria-labelledby="explore-heading" className="mt-4 overflow-hidden rounded-2xl border border-parade-gold/25">
            <ul className="grid grid-cols-2 gap-px bg-parade-gold/20 lg:grid-cols-4">
              {visitorLinks.map((link) => (
                <li key={link.href} className="min-w-0 bg-parade-purpleDeep">
                  <VisitorQuickLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <div className="grid gap-5 rounded-[1.5rem] bg-gradient-to-br from-parade-purpleDeep to-parade-purple p-4 text-white shadow-civic sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
          <HomepageVideoSpotlight />
          <div className="space-y-4">
            <div className="rounded-2xl border border-parade-gold/30 bg-white/10 p-4">
              <h2 className="text-lg font-black">Have a Mardi Gras event to share?</h2>
              <p className="mt-1 text-sm leading-6 text-purple-100">Send us your ball, fundraiser, social, or watch party for calendar review.</p>
              <Link href="/submit-event" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-parade-goldBright px-5 py-2 text-sm font-black text-parade-purpleDark hover:bg-parade-goldSoft">
                <PlusCircle className="h-4 w-4" aria-hidden="true" /> Submit an event
              </Link>
            </div>
          </div>
        </div>
        <HomepageHistoryCallout />
        <SupportSection />

        <VisitorCounter />
      </div>
    </div>
  );
}

function SocialLinksStrip() {
  return (
    <section aria-labelledby="homepage-follow-heading" className="mt-5 sm:mt-6">
      <h2 id="homepage-follow-heading" className="text-sm font-black text-parade-goldBright sm:text-base">
        Follow Mobile Mardi Gras
      </h2>
      <p className="mt-1 text-xs leading-5 text-purple-100">
        Parade videos, live coverage, and updates on your favorite platform.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {MG251_SOCIAL_LINKS.filter((link) => link.featured).map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-14 items-center justify-center gap-2.5 rounded-xl border border-parade-gold/60 bg-parade-gold/15 px-3 py-2.5 text-parade-goldBright transition hover:border-parade-goldBright hover:bg-parade-goldBright hover:text-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright"
            aria-label={`${link.label} ${link.action} (opens in a new tab)`}
          >
            <span className="shrink-0"><SocialBrandIcon platform={link.label} /></span>
            <span className="text-left">
              <span className="block text-sm font-black">{link.label}</span>
              <span className="block text-xs font-semibold text-purple-100 group-hover:text-parade-purpleDark">{link.action}</span>
            </span>
          </a>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {MG251_SOCIAL_LINKS.filter((link) => !link.featured).map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-parade-gold/35 bg-parade-purpleDeep/70 px-2.5 py-2 text-xs font-bold text-white transition hover:border-parade-goldBright hover:bg-parade-goldBright hover:text-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright"
            aria-label={`${link.action} on ${link.label} (opens in a new tab)`}
          >
            <SocialBrandIcon platform={link.label} />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function HomepageVideoSpotlight({ className = "" }: { className?: string }) {
  return (
    <section className={`overflow-hidden rounded-[1.5rem] border border-parade-gold/45 bg-white/12 p-3 shadow-glow backdrop-blur ${className}`} aria-label="Every Day is Mardi Gras in Mobile, Alabama video">
      <div className="flex items-center gap-3 px-1 pb-3">
        <HomepageBannerIcon kind="jester" size="medium" />
        <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
          Every Day is Mardi Gras in Mobile, Alabama
        </h2>
      </div>
      <FeaturedVideo videoId="vSwxOuydTjU" title="Every Day is Mardi Gras in Mobile, Alabama" />
    </section>
  );
}

function UpcomingCommunityEvents({ events }: { events: CommunityEvent[] }) {
  return (
    <section aria-labelledby="upcoming-events-heading" className="overflow-hidden rounded-[1.5rem] border border-[#ffd45a] bg-[linear-gradient(120deg,#2b0645_0%,#591284_52%,#7d259f_100%)] text-white shadow-glow">
      <div className="flex items-center gap-3 border-b border-parade-gold/25 px-5 py-4">
        <HomepageBannerIcon kind="king" size="small" />
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-parade-goldBright">Around the community</p>
          <h2 id="upcoming-events-heading" className="text-xl font-black sm:text-2xl">Coming up next</h2>
        </div>
      </div>
      {events.length ? (
        <ul className="divide-y divide-parade-gold/20">
          {events.map((event) => {
            const start = new Date(event.startDateTime);
            const dateOptions = { timeZone: "America/Chicago" } as const;
            return (
              <li key={event.id}>
                <Link href={`/events/${event.slug}`} className="group flex min-h-28 items-center gap-3 px-4 py-4 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-parade-goldBright sm:gap-4 sm:px-5">
                  <time dateTime={event.startDateTime} className="flex w-16 shrink-0 flex-col items-center rounded-xl border border-parade-gold/40 bg-parade-goldBright py-2 text-center text-parade-purpleDark shadow-sm">
                    <span className="text-[0.65rem] font-black uppercase tracking-wide text-parade-purple">{new Intl.DateTimeFormat("en-US", { ...dateOptions, month: "short" }).format(start)}</span>
                    <span className="text-3xl font-black leading-tight">{new Intl.DateTimeFormat("en-US", { ...dateOptions, day: "numeric" }).format(start)}</span>
                    <span className="text-[0.6rem] font-bold text-parade-purple">{new Intl.DateTimeFormat("en-US", { ...dateOptions, year: "numeric" }).format(start)}</span>
                  </time>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black leading-5 group-hover:underline sm:text-base">{event.title}</h3>
                    <p className="mt-1 break-words text-xs font-semibold leading-5 text-purple-100">Hosted by {event.organization}</p>
                    <p className="mt-1 text-xs font-bold text-parade-goldBright">{new Intl.DateTimeFormat("en-US", { ...dateOptions, weekday: "short", hour: "numeric", minute: "2-digit" }).format(start)} CT</p>
                    <p className="mt-1 text-xs leading-5 text-purple-100">{event.venueName || event.locationLabel}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-parade-goldBright" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : <p className="px-5 py-7 text-sm leading-6 text-purple-100">More community events are on the way. Check the calendar or submit your event for review.</p>}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-parade-gold/25 bg-parade-purpleDeep/35 px-5 py-3">
        <Link href="/events" className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-parade-goldBright hover:underline">Full event calendar <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <Link href="/submit-event" className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-purple-100 hover:underline"><PlusCircle className="h-4 w-4" aria-hidden="true" /> Submit event</Link>
      </div>
    </section>
  );
}

function HomepageBannerIcon({ kind, size }: { kind: "jester" | "logo" | "king"; size: "small" | "medium" }) {
  const sizeClass = size === "medium" ? "h-12 w-12 border-[3px]" : "h-8 w-8 border-2";
  const source = kind === "jester"
    ? "/images/schedule/mardi-gras-jester-icon.webp"
    : kind === "king"
      ? "/images/schedule/mardi-gras-king-icon.webp"
      : "/images/mardi-gras-mobile-logo.png";

  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full border-[#fff2b5] bg-[#2b0645] shadow-[0_0_20px_rgba(255,212,90,0.42)] ring-2 ring-[#d69b16]/30 ${sizeClass}`} aria-hidden="true">
      <Image src={source} alt="" fill sizes={size === "medium" ? "48px" : "32px"} className="object-cover" />
    </span>
  );
}

function HomepageHistoryCallout() {
  return (
    <section id="mobile-mardi-gras-history" className="relative scroll-mt-24 overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
      <span className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright shadow-sm ring-1 ring-parade-gold/35">
            <Landmark className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">History & Culture</p>
            <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Brief History of Mobile Mardi Gras</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
              Mobile is widely known as the birthplace of American Mardi Gras. Its Carnival story includes French colonial roots, the well-known 1703 tradition, and the mystic society culture that helped shape modern Mobile Mardi Gras in the 1830s and 1840s.
            </p>
          </div>
        </div>
        <Link href="/history" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-purple lg:shrink-0">
          Read brief history <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function SupportSection() {
  const supportOptions = [
    {
      platform: "Patreon",
      eyebrow: "Monthly support",
      body: "Best for recurring support of the website, videos, and event calendar.",
      href: PATREON_SUPPORT_URL,
      action: "Join Patreon",
      featured: true
    },
    {
      platform: "YouTube",
      eyebrow: "Channel membership",
      body: "Support parade coverage through the YouTube membership option.",
      href: YOUTUBE_SUPPORTER_URL,
      action: "Join on YouTube",
      featured: false
    },
    {
      platform: "Facebook",
      eyebrow: "Page subscription",
      body: "Subscribe through Facebook if that is where you already follow along.",
      href: FACEBOOK_SUPPORTER_URL,
      action: "Subscribe",
      featured: false
    },
    {
      platform: "One-Time Support",
      eyebrow: "Buy Me a Coffee",
      body: "Send a one-time contribution through Buy Me a Coffee.",
      href: BUY_ME_COFFEE_URL,
      action: "Send Support",
      featured: false
    }
  ];

  return (
    <section className="relative overflow-hidden rounded-[1.65rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card md:p-6">
      <span className="pointer-events-none absolute left-[-5rem] top-[-5rem] h-40 w-40 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-52 w-52 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute right-6 top-6 h-2 w-2 rounded-full bg-parade-gold/70" aria-hidden="true" />
      <span className="pointer-events-none absolute right-14 top-12 h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(28rem,1fr)] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow ring-1 ring-white/20">
            <HeartHandshake className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Support the coverage</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
              Support Mardi Gras - Mobile, Alabama
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-purple-100 md:text-base md:leading-7">
              Help support parade coverage, videos, community event listings, and visitor resources.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {supportOptions.map((option) => (
            <a
              key={option.platform}
              href={option.href}
              target="_blank"
              rel="noreferrer"
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border p-3 sm:min-h-[9.4rem] sm:p-4 text-left transition hover:-translate-y-1 ${
                option.featured
                  ? "border-parade-gold/70 bg-gradient-to-br from-parade-goldSoft via-white to-parade-purpleMist text-parade-purpleDark shadow-glow"
                  : "border-white/15 bg-white/10 text-white shadow-civic backdrop-blur hover:bg-white/15"
              }`}
            >
              <span className="pointer-events-none absolute right-[-1.5rem] top-[-1.5rem] h-16 w-16 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
              <span className="relative z-10 flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className={`block text-[0.6rem] font-black uppercase tracking-wide sm:text-xs ${option.featured ? "text-parade-purple" : "text-parade-goldBright"}`}>
                    {option.eyebrow}
                  </span>
                  <span className={`mt-1 block text-base font-black leading-tight sm:text-lg ${option.featured ? "text-parade-purpleDark" : "text-white"}`}>
                    {option.platform}
                  </span>
                </span>
                {option.featured ? (
                  <span className="hidden rounded-full bg-parade-purple px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-white sm:inline">
                    Featured
                  </span>
                ) : null}
              </span>
              <span className={`relative z-10 mt-2 hidden flex-1 text-sm font-semibold leading-5 sm:block ${option.featured ? "text-parade-ink/75" : "text-purple-100"}`}>
                {option.body}
              </span>
              <span className={`relative z-10 mt-3 inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-full px-2 py-2 text-xs sm:gap-2 sm:px-4 sm:text-sm font-black shadow-sm transition group-hover:-translate-y-0.5 ${
                option.featured
                  ? "bg-parade-purple text-white group-hover:bg-parade-purpleDark"
                  : "bg-parade-gold text-parade-purpleDark group-hover:bg-parade-goldBright"
              }`}>
                {option.action}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisitorQuickLink({ icon, title, href }: VisitorLink) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-20 min-w-0 items-center gap-2 px-3 py-4 text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-parade-goldBright sm:gap-3 sm:px-5"
    >
      <span className="shrink-0 text-parade-goldBright">{icon}</span>
      <span className="min-w-0 flex-1 text-sm font-semibold leading-5 sm:text-base sm:leading-6">{title}</span>
      <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-parade-gold/70 transition-colors group-hover:text-parade-goldBright group-focus-visible:text-parade-goldBright sm:block" aria-hidden="true" />
    </Link>
  );
}
