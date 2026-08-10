import Image from "next/image";
import Link from "next/link";
import { Archive, ArrowRight, Car, CloudSun, ExternalLink, PlayCircle, ShieldCheck, ShoppingBag, Utensils } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const primaryActions = [
    {
      icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Live Coverage",
      body: "Start with the live parade coverage hub and current player.",
      href: "/watch",
      action: "Open Watch Live",
      external: false,
      featured: true
    },
    {
      icon: <Archive className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Parade Replays",
      body: "Choose a previous Mobile Mardi Gras parade season: 2026, 2025, 2024, or 2023.",
      href: "/replays",
      action: "Choose a Year",
      external: false,
      featured: true
    },
    {
      icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
      title: "Food and Drink",
      body: "Navigate to downtown restaurants, coffee, bakeries, breweries, and dessert stops.",
      href: "/food-drink",
      action: "Find Food Nearby",
      external: false,
      featured: false
    },
    {
      icon: <Car className="h-5 w-5" aria-hidden="true" />,
      title: "Parking and Access",
      body: "Find parking, transportation, and mobility-friendly access resources.",
      href: "/parking-access",
      action: "Plan Access",
      external: false,
      featured: false
    },
    {
      icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
      title: "Weather",
      body: "Use the weather page as a planning tool between official updates.",
      href: "/weather",
      action: "Check Weather",
      external: false,
      featured: false
    },
    {
      icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
      title: "Mardi Gras Gear",
      body: "Find throws, shirts, drink holders, and Mobile Mardi Gras gear from selected local resources.",
      href: "/mardi-gras-gear",
      action: "Shop Gear",
      external: false,
      featured: false
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

function PrimaryActionCard({
  icon,
  title,
  body,
  href,
  action,
  external,
  featured
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  action: string;
  external: boolean;
  featured: boolean;
}) {
  const className = `group flex h-full min-w-0 flex-col rounded-2xl border p-4 text-left shadow-card transition hover:-translate-y-1 ${
    featured
      ? "border-parade-gold/50 bg-gradient-to-br from-white to-parade-goldSoft"
      : "border-parade-line bg-white hover:bg-parade-purpleMist"
  }`;
  const content = (
    <>
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-parade-goldSoft text-parade-gold ring-1 ring-parade-gold/30">{icon}</div>
      <h2 className="mt-4 text-lg font-black text-parade-ink">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-parade-purple group-hover:underline">
        {action}
        {external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
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
