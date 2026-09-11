import { CalendarDays, ExternalLink, MapPinned, ShieldCheck } from "lucide-react";
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

const schedule = paradeSchedule2027 as ParadeSchedule;
const allParades = schedule.days.flatMap((day) => day.parades.map((parade) => ({ ...parade, day })));
const routeCounts = getRouteCounts(schedule.days);
const firstParade = allParades[0];

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="2027 Mobile Mardi Gras Parade Schedule"
        description="A native MG251 schedule view transcribed from the official City of Mobile parade schedule and routes source. Times and routes can change, so verify the official source before travel."
      />

      <section className="overflow-hidden rounded-[1.65rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-4 text-white shadow-card sm:p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow ring-1 ring-white/20">
              <CalendarDays className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Official schedule transcribed</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">{schedule.displayDateRange}</h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100 sm:text-base">
                Browse the released Mobile Mardi Gras parade schedule directly on MG251 without embedding the City StoryMap. The official source remains linked for verification.
              </p>
            </div>
          </div>
          <a
            href={schedule.source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-parade-gold/55 bg-parade-gold px-4 py-2.5 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright sm:w-auto"
          >
            Open official source <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ScheduleStat label="Total parades" value={`${allParades.length}`} />
          <ScheduleStat label="First parade" value={firstParade ? `${firstParade.day.label} • ${firstParade.time}` : "Posted"} />
          <ScheduleStat label="Mardi Gras Day" value={schedule.mardiGrasDay} />
        </div>

        <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-parade-goldBright" aria-hidden="true" />
            <p className="text-sm font-semibold leading-6 text-purple-100">
              {schedule.defaultRouteNote} MG251 lists Route A for downtown entries without a separate route note and preserves the specific route letters where the official schedule lists one.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.35rem] border border-parade-line bg-white p-4 shadow-civic sm:p-5" aria-labelledby="route-summary-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Route summary</p>
            <h2 id="route-summary-heading" className="mt-1 text-2xl font-black text-parade-ink">Parades by route</h2>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-6 text-parade-muted">
            Use these route chips as a quick planning scan. Open the official source for route maps and any updated traffic details.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {routeCounts.map((route) => (
            <span
              key={route.name}
              className="inline-flex items-center gap-2 rounded-full border border-parade-gold/35 bg-parade-cream px-3 py-2 text-xs font-black uppercase tracking-wide text-parade-purpleDark"
            >
              <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
              {route.name} <span className="text-parade-muted">{route.count}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="schedule-list-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Schedule cards</p>
            <h2 id="schedule-list-heading" className="mt-1 text-2xl font-black text-parade-ink">Daily parade listings</h2>
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-6 text-parade-muted">
            Last transcribed from the official source on {formatTranscribedDate(schedule.lastTranscribedAt)}.
          </p>
        </div>

        {schedule.days.map((day) => (
          <section key={day.date} className="overflow-hidden rounded-[1.35rem] border border-parade-line bg-white shadow-civic" aria-labelledby={`${day.date}-heading`}>
            <div className="border-b border-parade-line bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-4 py-4 text-white sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">{day.parades.length} parade{day.parades.length === 1 ? "" : "s"}</p>
                  <h3 id={`${day.date}-heading`} className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{day.label}</h3>
                </div>
                {day.specialLabel ? <StatusPill tone="gold">{day.specialLabel}</StatusPill> : null}
              </div>
            </div>

            <div className="divide-y divide-parade-line">
              {day.parades.map((parade) => (
                <article key={parade.id} id={parade.id} className="scroll-mt-28 px-4 py-4 sm:px-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-parade-purpleSoft px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purple">{parade.time}</span>
                        <span className="rounded-full bg-parade-gold/20 px-3 py-1 text-xs font-black uppercase tracking-wide text-parade-purpleDark">{parade.route}</span>
                      </div>
                      <h4 className="mt-2 text-xl font-black leading-tight text-parade-ink">{parade.name}</h4>
                      <p className="mt-1 text-sm font-semibold leading-6 text-parade-muted">
                        {parade.routeNote ? `Official schedule lists ${parade.routeNote}.` : "Route A shown from the official downtown default note."}
                      </p>
                    </div>
                    <a
                      href={schedule.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-full border border-parade-line bg-parade-cream px-3 py-2 text-xs font-black uppercase tracking-wide text-parade-purple transition hover:-translate-y-0.5 hover:border-parade-gold sm:w-auto"
                    >
                      Source <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
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

function ScheduleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">{label}</p>
      <p className="mt-2 text-lg font-black leading-tight text-white">{value}</p>
    </div>
  );
}

function getRouteCounts(days: ParadeDay[]) {
  const counts = new Map<string, number>();

  days.forEach((day) => {
    day.parades.forEach((parade) => {
      counts.set(parade.route, (counts.get(parade.route) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort(([routeA], [routeB]) => routeA.localeCompare(routeB, "en", { numeric: true }))
    .map(([name, count]) => ({ name, count }));
}

function formatTranscribedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago"
  }).format(new Date(`${value}T12:00:00-05:00`));
}
