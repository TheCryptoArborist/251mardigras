"use client";

import { Check, ExternalLink, MapPinned, Share2, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";

export type ParadeEntry = {
  id: string;
  time: string;
  name: string;
  route: string;
  routeNote?: string;
};

export type ParadeDay = {
  date: string;
  label: string;
  specialLabel?: string;
  parades: ParadeEntry[];
};

export type ParadeSchedule = {
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
  note: string;
};

type ScheduleRouteViewerProps = {
  schedule: ParadeSchedule;
};

type ShareStatus = "idle" | "shared" | "copied" | "error";

const SCHEDULE_SHARE_BASE_URL = "https://mg251.xyz/schedule";

const routeMaps: RouteMap[] = [
  {
    name: "Route A",
    anchor: "route-map-a",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-A.jpg",
    note: "Primary downtown loop used by most listed downtown parades."
  },
  {
    name: "Route B",
    anchor: "route-map-b",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-B-scaled.jpg",
    note: "Used when the official schedule lists Route B."
  },
  {
    name: "Route C",
    anchor: "route-map-c",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-C-scaled.jpg",
    note: "Used when the official schedule lists Route C."
  },
  {
    name: "Route D",
    anchor: "route-map-d",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-D.jpg",
    note: "Used when the official schedule lists Route D."
  },
  {
    name: "Route E",
    anchor: "route-map-e",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-E.jpg",
    note: "Used when the official schedule lists Route E."
  },
  {
    name: "Route F",
    anchor: "route-map-f",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-F-scaled.jpg",
    note: "Used when the official schedule lists Route F."
  },
  {
    name: "Route G",
    anchor: "route-map-g",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-G-scaled.jpg",
    note: "Included with the route map set; not currently assigned in this 2027 transcription."
  },
  {
    name: "Route H",
    anchor: "route-map-h",
    imageUrl: "https://assets.mobilebaymag.com/2025/01/ROUTE-H-scaled.jpg",
    note: "Used when the official schedule lists Route H."
  }
];

const routeMapByName = new Map(routeMaps.map((route) => [route.name, route]));

export function ScheduleRouteViewer({ schedule }: ScheduleRouteViewerProps) {
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null);
  const [shareStatusByParadeId, setShareStatusByParadeId] = useState<Record<string, ShareStatus>>({});
  const allParades = useMemo(() => schedule.days.flatMap((day) => day.parades.map((parade) => ({ ...parade, day }))), [schedule.days]);
  const firstParade = allParades[0];
  const selectedRoute = selectedRouteName ? routeMapByName.get(selectedRouteName) ?? null : null;

  useEffect(() => {
    if (!selectedRouteName) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedRouteName(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRouteName]);

  function openRouteMap(routeName: string) {
    setSelectedRouteName(routeName);
  }

  function closeRouteMap() {
    setSelectedRouteName(null);
  }

  function markParadeShareStatus(paradeId: string, status: ShareStatus) {
    setShareStatusByParadeId((current) => ({ ...current, [paradeId]: status }));

    window.setTimeout(() => {
      setShareStatusByParadeId((current) => {
        if (current[paradeId] !== status) {
          return current;
        }

        const next = { ...current };
        delete next[paradeId];
        return next;
      });
    }, 2800);
  }

  async function shareParade(parade: ParadeEntry, day: ParadeDay) {
    const shareUrl = buildParadeShareUrl(parade.id);
    const shareText = buildParadeShareText(parade, day);
    const shareData = {
      title: `${parade.name} | Mobile Mardi Gras 2027`,
      text: shareText,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        markParadeShareStatus(parade.id, "shared");
        return;
      }

      const copied = await copyParadeShareText(shareText, shareUrl);
      markParadeShareStatus(parade.id, copied ? "copied" : "error");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const copied = await copyParadeShareText(shareText, shareUrl).catch(() => false);
      markParadeShareStatus(parade.id, copied ? "copied" : "error");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
      <span className="pointer-events-none absolute left-[-7rem] top-[-8rem] z-0 h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute right-[-8rem] top-[18rem] z-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-10rem] left-[20%] z-0 h-96 w-96 rounded-full bg-parade-gold/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,201,40,0.18),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.10),transparent_32%),linear-gradient(180deg,rgba(23,4,47,0.05),rgba(23,4,47,0.34))]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[1.55rem] border border-parade-gold/50 bg-white/10 p-4 text-white shadow-card backdrop-blur sm:p-5">
          <span className="pointer-events-none absolute right-[-4rem] top-[-5rem] h-44 w-44 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-[-5rem] left-[-5rem] h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">2027 parade schedule</p>
              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl">2027 Mobile Mardi Gras Parade Schedule</h1>
              <p className="mt-2 text-base font-black text-parade-goldBright">{schedule.displayDateRange}</p>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100">
                Dates, start times, and route-map access for the Mobile Mardi Gras season.
              </p>
            </div>

            <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:min-w-[20rem] lg:grid-cols-1 xl:grid-cols-2">
              <ScheduleStat label="Total parades" value={`${allParades.length}`} />
              <ScheduleStat label="First parade" value={firstParade ? `${firstParade.day.label} • ${firstParade.time}` : "Posted"} />
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            <a
              href="#all-route-maps"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
            >
              Route maps <MapPinned className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="quick-parade-schedule" className="scroll-mt-28 space-y-4" aria-labelledby="quick-parade-schedule-heading">
          <div className="rounded-[1.35rem] border border-parade-gold/35 bg-white/10 p-4 text-white shadow-civic backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Quick schedule</p>
                <h2 id="quick-parade-schedule-heading" className="mt-1 text-3xl font-black tracking-tight text-white drop-shadow-lg">Daily parade listings</h2>
              </div>
              <p className="max-w-2xl text-sm font-semibold leading-6 text-purple-100">
                Select a date below to jump directly to that day’s lineup.
              </p>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Jump to a schedule date">
              {schedule.days.map((day) => (
                <a
                  key={day.date}
                  href={`#${day.date}`}
                  className="shrink-0 rounded-full border border-parade-gold/35 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:border-parade-gold hover:bg-parade-gold hover:text-parade-purpleDark"
                >
                  {compactDateLabel(day.label)}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {schedule.days.map((day) => (
              <section key={day.date} id={day.date} className="scroll-mt-28 overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-parade-purpleDeep/62 shadow-card backdrop-blur" aria-labelledby={`${day.date}-heading`}>
                <div className="border-b border-parade-gold/25 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-4 py-3 text-white sm:px-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">{day.parades.length} parade{day.parades.length === 1 ? "" : "s"}</p>
                      <h3 id={`${day.date}-heading`} className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{day.label}</h3>
                    </div>
                    {day.specialLabel ? <StatusPill tone="gold">{day.specialLabel}</StatusPill> : null}
                  </div>
                </div>

                <div className="divide-y divide-parade-gold/20 bg-white/5">
                  {day.parades.map((parade) => {
                    const shareStatus = shareStatusByParadeId[parade.id] ?? "idle";

                    return (
                      <article key={parade.id} id={parade.id} className="scroll-mt-28 px-4 py-3.5 transition hover:bg-white/10 sm:px-5">
                        <div className="grid gap-3 md:grid-cols-[7.75rem_minmax(0,1fr)_auto] md:items-center">
                          <div className="inline-flex w-fit items-center rounded-full bg-parade-gold px-3 py-1.5 text-sm font-black uppercase tracking-wide text-parade-purpleDark shadow-glow">
                            {parade.time}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-lg font-black leading-tight text-white sm:text-xl">{parade.name}</h4>
                            {parade.routeNote ? (
                              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-purple-100">Route exception listed by official schedule</p>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap gap-2 md:justify-end">
                            <button
                              type="button"
                              onClick={() => openRouteMap(parade.route)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-parade-gold/45 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:border-parade-gold hover:bg-parade-gold hover:text-parade-purpleDark"
                            >
                              {parade.route} map <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => shareParade(parade, day)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-parade-gold/45 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:border-parade-gold hover:bg-parade-gold hover:text-parade-purpleDark"
                              aria-label={`Share ${parade.name}`}
                            >
                              {shareStatus === "shared" || shareStatus === "copied" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Share2 className="h-3.5 w-3.5" aria-hidden="true" />}
                              {getShareButtonLabel(shareStatus)}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="rounded-[1.35rem] border border-parade-gold/35 bg-white/10 p-4 text-white shadow-civic backdrop-blur sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-parade-goldBright" aria-hidden="true" />
            <p className="text-sm font-semibold leading-6 text-purple-100">
              {schedule.defaultRouteNote} MG251 lists Route A for downtown entries without a separate route note and preserves the specific route letters where the official schedule lists one.
            </p>
          </div>
        </section>

        <section id="all-route-maps" className="scroll-mt-28 space-y-5" aria-labelledby="all-route-maps-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Route maps</p>
              <h2 id="all-route-maps-heading" className="mt-1 text-3xl font-black tracking-tight text-white drop-shadow-lg">All route maps</h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-6 text-purple-100">
              Browse the full route-map set here, or open maps directly from the parade schedule above.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {routeMaps.map((route) => (
              <RouteMapCard key={route.name} route={route} onOpen={openRouteMap} />
            ))}
          </div>
        </section>

        <section className="rounded-[1.35rem] border border-parade-gold/45 bg-parade-goldSoft p-5 text-amber-950 shadow-civic">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-purple">Planning note</p>
          <h2 className="mt-2 text-2xl font-black text-parade-ink">Verify before you roll downtown</h2>
          <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-amber-950">
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

      {selectedRoute ? <RouteMapDialog route={selectedRoute} schedule={schedule} onClose={closeRouteMap} /> : null}
    </main>
  );
}

function ScheduleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-sm backdrop-blur">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-parade-goldBright">{label}</p>
      <p className="mt-1 text-sm font-black leading-tight text-white sm:text-base">{value}</p>
    </div>
  );
}

function RouteMapCard({ route, onOpen }: { route: RouteMap; onOpen: (routeName: string) => void }) {
  return (
    <article id={route.anchor} className="scroll-mt-48 overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-parade-purpleDeep/65 text-white shadow-card backdrop-blur sm:scroll-mt-28">
      <div className="border-b border-parade-gold/25 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Route map</p>
            <h3 className="text-xl font-black text-white">{route.name}</h3>
          </div>
          <button
            type="button"
            onClick={() => onOpen(route.name)}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white/15"
          >
            Open <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <button type="button" onClick={() => onOpen(route.name)} className="block w-full bg-white/10 p-2 text-left" aria-label={`Open ${route.name} map`}>
        <div className="overflow-hidden rounded-2xl border border-parade-gold/25 bg-white shadow-civic">
          <img src={route.imageUrl} alt={`${route.name} Mardi Gras parade route map`} className="h-auto w-full object-contain sm:h-64" loading="lazy" />
        </div>
      </button>
      <p className="px-4 pb-4 text-sm font-semibold leading-6 text-purple-100">{route.note}</p>
    </article>
  );
}

function RouteMapDialog({ route, schedule, onClose }: { route: RouteMap; schedule: ParadeSchedule; onClose: () => void }) {
  const routeParades = schedule.days.flatMap((day) =>
    day.parades
      .filter((parade) => parade.route === route.name)
      .map((parade) => `${day.label}: ${parade.time} — ${parade.name}`)
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="route-map-dialog-title"
    >
      <div className="max-h-[calc(100dvh-2rem)] w-full overflow-hidden rounded-[1.5rem] border border-parade-gold/40 bg-parade-purpleDeep shadow-card sm:max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b border-parade-gold/25 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-4 py-3 text-white sm:px-5 sm:py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Route map</p>
            <h2 id="route-map-dialog-title" className="mt-1 text-2xl font-black text-white">{route.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15"
            aria-label="Close route map"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto p-3 text-white sm:p-5">
          <div className="overflow-hidden rounded-2xl border border-parade-gold/25 bg-white p-1 shadow-civic sm:p-2">
            <img src={route.imageUrl} alt={`${route.name} Mardi Gras parade route map`} className="h-auto max-h-[52dvh] w-full object-contain sm:max-h-[68vh]" />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <p className="text-sm font-bold leading-6 text-purple-100">{route.note}</p>
              {routeParades.length > 0 ? (
                <details className="mt-3 rounded-2xl border border-parade-gold/25 bg-white/10 p-4">
                  <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">
                    Listed parades on {route.name} ({routeParades.length})
                  </summary>
                  <ul className="mt-3 grid gap-1.5 text-sm font-semibold leading-6 text-purple-100">
                    {routeParades.map((parade) => (
                      <li key={parade}>{parade}</li>
                    ))}
                  </ul>
                </details>
              ) : (
                <p className="mt-3 rounded-2xl border border-parade-gold/25 bg-white/10 p-4 text-sm font-semibold leading-6 text-purple-100">
                  No parade in this 2027 MG251 transcription currently uses {route.name}, but the map remains available for reference.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <a
                href={route.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-parade-gold/45 bg-parade-gold/20 px-4 py-2.5 text-sm font-black text-parade-goldBright transition hover:-translate-y-0.5 hover:bg-parade-gold hover:text-parade-purpleDark sm:w-auto"
              >
                Open full map <MapPinned className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={schedule.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-parade-gold px-4 py-2.5 text-sm font-black text-parade-purpleDark shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldBright sm:w-auto"
              >
                Official source <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function compactDateLabel(label: string) {
  return label.replace(/^\w+,\s*/, "").replace("January", "Jan.").replace("February", "Feb.");
}

function buildParadeShareUrl(paradeId: string) {
  return `${SCHEDULE_SHARE_BASE_URL}#${paradeId}`;
}

function buildParadeShareText(parade: ParadeEntry, day: ParadeDay) {
  return `${parade.name}\n${formatParadeShareDate(day.date)} • ${parade.time}\n${parade.route}\n\nView the Mobile Mardi Gras schedule and route:`;
}

function formatParadeShareDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago"
  }).format(new Date(`${value}T12:00:00-06:00`));
}

async function copyParadeShareText(shareText: string, shareUrl: string) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
  return true;
}

function getShareButtonLabel(status: ShareStatus) {
  if (status === "shared") {
    return "Shared";
  }

  if (status === "copied") {
    return "Copied";
  }

  if (status === "error") {
    return "Copy failed";
  }

  return "Share";
}
