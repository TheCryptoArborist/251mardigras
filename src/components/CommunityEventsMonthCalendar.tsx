"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { CommunityEvent } from "@/lib/community-events";

const CENTRAL_TIME_ZONE = "America/Chicago";
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const centralDatePartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CENTRAL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

const monthTitleFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric"
});

const agendaDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CENTRAL_TIME_ZONE,
  weekday: "short",
  month: "short",
  day: "numeric"
});

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CENTRAL_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit"
});

export function CommunityEventsMonthCalendar({ events }: { events: CommunityEvent[] }) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  const initialMonth = getInitialMonth(sortedEvents);
  const [visibleMonth, setVisibleMonth] = useState<Date>(initialMonth);
  const visibleYear = visibleMonth.getFullYear();
  const visibleMonthIndex = visibleMonth.getMonth();
  const visibleMonthLabel = monthTitleFormatter.format(visibleMonth);
  const eventsByDate = groupEventsByDate(sortedEvents);
  const monthCells = buildMonthCells(visibleYear, visibleMonthIndex);
  const visibleMonthEvents = sortedEvents.filter((event) => {
    const parts = getCentralDateParts(event.startDateTime);
    return parts.year === visibleYear && parts.monthIndex === visibleMonthIndex;
  });

  function changeMonth(offset: number) {
    setVisibleMonth(new Date(visibleYear, visibleMonthIndex + offset, 1));
  }

  function resetMonth() {
    setVisibleMonth(initialMonth);
  }

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist shadow-card">
      <div className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white">
        <span className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Monthly view</p>
              <h2 className="mt-1 text-2xl font-black text-white">Approved community events</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100">
                Browse approved Mardi Gras-related events by month. Tap an event to open its full details, flyer, map, and calendar options.
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 sm:w-auto">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetMonth}
              className="min-w-40 rounded-xl px-3 py-2 text-center text-sm font-black text-parade-goldBright transition hover:bg-white/10"
            >
              {visibleMonthLabel}
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-wide text-parade-purple">
            {weekdayLabels.map((weekday) => (
              <div key={weekday} className="rounded-xl bg-white/70 px-2 py-2 ring-1 ring-parade-gold/20">
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthCells.map((cell, index) => {
              if (!cell.day || !cell.dateKey) {
                return <div key={`blank-${index}`} className="min-h-28 rounded-2xl border border-parade-gold/15 bg-white/35" aria-hidden="true" />;
              }

              const dayEvents = eventsByDate[cell.dateKey] ?? [];

              return (
                <div key={cell.dateKey} className="min-h-28 rounded-2xl border border-parade-gold/25 bg-white/80 p-2 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-parade-purple text-xs font-black text-parade-goldBright">
                      {cell.day}
                    </span>
                    {dayEvents.length > 0 ? (
                      <span className="rounded-full bg-parade-goldSoft px-2 py-0.5 text-[0.62rem] font-black uppercase text-parade-purple">
                        {dayEvents.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="block rounded-xl bg-parade-purple px-2 py-1.5 text-left text-[0.68rem] font-black leading-4 text-white transition hover:bg-parade-purpleDark"
                      >
                        <span className="block truncate">{event.title}</span>
                        <span className="mt-0.5 block truncate text-[0.62rem] font-bold text-parade-goldBright">{formatEventTime(event.startDateTime)} CT</span>
                      </Link>
                    ))}
                    {dayEvents.length > 2 ? (
                      <Link href="#approved-event-details" className="block text-[0.68rem] font-black text-parade-purple hover:underline">
                        +{dayEvents.length - 2} more
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden">
          <h3 className="text-base font-black text-parade-purpleDark">{visibleMonthLabel} agenda</h3>
          <MobileAgenda events={visibleMonthEvents} />
        </div>

        <div className="mt-5 rounded-2xl border border-parade-gold/30 bg-white/75 p-4 text-sm font-semibold leading-6 text-parade-muted">
          Calendar only displays approved community submissions. Verify details with the host organization before attending.
        </div>
      </div>
    </section>
  );
}

function MobileAgenda({ events }: { events: CommunityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="mt-3 rounded-2xl border border-dashed border-parade-gold/35 bg-white/75 p-4 text-sm font-semibold leading-6 text-parade-muted">
        No approved community events are posted for this month yet.
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.slug}`}
          className="block rounded-2xl border border-parade-gold/30 bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-civic"
        >
          <p className="text-xs font-black uppercase tracking-wide text-parade-purple">{formatAgendaDate(event.startDateTime)}</p>
          <h4 className="mt-1 text-base font-black text-parade-purpleDark">{event.title}</h4>
          <p className="mt-1 text-sm font-semibold text-parade-muted">{event.eventType} • {formatEventTime(event.startDateTime)} CT</p>
        </Link>
      ))}
    </div>
  );
}

function getInitialMonth(events: CommunityEvent[]) {
  const now = new Date();
  const nextUpcomingEvent = events.find((event) => new Date(event.endDateTime).getTime() >= now.getTime()) ?? events[0];

  if (!nextUpcomingEvent) {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const parts = getCentralDateParts(nextUpcomingEvent.startDateTime);
  return new Date(parts.year, parts.monthIndex, 1);
}

function groupEventsByDate(events: CommunityEvent[]) {
  return events.reduce<Record<string, CommunityEvent[]>>((groups, event) => {
    const key = getCentralDateParts(event.startDateTime).dateKey;
    groups[key] = [...(groups[key] ?? []), event];
    return groups;
  }, {});
}

function buildMonthCells(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlankDays = firstDay.getDay();
  const cells: { day: number | null; dateKey: string | null }[] = [];

  for (let index = 0; index < leadingBlankDays; index += 1) {
    cells.push({ day: null, dateKey: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, dateKey: `${year}-${pad(monthIndex + 1)}-${pad(day)}` });
  }

  const trailingBlankDays = (7 - (cells.length % 7)) % 7;
  for (let index = 0; index < trailingBlankDays; index += 1) {
    cells.push({ day: null, dateKey: null });
  }

  return cells;
}

function getCentralDateParts(value: string) {
  const parts = Object.fromEntries(
    centralDatePartsFormatter.formatToParts(new Date(value)).map((part) => [part.type, part.value])
  );
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);

  return {
    year,
    monthIndex: month - 1,
    day,
    dateKey: `${year}-${pad(month)}-${pad(day)}`
  };
}

function formatEventTime(value: string) {
  return eventTimeFormatter.format(new Date(value));
}

function formatAgendaDate(value: string) {
  return agendaDateFormatter.format(new Date(value));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}
