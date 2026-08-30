import Link from "next/link";
import type { ReactNode } from "react";
import { Archive, ArrowRight, CalendarDays, Car, CloudSun, ExternalLink, HeartHandshake, Landmark, PlayCircle, PlusCircle, ShieldCheck, ShoppingBag, Utensils } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { VisitorCounter } from "@/components/VisitorCounter";
import { BUY_ME_COFFEE_URL, PATREON_SUPPORT_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

const HOMEPAGE_VIDEO_SRC = "/videos/dragon-home-screen-bg.mp4";
const HOMEPAGE_VIDEO_POSTER = "/videos/dragon-home-screen-poster.jpg";
const HOMEPAGE_FEATURED_VIDEO_EMBED_URL = "https://www.youtube.com/embed/vSwxOuydTjU?si=dpUnDxY4bDv-7Gqt";
const FACEBOOK_SUPPORTER_URL = "https://www.facebook.com/mardigrasmobileal/support/?surface=page_top_cta_button&entrypoint_surface=page_top_cta_button";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://m.facebook.com/mardigrasmobileal/"
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mardi_gras_mobile_alabama"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@MobileMardiGras?sub_confirmation=1"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mobilemardigras"
  },
  {
    label: "X",
    href: "https://x.com/MobMardiGras"
  }
] as const;

type PrimaryActionVariant = "live" | "replays" | "food" | "parking" | "weather" | "gear";

type PrimaryAction = {
  icon: ReactNode;
  title: string;
  body: string;
  href: string;
  action: string;
  external: boolean;
  featured: boolean;
  variant: PrimaryActionVariant;
};

