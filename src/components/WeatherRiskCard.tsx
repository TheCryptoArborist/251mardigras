import { CloudRain, ShieldCheck, Wind } from "lucide-react";
import type { WeatherPreview } from "@/services/weather";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

const riskTone = {
  LOW: "purple",
  MODERATE: "gold",
  HIGH: "gold",
  SEVERE: "gold"
} as const;

type WeatherRiskCardProps = {
  weather?: WeatherPreview | null;
  error?: string | null;
};

export function WeatherRiskCard({ weather, error }: WeatherRiskCardProps) {
  const risk = weather?.risk;
  const current = weather?.current;

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Downtown weather check</p>
          <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Weather risk</h2>
          <p className="mt-2 text-sm leading-6 text-parade-muted">
            National Weather Service data for the downtown Mobile point.
          </p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
          <CloudRain className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      {error ? (
        <div className="relative z-10 mb-3 rounded-2xl border border-parade-gold/35 bg-parade-goldSoft p-4 text-sm font-semibold leading-6 text-amber-950">
          Weather data could not be refreshed right now. Verify conditions directly with the National Weather Service.
        </div>
      ) : null}

      {weather?.isStoredFallback ? (
        <div className="relative z-10 mb-3 rounded-2xl border border-parade-gold/35 bg-parade-goldSoft p-4 text-sm font-semibold leading-6 text-amber-950">
          Showing the last stored NWS snapshot from {formatDateTime(weather.checkedAt)} because live weather refresh failed. Verify current conditions directly with the National Weather Service.
        </div>
      ) : null}

      <div className="relative z-10 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-parade-gold/30 bg-white/85 p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-parade-purple">Risk level</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill tone={risk ? riskTone[risk.riskLevel] : "gray"}>{risk?.riskLevel ?? "Not checked"}</StatusPill>
            <span className="text-sm font-black text-parade-muted">Score {risk?.riskScore ?? "--"}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-parade-gold/30 bg-white/85 p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-parade-purple">Current conditions</p>
          <p className="mt-3 text-sm font-black leading-6 text-parade-ink">
            {current ? `${current.temperature} ${current.temperatureUnit}, ${current.shortForecast}` : "Not checked yet"}
          </p>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-sm font-semibold leading-6 text-parade-muted">
        {risk?.summary ?? "Open this page with NWS access to calculate current downtown weather risk."}
      </p>

      <div className="relative z-10 mt-4 flex items-start gap-2 rounded-2xl border border-parade-gold/30 bg-white/70 p-3 text-xs font-bold leading-5 text-parade-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
        <span>Weather risk is a planning aid. Parade changes or cancellations must come from official sources.</span>
      </div>

      <div className="relative z-10 mt-3 flex items-center gap-2 text-xs font-semibold text-parade-muted">
        <Wind className="h-4 w-4 text-parade-purple" aria-hidden="true" />
        Last refresh: {formatDateTime(weather?.checkedAt)}
      </div>
    </section>
  );
}
