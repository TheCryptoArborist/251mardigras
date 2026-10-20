"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  COUNTDOWN_PROGRESS_START,
  FIRST_DOWNTOWN_PARADE_TARGET,
  TARGET_EVENT_NAME,
  TARGET_FULL_DATE_LABEL,
  TARGET_SHORT_DATE_LABEL,
  createCountdownSnapshot,
  getTimeRemaining,
  type CountdownSnapshot,
  type TimeRemaining
} from "@/lib/countdown-share";

const CountdownShareDialog = dynamic(() => import("@/components/CountdownShareDialog").then((module) => module.CountdownShareDialog), { ssr: false });

export function CountdownTimer({ mardiGrasDay }: { mardiGrasDay: string }) {
  const targetDate = useMemo(() => new Date(FIRST_DOWNTOWN_PARADE_TARGET), []);
  const progressStartDate = useMemo(() => new Date(COUNTDOWN_PROGRESS_START), []);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [shareSnapshot, setShareSnapshot] = useState<CountdownSnapshot | null>(null);

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(getTimeRemaining());
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const countdownExpired = timeRemaining !== null && timeRemaining.totalMilliseconds <= 0;
  const countdownProgress = timeRemaining ? getCountdownProgress(progressStartDate, targetDate, timeRemaining.totalMilliseconds) : 0;

  return (
    <section id="mardi-gras-countdown" className="mt-5 scroll-mt-28 rounded-2xl border border-parade-gold/35 bg-parade-purpleDeep/55 p-4 backdrop-blur sm:mt-6 sm:p-5" aria-label="Countdown to the first downtown Mobile parade">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-parade-goldBright sm:text-base">First downtown parade</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-purple-100">{TARGET_EVENT_NAME} • {TARGET_SHORT_DATE_LABEL}</p>
        </div>
        <button type="button" onClick={() => setShareSnapshot(createCountdownSnapshot())} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-parade-gold/50 bg-white/10 px-3 text-xs font-black text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright" aria-label="Share the Mobile Mardi Gras countdown" aria-haspopup="dialog">
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          Share
        </button>
      </div>
      {!countdownExpired ? (
        <>
          <p className="sr-only">Counting down to {TARGET_EVENT_NAME}, {TARGET_FULL_DATE_LABEL}.</p>
          <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden="true">
            <CountdownValue label="Days" value={timeRemaining?.days} />
            <CountdownValue label="Hours" value={timeRemaining?.hours} />
            <CountdownValue label="Minutes" value={timeRemaining?.minutes} />
            <CountdownValue label="Seconds" value={timeRemaining?.seconds} />
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
            <span className="block h-full rounded-full bg-parade-goldBright" style={{ width: `${countdownProgress}%` }} />
          </div>
        </>
      ) : <p className="mt-4 text-sm font-bold text-white">The first parade date has arrived. <Link className="underline" href="/schedule">Check the current schedule.</Link></p>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs leading-5 text-purple-100">
        <p><span className="font-bold text-parade-goldBright">Mardi Gras Day:</span> {mardiGrasDay}</p>
        <button type="button" onClick={() => setShareSnapshot(createCountdownSnapshot())} className="inline-flex min-h-8 items-center gap-1 font-bold text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright" aria-haspopup="dialog">Get a card + caption <ArrowRight className="h-3 w-3" aria-hidden="true" /></button>
      </div>
      {shareSnapshot ? <CountdownShareDialog snapshot={shareSnapshot} onClose={() => setShareSnapshot(null)} /> : null}
    </section>
  );
}

function CountdownValue({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl border border-parade-gold/25 bg-parade-purpleDeep/65 px-1 py-2 text-center">
      <p className="text-3xl font-black leading-tight tabular-nums tracking-tight text-parade-goldBright sm:text-4xl">{value === undefined ? "–" : String(value).padStart(2, "0")}</p>
      <p className="mt-0.5 text-[0.6rem] font-black uppercase tracking-wide text-purple-100">{label}</p>
    </div>
  );
}

function getCountdownProgress(startDate: Date, targetDate: Date, remainingMilliseconds: number) {
  const totalWindow = targetDate.getTime() - startDate.getTime();
  const elapsed = totalWindow - remainingMilliseconds;
  const percentage = totalWindow > 0 ? (elapsed / totalWindow) * 100 : 100;

  return Math.min(Math.max(percentage, 0), 100);
}
