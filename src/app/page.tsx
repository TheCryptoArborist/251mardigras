import Link from "next/link";
import { Archive, ArrowRight, Car, CloudSun, ExternalLink, PlayCircle, ShieldCheck, ShoppingBag, Utensils } from "lucide-react";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { getResources } from "@/lib/data-access";
import { SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const resources = await getResources();
  const latestReplay =
    resources.find((resource) => resource.title === "Mardi Gras 2025 Playlist") ??
    resources.find((resource) => resource.category === "Previous Parade Seasons");

  const primaryActions = [
    {
      icon: <PlayCircle className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Live Coverage",
      body: "Start with the live parade coverage hub and current player.",
      href: "/watch",
      action: "Open Watch Live",
      external: false
    },
    {
      icon: <Archive className="h-5 w-5" aria-hidden="true" />,
      title: "Watch Parade Replays",
      body: "Catch up on previous Mobile Mardi Gras parade coverage.",
      href: latestReplay?.url ?? "/watch",
      action: "Open Replays",
      external: Boolean(latestReplay)
    },
    {
      icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
      title: "Food and Drink",
      body: "Navigate to downtown restaurants, coffee, bakeries, breweries, and dessert stops.",
      href: "/food-drink",
      action: "Find Food Nearby",
      external: false
    },
    {
      icon: <Car className="h-5 w-5" aria-hidden="true" />,
      title: "Parking and Access",
      body: "Find parking, transportation, and mobility-friendly access resources.",
      href: "/parking-access",
      action: "Plan Access",
      external: false
    },
    {
      icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
      title: "Weather",
      body: "Use the weather page as a planning tool between official updates.",
      href: "/weather",
      action: "Check Weather",
      external: false
    },
    {
      icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
      title: "Mardi Gras Gear",
      body: "Find throws, shirts, drink holders, and Mobile Mardi Gras gear from selected local resources.",
      href: "/mardi-gras-gear",
      action: "Shop Gear",
      external: false
    }
  ];

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.38fr] lg:items-center lg:px-8 lg:py-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Mobile Mardi Gras parade coverage</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
              Watch the parades. Find the links. Plan the day.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-parade-muted">
              The main purpose of this site is Mobile Mardi Gras parade coverage. Food and drink, parking and access, weather, and Mardi Gras gear are organized as support tools for visitors before, during, and between live coverage.
            </p>
          </div>

          <div className="hidden justify-self-center rounded border border-parade-line bg-white p-4 shadow-civic sm:block">
            <img src={SITE_LOGO_PATH} alt={SITE_LOGO_ALT} className="h-40 w-40 object-contain lg:h-48 lg:w-48" />
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {primaryActions.map((action) => (
                <PrimaryActionCard key={action.title} {...action} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <LiveStreamEmbed />
          <article className="rounded border border-parade-line bg-white p-5 shadow-civic">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-parade-goldSoft text-parade-gold">
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
              {latestReplay ? <CoverageAction href={latestReplay.url} label="Watch latest parade replay" external /> : null}
              <CoverageAction href={YOUTUBE_SUPPORTER_URL} label="Become a channel supporter" external />
            </div>
          </article>
        </section>

        <section className="rounded border border-amber-200 bg-parade-goldSoft p-5">
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
  external
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  action: string;
  external: boolean;
}) {
  const className = "flex h-full min-w-0 flex-col rounded border border-parade-line bg-white p-4 text-left shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleSoft";
  const content = (
    <>
      <div className="grid h-10 w-10 place-items-center rounded bg-parade-goldSoft text-parade-gold">{icon}</div>
      <h2 className="mt-4 text-lg font-black text-parade-ink">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-parade-purple">
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
  const className = "flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line px-4 py-3 text-sm font-bold text-parade-ink hover:bg-parade-purpleSoft";
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
