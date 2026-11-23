"use client";

import Link from "next/link";
import { Check, Crown, Gift, Medal, Sparkles, Star, TreePine } from "lucide-react";
import { useEffect, useState } from "react";

const timeZone = "America/Chicago";
const dateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone, year: "numeric", month: "2-digit", day: "2-digit"
});
const paradeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC", month: "long", day: "numeric"
});
const launchDay = "2026-11-22";
const storagePrefix = "mg251:road-to-first-throw:2027:";
const mulliganKey = storagePrefix + "mulligan";
const shareUrl = "https://mg251.xyz/play";
const shareCaption = "🎭 I’m counting down to Mobile’s first Mardi Gras parade! Start your own daily check-in and earn badges in the MG251 Mardi Gras Arcade. 💜💛";
const holidayStart = "2026-12-01";
const holidayEnd = "2026-12-25";
const dayLength = 86_400_000;

const badges = [
  { name: "First Throw", goal: 1, icon: Star },
  { name: "Bead Collector", goal: 7, icon: Medal },
  { name: "Christmas Crewe", goal: 12, icon: Gift, holiday: true },
  { name: "MoonPie Master", goal: 21, icon: Sparkles },
  { name: "Carnival Royalty", goal: 30, icon: Crown }
];

function mobileDate() {
  const parts = dateFormat.formatToParts();
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value).join("-");
}

function dayNumber(date: string) {
  return Date.parse(date) / dayLength;
}

type Progress = { today: string; dates: string[]; mulligan?: string | null; storageError?: boolean };

function readProgress(today: string, paradeDay: string): Progress {
  const dates = Object.keys(localStorage)
    .filter((key) => key.startsWith(storagePrefix))
    .map((key) => key.slice(storagePrefix.length))
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= launchDay && date <= paradeDay && date <= today);
  return { today, dates, mulligan: localStorage.getItem(mulliganKey) };
}

function missedDayToRestore({ today, dates, mulligan }: Progress, paradeDay: string) {
  if (mulligan || today > paradeDay || !dates.includes(today)) return null;
  const days = new Set(dates.map(dayNumber));
  const yesterday = dayNumber(today) - 1;
  if (days.has(yesterday) || !days.has(yesterday - 1)) return null;
  return new Date(yesterday * dayLength).toISOString().slice(0, 10);
}

function countStreak(dates: string[], through: string, mulligan?: string | null) {
  const days = new Set(dates.map(dayNumber));
  const restoredDay = mulligan ? dayNumber(mulligan) : NaN;
  let day = dayNumber(through);
  if (!days.has(day)) day -= 1;
  let streak = 0;
  while (days.has(day) || day === restoredDay) {
    if (days.has(day)) streak += 1;
    day -= 1;
  }
  return streak;
}

