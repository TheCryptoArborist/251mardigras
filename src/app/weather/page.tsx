import { AlertTriangle, CloudSun, ExternalLink, Thermometer, Wind } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusPill } from "@/components/StatusPill";
import { WeatherRiskCard } from "@/components/WeatherRiskCard";
import { formatDateTime } from "@/lib/format";
import { getParades } from "@/lib/data-access";
import { getWeatherPreview } from "@/services/weather";

export const dynamic = "force-dynamic";

export default async function WeatherPage() {
  const [parades, weatherResult] = await Promise.all([
    getParades(),
    getWeatherPreview()
      .then((weather) => ({ weather, error: null }))
      .catch((error) => ({
        weather: null,
        error: error instanceof Error ? error.message : "Weather refresh failed"
      }))
  ]);
  const weather = weatherResult.weather;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="Weather"
        description="Downtown Mobile weather risk using the National Weather Service API. Verify all watches, warnings, and parade impacts with official sources."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <WeatherRiskCard weather={weather} error={weatherResult.error} />
        <section className="rounded border border-parade-line bg-white p-4 shadow-civic">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-parade-gold" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-bold text-parade-ink">Active Weather Alerts</h2>
              <p className="text-sm text-parade-muted">NWS alerts for the downtown Mobile point.</p>
            </div>
          </div>
          {weather?.alerts.length ? (
            <div className="space-y-3">
              {weather.alerts.map((alert) => (
                <article key={alert.id} className="rounded border border-amber-200 bg-amber-50 p-3">
                  <StatusPill tone="red">{alert.properties.event}</StatusPill>
                  <h3 className="mt-2 font-bold text-amber-950">{alert.properties.headline ?? alert.properties.event}</h3>
                  <p className="mt-1 text-sm leading-6 text-amber-900">{alert.properties.areaDesc}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded border border-parade-line bg-parade-greenSoft p-3 text-sm leading-6 text-parade-ink">
              No active NWS alerts returned for the downtown Mobile point.
            </p>
          )}
        </section>
      </div>

      <section>
        <SectionHeader title="Today's Parade Weather" description={`Last weather refresh: ${formatDateTime(weather?.checkedAt)}`} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(weather?.hourly ?? []).map((period) => (
            <article key={period.startTime} className="rounded border border-parade-line bg-white p-4">
              <p className="text-xs font-bold uppercase text-parade-muted">{formatDateTime(period.startTime)}</p>
              <h3 className="mt-2 text-lg font-bold text-parade-ink">{period.shortForecast}</h3>
              <div className="mt-3 grid gap-2 text-sm text-parade-muted">
                <span className="inline-flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-parade-purple" aria-hidden="true" />
                  {period.temperature} {period.temperatureUnit}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Wind className="h-4 w-4 text-parade-green" aria-hidden="true" />
                  {period.windSpeed} {period.windDirection}
                </span>
                <span>Rain chance: {period.probabilityOfPrecipitation?.value ?? 0}%</span>
              </div>
            </article>
          ))}
          {!weather ? (
            <article className="rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Weather could not be refreshed in this environment. Use the official NWS links below.
            </article>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RiskDetail title="Wind Gust Risk" icon={<Wind className="h-5 w-5" />} value={weather?.risk.windScore ?? 0} />
        <RiskDetail title="Rain / Thunderstorm Timing" icon={<CloudSun className="h-5 w-5" />} value={(weather?.risk.rainScore ?? 0) + (weather?.risk.lightningScore ?? 0)} />
        <RiskDetail title="Heat Comfort Level" icon={<Thermometer className="h-5 w-5" />} value={weather?.risk.heatScore ?? 0} />
        <RiskDetail title="Cold Comfort Level" icon={<Thermometer className="h-5 w-5" />} value={weather?.risk.coldScore ?? 0} />
      </section>

      <section>
        <SectionHeader title="Weather Risk by Parade" description="Parade-specific forecast windows are planned for Phase 2 after official parade times are imported." />
        {parades.length === 0 ? (
          <div className="rounded border border-dashed border-parade-line bg-white p-6 text-sm leading-6 text-parade-muted">
            No parade records are loaded yet, so Phase 1 shows general downtown risk only.
          </div>
        ) : null}
      </section>

      <section className="rounded border border-parade-line bg-white p-5 shadow-civic">
        <SectionHeader title="Official Weather Sources" />
        <div className="grid gap-3 text-sm font-semibold text-parade-purple sm:grid-cols-2">
          <WeatherLink href={weather?.sourceUrls.points ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="NWS points endpoint" />
          <WeatherLink href={weather?.sourceUrls.forecastHourly ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="NWS hourly forecast" />
          <WeatherLink href={weather?.sourceUrls.forecast ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="NWS daily forecast" />
          <WeatherLink href={weather?.sourceUrls.alerts ?? "https://api.weather.gov/alerts/active?point=30.6954,-88.0399"} label="NWS active alerts" />
        </div>
      </section>
    </div>
  );
}

function RiskDetail({ title, icon, value }: { title: string; icon: React.ReactNode; value: number }) {
  return (
    <article className="rounded border border-parade-line bg-white p-4">
      <div className="flex items-center gap-2 text-parade-purple">{icon}</div>
      <h2 className="mt-3 font-bold text-parade-ink">{title}</h2>
      <p className="mt-2 text-sm text-parade-muted">Score contribution: {value}</p>
    </article>
  );
}

function WeatherLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-parade-line px-3 py-2 hover:bg-parade-purpleSoft">
      {label} <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

