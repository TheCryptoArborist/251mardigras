import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Archive, ArrowRight, Car, CloudSun, ExternalLink, PlayCircle, ShieldCheck, ShoppingBag, Utensils } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

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
      body: "Start with the live parade coverage hub and current player.",
      href: "/watch",
      action: "Open Watch Live",
      external: false,
      featured: true,
      variant: "live"
    },
    {
      icon: <Archive className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Parade Replays",
      body: "Choose a previous Mobile Mardi Gras parade season: 2026, 2025, 2024, or 2023.",
      href: "/replays",
      action: "Choose a Year",
      external: false,
      featured: true,
      variant: "replays"
    },
    {
      icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
      title: "Food and Drink",
      body: "Navigate to downtown restaurants, coffee, bakeries, breweries, and dessert stops.",
      href: "/food-drink",
      action: "Find Food Nearby",
      external: false,
      featured: false,
      variant: "food"
    },
    {
      icon: <Car className="h-5 w-5" aria-hidden="true" />,
      title: "Parking and Access",
      body: "Find parking, transportation, and mobility-friendly access resources.",
      href: "/parking-access",
      action: "Plan Access",
      external: false,
      featured: false,
      variant: "parking"
    },
    {
      icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
      title: "Weather",
      body: "Use the weather page as a planning tool between official updates.",
      href: "/weather",
      action: "Check Weather",
      external: false,
      featured: false,
      variant: "weather"
    },
    {
      icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
      title: "Mardi Gras Gear",
      body: "Find throws, shirts, drink holders, and Mobile Mardi Gras gear from selected local resources.",
      href: "/mardi-gras-gear",
      action: "Shop Gear",
      external: false,
      featured: false,
      variant: "gear"
    }
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-line bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-6rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.34fr] lg:items-center lg:px-8 lg:py-14">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-parade-goldBright shadow-glow">
              Mobile Mardi Gras parade coverage
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Watch the parades. Find the links. Plan the day.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-purple-100">
              The main purpose of this site is Mobile Mardi Gras parade coverage. Food and drink, parking and access, weather, and Mardi Gras gear are organized as support tools for visitors before, during, and between live coverage.
            </p>
            <CountdownTimer />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/watch" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
                Watch live coverage <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/replays" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15">
                Choose replay season <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden justify-self-center rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur sm:block">
            <div className="rounded-[1.5rem] bg-white/90 p-4">
              <Image src={SITE_LOGO_PATH} alt={SITE_LOGO_ALT} width={208} height={208} className="h-44 w-44 object-contain lg:h-52 lg:w-52" priority />
            </div>
          </div>

          <div className="relative z-10 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {primaryActions.map((action) => (
                <PrimaryActionCard key={action.title} {...action} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-parade-line bg-white p-3 shadow-card">
            <LiveStreamEmbed />
          </div>
          <article className="rounded-[1.5rem] border border-parade-line bg-gradient-to-br from-white to-parade-purpleMist p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-goldSoft text-parade-gold shadow-sm ring-1 ring-parade-gold/30">
                <PlayCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-parade-ink">Parade Coverage Hub</h2>
                <p className="mt-2 text-sm leading-6 text-parade-muted">
                  Start here for live parade coverage, the YouTube channel, replays, and channel support. This is the core of the website.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <CoverageAction href="/watch" label="Open live coverage page" />
              <CoverageAction href={YOUTUBE_CHANNEL_URL} label="Open YouTube channel" external />
              <CoverageAction href="/replays" label="Choose replay season" />
              <CoverageAction href={YOUTUBE_SUPPORTER_URL} label="Become a channel supporter" external />
            </div>
          </article>
        </section>

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
      </div>
    </div>
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
    sparkle: string;
  }
