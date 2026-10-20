"use client";

import Link from "next/link";
import { ArrowRight, Check, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const FIRST_DOWNTOWN_PARADE_TARGET = "2027-01-22T18:30:00-06:00";
const COUNTDOWN_PROGRESS_START = "2026-02-17T00:00:00-06:00";
const TARGET_EVENT_NAME = "Conde Cavaliers";
const TARGET_FULL_DATE_LABEL = "January 22, 2027 • 6:30 PM CT";
const TARGET_SHORT_DATE_LABEL = "Jan. 22, 2027 • 6:30 PM CT";
const COUNTDOWN_SHARE_URL = "https://mg251.xyz/#mardi-gras-countdown";
const COUNTDOWN_SHARE_TITLE = "Mobile Mardi Gras Countdown";
const X_SHARE_INTENT_URL = "https://x.com/intent/tweet";

type TimeRemaining = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type ShareStatus = "idle" | "shared" | "copied" | "error";

export function CountdownTimer({ mardiGrasDay }: { mardiGrasDay: string }) {
  const targetDate = useMemo(() => new Date(FIRST_DOWNTOWN_PARADE_TARGET), []);
  const progressStartDate = useMemo(() => new Date(COUNTDOWN_PROGRESS_START), []);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(getTimeRemaining(targetDate));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (shareStatus === "idle") return;
    const timeout = window.setTimeout(() => setShareStatus("idle"), 2800);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const countdownExpired = timeRemaining !== null && timeRemaining.totalMilliseconds <= 0;
  const countdownProgress = timeRemaining ? getCountdownProgress(progressStartDate, targetDate, timeRemaining.totalMilliseconds) : 0;
  const shareButtonLabel = getShareButtonLabel(shareStatus);
  const shareStatusMessage = getShareStatusMessage(shareStatus);
  const currentShareText = timeRemaining ? buildCountdownShareText(timeRemaining) : `${TARGET_EVENT_NAME} — ${TARGET_FULL_DATE_LABEL}.`;
  const xShareUrl = buildXIntentUrl(currentShareText);

  async function handleShareCountdown() {
    const shareText = buildCountdownShareText(getTimeRemaining(targetDate));
    try {
      if (navigator.share) {
        await navigator.share({ title: COUNTDOWN_SHARE_TITLE, text: shareText, url: COUNTDOWN_SHARE_URL });
        setShareStatus("shared");
        return;
      }
      setShareStatus(await copyCountdownShareText(shareText) ? "copied" : "error");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const copied = await copyCountdownShareText(shareText).catch(() => false);
      setShareStatus(copied ? "copied" : "error");
    }
  }

  return (
    <section id="mardi-gras-countdown" className="mt-5 scroll-mt-28 rounded-2xl border border-parade-gold/35 bg-parade-purpleDeep/55 p-4 backdrop-blur sm:mt-6 sm:p-5" aria-label="Countdown to the first downtown Mobile parade">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-parade-goldBright sm:text-base">First downtown parade</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-purple-100">{TARGET_EVENT_NAME} • {TARGET_SHORT_DATE_LABEL}</p>
        </div>
        <button type="button" onClick={handleShareCountdown} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-parade-gold/50 bg-white/10 px-3 text-xs font-black text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright" aria-label="Share the Mobile Mardi Gras countdown">
          {shareStatus === "shared" || shareStatus === "copied" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Share2 className="h-3.5 w-3.5" aria-hidden="true" />}
          {shareButtonLabel}
        </button>
      </div>
      <p className="sr-only" role="status">{shareStatusMessage}</p>
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
        <a href={xShareUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1 font-bold text-white hover:underline" aria-label="Post the Mobile Mardi Gras countdown to X">Post to X <ArrowRight className="h-3 w-3" aria-hidden="true" /></a>
      </div>
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

function buildCountdownShareText(timeRemaining: TimeRemaining) {
  if (timeRemaining.totalMilliseconds <= 0) {
    return `The first downtown parade date has arrived. Check the latest Mobile Mardi Gras schedule. This countdown tracked: ${TARGET_EVENT_NAME} — ${TARGET_FULL_DATE_LABEL}.`;
  }

  return `Current countdown: ${formatTimeRemainingForShare(timeRemaining)} until the first downtown Mobile Mardi Gras parade — ${TARGET_EVENT_NAME}, ${TARGET_FULL_DATE_LABEL}.`;
}

function formatTimeRemainingForShare(timeRemaining: TimeRemaining) {
  return [
    formatShareUnit(timeRemaining.days, "day"),
    formatShareUnit(timeRemaining.hours, "hour"),
    formatShareUnit(timeRemaining.minutes, "minute"),
    formatShareUnit(timeRemaining.seconds, "second")
  ].join(", ");
}

function formatShareUnit(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function buildXIntentUrl(shareText: string) {
  const params = new URLSearchParams({
    text: `${shareText}\n\n${COUNTDOWN_SHARE_URL}`
  });

  return `${X_SHARE_INTENT_URL}?${params.toString()}`;
}

async function copyCountdownShareText(shareText: string) {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(`${shareText}\n${COUNTDOWN_SHARE_URL}`);
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

function getShareStatusMessage(status: ShareStatus) {
  if (status === "shared") {
    return "Countdown share menu opened with the current countdown numbers.";
  }

  if (status === "copied") {
    return "Countdown text and link copied to clipboard.";
  }

  if (status === "error") {
    return "Countdown text and link could not be copied automatically.";
  }

  return "";
}
