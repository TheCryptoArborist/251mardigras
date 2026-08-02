import Link from "next/link";
import { ArrowRight, CalendarDays, Car, Share2, ShieldCheck, Video } from "lucide-react";
import { AlertCard } from "@/components/AlertCard";
import { DataFreshnessPanel } from "@/components/DataFreshnessPanel";
import { EmptyState } from "@/components/EmptyState";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SourceStatusCard } from "@/components/SourceStatusCard";
import { StatusPill } from "@/components/StatusPill";
import { WeatherRiskCard } from "@/components/WeatherRiskCard";
import { getParades, getPublicChanges, getResources, getSourceStatuses, type PublicChange } from "@/lib/data-access";
import { getWeatherPreview } from "@/services/weather";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [changes, sources, resources, parades, weatherResult] = await Promise.all([
    getPublicChanges(),
    getSourceStatuses(),
    getResources(),
    getParades(),
    getWeatherPreview()
      .then((weather) => ({ weather, error: null }))
      .catch((error) => ({
        weather: null,
        error: error instanceof Error ? error.message : "Weather refresh failed"
      }))
  ]);

  const publicAlerts = changes.length > 0 ? changes : [noAlertState];
  const routeSources = sources.filter((source) => /route|parking|mardi gras|police/i.test(source.name)).slice(0, 4);
  const previewResources = resources.slice(0, 6);
  const hubActions = [
    {
      icon: <Video className="h-5 w-5" aria-hidden="true" />,
      title: "Watch live coverage",
      body: "Open the live player, YouTube channel, supporter link, and previous parade-season coverage from one page.",
      href: "/watch",
      action: "Open Watch Live"
    },
    {
      icon: <Share2 className="h-5 w-5" aria-hidden="true" />,
      title: "Open quick links",
      body: "Use the mobile-first links page for direct access to livestreams, social channels, parking, food, gear, and past coverage.",
      href: "/links",
      action: "Open Quick Links"
    },
    {
      icon: <Car className="h-5 w-5" aria-hidden="true" />,
      title: "Plan your day downtown",
      body: "Find parking, transportation, mobility-friendly access, food, gear, and visitor-planning resources.",
      href: "/resources",
      action: "Browse Resources"
    },
    {
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      title: "Verify official information",
      body: "Use the tracker and official-source reminders before relying on schedule, route, closure, safety, or weather decisions.",
      href: "/admin",
      action: "View Source Status"
    }
  ];

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
          <div>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
              Mobile Mardi Gras Information Hub
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-parade-muted">
              Unofficial central hub for Mobile Mardi Gras livestreams, direct visitor links, public-source checks, weather risk, parking, towing, and previous parade-season coverage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/watch" className="inline-flex items-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark">
                Watch live coverage <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/links" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
                Open quick links
              </Link>
              <Link href="/resources" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
                Browse visitor resources
              </Link>
              <Link href="/weather" className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft">
                Check weather risk
              </Link>
            </div>
          </div>
          <DataFreshnessPanel
            sources={sources}
            alertCount={changes.length}
            paradeCount={parades.length}
            weatherCheckedAt={weatherResult.weather?.checkedAt}
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <SectionHeader
            title="Start Here"
            description="The website is evolving from a quick-link list into a fuller visitor hub. These are the main paths most people need first."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {hubActions.map((item) => (
              <HubAction key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title="High Priority Alerts"
            description="Meaningful official-source changes appear here after the checker compares stored snapshots."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {publicAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <LiveStreamEmbed />
          <WeatherRiskCard weather={weatherResult.weather} error={weatherResult.error} />
        </div>

        <section>
          <SectionHeader title="Today's Parade Schedule" description="Phase 1 does not invent parade times. Official schedule parsing is reserved for Phase 2." />
          {parades.length === 0 ? (
            <EmptyState
              title="No verified parade schedule loaded yet"
              message="Run source checks and add official schedule parsing before publishing parade-specific times."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {parades.map((parade) => (
                <article key={parade.id} className="rounded border border-parade-line bg-white p-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-parade-purple" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-parade-ink">{parade.name}</h3>
                      <p className="text-sm text-parade-muted">
                        {parade.date} {parade.startTime ? `at ${parade.startTime}` : ""}
                      </p>
                      <StatusPill tone="gold">{parade.status}</StatusPill>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            title="Route and Road Closure Updates"
            description="Official route, parking, public-safety, and traffic sources monitored by the Phase 1 checker."
            action={
              <Link href="/routes" className="inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
                View routes and traffic <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {routeSources.map((source) => (
              <SourceStatusCard key={source.id} source={source} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <InfoPanel
            icon={<Car className="h-5 w-5" aria-hidden="true" />}
            title="Parking and Towing Information"
            body="Parking, transportation, and towing changes are treated as high priority because they affect downtown access and parade-day decisions."
            href="/routes"
            action="Review parking sources"
          />
          <InfoPanel
            icon={<Video className="h-5 w-5" aria-hidden="true" />}
            title="Previous Parade Videos"
            body="Previous season playlists are listed under resources. Phase 3 can add searchable video archives."
            href="/resources"
            action="Open video resources"
          />
        </section>

        <section>
          <SectionHeader
            title="Mardi Gras Resources"
            description="Curated visitor directory items maintained as direct destination links on this website."
            action={
              <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
                View all resources <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {previewResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HubAction({
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

function InfoPanel({
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
    <article className="rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded bg-parade-goldSoft text-parade-gold">{icon}</div>
        <div>
          <h2 className="text-xl font-bold text-parade-ink">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-parade-muted">{body}</p>
          <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
            {action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

const noAlertState: PublicChange = {
  id: "no-alerts",
  label: "PUBLIC SAFETY UPDATE",
  severity: "info",
  title: "No high-priority official changes stored yet",
  summary:
    "The tracker is ready, but no stored source comparison has produced a public alert. Run the source checker after migrating and seeding SQLite.",
  source: "Mobile Mardi Gras Tracker",
  detectedAt: undefined
};
