import { CloudRain, Wind } from "lucide-react";
import type { WeatherPreview } from "@/services/weather";
import { formatDateTime } from "@/lib/format";
import { StatusPill } from "./StatusPill";

const riskTone = {
  LOW: "green",
  MODERATE: "gold",
  HIGH: "red",
  SEVERE: "red"
} as const;

type WeatherRiskCardProps = {
  weather?: WeatherPreview | null;
  error?: string | null;
};

export function WeatherRiskCard({ weather, error }: WeatherRiskCardProps) {
  const risk = weather?.risk;
  const current = weather?.current;

  return (
    <section className="rounded border border-parade-line bg-white p-4 shadow-civic">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-parade-ink">Weather Risk</h2>
          <p className="mt-1 text-sm leading-6 text-parade-muted">Downtown Mobile forecast from National Weather Service data.</p>
        </div>
        <CloudRain className="h-6 w-6 text-parade-green" aria-hidden="true" />
      </div>

      {error ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          Weather data could not be refreshed right now. Verify conditions directly with the National Weather Service.
        </div>
      ) : null}

      {weather?.isStoredFallback ? (
        <div className="mb-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          Showing the last stored NWS snapshot from {formatDateTime(weather.checkedAt)} because live weather refresh failed. Verify current conditions directly with the National Weather Service.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded border border-parade-line bg-parade-purpleSoft p-3">
          <p className="text-xs font-bold uppercase text-parade-muted">Current risk</p>
          <div className="mt-2 flex items-center gap-2">
            <StatusPill tone={risk ? riskTone[risk.riskLevel] : "gray"}>{risk?.riskLevel ?? "Not checked"}</StatusPill>
            <span className="text-sm font-semibold text-parade-muted">Score {risk?.riskScore ?? "--"}</span>
          </div>
        </div>
        <div className="rounded border border-parade-line bg-parade-greenSoft p-3">
          <p className="text-xs font-bold uppercase text-parade-muted">Current conditions</p>
          <p className="mt-2 text-sm font-bold text-parade-ink">
            {current ? `${current.temperature} ${current.temperatureUnit}, ${current.shortForecast}` : "Not checked yet"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-parade-muted">
        {risk?.summary ?? "Run the weather checker or open this page with NWS access to calculate current risk."}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-parade-muted">
        <Wind className="h-4 w-4 text-parade-green" aria-hidden="true" />
        Weather risk does not mean a parade is canceled unless officially announced.
      </div>
    </section>
  );
}
