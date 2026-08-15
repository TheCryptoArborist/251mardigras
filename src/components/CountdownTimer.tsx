"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ScheduleNotificationSignup } from "@/components/ScheduleNotificationSignup";

const FIRST_DOWNTOWN_PARADE_TARGET = "2027-01-22T18:30:00-06:00";
const COUNTDOWN_PROGRESS_START = "2026-01-22T18:30:00-06:00";
const TARGET_LABEL = "Conde Cavaliers • January 22, 2027 • 6:30 PM CT";

type TimeRemaining = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function CountdownTimer() {
  const targetDate = useMemo(() => new Date(FIRST_DOWNTOWN_PARADE_TARGET), []);
  const progressStartDate = useMemo(() => new Date(COUNTDOWN_PROGRESS_START), []);
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(getTimeRemaining(targetDate));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const countdownExpired = timeRemaining.totalMilliseconds <= 0;
  const countdownProgress = getCountdownProgress(progressStartDate, targetDate, timeRemaining.totalMilliseconds);
  const daysRemainingLabel = timeRemaining.days === 1 ? "1 day remaining" : `${timeRemaining.days} days remaining`;

  return (
    <section
      className="mt-7 max-w-4xl overflow-hidden rounded-[1.75rem] border border-parade-gold/35 bg-gradient-to-br from-white/14 via-white/10 to-parade-purpleDeep/40 p-4 shadow-glow backdrop-blur sm:p-5"
      aria-label="Countdown to the first downtown Mobile parade"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Parade season countdown</p>
            {!countdownExpired ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-parade-gold/35 bg-white/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-white shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-parade-gold opacity-75" aria-hidden="true" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-parade-gold" aria-hidden="true" />
                </span>
                Live countdown
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">First Downtown Parade</h2>
          <p className="mt-1 text-sm font-bold text-purple-100 sm:text-base">{TARGET_LABEL}</p>
        </div>
        {countdownExpired ? (
          <p className="rounded-2xl bg-parade-gold px-4 py-3 text-sm font-black text-parade-purpleDark shadow-glow">
            Parade season is underway.
          </p>
        ) : null}
      </div>

      {!countdownExpired ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
            <CountdownValue label="Days" value={timeRemaining.days} />
            <CountdownValue label="Hours" value={timeRemaining.hours} />
            <CountdownValue label="Minutes" value={timeRemaining.minutes} />
            <CountdownValue label="Seconds" value={timeRemaining.seconds} />
          </div>

          <div className="mt-4 rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/45 p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[0.72rem] font-black uppercase tracking-wide text-purple-100">
              <span>Parade season is getting closer</span>
              <span className="text-parade-goldBright">{daysRemainingLabel}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-parade-gold via-parade-goldBright to-white shadow-glow transition-[width] duration-700 ease-out"
                style={{ width: `${countdownProgress}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </>
      ) : null}

      <p className="mt-3 text-xs font-semibold leading-5 text-purple-100/90 sm:text-sm sm:leading-6">
        For planning only. Verify schedules, routes, closures, and public-safety updates with official sources before travel.
      </p>

      <div className="mt-4 rounded-2xl border border-parade-gold/45 bg-parade-purpleDeep/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parade-gold text-parade-purpleDark shadow-sm">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-black text-white">2027 Parade Schedule Coming Soon</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-purple-100">
                Verified dates, start times, routes, and official-source links will be posted after the schedule is released.
              </p>
            </div>
          </div>
          <Link
            href="/schedule"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-parade-gold/55 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Schedule page <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4">
          <ScheduleNotificationSignup source="homepage" compact />
        </div>
      </div>
    </section>
  );
}

function CountdownValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist px-2 py-3 text-center shadow-civic ring-1 ring-white/55 sm:py-4">
      <span className="pointer-events-none absolute right-[-1.75rem] top-[-1.75rem] h-16 w-16 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <p className="relative z-10 text-3xl font-black tabular-nums tracking-tight text-parade-purpleDark sm:text-4xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="relative z-10 mt-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-parade-muted">{label}</p>
    </div>
  );
}

function getTimeRemaining(targetDate: Date): TimeRemaining {
  const totalMilliseconds = Math.max(targetDate.getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMilliseconds,
    days,
    hours,
    minutes,
    seconds
  };
}

function getCountdownProgress(startDate: Date, targetDate: Date, remainingMilliseconds: number) {
  const totalWindow = targetDate.getTime() - startDate.getTime();
  const elapsed = totalWindow - remainingMilliseconds;
  const percentage = totalWindow > 0 ? (elapsed / totalWindow) * 100 : 100;

  return Math.min(Math.max(percentage, 0), 100);
}