export default async function HomePage() {
  const primaryActions: PrimaryAction[] = [
    {
      icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Live Coverage",
      body: "Open the live parade coverage page and current player.",
      href: "/watch",
      action: "Open Live Coverage",
      external: false,
      featured: true,
      variant: "live"
    },
    {
      icon: <Archive className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Parade Replays",
      body: "Choose previous parade seasons from 2023–2026.",
      href: "/replays",
      action: "Watch Replays",
      external: false,
      featured: true,
      variant: "replays"
    },
    {
      icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
      title: "Food and Drink",
      body: "Find downtown restaurants, coffee, bakeries, breweries, and dessert stops.",
      href: "/food-drink",
      action: "Find Food & Drink",
      external: false,
      featured: false,
      variant: "food"
    },
    {
      icon: <Car className="h-5 w-5" aria-hidden="true" />,
      title: "Parking and Access",
      body: "Find parking, transportation, and access planning resources.",
      href: "/parking-access",
      action: "Plan Parking",
      external: false,
      featured: false,
      variant: "parking"
    },
    {
      icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
      title: "Weather",
      body: "Check weather conditions before heading downtown.",
      href: "/weather",
      action: "Check Weather",
      external: false,
      featured: false,
      variant: "weather"
    },
    {
      icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
      title: "Mardi Gras Gear",
      body: "Find throws, shirts, drink holders, and Mardi Gras gear.",
      href: "/mardi-gras-gear",
      action: "Shop Gear",
      external: false,
      featured: false,
      variant: "gear"
    }
  ];
  const featuredActions = primaryActions.filter((action) => action.featured);
  const planningActions = primaryActions.filter((action) => !action.featured);

  return (
    <div>
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
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-parade-purpleDeep/88 via-parade-purpleDark/76 to-parade-purple/66" aria-hidden="true" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,201,40,0.22),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,rgba(23,4,47,0.10),rgba(23,4,47,0.42))]" aria-hidden="true" />
        <div className="absolute left-[-6rem] top-[-8rem] z-0 h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] z-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:items-center lg:px-8 lg:py-14">
          <div className="relative z-10 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-parade-goldBright shadow-glow backdrop-blur">
              Mobile Mardi Gras parade coverage
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
              <span className="block">Watch the parades</span>
              <span className="block">Find the links</span>
              <span className="block">Plan the day</span>
            </h1>
            <CountdownTimer />
            <SocialLinksStrip className="mt-7" />
            <HomepageVideoSpotlight className="mt-7 lg:hidden" />
          </div>

          <div className="relative z-10 hidden min-w-0 lg:block">
            <HomepageVideoSpotlight />
          </div>

          <div className="relative z-10 lg:col-span-2">
            <CommunityEventsCallout />
          </div>

          <div className="relative z-10 lg:col-span-2">
            <section aria-labelledby="plan-day-heading" className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Visitor tools</p>
                  <h2 id="plan-day-heading" className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">
                    Plan Your Mardi Gras Day
                  </h2>
                </div>
                <p className="max-w-2xl text-sm font-semibold leading-6 text-purple-100 md:text-right">
                  Start with live coverage, replays, food, parking, weather, and gear.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {featuredActions.map((action) => (
                  <PrimaryActionCard key={action.title} {...action} />
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {planningActions.map((action) => (
                  <PrimaryActionCard key={action.title} {...action} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <HomepageHistoryCallout />
        <SupportSection />

        <section className="rounded-[1.5rem] border border-amber-200 bg-parade-goldSoft p-5 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-black text-amber-950">Official-source reminder</h2>
              <p className="mt-2 text-sm leading-6 text-amber-950">
                This is an unofficial visitor resource and coverage hub. Parade schedules, routes, cancellations, road closures, parking rules, towing, public-safety instructions, and weather impacts should be verified through official City, public-safety, parade organization, and National Weather Service sources.
              </p>
            </div>
          </div>
        </section>

        <VisitorCounter />
      </div>
    </div>
  );
}

function SocialLinksStrip({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="Follow Mardi Gras - Mobile, Alabama on social media"
      className={`rounded-2xl border border-parade-gold/35 bg-white/10 p-3 shadow-civic backdrop-blur sm:inline-flex sm:items-center sm:gap-3 ${className}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright sm:shrink-0">Follow for updates</p>
      <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-3 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-parade-gold hover:text-parade-purpleDark"
          >
            {link.label}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function HomepageVideoSpotlight({ className = "" }: { className?: string }) {
  return (
    <section className={`overflow-hidden rounded-[1.5rem] border border-parade-gold/45 bg-white/12 p-3 shadow-glow backdrop-blur ${className}`} aria-label="Every Day is Mardi Gras in Mobile, Alabama video">
      <h2 className="px-1 pb-3 text-xl font-black text-white sm:text-2xl">
        Every Day is Mardi Gras in Mobile, Alabama
      </h2>
      <div className="relative aspect-video overflow-hidden rounded-[1.15rem] border border-parade-gold/35 bg-parade-purpleDark shadow-civic">
        <iframe
          src={HOMEPAGE_FEATURED_VIDEO_EMBED_URL}
          title="Every Day is Mardi Gras in Mobile, Alabama"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function CommunityEventsCallout() {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card">
      <span className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Community Mardi Gras Events</p>
            <h2 className="mt-1 text-2xl font-black text-white">Have a Mardi Gras-related event?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">
              Submit Mardi Gras balls, fundraisers, watch parties, socials, and Carnival-related events for review. Approved events may appear on the Community Mardi Gras Events calendar.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <Link href="/events" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-parade-purpleDark shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-goldSoft">
            View event calendar <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/submit-event" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
            Submit your event <PlusCircle className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomepageHistoryCallout() {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
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
        <Link href="/resources#mobile-mardi-gras-history" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-5 py-3 text-sm font-black text-white shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleDark lg:shrink-0">
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

        <div className="grid gap-3 sm:grid-cols-2">
          {supportOptions.map((option) => (
            <a
              key={option.platform}
              href={option.href}
              target="_blank"
              rel="noreferrer"
              className={`group relative flex min-h-[9.4rem] min-w-0 flex-col overflow-hidden rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                option.featured
                  ? "border-parade-gold/70 bg-gradient-to-br from-parade-goldSoft via-white to-parade-purpleMist text-parade-purpleDark shadow-glow"
                  : "border-white/15 bg-white/10 text-white shadow-civic backdrop-blur hover:bg-white/15"
              }`}
            >
              <span className="pointer-events-none absolute right-[-1.5rem] top-[-1.5rem] h-16 w-16 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
              <span className="relative z-10 flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className={`block text-xs font-black uppercase tracking-[0.14em] ${option.featured ? "text-parade-purple" : "text-parade-goldBright"}`}>
                    {option.eyebrow}
                  </span>
                  <span className={`mt-1 block text-lg font-black leading-tight ${option.featured ? "text-parade-purpleDark" : "text-white"}`}>
                    {option.platform}
                  </span>
                </span>
                {option.featured ? (
                  <span className="rounded-full bg-parade-purple px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-white">
                    Featured
                  </span>
                ) : null}
              </span>
              <span className={`relative z-10 mt-2 flex-1 text-sm font-semibold leading-5 ${option.featured ? "text-parade-ink/75" : "text-purple-100"}`}>
                {option.body}
              </span>
              <span className={`relative z-10 mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-black shadow-sm transition group-hover:-translate-y-0.5 ${
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

const actionCardStyles: Record<
  PrimaryActionVariant,
  {
    label: string;
    card: string;
    badge: string;
    title: string;
    body: string;
    labelClass: string;
    action: string;
    glow: string;
  }
> = {
  live: {
    label: "Live coverage",
    card: "border-parade-gold/80 bg-gradient-to-br from-parade-goldSoft via-white to-[#e6d4ff] shadow-glow",
    badge: "bg-parade-gold text-parade-purpleDark ring-parade-goldBright/60 shadow-sm",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/40 bg-white/65 text-parade-purple",
    action: "bg-parade-gold text-parade-purpleDark shadow-glow group-hover:bg-parade-goldBright",
    glow: "bg-parade-purple/16"
  },
  replays: {
    label: "Replay archive",
    card: "border-parade-gold/70 bg-gradient-to-br from-[#ffe38a] via-parade-cream to-[#e9d8ff] shadow-glow",
    badge: "bg-parade-purple text-parade-goldBright ring-parade-gold/40 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/40 bg-white/65 text-parade-purple",
    action: "bg-parade-purple text-white shadow-civic group-hover:bg-parade-purpleDark",
    glow: "bg-parade-gold/25"
  },
  food: {
    label: "Downtown stops",
    card: "border-parade-gold/45 bg-gradient-to-br from-parade-cream via-white to-[#fff0b8] shadow-card hover:shadow-glow",
    badge: "bg-parade-purple text-parade-goldBright ring-parade-gold/45 shadow-sm",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/30 bg-white/60 text-parade-purple",
    action: "bg-parade-purple text-white shadow-sm group-hover:bg-parade-purpleDark",
    glow: "bg-parade-gold/18"
  },
  parking: {
    label: "Access planning",
    card: "border-parade-purple/25 bg-gradient-to-br from-white via-parade-purpleMist to-parade-goldSoft shadow-card hover:shadow-glow",
    badge: "bg-parade-gold text-parade-purpleDark ring-parade-purple/20 shadow-sm",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-purple/15 bg-white/60 text-parade-purple",
    action: "bg-parade-gold text-parade-purpleDark shadow-sm group-hover:bg-parade-goldBright",
    glow: "bg-parade-purple/10"
  },
  weather: {
    label: "Planning tool",
    card: "border-parade-gold/40 bg-gradient-to-br from-[#f0e4ff] via-parade-cream to-white shadow-card hover:shadow-glow",
    badge: "bg-parade-purpleDark text-parade-goldBright ring-parade-gold/40 shadow-sm",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/30 bg-white/60 text-parade-purple",
    action: "bg-parade-purple text-white shadow-sm group-hover:bg-parade-purpleDark",
    glow: "bg-parade-gold/16"
  },
  gear: {
    label: "Throws & gear",
    card: "border-parade-gold/55 bg-gradient-to-br from-[#ffdc73] via-parade-goldSoft to-parade-purpleMist shadow-card hover:shadow-glow",
    badge: "bg-parade-purpleDark text-parade-goldBright ring-parade-gold/45 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/35 bg-white/60 text-parade-purple",
    action: "bg-parade-gold text-parade-purpleDark shadow-sm group-hover:bg-parade-goldBright",
    glow: "bg-parade-purple/12"
  }
};

function PrimaryActionCard({
  icon,
  title,
  body,
  href,
  action,
  external,
  featured,
  variant
}: PrimaryAction) {
  const styles = actionCardStyles[variant];
  const className = `group relative flex h-full min-h-[14.5rem] min-w-0 overflow-hidden rounded-[1.6rem] border p-5 text-left transition duration-200 hover:-translate-y-1 ${styles.card} ${
    featured ? "lg:min-h-[13.5rem]" : ""
  }`;
  const content = (
    <>
      <span className={`pointer-events-none absolute right-[-2.25rem] top-[-2.25rem] h-28 w-28 rounded-full blur-2xl ${styles.glow}`} aria-hidden="true" />
      <span className="relative z-10 flex h-full min-w-0 flex-col">
        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-[0.62rem] font-black uppercase tracking-wide ${styles.labelClass}`}>
          {styles.label}
        </span>
        <span className={`mt-4 grid h-12 w-12 place-items-center rounded-2xl ring-1 ${styles.badge}`}>{icon}</span>
        <h2 className={`mt-4 text-lg font-black ${styles.title}`}>{title}</h2>
        <p className={`mt-2 flex-1 text-sm leading-6 ${styles.body}`}>{body}</p>
        <span className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition group-hover:-translate-y-0.5 ${styles.action}`}>
          {action}
          {external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}