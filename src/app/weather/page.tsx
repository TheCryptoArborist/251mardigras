import type { ReactNode } from "react";
import { AlertTriangle, CloudSun, ExternalLink, ShieldCheck, Thermometer, Umbrella, Wind } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";
import { WeatherRiskCard } from "@/components/WeatherRiskCard";
import { formatDateTime } from "@/lib/format";
import { getWeatherPreview, type WeatherPreview } from "@/services/weather";

export const dynamic = "force-dynamic";

type HourlyPeriod = WeatherPreview["hourly"][number];

export default async function WeatherPage() {
  const weatherResult = await getWeatherPreview()
    .then((weather) => ({ weather, error: null }))
    .catch((error) => ({
      weather: null,
      error: error instanceof Error ? error.message : "Weather refresh failed"
    }));
  const weather = weatherResult.weather;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-parade-goldBright shadow-glow">
            <CloudSun className="h-4 w-4" aria-hidden="true" />
            Weather planning
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Downtown Mobile Weather
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">
            National Weather Service data for downtown Mobile. Use this as a visitor planning tool, then verify watches, warnings, road impacts, and parade decisions with official sources.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <WeatherRiskCard weather={weather} error={weatherResult.error} />
          <ActiveAlertsCard weather={weather} />
        </div>

        <ForecastWindow weather={weather} error={weatherResult.error} />

        <section>
          <SectionTitle
            title="What the risk score looks at"
            description="These are planning signals only. They do not replace official weather alerts or public-safety announcements."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <RiskDetail title="Wind" icon={<Wind className="h-5 w-5" aria-hidden="true" />} value={weather?.risk.windScore ?? 0} />
            <RiskDetail title="Rain / storms" icon={<Umbrella className="h-5 w-5" aria-hidden="true" />} value={(weather?.risk.rainScore ?? 0) + (weather?.risk.lightningScore ?? 0)} />
            <RiskDetail title="Heat comfort" icon={<Thermometer className="h-5 w-5" aria-hidden="true" />} value={weather?.risk.heatScore ?? 0} />
            <RiskDetail title="Cold comfort" icon={<Thermometer className="h-5 w-5" aria-hidden="true" />} value={weather?.risk.coldScore ?? 0} />
          </div>
        </section>

        <OfficialWeatherSources weather={weather} />

        <section className="rounded-[1.25rem] border border-parade-gold/35 bg-parade-goldSoft p-4 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Unofficial weather planning resource.</span>{" "}
              Weather risk does not mean a parade is delayed, changed, or canceled unless an official source announces it.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function ActiveAlertsCard({ weather }: { weather: WeatherPreview | null }) {
  const alerts = weather?.alerts ?? [];

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 mb-5 flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">NWS alerts</p>
          <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Active weather alerts</h2>
          <p className="mt-2 text-sm leading-6 text-parade-muted">
            Alerts returned for the downtown Mobile forecast point.
          </p>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="relative z-10 space-y-3">
          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-2xl border border-parade-gold/35 bg-parade-goldSoft p-4">
              <StatusPill tone="gold">{alert.properties.event}</StatusPill>
              <h3 className="mt-3 text-base font-black text-amber-950">{alert.properties.headline ?? alert.properties.event}</h3>
              {alert.properties.areaDesc ? (
                <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">{alert.properties.areaDesc}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="relative z-10 rounded-2xl border border-parade-gold/30 bg-white/85 p-4 text-sm font-semibold leading-6 text-parade-muted">
          No active NWS alerts returned for the downtown Mobile point at the last refresh.
        </div>
      )}
    </section>
  );
}

function ForecastWindow({ weather, error }: { weather: WeatherPreview | null; error: string | null }) {
  const hourly = weather?.hourly ?? [];

  return (
    <section>
      <SectionTitle
        title="Next few hours downtown"
        description={`Last weather refresh: ${formatDateTime(weather?.checkedAt)}`}
      />
      {hourly.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {hourly.map((period) => (
            <ForecastCard key={period.startTime} period={period} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[1.5rem] border border-parade-gold/35 bg-parade-goldSoft p-5 text-sm font-semibold leading-6 text-amber-950 shadow-civic">
          Weather could not be refreshed in this environment. Use the official National Weather Service links below.
          {error ? <span className="mt-2 block text-xs">Refresh note: {error}</span> : null}
        </div>
      )}
    </section>
  );
}

function ForecastCard({ period }: { period: HourlyPeriod }) {
  return (
    <article className="relative overflow-hidden rounded-[1.25rem] border border-parade-gold/30 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-civic">
      <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-wide text-parade-purple">{formatDateTime(period.startTime)}</p>
        <h3 className="mt-2 text-lg font-black text-parade-purpleDark">{period.shortForecast}</h3>
        <div className="mt-4 grid gap-2 text-sm font-semibold text-parade-muted">
          <span className="inline-flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-parade-purple" aria-hidden="true" />
            {period.temperature} {period.temperatureUnit}
          </span>
          <span className="inline-flex items-center gap-2">
            <Wind className="h-4 w-4 text-parade-purple" aria-hidden="true" />
            {period.windSpeed} {period.windDirection}
          </span>
          <span className="inline-flex items-center gap-2">
            <Umbrella className="h-4 w-4 text-parade-purple" aria-hidden="true" />
            Rain chance: {period.probabilityOfPrecipitation?.value ?? 0}%
          </span>
        </div>
      </div>
    </article>
  );
}

function RiskDetail({ title, icon, value }: { title: string; icon: ReactNode; value: number }) {
  return (
    <article className="rounded-[1.25rem] border border-parade-gold/30 bg-white p-4 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/35">
        {icon}
      </div>
      <h3 className="mt-3 text-base font-black text-parade-purpleDark">{title}</h3>
      <p className="mt-2 text-sm font-semibold text-parade-muted">Score contribution: {value}</p>
    </article>
  );
}

function OfficialWeatherSources({ weather }: { weather: WeatherPreview | null }) {
  return (
    <section className="rounded-[1.5rem] border border-parade-gold/35 bg-white p-5 shadow-card">
      <SectionTitle
        title="Official weather sources"
        description="Use these National Weather Service links when weather decisions matter."
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <WeatherLink href={weather?.sourceUrls.forecastHourly ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="Hourly forecast" />
        <WeatherLink href={weather?.sourceUrls.forecast ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="Daily forecast" />
        <WeatherLink href={weather?.sourceUrls.alerts ?? "https://api.weather.gov/alerts/active?point=30.6954,-88.0399"} label="Active alerts" />
        <WeatherLink href={weather?.sourceUrls.points ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="NWS downtown point" />
      </div>
    </section>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-parade-purpleDark">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">{description}</p> : null}
    </div>
  );
}

function WeatherLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-3 rounded-2xl border border-parade-gold/30 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist px-4 py-3 text-sm font-black text-parade-purple transition hover:-translate-y-0.5 hover:shadow-civic">
      {label} <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}
