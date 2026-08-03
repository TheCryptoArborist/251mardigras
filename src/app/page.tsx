import Link from "next/link";
import {
  ArrowRight,
  Car,
  CloudSun,
  ExternalLink,
  MapPinned,
  PlayCircle,
  Share2,
  ShieldCheck,
  Utensils
} from "lucide-react";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { SectionHeader } from "@/components/SectionHeader";
import { getResources, type ResourceItem } from "@/lib/data-access";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

const planningTools = [
  {
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
    title: "Food and Drink",
    body: "Open the downtown food navigator when you are walking around, driving in, or deciding where to stop between parades.",
    href: "/resources#food-and-drink-navigator",
    action: "Find downtown stops"
  },
  {
    icon: <Car className="h-5 w-5" aria-hidden="true" />,
    title: "Parking and Access",
    body: "Find parking, transportation, mobility-friendly access, and other visitor planning resources in the full guide.",
    href: "/resources",
    action: "Plan your day"
  },
  {
    icon: <CloudSun className="h-5 w-5" aria-hidden="true" />,
    title: "Weather",
    body: "Check the weather-risk page as a planning tool. Weather risk does not mean a parade is canceled unless officials say so.",
    href: "/weather",
    action: "Check weather"
  }
];

export default async function HomePage() {
  const resources = await getResources();
  const latestReplay =
    resources.find((resource) => resource.title === "Mardi Gras 2025 Playlist") ??
    resources.find((resource) => resource.category === "Previous Parade Seasons");

  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Mobile Mardi Gras parade coverage</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
            Watch the parades. Find the links. Plan the day.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-parade-muted">
            The main purpose of this site is Mobile Mardi Gras parade coverage. The quick links, food and drink navigator, parking tools, and weather page are here to help visitors before, during, and between live coverage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/watch" className="inline-flex items-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
              Watch live coverage <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {latestReplay ? (
              <a
                href={latestReplay.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft"
              >
                Watch parade replays <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            <Link href="/links" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
              Open quick links
            </Link>
            <Link href="/resources#food-and-drink-navigator" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
              Food and drink
            </Link>
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

        <section>
          <SectionHeader
            title="Useful Between Parades"
            description="These tools support the parade coverage by giving people a reason to keep coming back before, during, and between events."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {planningTools.map((tool) => (
              <PlanningToolCard key={tool.title} {...tool} />
            ))}
          </div>
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

function PlanningToolCard({
  icon,
  title,
  body,
  href,
  action
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <article className="min-w-0 rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="grid h-10 w-10 place-items-center rounded bg-parade-goldSoft text-parade-gold">{icon}</div>
      <h2 className="mt-4 text-xl font-black text-parade-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{body}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
        {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
