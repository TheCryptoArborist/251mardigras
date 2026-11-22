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
const holidayStart = "2026-12-01";
const holidayEnd = "2026-12-25";
const dayLength = 86_400_000;

const badges = [
  { name: "First Throw", goal: 1, icon: Star },
  { name: "Bead Collector", goal: 7, icon: Medal },
  { name: "Christmas Krewe", goal: 12, icon: Gift, holiday: true },
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

type Progress = { today: string; dates: string[]; storageError?: boolean };

export function ArcadeCheckIn({ paradeDay, paradeName }: { paradeDay: string; paradeName: string }) {
  const [progress, setProgress] = useState<Progress>();

  useEffect(() => {
    function refresh() {
      const today = mobileDate();
      try {
        const dates = Object.keys(localStorage)
          .filter((key) => key.startsWith(storagePrefix))
          .map((key) => key.slice(storagePrefix.length))
          .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= launchDay && date <= paradeDay && date <= today);
        setProgress({ today, dates });
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
      setProgress((previous) => ({ today, dates: [...new Set([...(previous?.dates ?? []), today])] }));
    } catch {
      setProgress((previous) => ({ today, dates: previous?.dates ?? [], storageError: true }));
    }
  }

  const today = progress?.today ?? launchDay;
  const dates = progress?.dates ?? [];
  const daysLeft = dayNumber(paradeDay) - dayNumber(today);
  const checkedIn = dates.includes(today);
  const holiday = today >= holidayStart && today <= holidayEnd;
  const holidayVisits = dates.filter((date) => date >= holidayStart && date <= holidayEnd).length;
  const ThemeIcon = holiday ? TreePine : Sparkles;

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
        {daysLeft > 0 && <p>{checkedIn ? "Come back tomorrow after midnight Mobile time." : "One check-in per day. Every visit counts."}</p>}
      </div>
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
