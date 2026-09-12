import { CloudRain, Droplets, Wind } from "lucide-react";
import type { WeatherPreview } from "@/services/weather";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

const riskTone = {
  LOW: "purple",
  MODERATE: "gold",
  HIGH: "gold",
  SEVERE: "red"
} as const;

type WeatherRiskCardProps = {
  weather?: WeatherPreview | null;
  error?: string | null;
};

export function WeatherRiskCard({ weather, error }: WeatherRiskCardProps) {
  const risk = weather?.risk;
  const current = weather?.current;
  const rainChance = current?.probabilityOfPrecipitation?.value ?? 0;

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-card backdrop-blur">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Downtown weather check</p>
          <h2 className="mt-1 text-2xl font-black text-white">Current conditions</h2>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark ring-1 ring-white/20 shadow-glow">
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

      <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Now</p>
          <p className="mt-1 text-3xl font-black text-white">{current ? `${current.temperature}°` : "--"}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-purple-100">{current?.shortForecast ?? "Not checked"}</p>
        </div>
        <div className="rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Risk</p>
          <div className="mt-3">
            <StatusPill tone={risk ? riskTone[risk.riskLevel] : "gray"}>{risk?.riskLevel ?? "Pending"}</StatusPill>
          </div>
        </div>
        <div className="rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-parade-goldBright">
            <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> Rain
          </div>
          <p className="mt-3 text-xl font-black text-white">{current ? `${rainChance}%` : "--"}</p>
        </div>
        <div className="rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-parade-goldBright">
            <Wind className="h-3.5 w-3.5" aria-hidden="true" /> Wind
          </div>
          <p className="mt-3 text-sm font-black leading-5 text-white">{current ? `${current.windSpeed} ${current.windDirection}` : "--"}</p>
        </div>
      </div>

      <p className="relative z-10 mt-3 text-sm font-semibold leading-6 text-purple-100">
        {risk?.summary ?? "Open this page with NWS access to calculate current downtown weather risk."}
      </p>

      <div className="relative z-10 mt-3 flex items-center gap-2 text-xs font-semibold text-purple-100">
        <Wind className="h-4 w-4 text-parade-goldBright" aria-hidden="true" />
        Last refresh: {formatDateTime(weather?.checkedAt)}
      </div>
    </section>
  );
}