export function ArcadeCheckIn({ paradeDay, paradeName }: { paradeDay: string; paradeName: string }) {
  const [progress, setProgress] = useState<Progress>();
  const [shareDay, setShareDay] = useState<string>();
  const [manualShare, setManualShare] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function refresh() {
      const today = mobileDate();
      try {
        setProgress(readProgress(today, paradeDay));
      } catch {
        setProgress({ today, dates: [], storageError: true });
      }
    }

    refresh();
    const timer = window.setInterval(refresh, 15_000);
    window.addEventListener("storage", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [paradeDay]);

  function checkIn() {
    const today = mobileDate();
    if (today < launchDay || today > paradeDay) return;
    try {
      localStorage.setItem(storagePrefix + today, "1");
      setProgress(readProgress(today, paradeDay));
    } catch {
      setProgress((previous) => ({ ...previous, today, dates: previous?.dates ?? [], storageError: true }));
    }
  }

  const today = progress?.today ?? launchDay;
  const dates = progress?.dates ?? [];
  const daysLeft = dayNumber(paradeDay) - dayNumber(today);
  const checkedIn = dates.includes(today);
  const holiday = today >= holidayStart && today <= holidayEnd;
  const holidayVisits = dates.filter((date) => date >= holidayStart && date <= holidayEnd).length;
  const ThemeIcon = holiday ? TreePine : Sparkles;
  const streak = countStreak(dates, daysLeft < 0 ? paradeDay : today, progress?.mulligan);
  const missedDay = progress && !progress.storageError && missedDayToRestore(progress, paradeDay);

  async function shareArcade(copy: boolean) {
    if (!missedDay) return;
    setMessage("");
    try {
      if (copy) {
        await navigator.clipboard.writeText(`${shareCaption}\n${shareUrl}`);
        setMessage("Caption and link copied. Paste them into your social post.");
      } else {
        await navigator.share({ text: shareCaption, url: shareUrl });
      }
      setShareDay(missedDay);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setManualShare(true);
      setShareDay(missedDay);
    }
  }

  function restoreStreak() {
    const currentDay = mobileDate();
    try {
      const current = readProgress(currentDay, paradeDay);
      const missed = missedDayToRestore(current, paradeDay);
      if (!missed || missed !== shareDay) {
        setProgress(current);
        setMessage("This streak is no longer eligible for a save.");
        return;
      }
      localStorage.setItem(mulliganKey, missed);
      setProgress({ ...current, mulligan: missed });
      setMessage("Mulligan Throw used. Your streak is restored!");
    } catch {
      setMessage("Your streak could not be saved. Check that browser storage is enabled.");
    }
  }

  return (
    <section className="arcade-checkin" aria-labelledby="arcade-checkin-heading">
      <div className="arcade-checkin-lead">
        <div className="arcade-checkin-emblem" aria-hidden="true"><ThemeIcon size={26} /></div>
        <div>
          <p className="arcade-eyebrow">{holiday ? "Christmas on the Gulf Coast" : "Daily Arcade Check-In"}</p>
          <h2 id="arcade-checkin-heading">Road to the First Throw</h2>
          <p>{daysLeft > 0 ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"} until the first Mobile parade` : daysLeft === 0 ? "It’s parade day!" : "The first parade has rolled!"}</p>
          <Link href="/schedule">{paradeName} · {paradeFormat.format(new Date(paradeDay))} ↗</Link>
        </div>
      </div>
      <div className="arcade-checkin-action">
        {daysLeft >= 0 && (
          <button className="arcade-button" type="button" onClick={checkIn} disabled={!progress || checkedIn || today < launchDay}>
            {checkedIn && <Check size={16} aria-hidden="true" />}
            {checkedIn ? "Checked in today" : "Check in today"}
          </button>
        )}
        <p role="status">{progress?.storageError ? "Progress could not be saved. Check that browser storage is enabled." : `${dates.length} total ${dates.length === 1 ? "check-in" : "check-ins"} · Saved in this browser`}</p>
        <p><strong>{streak}-day streak</strong></p>
        {daysLeft > 0 && <p>{checkedIn ? "Come back tomorrow after midnight Mobile time." : "One check-in per day. Every visit counts."}</p>}
      </div>
      {missedDay && (
        <div style={{ gridColumn: "1 / -1" }}>
          <h3>Mulligan Throw</h3>
          <p>Share the arcade to save your streak before midnight Mobile time. You get one save per season.</p>
          {typeof navigator.share === "function" && (
            <button className="arcade-button" type="button" onClick={() => shareArcade(false)}>Share the arcade</button>
          )}{" "}
          <button className="arcade-secondary-link" type="button" onClick={() => shareArcade(true)}>Copy link and caption</button>
          {manualShare && <p><textarea aria-label="Share caption and link" readOnly rows={4} value={`${shareCaption}\n${shareUrl}`} onFocus={(event) => event.currentTarget.select()} /></p>}
          {shareDay === missedDay && <p><button className="arcade-button" type="button" onClick={restoreStreak}>I shared it · Restore my streak</button></p>}
        </div>
      )}
      {message && <p role="status" style={{ gridColumn: "1 / -1" }}>{message}</p>}
      <ul className="arcade-checkin-badges" aria-label="Collectible badges">
        {badges.map(({ name, goal, icon: Icon, holiday: holidayBadge }) => {
          const visits = holidayBadge ? holidayVisits : dates.length;
          const earned = visits >= goal;
          return (
            <li key={name} className={earned ? "is-earned" : undefined}>
              <Icon size={22} aria-hidden="true" />
              <strong>{name}</strong>
              {holidayBadge && <small>Dec. 1–25</small>}
              <span>{earned ? "Earned" : `${visits} / ${goal} check-ins`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
