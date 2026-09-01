"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ScheduleNotificationSignup } from "@/components/ScheduleNotificationSignup";

const FIRST_DOWNTOWN_PARADE_TARGET = "2027-01-22T18:30:00-06:00";
const COUNTDOWN_PROGRESS_START = "2026-01-22T18:30:00-06:00";
const COUNTDOWN_PROGRESS_START_LABEL = "Jan. 22, 2026";
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

export function CountdownTimer() {
  const targetDate = useMemo(() => new Date(FIRST_DOWNTOWN_PARADE_TARGET), []);
  const progressStartDate = useMemo(() => new Date(COUNTDOWN_PROGRESS_START), []);
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(targetDate));
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(getTimeRemaining(targetDate));
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (shareStatus === "idle") {
      return undefined;
    }

    const timeout = window.setTimeout(() => setShareStatus("idle"), 2800);

    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const countdownExpired = timeRemaining.totalMilliseconds <= 0;
  const countdownProgress = getCountdownProgress(progressStartDate, targetDate, timeRemaining.totalMilliseconds);
  const countdownProgressLabel = `${Math.round(countdownProgress)}% complete`;
  const daysRemainingLabel = timeRemaining.days === 1 ? "1 day remaining" : `${timeRemaining.days} days remaining`;
  const shareButtonLabel = getShareButtonLabel(shareStatus);
  const shareStatusMessage = getShareStatusMessage(shareStatus);
  const currentShareText = buildCountdownShareText(timeRemaining);
  const xShareUrl = buildXIntentUrl(currentShareText);

  async function handleShareCountdown() {
    const shareText = buildCountdownShareText(timeRemaining);
    const shareData = {
      title: COUNTDOWN_SHARE_TITLE,
      text: shareText,
      url: COUNTDOWN_SHARE_URL
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("shared");
        return;
      }

      const copied = await copyCountdownShareText(shareText);
      setShareStatus(copied ? "copied" : "error");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const copied = await copyCountdownShareText(shareText).catch(() => false);
      setShareStatus(copied ? "copied" : "error");
    }
  }

  return (
    <div className="mt-7 max-w-4xl space-y-3">
      <section
        id="mardi-gras-countdown"
        className="scroll-mt-28 overflow-hidden rounded-[1.55rem] border border-parade-gold/40 bg-gradient-to-br from-parade-purpleDeep/72 via-parade-purpleDark/62 to-parade-purple/48 p-4 shadow-glow backdrop-blur sm:rounded-[1.75rem] sm:p-5"
        aria-label="Countdown to the first downtown Mobile parade"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright">Parade season countdown</p>
              {!countdownExpired ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-parade-gold/35 bg-parade-purpleDeep/45 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-purple-50 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-parade-gold opacity-75" aria-hidden="true" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-parade-gold" aria-hidden="true" />
                  </span>
                  <span className="sm:hidden">Live</span>
                  <span className="hidden sm:inline">Live countdown</span>
                </span>
              ) : null}
            </div>
            <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">First Downtown Parade</h2>
            <p className="mt-1 text-sm font-bold leading-6 text-purple-100 sm:text-base">
              <span>{TARGET_EVENT_NAME}</span>
              <span className="hidden sm:inline"> • {TARGET_FULL_DATE_LABEL}</span>
              <span className="block sm:hidden">{TARGET_SHORT_DATE_LABEL}</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={handleShareCountdown}
              className="inline-flex w-fit items-center justify-center gap-1.5 rounded-full border border-parade-gold/55 bg-parade-gold px-3 py-2 text-xs font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
              aria-label="Share the Mobile Mardi Gras countdown with the current countdown numbers"
            >
              {shareStatus === "shared" || shareStatus === "copied" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Share2 className="h-3.5 w-3.5" aria-hidden="true" />}
              {shareButtonLabel}
            </button>
            <a
              href={xShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center justify-center gap-1.5 rounded-full border border-parade-gold/30 bg-parade-purpleDeep/45 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:border-parade-gold/55 hover:bg-parade-purpleDeep/65"
              aria-label="Post the current Mobile Mardi Gras countdown to X"
            >
              <span className="text-sm leading-none" aria-hidden="true">𝕏</span>
              Post to X
            </a>
            {countdownExpired ? (
              <p className="basis-full rounded-2xl bg-parade-gold px-4 py-3 text-sm font-black text-parade-purpleDark shadow-glow sm:text-right">
                Parade season is underway.
              </p>
            ) : null}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {shareStatusMessage}
        </p>

        {!countdownExpired ? (
          <>
            <div className="mt-5 sm:hidden" aria-live="polite">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep/95 via-parade-purpleDark/90 to-parade-purple/75 px-4 py-5 text-center shadow-civic ring-1 ring-parade-gold/25">
                <span className="pointer-events-none absolute right-[-2.5rem] top-[-2.5rem] h-24 w-24 rounded-full bg-parade-gold/25 blur-2xl" aria-hidden="true" />
                <span className="pointer-events-none absolute left-[-2rem] bottom-[-2rem] h-20 w-20 rounded-full bg-white/8 blur-2xl" aria-hidden="true" />
                <p className="relative z-10 text-6xl font-black leading-none tabular-nums tracking-tight text-parade-goldBright drop-shadow-lg">
                  {timeRemaining.days}
                </p>
                <p className="relative z-10 mt-2 text-xs font-black uppercase tracking-[0.22em] text-purple-100">
                  Days
                </p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <CountdownMiniValue label="Hrs" value={timeRemaining.hours} />
                <CountdownMiniValue label="Min" value={timeRemaining.minutes} />
                <CountdownMiniValue label="Sec" value={timeRemaining.seconds} />
              </div>
            </div>

            <div className="mt-5 hidden grid-cols-4 gap-2 sm:grid" aria-live="polite">
              <CountdownValue label="Days" value={timeRemaining.days} />
              <CountdownValue label="Hours" value={timeRemaining.hours} />
              <CountdownValue label="Minutes" value={timeRemaining.minutes} />
              <CountdownValue label="Seconds" value={timeRemaining.seconds} />
            </div>

            <div className="mt-3 rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 p-3 shadow-sm sm:mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[0.72rem] font-black uppercase tracking-wide text-purple-100">
                <span>Countdown progress</span>
                <span className="text-parade-goldBright">{countdownProgressLabel}</span>
              </div>
              <p className="mt-1 text-xs font-bold leading-5 text-purple-100/90">
                {daysRemainingLabel} until the first downtown parade.
              </p>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-black/20 ring-1 ring-parade-gold/15"
                aria-label={`Countdown progress: ${countdownProgressLabel}, ${daysRemainingLabel}`}
              >
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-parade-gold via-parade-goldBright to-parade-goldSoft shadow-glow transition-[width] duration-700 ease-out"
                  style={{ width: `${countdownProgress}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-2 hidden items-center justify-between text-[0.65rem] font-black uppercase tracking-wide text-purple-100/70 sm:flex">
                <span>{COUNTDOWN_PROGRESS_START_LABEL}</span>
                <span>{TARGET_SHORT_DATE_LABEL}</span>
              </div>
            </div>
          </>
        ) : null}

        <p className="mt-3 text-xs font-semibold leading-5 text-purple-100/90 sm:text-sm sm:leading-6">
          For planning only. Verify schedules, routes, closures, and public-safety updates with official sources.
        </p>
      </section>

      <section className="rounded-[1.35rem] border border-parade-gold/45 bg-parade-purpleDeep/60 p-4 shadow-civic backdrop-blur sm:rounded-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-parade-gold text-parade-purpleDark shadow-sm">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-black leading-tight text-white sm:text-lg">2027 Parade Schedule Coming Soon</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-purple-100">
                Get notified when verified dates, start times, routes, and official-source links are posted.
              </p>
            </div>
          </div>
          <Link
            href="/schedule"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-parade-gold/55 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
          >
            Schedule page <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4">
          <ScheduleNotificationSignup source="homepage" compact />
        </div>
      </section>
    </div>
  );
}

function CountdownValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep/95 via-parade-purpleDark/90 to-parade-purple/72 px-2 py-4 text-center shadow-civic ring-1 ring-parade-gold/25">
      <span className="pointer-events-none absolute right-[-1.75rem] top-[-1.75rem] h-16 w-16 rounded-full bg-parade-gold/25 blur-2xl" aria-hidden="true" />
      <span className="pointer-events-none absolute left-[-1.5rem] bottom-[-1.5rem] h-14 w-14 rounded-full bg-white/8 blur-2xl" aria-hidden="true" />
      <p className="relative z-10 text-4xl font-black tabular-nums tracking-tight text-parade-goldBright drop-shadow-lg">
        {String(value).padStart(2, "0")}
      </p>
      <p className="relative z-10 mt-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-purple-100">{label}</p>
    </div>
  );
}

function CountdownMiniValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 px-2 py-2.5 text-center shadow-sm ring-1 ring-parade-gold/10">
      <p className="text-xl font-black tabular-nums text-parade-goldBright">{String(value).padStart(2, "0")}</p>
      <p className="mt-0.5 text-[0.62rem] font-black uppercase tracking-[0.14em] text-purple-100">{label}</p>
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
    return `Mobile Mardi Gras parade season is underway. The countdown was tracking the first downtown parade: ${TARGET_EVENT_NAME} — ${TARGET_FULL_DATE_LABEL}.`;
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