> = {
  live: {
    label: "Live coverage",
    card: "border-parade-gold/80 bg-gradient-to-br from-parade-purpleDeep via-parade-purple to-parade-purpleDark text-white shadow-glow",
    badge: "bg-parade-gold text-parade-purpleDark ring-parade-goldBright/70 shadow-glow",
    title: "text-white",
    body: "text-purple-100",
    labelClass: "border-parade-gold/45 bg-white/10 text-parade-goldBright",
    action: "bg-parade-gold text-parade-purpleDark shadow-glow group-hover:bg-parade-goldBright",
    glow: "bg-parade-gold/30",
    sparkle: "border-white/20"
  },
  replays: {
    label: "Replay archive",
    card: "border-parade-gold/80 bg-gradient-to-br from-[#ffd95d] via-parade-goldSoft to-[#d8c4ff] shadow-glow",
    badge: "bg-parade-purple text-parade-goldBright ring-parade-gold/50 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/80",
    labelClass: "border-parade-purple/20 bg-white/70 text-parade-purple",
    action: "bg-parade-purple text-white shadow-civic group-hover:bg-parade-purpleDark",
    glow: "bg-parade-purple/20",
    sparkle: "border-parade-purple/20"
  },
  food: {
    label: "Downtown stops",
    card: "border-parade-gold/60 bg-gradient-to-br from-[#ffeaa6] via-parade-goldSoft to-[#efdfff] shadow-card hover:shadow-glow",
    badge: "bg-parade-purple text-parade-goldBright ring-parade-gold/45 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/40 bg-white/75 text-parade-purple",
    action: "bg-parade-purple text-white shadow-sm group-hover:bg-parade-purpleDark",
    glow: "bg-parade-gold/30",
    sparkle: "border-parade-gold/30"
  },
  parking: {
    label: "Access planning",
    card: "border-parade-purple/35 bg-gradient-to-br from-[#d7c1ff] via-parade-purpleSoft to-[#fff0b8] shadow-card hover:shadow-glow",
    badge: "bg-parade-gold text-parade-purpleDark ring-parade-purple/25 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-purple/20 bg-white/75 text-parade-purple",
    action: "bg-parade-gold text-parade-purpleDark shadow-sm group-hover:bg-parade-goldBright",
    glow: "bg-parade-purple/20",
    sparkle: "border-parade-purple/20"
  },
  weather: {
    label: "Planning tool",
    card: "border-parade-purple/30 bg-gradient-to-br from-[#e8ddff] via-[#fff5cf] to-[#d9c5ff] shadow-card hover:shadow-glow",
    badge: "bg-parade-purpleDark text-parade-goldBright ring-parade-gold/50 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-purple/20 bg-white/75 text-parade-purple",
    action: "bg-parade-purple text-white shadow-sm group-hover:bg-parade-purpleDark",
    glow: "bg-parade-gold/25",
    sparkle: "border-parade-gold/30"
  },
  gear: {
    label: "Throws & gear",
    card: "border-parade-gold/70 bg-gradient-to-br from-[#ffdc73] via-parade-goldSoft to-[#e7d3ff] shadow-card hover:shadow-glow",
    badge: "bg-parade-purpleDark text-parade-goldBright ring-parade-gold/50 shadow-civic",
    title: "text-parade-purpleDark",
    body: "text-parade-ink/75",
    labelClass: "border-parade-gold/45 bg-white/75 text-parade-purple",
    action: "bg-parade-gold text-parade-purpleDark shadow-sm group-hover:bg-parade-goldBright",
    glow: "bg-parade-purple/18",
    sparkle: "border-parade-purple/20"
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
  const className = `group relative flex h-full min-w-0 overflow-hidden rounded-[1.6rem] border p-5 text-left transition duration-200 hover:-translate-y-1 ${styles.card} ${
    featured ? "shadow-glow" : "shadow-card hover:shadow-glow"
  }`;
  const content = (
    <>
      <span className={`pointer-events-none absolute right-[-2.25rem] top-[-2.25rem] h-28 w-28 rounded-full blur-2xl ${styles.glow}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute bottom-4 right-4 h-12 w-12 rotate-45 rounded-xl border ${styles.sparkle}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute bottom-7 right-11 h-2 w-2 rounded-full ${variant === "live" ? "bg-parade-goldBright/60" : "bg-parade-gold/45"}`} aria-hidden="true" />
      <span className={`pointer-events-none absolute right-7 top-8 h-1.5 w-1.5 rounded-full ${variant === "live" ? "bg-white/50" : "bg-parade-purple/25"}`} aria-hidden="true" />
      <span className="relative z-10 flex h-full min-w-0 flex-col">
        <span className="flex items-center justify-between gap-3">
          <span className={`inline-flex rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide ${styles.labelClass}`}>
            {styles.label}
          </span>
          {featured ? <span className="rounded-full bg-parade-gold/25 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-parade-purpleDark">Featured</span> : null}
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

function CoverageAction({ href, label, external = false }: { href: string; label: string; external?: boolean }) {
  const className = "flex min-w-0 items-center justify-between gap-3 rounded-xl border border-parade-line bg-white/80 px-4 py-3 text-sm font-black text-parade-ink transition hover:-translate-y-0.5 hover:bg-parade-purpleSoft hover:shadow-civic";
  const content = (
    <>
      <span className="min-w-0 truncate">{label}</span>
      {external ? <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" /> : <ArrowRight className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />}
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
