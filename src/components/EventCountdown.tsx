"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

type EventCountdownProps = {
  eyebrow?: string;
  title: string;
  eventName: string;
  targetDateTime: string;
  dateLabel: string;
  locationLabel?: string;
  logoSrc?: string;
  logoAlt?: string;
};

function getCountdownParts(targetTime: number): CountdownParts {
  const remaining = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: remaining <= 0
  };
}

function formatTwoDigits(value: number) {
  return value.toString().padStart(2, "0");
}

export function EventCountdown({
  eyebrow = "Live countdown",
  title,
  eventName,
  targetDateTime,
  dateLabel,
  locationLabel,
  logoSrc,
  logoAlt
}: EventCountdownProps) {
  const targetTime = useMemo(() => new Date(targetDateTime).getTime(), [targetDateTime]);
  const [timeLeft, setTimeLeft] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const updateCountdown = () => setTimeLeft(getCountdownParts(targetTime));

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  const displayParts = [
    { label: "Days", value: timeLeft ? timeLeft.days.toString() : "—" },
    { label: "Hours", value: timeLeft ? formatTwoDigits(timeLeft.hours) : "—" },
    { label: "Minutes", value: timeLeft ? formatTwoDigits(timeLeft.minutes) : "—" },
    { label: "Seconds", value: timeLeft ? formatTwoDigits(timeLeft.seconds) : "—" }
  ];

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-parade-gold/40 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-5 text-white shadow-card sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {logoSrc ? (
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.25rem] border border-parade-gold/40 bg-white p-2 shadow-glow ring-1 ring-white/20">
                <img src={logoSrc} alt={logoAlt ?? ""} className="max-h-full max-w-full object-contain" />
              </span>
            ) : null}
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright shadow-glow">
                <span className="h-2 w-2 rounded-full bg-parade-goldBright shadow-glow" aria-hidden="true" />
                {eyebrow}
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-parade-goldBright">{eventName}</p>
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-7 text-purple-100">{dateLabel}</p>
          {locationLabel ? <p className="mt-1 text-sm font-semibold text-purple-100">{locationLabel}</p> : null}
        </div>

        {timeLeft?.isComplete ? (
          <div className="rounded-[1.25rem] border border-parade-gold/35 bg-white/10 p-4 text-center shadow-glow lg:min-w-64">
            <p className="text-3xl font-black text-parade-goldBright">It’s time.</p>
            <p className="mt-2 text-sm font-semibold text-purple-100">The countdown has reached the scheduled event time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[30rem]" aria-live="polite">
            {displayParts.map((part) => (
              <div key={part.label} className="rounded-[1.25rem] border border-parade-gold/35 bg-white/10 px-3 py-4 text-center shadow-glow backdrop-blur">
                <p className="text-3xl font-black tabular-nums text-parade-goldBright sm:text-4xl">{part.value}</p>
                <p className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-purple-100">{part.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
