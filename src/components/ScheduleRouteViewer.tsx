"use client";

import { ArrowUp, CalendarPlus, Check, ChevronDown, Clock3, ExternalLink, MapPinned, Share2, ShieldCheck, Sparkles, X } from "lucide-react";
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
  focusParadeId?: string;
};

type ShareStatus = "idle" | "shared" | "copied" | "error";
type CalendarSelection = { parade: ParadeEntry; day: ParadeDay };
type TimedParade = ParadeEntry & { day: ParadeDay };

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

export function ScheduleRouteViewer({ schedule, focusParadeId }: ScheduleRouteViewerProps) {
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarSelection | null>(null);
  const [shareStatusByParadeId, setShareStatusByParadeId] = useState<Record<string, ShareStatus>>({});
  const [routeFilter, setRouteFilter] = useState("All routes");
  const [now, setNow] = useState<Date | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const allParades = useMemo(() => schedule.days.flatMap((day) => day.parades.map((parade) => ({ ...parade, day }))), [schedule.days]);
  const firstParade = allParades[0];
  const selectedRoute = selectedRouteName ? routeMapByName.get(selectedRouteName) ?? null : null;
  const routeOptions = useMemo(() => Array.from(new Set(allParades.map((parade) => parade.route))).sort(), [allParades]);
  const filteredDays = useMemo(
    () => schedule.days
      .map((day) => ({ ...day, parades: routeFilter === "All routes" ? day.parades : day.parades.filter((parade) => parade.route === routeFilter) }))
      .filter((day) => day.parades.length > 0),
    [routeFilter, schedule.days]
  );
  const currentDateKey = now ? getCentralDateKey(now) : null;
  const focusedParade = focusParadeId ? allParades.find((parade) => parade.id === focusParadeId) ?? null : null;
  const nextParade = now ? findNextParade(allParades, now, routeFilter) : firstParade ?? null;
  const featuredParade = focusedParade ?? nextParade;

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    function updateBackToTopVisibility() {
      setShowBackToTop(window.scrollY > 700);
    }

    updateBackToTopVisibility();
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTopVisibility);
  }, []);

  useEffect(() => {
    if (!selectedRouteName && !selectedCalendar) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedRouteName(null);
        setSelectedCalendar(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCalendar, selectedRouteName]);

  function openRouteMap(routeName: string) {
    setSelectedRouteName(routeName);
  }

  function closeRouteMap() {
    setSelectedRouteName(null);
  }

  function openCalendar(parade: ParadeEntry, day: ParadeDay) {
    setSelectedCalendar({ parade, day });
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
        <section className="relative overflow-hidden rounded-[1.55rem] border-2 border-[#ffd45a] bg-[radial-gradient(circle_at_86%_16%,rgba(255,212,90,0.22),transparent_25%),linear-gradient(118deg,#2b0645_0%,#4a0b70_48%,#7d259f_100%)] p-4 text-white shadow-[0_20px_55px_rgba(43,6,69,0.42)] sm:p-5">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#d69b16,#ffd45a,#fff2b5,#ffd45a,#d69b16)]" aria-hidden="true" />
          <span className="pointer-events-none absolute right-[-3.5rem] top-[-4.5rem] h-48 w-48 rounded-full border-[1.75rem] border-[#ffd45a]/15" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-[-5.5rem] right-[5rem] h-36 w-36 rounded-full border-[1.25rem] border-white/5" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-[-4rem] left-[-3rem] h-36 w-36 rounded-full bg-[#ffd45a]/10 blur-2xl" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="mt-1 hidden sm:block"><BannerArtworkIcon kind="king" size="medium" /></div>
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright"><Sparkles className="h-4 w-4" aria-hidden="true" /> 2027 parade schedule</p>
                <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl">2027 Mobile Mardi Gras Parade Schedule</h1>
                <p className="mt-2 text-base font-black text-parade-goldBright">{schedule.displayDateRange}</p>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100">
                  Dates, start times, and route-map access for the Mobile Mardi Gras season.
                </p>
              </div>
            </div>

            <div className="shrink-0 lg:min-w-[17rem]">
              <ScheduleStat label="First parade" value={firstParade ? `${firstParade.day.label} • ${firstParade.time}` : "Posted"} />
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            <a
              href="#all-route-maps"
              className="inline-flex items-center gap-2 rounded-full border border-[#fff2b5]/65 bg-[#ffd45a] px-4 py-2.5 text-sm font-black text-[#351052] shadow-glow transition hover:-translate-y-0.5 hover:bg-[#fff2b5]"
            >
              Route maps <MapPinned className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="inline-flex items-center gap-2 px-1 py-2.5 text-xs font-bold text-purple-100">
              <ShieldCheck className="h-4 w-4 text-parade-goldBright" aria-hidden="true" />
              Last verified {formatVerificationDate(schedule.lastTranscribedAt)}
            </span>
          </div>
        </section>

        {featuredParade ? (
          <FeaturedParadePanel
            entry={featuredParade}
            now={now}
            isFocused={Boolean(focusedParade)}
            shareStatus={shareStatusByParadeId[featuredParade.id] ?? "idle"}
            onMap={openRouteMap}
            onCalendar={openCalendar}
            onShare={shareParade}
          />
        ) : (
          <section className="rounded-[1.35rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-civic backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Season complete</p>
            <h2 className="mt-2 text-2xl font-black">All listed 2027 parades have concluded.</h2>
          </section>
        )}

        <section id="quick-parade-schedule" className="scroll-mt-28 space-y-4" aria-labelledby="quick-parade-schedule-heading">
          <div className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#ffd45a] bg-[linear-gradient(120deg,#2b0645_0%,#591284_52%,#7d259f_100%)] text-white shadow-[0_18px_50px_rgba(214,155,22,0.28)]">
            <span className="pointer-events-none absolute bottom-[-5rem] right-[-3rem] h-44 w-44 rounded-full border-[1.75rem] border-[#ffd45a]/15" aria-hidden="true" />

            <div className="relative z-10 flex flex-col gap-3 bg-[linear-gradient(100deg,#d69b16_0%,#ffd45a_48%,#fff0a5_100%)] px-4 py-4 text-[#351052] md:flex-row md:items-end md:justify-between sm:px-5">
              <div className="flex items-center gap-3">
                <BannerArtworkIcon kind="jester" size="medium" />
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#591284]">
                    <Sparkles className="h-4 w-4" aria-hidden="true" /> Quick schedule
                  </p>
                  <h2 id="quick-parade-schedule-heading" className="mt-1 text-3xl font-black tracking-tight text-[#2b0645]">Daily parade listings</h2>
                </div>
              </div>
              <p className="max-w-2xl text-sm font-bold leading-6 text-[#4a0b70]">
                Select a date below to jump directly to that day’s lineup.
              </p>
            </div>

            <div className="relative z-10 p-4 sm:p-5">
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Jump to a schedule date">
                {filteredDays.map((day) => (
                  <a
                    key={day.date}
                    href={`#${day.date}`}
                    className="shrink-0 rounded-full border border-[#ffd45a]/80 bg-[#fffaf0] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#4a0b70] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffd45a]"
                  >
                    {compactDateLabel(day.label)}
                  </a>
                ))}
              </div>

              <div className="mt-4 border-t border-[#ffd45a]/35 pt-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#ffd45a]">
                  <BannerArtworkIcon kind="logo" size="small" /> Filter by route
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filter schedule by route">
                  {["All routes", ...routeOptions].map((route) => (
                    <button
                      key={route}
                      type="button"
                      onClick={() => setRouteFilter(route)}
                      aria-pressed={routeFilter === route}
                      className={`shrink-0 rounded-full border px-3 py-2 text-xs font-black uppercase tracking-wide transition ${routeFilter === route ? "border-[#ffd45a] bg-[#ffd45a] text-[#351052] shadow-glow" : "border-[#fff2b5]/60 bg-[#2b0645]/35 text-[#fffaf0] hover:border-[#ffd45a] hover:bg-[#2b0645]/60"}`}
                    >
                      {route}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDays.map((day) => {
              const isToday = currentDateKey === day.date;

              return (
              <section key={day.date} id={day.date} className={`scroll-mt-28 overflow-hidden rounded-[1.35rem] bg-parade-purpleDeep/62 shadow-card backdrop-blur ${isToday ? "border-2 border-parade-gold shadow-glow" : "border border-parade-gold/35"}`} aria-labelledby={`${day.date}-heading`}>
                <div className="border-b border-parade-gold/25 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-4 py-3 text-white sm:px-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">{day.parades.length} parade{day.parades.length === 1 ? "" : "s"}</p>
                      <h3 id={`${day.date}-heading`} className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{day.label}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isToday ? <StatusPill tone="gold">Today</StatusPill> : null}
                      {day.specialLabel ? <StatusPill tone="gold">{day.specialLabel}</StatusPill> : null}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-parade-gold/20 bg-white/5">
                  {day.parades.map((parade) => {
                    const shareStatus = shareStatusByParadeId[parade.id] ?? "idle";
                    const paradeStatus = now ? getParadeStatus(parade, day, now) : null;

                    return (
                      <article key={parade.id} id={parade.id} className={`scroll-mt-28 px-4 py-3.5 transition hover:bg-white/10 sm:px-5 ${focusParadeId === parade.id ? "bg-parade-gold/10 ring-1 ring-inset ring-parade-gold/50" : ""}`}>
                        <div className="grid gap-3 md:grid-cols-[7.75rem_minmax(0,1fr)_auto] md:items-center">
                          <div className="inline-flex w-fit items-center rounded-full bg-parade-gold px-3 py-1.5 text-sm font-black uppercase tracking-wide text-parade-purpleDark shadow-glow">
                            {parade.time}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-black leading-tight text-white sm:text-xl">{parade.name}</h4>
                              {paradeStatus ? <ParadeStatusPill status={paradeStatus} /> : null}
                            </div>
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
                            <button
                              type="button"
                              onClick={() => openCalendar(parade, day)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-parade-gold/45 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:border-parade-gold hover:bg-parade-gold hover:text-parade-purpleDark"
                              aria-label={`Add ${parade.name} to calendar`}
                            >
                              <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" /> Calendar
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
              );
            })}
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
      {selectedCalendar ? <CalendarDialog selection={selectedCalendar} onClose={() => setSelectedCalendar(null)} /> : null}

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        aria-hidden={!showBackToTop || Boolean(selectedRoute) || Boolean(selectedCalendar)}
        tabIndex={showBackToTop && !selectedRoute && !selectedCalendar ? 0 : -1}
        className={`fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] right-4 z-40 inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#fff2b5] bg-parade-goldBright px-3 text-sm font-black text-parade-purpleDark shadow-[0_12px_35px_rgba(43,6,69,0.45)] transition-all duration-200 hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-parade-gold/50 sm:bottom-6 sm:right-6 sm:px-5 ${
          showBackToTop && !selectedRoute && !selectedCalendar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Back to top</span>
      </button>
    </main>
  );
}

function ScheduleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#fff2b5]/70 bg-[linear-gradient(120deg,rgba(255,212,90,0.24),rgba(255,255,255,0.10))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_25px_rgba(31,3,55,0.24)] backdrop-blur">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#ffd45a]">{label}</p>
      <p className="mt-1 text-sm font-black leading-tight text-[#fffaf0] sm:text-base">{value}</p>
    </div>
  );
}

function FeaturedParadePanel({
  entry,
  now,
  isFocused,
  shareStatus,
  onMap,
  onCalendar,
  onShare
}: {
  entry: TimedParade;
  now: Date | null;
  isFocused: boolean;
  shareStatus: ShareStatus;
  onMap: (routeName: string) => void;
  onCalendar: (parade: ParadeEntry, day: ParadeDay) => void;
  onShare: (parade: ParadeEntry, day: ParadeDay) => Promise<void>;
}) {
  const start = getParadeStart(entry, entry.day);
  const countdownMilliseconds = now ? start.getTime() - now.getTime() : null;

  return (
    <section className="relative overflow-hidden rounded-[1.45rem] border-2 border-[#ffd45a] bg-[linear-gradient(120deg,#2b0645_0%,#591284_48%,#8a2bad_100%)] p-5 text-white shadow-[0_20px_55px_rgba(214,155,22,0.32)] sm:p-6">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#d69b16_0%,#ffd45a_30%,#fff2b5_50%,#ffd45a_70%,#d69b16_100%)]" aria-hidden="true" />
      <span className="pointer-events-none absolute right-[-3rem] top-[-4rem] h-48 w-48 rounded-full border-[2rem] border-[#ffd45a]/15" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-6rem] left-[35%] h-44 w-44 rounded-full bg-[#ffd45a]/15 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="hidden sm:block"><BannerArtworkIcon kind="king" size="large" /></span>
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#ffd45a] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#3b075f] shadow-md">
              <Clock3 className="h-4 w-4" aria-hidden="true" /> {isFocused ? "Shared parade" : "Next parade"}
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-[#fffaf0] drop-shadow-lg sm:text-3xl">{entry.name}</h2>
            <p className="mt-1 text-sm font-black text-[#ffd45a] sm:text-base">
              {formatParadeShareDate(entry.day.date)} • {entry.time} • {entry.route}
            </p>
            {!isFocused ? <NextParadeCountdown milliseconds={countdownMilliseconds} /> : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-[28rem] lg:justify-end">
          <a href={`#${entry.id}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffd45a] px-4 py-2.5 text-sm font-black text-[#3b075f] shadow-md transition hover:-translate-y-0.5 hover:bg-[#ffe584]">
            View listing <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={() => onMap(entry.route)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#fff2b5] bg-[#fffaf0] px-4 py-2.5 text-sm font-black text-[#4a0b70] shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
            {entry.route} map <MapPinned className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onCalendar(entry, entry.day)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffd45a]/70 bg-[#2b0645]/35 px-4 py-2.5 text-sm font-black text-[#fffaf0] transition hover:-translate-y-0.5 hover:bg-[#2b0645]/55">
            Calendar <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onShare(entry, entry.day)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffd45a]/70 bg-[#2b0645]/35 px-4 py-2.5 text-sm font-black text-[#fffaf0] transition hover:-translate-y-0.5 hover:bg-[#2b0645]/55">
            {shareStatus === "shared" || shareStatus === "copied" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
            {getShareButtonLabel(shareStatus)}
          </button>
        </div>
      </div>
    </section>
  );
}

function NextParadeCountdown({ milliseconds }: { milliseconds: number | null }) {
  if (milliseconds !== null && milliseconds <= 0) {
    return <p className="mt-2 text-sm font-bold text-[#fff2d0]">Scheduled activity is underway.</p>;
  }

  const totalSeconds = milliseconds === null ? null : Math.floor(milliseconds / 1000);
  const values = [
    { label: "Days", value: totalSeconds === null ? null : Math.floor(totalSeconds / 86400) },
    { label: "Hours", value: totalSeconds === null ? null : Math.floor((totalSeconds % 86400) / 3600) },
    { label: "Min", value: totalSeconds === null ? null : Math.floor((totalSeconds % 3600) / 60) },
    { label: "Sec", value: totalSeconds === null ? null : totalSeconds % 60 }
  ];

  return (
    <div className="mt-2 flex max-w-[19rem] gap-1.5" aria-label="Live countdown to the next parade" aria-live="polite">
      {values.map(({ label, value }) => (
        <div key={label} className="min-w-0 flex-1 rounded-lg border border-[#ffd45a]/40 bg-[#2b0645]/55 px-1.5 py-1 text-center shadow-sm ring-1 ring-white/5">
          <p className="text-base font-black leading-none tabular-nums text-[#ffd45a]">
            {value === null ? "--" : String(value).padStart(2, "0")}
          </p>
          <p className="mt-0.5 text-[0.52rem] font-black uppercase leading-none tracking-[0.12em] text-[#fff2d0]">{label}</p>
        </div>
      ))}
    </div>
  );
}

function BannerArtworkIcon({ kind, size }: { kind: "jester" | "logo" | "king"; size: "small" | "medium" | "large" }) {
  const sizeClass = size === "large" ? "h-16 w-16 border-4" : size === "medium" ? "h-12 w-12 border-[3px]" : "h-7 w-7 border-2";
  const source = kind === "jester"
    ? "/images/schedule/mardi-gras-jester-icon.webp"
    : kind === "king"
      ? "/images/schedule/mardi-gras-king-icon.webp"
      : "/images/mardi-gras-mobile-logo.png";

  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full border-[#fff2b5] bg-[#2b0645] shadow-[0_0_24px_rgba(255,212,90,0.48)] ring-2 ring-[#d69b16]/35 ${sizeClass}`} aria-hidden="true">
      <span
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${source}')`
        }}
      />
    </span>
  );
}

function ParadeStatusPill({ status }: { status: "rolling" | "finished" }) {
  if (status === "rolling") {
    return <span className="rounded-full bg-parade-gold px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-parade-purpleDark shadow-glow">Rolling now</span>;
  }

  return <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-purple-100">Finished</span>;
}

function CalendarDialog({ selection, onClose }: { selection: CalendarSelection; onClose: () => void }) {
  const { parade, day } = selection;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="calendar-dialog-title">
      <div className="w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-parade-gold/45 bg-parade-purpleDeep text-white shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-parade-gold/25 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Add to calendar</p>
            <h2 id="calendar-dialog-title" className="mt-1 text-2xl font-black">{parade.name}</h2>
            <p className="mt-2 text-sm font-bold text-purple-100">{formatParadeShareDate(day.date)} • {parade.time}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15" aria-label="Close calendar options">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <a href={buildGoogleCalendarUrl(parade, day)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-4 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
            Google Calendar <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={`/api/parades/${parade.id}/ics`} className="inline-flex items-center justify-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15">
            Apple / Outlook <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p className="px-5 pb-5 text-xs font-semibold leading-5 text-purple-100">Calendar entries use a three-hour planning window. Confirm final times and changes before attending.</p>
      </div>
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
  return `${SCHEDULE_SHARE_BASE_URL}/${encodeURIComponent(paradeId)}`;
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

function formatVerificationDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago"
  }).format(new Date(`${value}T12:00:00-05:00`));
}

function getCentralDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Chicago"
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function getParadeStart(parade: ParadeEntry, day: ParadeDay) {
  const { hour, minute } = parseParadeTime(parade.time);
  return new Date(`${day.date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-06:00`);
}

function parseParadeTime(value: string) {
  if (value.toLowerCase() === "noon") {
    return { hour: 12, minute: 0 };
  }

  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return { hour: 12, minute: 0 };
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;
  return { hour, minute };
}

function findNextParade(parades: TimedParade[], now: Date, routeFilter: string) {
  return parades
    .filter((parade) => routeFilter === "All routes" || parade.route === routeFilter)
    .find((parade) => getParadeStart(parade, parade.day).getTime() + 3 * 60 * 60 * 1000 > now.getTime()) ?? null;
}

function getParadeStatus(parade: ParadeEntry, day: ParadeDay, now: Date): "rolling" | "finished" | null {
  const start = getParadeStart(parade, day).getTime();
  const end = start + 3 * 60 * 60 * 1000;
  if (now.getTime() >= end) return "finished";
  if (now.getTime() >= start) return "rolling";
  return null;
}

function buildGoogleCalendarUrl(parade: ParadeEntry, day: ParadeDay) {
  const start = getParadeStart(parade, day);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: parade.name,
    dates: `${formatCalendarUtc(start)}/${formatCalendarUtc(end)}`,
    details: `Mobile Mardi Gras 2027 parade. ${parade.route}. Verify schedule details before attending. ${buildParadeShareUrl(parade.id)}`,
    location: `Mobile, Alabama — ${parade.route}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatCalendarUtc(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
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
