import { CalendarDays, ExternalLink, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import paradeSchedule2027 from "../../../data/parade-schedule-2027.json";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusPill } from "@/components/StatusPill";

type ParadeEntry = {
  id: string;
  time: string;
  name: string;
  route: string;
  routeNote?: string;
};

type ParadeDay = {
  date: string;
  label: string;
  specialLabel?: string;
  parades: ParadeEntry[];
};

type ParadeSchedule = {
  season: string;
  title: string;
  source: {
    name: string;
    url: string;
  };
  lastTranscribedAt: string;
  displayDateRange: string;
  mardiGrasDay: string;
  defaultRouteNote: string;
  scheduleStatus: string;
  days: ParadeDay[];
};

type RouteMap = {
  name: string;
  anchor: string;
  imageUrl: string;
  emphasis: "featured" | "standard";
  note: string;
};

const schedule = paradeSchedule2027 as ParadeSchedule;
const allParades = schedule.days.flatMap((day) => day.parades.map((parade) => ({ ...parade, day })));
const firstParade = allParades[0];
const routeMaps: RouteMap[] = [
  {
    name: "Route A",
    anchor: "route-map-a",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-A.jpg",
    emphasis: "featured",
    note: "Primary downtown loop used by most listed downtown parades."
  },
  {
    name: "Route B",
    anchor: "route-map-b",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-B-scaled.jpg",
    emphasis: "standard",
    note: "Used when the official schedule lists Route B."
  },
  {
    name: "Route C",
    anchor: "route-map-c",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-C-scaled.jpg",
    emphasis: "standard",
    note: "Used when the official schedule lists Route C."
  },
  {
    name: "Route D",
    anchor: "route-map-d",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-D.jpg",
    emphasis: "standard",
    note: "Used when the official schedule lists Route D."
  },
  {
    name: "Route E",
    anchor: "route-map-e",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-E.jpg",
    emphasis: "standard",
    note: "Used when the official schedule lists Route E."
  },
  {
    name: "Route F",
    anchor: "route-map-f",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-F-scaled.jpg",
    emphasis: "standard",
    note: "Used when the official schedule lists Route F."
  },
  {
    name: "Route G",
    anchor: "route-map-g",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-G-scaled.jpg",
    emphasis: "standard",
    note: "Included with the route map set; not currently assigned in this 2027 transcription."
  },
  {
    name: "Route H",
    anchor: "route-map-h",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-H-scaled.jpg",
    emphasis: "standard",
    note: "Used when the official schedule lists Route H."
  }
];

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  const featuredRoute = routeMaps.find((route) => route.emphasis === "featured") ?? routeMaps[0];
  const secondaryRoutes = routeMaps.filter((route) => route.name !== featuredRoute.name);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="2027 Mobile Mardi Gras Parade Schedule"
        description="A native MG251 schedule view transcribed from the official City of Mobile parade schedule and routes source. Times and routes can change, so verify the official source before travel."
      />

      <section className="relative overflow-hidden rounded-[1.8rem] border border-parade-gold/50 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-4 text-white shadow-card sm:p-5 lg:p-6">
        <span className="pointer-events-none absolute right-[-4rem] top-[-5rem] h-48 w-48 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-[-6rem] left-[-5rem] h-44 w-44 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.82fr)] lg:items-start">
          <div>
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow ring-1 ring-white/20">
                <CalendarDays className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Official schedule transcribed</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">{schedule.displayDateRange}</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100 sm:text-base">
                  Browse the released Mobile Mardi Gras parade schedule directly on MG251, with route maps restored for visitor planning and the official source linked for verification.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <ScheduleStat label="Total parades" value={`${allParades.length}`} />
              <ScheduleStat label="First parade" value={firstParade ? `${firstParade.day.label} • ${firstParade.time}` : "Posted"} />
              <ScheduleStat label="Mardi Gras Day" value={schedule.mardiGrasDay} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#route-maps"
                className="inline-flex items-center gap-2 rounded-full border border-parade-gold/55 bg-parade-gold px-4 py-2.5 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
              >
                View route maps <MapPinned className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#daily-parade-listings"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Daily listings <Sparkles className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={schedule.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Official source <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <RouteMapPreview route={featuredRoute} compact />
        </div>
      </section>

      <section id="route-maps" className="scroll-mt-28 space-y-5" aria-labelledby="route-maps-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Route maps</p>
            <h2 id="route-maps-heading" className="mt-1 text-3xl font-black tracking-tight text-parade-ink">Pick the route before you pick your spot</h2>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-6 text-parade-muted">
            Route A is featured first because the official source notes that downtown Mobile parades roll on Route A unless otherwise noted. Other route maps are shown when a specific route letter is listed.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.16fr)_minmax(18rem,0.84fr)]">
          <RouteMapCard route={featuredRoute} featured />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {secondaryRoutes.map((route) => (
              <RouteMapCard key={route.name} route={route} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.35rem] border border-parade-gold/35 bg-gradient-to-r from-parade-cream via-white to-parade-purpleSoft/45 p-4 shadow-civic sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-parade-purple" aria-hidden="true" />
          <p className="text-sm font-semibold leading-6 text-parade-muted">
            {schedule.defaultRouteNote} MG251 lists Route A for downtown entries without a separate route note and preserves the specific route letters where the official schedule lists one.
          </p>
        </div>
      </section>

      <section id="daily-parade-listings" className="scroll-mt-28 space-y-5" aria-labelledby="schedule-list-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Schedule cards</p>
            <h2 id="schedule-list-heading" className="mt-1 text-3xl font-black tracking-tight text-parade-ink">Daily parade listings</h2>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-6 text-parade-muted">
            Last transcribed from the official source on {formatTranscribedDate(schedule.lastTranscribedAt)}.
          </p>
        </div>

        {schedule.days.map((day) => (
          <section key={day.date} className="overflow-hidden rounded-[1.5rem] border border-parade-gold/30 bg-gradient-to-br from-white via-parade-cream to-white shadow-card" aria-labelledby={`${day.date}-heading`}>
            <div className="border-b border-parade-gold/25 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-4 py-4 text-white sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">{day.parades.length} parade{day.parades.length === 1 ? "" : "s"}</p>
                  <h3 id={`${day.date}-heading`} className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{day.label}</h3>
                </div>
                {day.specialLabel ? <StatusPill tone="gold">{day.specialLabel}</StatusPill> : null}
              </div>
            </div>

            <div className="divide-y divide-parade-gold/20">
              {day.parades.map((parade) => (
                <article key={parade.id} id={parade.id} className="scroll-mt-28 px-4 py-4 transition hover:bg-white sm:px-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-parade-purple px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-sm">{parade.time}</span>
                        <a
                          href={`#${routeAnchorId(parade.route)}`}
                          className="rounded-full bg-parade-gold/25 px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purpleDark transition hover:bg-parade-gold/40"
                        >
                          {parade.route} map
                        </a>
                      </div>
                      <h4 className="mt-2 text-xl font-black leading-tight text-parade-ink">{parade.name}</h4>
                      <p className="mt-1 text-sm font-semibold leading-6 text-parade-muted">
                        {parade.routeNote ? `Official schedule lists ${parade.routeNote}.` : "Route A shown from the official downtown default note."}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                      <a
                        href={`#${routeAnchorId(parade.route)}`}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-parade-gold/35 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-parade-purple transition hover:-translate-y-0.5 hover:border-parade-gold sm:w-auto"
                      >
                        View map <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <a
                        href={schedule.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-parade-line bg-parade-cream px-3 py-2 text-xs font-black uppercase tracking-wide text-parade-purple transition hover:-translate-y-0.5 hover:border-parade-gold sm:w-auto"
                      >
                        Source <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section className="rounded-[1.35rem] border border-parade-gold/35 bg-parade-cream p-5 shadow-civic">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Planning note</p>
        <h2 className="mt-2 text-2xl font-black text-parade-ink">Verify before you roll downtown</h2>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-parade-muted">
          MG251 is not the official parade authority. This page reformats the official schedule for easier browsing. Parade dates, start times, routes, road closures, parking rules, towing, and public-safety guidance can change.
        </p>
        <a
          href={schedule.source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-parade-purple px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-purpleDark sm:w-auto"
        >
          Check official City source <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

function RouteMapPreview({ route, compact = false }: { route: RouteMap; compact?: boolean }) {
  return (
    <a
      href={`#${route.anchor}`}
      className="group block overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-white p-2 shadow-civic transition hover:-translate-y-0.5 hover:border-parade-gold/70"
      aria-label={`Jump to ${route.name} route map`}
    >
      <div
        className={`relative overflow-hidden rounded-[1rem] bg-white bg-contain bg-center bg-no-repeat ${compact ? "min-h-[14rem]" : "min-h-[18rem]"}`}
        style={{ backgroundImage: `url(${route.imageUrl})` }}
        role="img"
        aria-label={`${route.name} Mobile Mardi Gras route map`}
      >
        <div className="absolute left-3 top-3 rounded-full bg-parade-purple px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-sm">
          {route.name}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-parade-gold px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purpleDark shadow-sm transition group-hover:bg-parade-goldBright">
          Open map
        </div>
      </div>
    </a>
  );
}

function RouteMapCard({ route, featured = false }: { route: RouteMap; featured?: boolean }) {
  const usageSummary = getRouteUsageSummary(route.name);
  const routeCount = getRouteCount(route.name);

  return (
    <article id={route.anchor} className="scroll-mt-28 overflow-hidden rounded-[1.45rem] border border-parade-gold/35 bg-white shadow-card">
      <div className={`grid gap-0 ${featured ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)]" : ""}`}>
        <div
          className={`relative bg-white bg-contain bg-center bg-no-repeat ${featured ? "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[30rem]" : "min-h-[14rem]"}`}
          style={{ backgroundImage: `url(${route.imageUrl})` }}
          role="img"
          aria-label={`${route.name} Mobile Mardi Gras route map`}
        >
          <div className="absolute left-3 top-3 rounded-full bg-parade-purple px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-sm">
            {route.name}
          </div>
        </div>
        <div className="border-t border-parade-line bg-gradient-to-br from-parade-cream via-white to-white p-4 lg:border-l lg:border-t-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Route map</p>
          <h3 className="mt-1 text-2xl font-black text-parade-ink">{route.name}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-parade-muted">{route.note}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-parade-ink">{usageSummary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-parade-gold/35 bg-parade-gold/20 px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purpleDark">
              {routeCount === 1 ? "1 parade" : `${routeCount} parades`}
            </span>
            <a
              href={route.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-parade-line bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purple transition hover:border-parade-gold"
            >
              Open larger map
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function ScheduleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">{label}</p>
      <p className="mt-2 text-lg font-black leading-tight text-white">{value}</p>
    </div>
  );
}

function getRouteCount(routeName: string) {
  return allParades.filter((parade) => parade.route === routeName).length;
}

function getRouteUsageSummary(routeName: string) {
  const matchingParades = allParades.filter((parade) => parade.route === routeName);

  if (matchingParades.length === 0) {
    return "No 2027 parade in this MG251 transcription is currently assigned to this route.";
  }

  if (routeName === "Route A") {
    return `${matchingParades.length} listed 2027 parades use Route A, including ${formatParadeExamples(matchingParades.map((parade) => parade.name))}.`;
  }

  return `Used by ${formatParadeExamples(matchingParades.map((parade) => parade.name))}.`;
}

function formatParadeExamples(names: string[]) {
  if (names.length <= 3) {
    return names.join(", ");
  }

  return `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
}

function routeAnchorId(routeName: string) {
  return `route-map-${routeName.replace(/^Route\s+/i, "").toLowerCase()}`;
}

function formatTranscribedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago"
  }).format(new Date(`${value}T12:00:00-05:00`));
}
