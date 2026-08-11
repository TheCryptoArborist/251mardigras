"use client";

import { useEffect, useMemo, useState } from "react";

const FIRST_DOWNTOWN_PARADE_TARGET = "2027-01-22T18:30:00-06:00";
const TARGET_LABEL = "January 22, 2027 • 6:30 PM CT";

type TimeRemaining = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function CountdownTimer() {
  const targetDate = useMemo(() => new Date(FIRST_DOWNTOWN_PARADE_TARGET), []);
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(getTimeRemaining(targetDate));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const countdownExpired = timeRemaining.totalMilliseconds <= 0;

  return (
    <section className="mt-7 max-w-3xl rounded-[1.5rem] border border-white/15 bg-white/10 p-4 shadow-glow backdrop-blur" aria-label="Countdown to the first downtown Mobile parade">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Countdown to parade season</p>
          <h2 className="mt-1 text-xl font-black text-white">First downtown parade rolls in</h2>
          <p className="mt-1 text-sm font-semibold text-purple-100">{TARGET_LABEL}</p>
        </div>
        {countdownExpired ? (
          <p className="rounded-2xl bg-parade-gold px-4 py-3 text-sm font-black text-parade-purpleDark shadow-glow">
            Parade season is underway.
          </p>
        ) : null}
      </div>

      {!countdownExpired ? (
        <div className="mt-4 grid grid-cols-4 gap-2" aria-live="polite">
          <CountdownValue label="Days" value={timeRemaining.days} />
          <CountdownValue label="Hours" value={timeRemaining.hours} />
          <CountdownValue label="Minutes" value={timeRemaining.minutes} />
          <CountdownValue label="Seconds" value={timeRemaining.seconds} />
        </div>
      ) : null}

      <p className="mt-3 text-xs font-medium leading-5 text-purple-100/90">
        This countdown is for visitor planning and channel coverage. Verify official schedules, routes, road closures, and public-safety guidance with official sources before travel.
      </p>
    </section>
  );
}

function CountdownValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/90 px-2 py-3 text-center shadow-sm">
      <p className="text-2xl font-black tabular-nums text-parade-purpleDark sm:text-3xl">{String(value).padStart(2, "0")}</p>
      <p className="mt-1 text-[0.65rem] font-black uppercase tracking-wide text-parade-muted">{label}</p>
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
