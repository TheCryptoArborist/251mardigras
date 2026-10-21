import Link from "next/link";
import type { ReactNode } from "react";
import {
  Archive,
  ArrowRight,
  CalendarDays,
  Car,
  CloudSun,
  ExternalLink,
  Landmark,
  MapPinned,
  PartyPopper,
  PlayCircle,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import { MOBILE_CARNIVAL_MUSEUM_URL } from "@/lib/seed-data";
import { MG251_SOCIAL_LINKS } from "@/lib/social-links";

type GuideLink = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

const planningLinks: GuideLink[] = [
  {
    title: "Parade Schedule",
    description: "Dates and start times",
    href: "/schedule",
    icon: <CalendarDays className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Route Maps",
    description: "Choose your viewing spot",
    href: "/schedule#all-route-maps",
    icon: <MapPinned className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Parking",
    description: "Maps and getting downtown",
    href: "/parking-access",
    icon: <Car className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Food & Drink",
    description: "Find a local stop",
    href: "/food-drink",
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Weather",
    description: "Forecasts and alerts",
    href: "/weather",
    icon: <CloudSun className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Community Events",
    description: "Balls, socials and gatherings",
    href: "/events",
    icon: <PartyPopper className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Mardi Gras Gear",
    description: "Throws, shirts and more",
    href: "/mardi-gras-gear",
    icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "History & Culture",
    description: "Explore Mobile's traditions",
    href: "#mobile-mardi-gras-history",
    icon: <Landmark className="h-5 w-5" aria-hidden="true" />
  }
];

const coverageLinks: GuideLink[] = [
  {
    title: "Watch Live",
    description: "Live parade coverage",
    href: "/watch",
    icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />
  },
  {
    title: "Parade Replays",
    description: "Past parade seasons",
    href: "/replays",
    icon: <Archive className="h-5 w-5" aria-hidden="true" />
  }
];

export default function ResourcesPage() {
  return (
    <div className="bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
      <section className="relative isolate overflow-hidden border-b border-parade-gold/25">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(255,201,40,0.12),transparent_60%)]" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Mobile, Alabama</p>
          <h1 className="mt-3 text-[1.875rem] font-black leading-[1.1] tracking-tight sm:text-5xl">
            <span className="block">Mobile Mardi Gras</span>
            <span className="mt-1 block text-parade-goldBright">Visitor Guide</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-purple-100 sm:text-base sm:leading-7">
            Plan your parade day, explore local traditions, and follow the celebrations.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-7 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
        <section aria-labelledby="plan-your-visit-heading">
          <h2 id="plan-your-visit-heading" className="text-xl font-bold text-white sm:text-2xl">Plan your visit</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">
            Start with the schedule and route maps, then plan the rest of your day.
          </p>
          <nav aria-labelledby="plan-your-visit-heading" className="mt-4 overflow-hidden rounded-2xl border border-parade-gold/25">
            <ul className="grid grid-cols-2 gap-px bg-parade-gold/20 lg:grid-cols-4">
              {planningLinks.map((link) => (
                <li key={link.href} className="min-w-0 bg-parade-purpleDeep">
                  <GuideQuickLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
          <section id="mobile-mardi-gras-history" aria-labelledby="history-heading" className="min-w-0 scroll-mt-24">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-parade-goldBright">History & culture</p>
            <h2 id="history-heading" className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">Mobile Mardi Gras history</h2>
            <div className="mt-4 max-w-3xl space-y-4 text-sm leading-7 text-purple-100 sm:text-base">
              <p>
                Mobile is widely known as the birthplace of American Mardi Gras. The city&apos;s Carnival story is often traced to its early French colonial roots and the well-known 1703 tradition, but like much of Carnival, the story includes both history and myth.
              </p>
              <p>
                The organized mystic society culture, balls, symbolism, and traditions that shaped modern Mobile Mardi Gras developed most clearly in the 1830s and 1840s. Today, Mobile Mardi Gras continues through parades, balls, mystic societies, music, costumes, throws, and community celebrations.
              </p>
            </div>
            <div className="mt-5 border-t border-parade-gold/25 pt-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <Landmark className="h-5 w-5 shrink-0 text-parade-goldBright" aria-hidden="true" />
                Explore the Mobile Carnival Museum
              </h3>
              <p className="mt-2 text-sm leading-6 text-purple-100">
                Discover Carnival costumes, artifacts, and the traditions behind the celebrations.
              </p>
              <a
                href={MOBILE_CARNIVAL_MUSEUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-parade-gold/50 bg-parade-gold/10 px-4 py-2 text-sm font-bold text-parade-goldBright transition hover:bg-parade-goldBright hover:text-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright"
              >
                Visit the museum website
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </section>

          <section aria-labelledby="follow-coverage-heading" className="min-w-0 rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/70 p-4 sm:p-6">
            <h2 id="follow-coverage-heading" className="text-xl font-bold text-white sm:text-2xl">Follow the coverage</h2>
            <p className="mt-2 text-sm leading-6 text-purple-100">Parade videos, live coverage, and updates on your favorite platform.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {MG251_SOCIAL_LINKS.filter((link) => link.featured).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.action} on ${link.label} (opens in a new tab)`}
                  className="group flex min-h-16 min-w-0 items-center justify-center gap-2 rounded-xl border border-parade-gold/60 bg-parade-gold/15 px-2 py-3 text-parade-goldBright transition hover:border-parade-goldBright hover:bg-parade-goldBright hover:text-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright"
                >
                  <span className="shrink-0"><SocialBrandIcon platform={link.label} /></span>
                  <span className="min-w-0">
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
                  aria-label={`${link.action} on ${link.label} (opens in a new tab)`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-parade-gold/35 px-1.5 py-2 text-xs font-bold text-white transition hover:border-parade-goldBright hover:bg-parade-goldBright hover:text-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright sm:px-2.5"
                >
                  <SocialBrandIcon platform={link.label} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
            <nav aria-label="Parade coverage" className="mt-5 border-t border-parade-gold/25 pt-1">
              <ul className="divide-y divide-parade-gold/20">
                {coverageLinks.map((link) => (
                  <li key={link.href}><GuideQuickLink {...link} compact={false} /></li>
                ))}
              </ul>
            </nav>
          </section>
        </div>
      </div>
    </div>
  );
}

function GuideQuickLink({ title, description, href, icon, compact = true }: GuideLink & { compact?: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex h-full min-h-20 min-w-0 items-center gap-2.5 px-3 py-4 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-parade-goldBright sm:gap-3 sm:px-4 ${compact ? "sm:min-h-24" : "rounded-lg"}`}
    >
      <span className="shrink-0 text-parade-goldBright">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-5 text-white sm:text-base sm:leading-6">{title}</span>
        <span className={`mt-1 text-xs leading-5 text-purple-100 ${compact ? "hidden sm:block" : "block"}`}>{description}</span>
      </span>
      <ArrowRight className={`h-4 w-4 shrink-0 text-parade-goldBright ${compact ? "hidden sm:block" : "block"}`} aria-hidden="true" />
    </Link>
  );
}
