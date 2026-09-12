import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CloudSun,
  ExternalLink,
  MapPinned,
  ShieldCheck,
  Thermometer,
  Umbrella,
  Wind
} from "lucide-react";
import { StatusPill } from "@/components/StatusPill";
import { MardiGrasFeatureIcon } from "@/components/MardiGrasFeatureIcon";
import { WeatherRiskCard } from "@/components/WeatherRiskCard";
import { formatDateTime } from "@/lib/format";
import { getWeatherPreview, scoreWeatherRisk, type WeatherPreview } from "@/services/weather";
import paradeSchedule2027 from "../../../data/parade-schedule-2027.json";

export const dynamic = "force-dynamic";

type HourlyPeriod = WeatherPreview["hourly"][number];

type ParadeEntry = {
  id: string;
  time: string;
  name: string;
  route: string;
  routeNote?: string;
};

type ParadeDay = {
  date: string;
  label: string;
  specialLabel?: string;
  parades: ParadeEntry[];
};

type ParadeSchedule = {
  displayDateRange: string;
  mardiGrasDay: string;
  defaultRouteNote: string;
  source: {
    name: string;
    url: string;
  };
  days: ParadeDay[];
};

type ParadeWeatherOutlook = {
  parade: ParadeEntry;
  day: ParadeDay;
  startDate: Date;
  periods: HourlyPeriod[];
  risk: WeatherPreview["risk"] | null;
  status: "available" | "pending" | "unavailable";
};

const schedule = paradeSchedule2027 as ParadeSchedule;

export default async function WeatherPage() {
  const weatherResult = await getWeatherPreview()
    .then((weather) => ({ weather, error: null }))
    .catch((error) => ({
      weather: null,
      error: error instanceof Error ? error.message : "Weather refresh failed"
    }));

  const weather = weatherResult.weather;
  const paradeOutlooks = buildParadeWeatherOutlooks(schedule, weather, 8);
  const forecastReadyOutlooks = paradeOutlooks.filter((outlook) => outlook.status === "available");
  const nextParadeOutlook = paradeOutlooks[0] ?? null;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
      <span className="pointer-events-none absolute left-[-7rem] top-[-8rem] z-0 h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute right-[-8rem] top-[18rem] z-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-10rem] left-[20%] z-0 h-96 w-96 rounded-full bg-parade-gold/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,201,40,0.18),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.10),transparent_32%),linear-gradient(180deg,rgba(23,4,47,0.05),rgba(23,4,47,0.34))]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[1.55rem] border border-parade-gold/50 bg-white/10 p-4 shadow-card backdrop-blur sm:p-5 lg:p-6">
          <span className="pointer-events-none absolute right-[-4rem] top-[-5rem] h-44 w-44 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-[-5rem] left-[-5rem] h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-parade-goldBright shadow-glow backdrop-blur">
                <CloudSun className="h-4 w-4" aria-hidden="true" />
                Downtown Mobile
              </div>
              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl">
                Mardi Gras Weather Center
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100 sm:text-base">
                Current conditions, NWS alerts, and parade-weather planning for downtown Mobile.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link href="#downtown-forecast" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-2.5 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
                Hourly Forecast <CloudSun className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/schedule" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-black text-white shadow-civic backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                Parade Schedule <MapPinned className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <WeatherRiskCard weather={weather} error={weatherResult.error} />
          <ActiveAlertsCard weather={weather} />
        </section>

        <ForecastWindow weather={weather} error={weatherResult.error} />

        <ParadeWeatherRiskPanel
          error={weatherResult.error}
          outlooks={forecastReadyOutlooks}
          nextOutlook={nextParadeOutlook}
        />

        <RiskMethod weather={weather} />

        <BeforeYouGo weather={weather} />
      </div>
    </main>
  );
}

function ActiveAlertsCard({ weather }: { weather: WeatherPreview | null }) {
  const alerts = weather?.alerts ?? [];

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-parade-purpleDeep/65 p-5 text-white shadow-card backdrop-blur">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 mb-5 flex items-start gap-3">
        <MardiGrasFeatureIcon artwork="king" badge={<AlertTriangle className="h-3.5 w-3.5" />} />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">NWS alerts</p>
          <h2 className="mt-1 text-2xl font-black text-white">Active weather alerts</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-purple-100">
            Alerts returned for the downtown Mobile forecast point.
          </p>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="relative z-10 space-y-3">
          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-2xl border border-parade-gold/35 bg-parade-goldSoft p-4 text-amber-950">
              <StatusPill tone="gold">{alert.properties.event}</StatusPill>
              <h3 className="mt-3 text-base font-black text-amber-950">{alert.properties.headline ?? alert.properties.event}</h3>
              {alert.properties.areaDesc ? (
                <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">{alert.properties.areaDesc}</p>
              ) : null}
              {alert.properties.expires ? (
                <p className="mt-2 text-xs font-black uppercase tracking-wide text-amber-900">Expires {formatDateTime(alert.properties.expires)}</p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="relative z-10 rounded-2xl border border-parade-gold/30 bg-white/10 p-4 text-sm font-semibold leading-6 text-purple-100">
          No active NWS alerts returned for the downtown Mobile point at the last refresh.
        </div>
      )}
    </section>
  );
}

function ParadeWeatherRiskPanel({
  error,
  outlooks,
  nextOutlook
}: {
  error: string | null;
  outlooks: ParadeWeatherOutlook[];
  nextOutlook: ParadeWeatherOutlook | null;
}) {
  return (
    <section id="parade-weather-outlook" className="scroll-mt-28 relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-card backdrop-blur">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <MardiGrasFeatureIcon artwork="logo" badge={<CalendarDays className="h-3.5 w-3.5" />} />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Parade weather outlook</p>
            <h2 className="mt-1 text-2xl font-black text-white">Weather for upcoming parades</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100">
              Parade forecasts appear automatically when an event enters the available NWS forecast window.
            </p>
          </div>
        </div>
        <Link href="/schedule" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-parade-gold px-4 py-2.5 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright sm:w-auto">
          Open schedule <MapPinned className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {error ? (
        <div className="relative z-10 mt-4 rounded-2xl border border-parade-gold/35 bg-parade-goldSoft p-4 text-sm font-semibold leading-6 text-amber-950">
          Parade-specific weather matching needs a refreshed forecast. Use the official NWS links below if live data is unavailable.
        </div>
      ) : null}

      {outlooks.length > 0 ? (
        <div className="relative z-10 mt-5 grid gap-3 lg:grid-cols-2">
          {outlooks.map((outlook) => (
            <ParadeWeatherCard key={`${outlook.day.date}-${outlook.parade.id}`} outlook={outlook} />
          ))}
        </div>
      ) : (
        <div className="relative z-10 mt-5 flex flex-col gap-3 rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <StatusPill tone="gray">Outside forecast window</StatusPill>
            <p className="mt-3 text-sm font-semibold leading-6 text-purple-100">
              No scheduled parades are currently within the NWS forecast window.
            </p>
          </div>
          {nextOutlook ? (
            <div className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-4 py-3 sm:text-right">
              <p className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Next parade</p>
              <p className="mt-1 text-sm font-black text-white">
                {compactDateLabel(nextOutlook.day.label)} • {nextOutlook.parade.time}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function ParadeWeatherCard({ outlook }: { outlook: ParadeWeatherOutlook }) {
  const routeAnchor = `/schedule#route-map-${outlook.parade.route.replace("Route ", "").toLowerCase()}`;
  const forecastAvailable = outlook.status === "available" && outlook.periods.length > 0;

  return (
    <article className="rounded-[1.25rem] border border-parade-gold/30 bg-parade-purpleDeep/65 p-4 text-white shadow-civic">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-parade-goldBright">
            {compactDateLabel(outlook.day.label)} • {outlook.parade.time}
          </p>
          <h3 className="mt-1 text-lg font-black leading-tight text-white">{outlook.parade.name}</h3>
        </div>
        <Link href={routeAnchor} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-parade-gold/35 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-parade-gold hover:text-parade-purpleDark">
          {outlook.parade.route} map <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {forecastAvailable ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusPill tone={outlook.risk?.riskLevel === "LOW" ? "purple" : outlook.risk?.riskLevel === "SEVERE" ? "red" : "gold"}>
              {outlook.risk?.riskLevel ?? "Forecast"}
            </StatusPill>
            <span className="text-xs font-black uppercase tracking-wide text-purple-100">Forecast window available</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <WeatherMetric label="Temp" value={formatTemperatureRange(outlook.periods)} />
            <WeatherMetric label="Rain" value={`${getMaxRain(outlook.periods)}%`} />
            <WeatherMetric label="Wind" value={`${getMaxWind(outlook.periods)} mph`} />
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-purple-100">
            Window: {formatForecastWindow(outlook.periods)}
          </p>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-parade-gold/25 bg-white/10 p-4">
          <StatusPill tone="gray">Forecast pending</StatusPill>
          <p className="mt-3 text-sm font-semibold leading-6 text-purple-100">
            Weather details are not available for this parade yet. Check back closer to {compactDateLabel(outlook.day.label)}.
          </p>
        </div>
      )}
    </article>
  );
}

function ForecastWindow({ weather, error }: { weather: WeatherPreview | null; error: string | null }) {
  const hourly = (weather?.hourly ?? []).slice(0, 6);

  return (
    <section id="downtown-forecast" className="scroll-mt-28">
      <SectionTitle
        title="Compact downtown forecast"
        description={`Next few hours from NWS data. Last refresh: ${formatDateTime(weather?.checkedAt)}`}
      />
      {hourly.length > 0 ? (
        <div className="mt-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(10rem,1fr)] gap-2 overflow-x-auto pb-2 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-6">
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
    <article className="relative snap-start overflow-hidden rounded-2xl border border-parade-gold/30 bg-white/10 p-3 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-civic">
      <span className="pointer-events-none absolute right-[-1.5rem] top-[-1.5rem] h-16 w-16 rounded-full bg-parade-gold/20 blur-xl" aria-hidden="true" />
      <div className="relative z-10">
        <p className="text-[0.7rem] font-black uppercase tracking-wide text-parade-goldBright">{formatDateTime(period.startTime)}</p>
        <div className="mt-2 flex items-start justify-between gap-2">
          <div>
            <p className="text-2xl font-black text-white">{period.temperature}°</p>
            <p className="text-[0.65rem] font-black uppercase text-purple-100">{period.temperatureUnit}</p>
          </div>
          <CloudSun className="h-5 w-5 shrink-0 text-parade-goldBright" aria-hidden="true" />
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-black leading-5 text-white">{period.shortForecast}</h3>
        <div className="mt-3 space-y-1 text-xs font-semibold text-purple-100">
          <span className="block truncate">Rain {period.probabilityOfPrecipitation?.value ?? 0}%</span>
          <span className="block truncate">Wind {period.windSpeed} {period.windDirection}</span>
        </div>
      </div>
    </article>
  );
}

function RiskMethod({ weather }: { weather: WeatherPreview | null }) {
  const risk = weather?.risk;

  return (
    <details className="group rounded-[1.35rem] border border-parade-gold/30 bg-white/10 text-white shadow-civic backdrop-blur">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden sm:p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Planning method</p>
          <h2 className="mt-1 text-lg font-black text-white">How the weather risk is calculated</h2>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-parade-gold text-xl font-black text-parade-purpleDark transition group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <div className="grid gap-2 border-t border-white/10 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <RiskSignal icon={<Wind className="h-4 w-4" aria-hidden="true" />} label="Wind" value={risk?.windScore ?? 0} />
        <RiskSignal icon={<Umbrella className="h-4 w-4" aria-hidden="true" />} label="Rain and storms" value={(risk?.rainScore ?? 0) + (risk?.lightningScore ?? 0)} />
        <RiskSignal icon={<Thermometer className="h-4 w-4" aria-hidden="true" />} label="Warm weather" value={risk?.heatScore ?? 0} />
        <RiskSignal icon={<Thermometer className="h-4 w-4" aria-hidden="true" />} label="Cold weather" value={risk?.coldScore ?? 0} />
      </div>
    </details>
  );
}

function RiskSignal({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-parade-gold/25 bg-parade-purpleDeep/55 px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm font-black text-white">{icon}{label}</span>
      <span className="text-xs font-black uppercase tracking-wide text-parade-goldBright">Score {value}</span>
    </div>
  );
}

function BeforeYouGo({ weather }: { weather: WeatherPreview | null }) {
  const items = [
    "Check active NWS alerts before leaving for downtown.",
    "Treat thunder, lightning, and strong wind as high-priority planning signals.",
    "Bring rain protection only when it will not block views or create a crowd hazard.",
    "Verify any route, road, parking, or parade-status changes with official sources."
  ];

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-card backdrop-blur">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-start gap-3">
            <MardiGrasFeatureIcon artwork="jester" badge={<Umbrella className="h-3.5 w-3.5" />} />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Before you go</p>
              <h2 className="mt-1 text-2xl font-black text-white">Parade-day weather checklist</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-parade-gold/25 bg-parade-purpleDeep/55 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-parade-goldBright" aria-hidden="true" />
                <p className="text-sm font-semibold leading-5 text-purple-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">National Weather Service</p>
          <h2 className="mt-1 text-xl font-black text-white">Official weather links</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <WeatherLink href={weather?.sourceUrls.forecastHourly ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="Hourly forecast" />
            <WeatherLink href={weather?.sourceUrls.forecast ?? "https://api.weather.gov/points/30.6954,-88.0399"} label="Daily forecast" />
            <WeatherLink href={weather?.sourceUrls.alerts ?? "https://api.weather.gov/alerts/active?point=30.6954,-88.0399"} label="Active alerts" />
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-parade-gold/30 bg-parade-goldSoft p-3 text-amber-950">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-xs font-semibold leading-5">
              Weather risk is a planning aid. Parade delays, changes, or cancellations must come from official sources.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-white drop-shadow-lg">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100">{description}</p> : null}
    </div>
  );
}

function WeatherLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-3 rounded-2xl border border-parade-gold/30 bg-parade-purpleDeep/55 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:border-parade-gold hover:bg-parade-gold hover:text-parade-purpleDark">
      {label} <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}


function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-parade-gold/25 bg-white/10 px-3 py-2">
      <p className="text-[0.62rem] font-black uppercase tracking-wide text-parade-goldBright">{label}</p>
      <p className="mt-0.5 truncate text-xs font-black text-white">{value}</p>
    </div>
  );
}

function buildParadeWeatherOutlooks(scheduleData: ParadeSchedule, weather: WeatherPreview | null, limit: number) {
  const now = Date.now();
  const scheduled = scheduleData.days
    .flatMap((day) =>
      day.parades.map((parade) => ({
        day,
        parade,
        startDate: parseParadeStart(day.date, parade.time)
      }))
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const upcoming = scheduled.filter((entry) => entry.startDate.getTime() >= now);
  const selected = (upcoming.length > 0 ? upcoming : scheduled).slice(0, limit);

  return selected.map((entry) => {
    const periods = findHourlyPeriodsForParade(weather?.hourly ?? [], entry.startDate);
    const status = !weather ? "unavailable" : periods.length > 0 ? "available" : "pending";

    return {
      ...entry,
      periods,
      status,
      risk: periods.length > 0 ? scoreWeatherRisk(periods, weather?.alerts ?? []) : null
    } satisfies ParadeWeatherOutlook;
  });
}

function findHourlyPeriodsForParade(periods: HourlyPeriod[], startDate: Date) {
  const windowStart = startDate.getTime() - 60 * 60 * 1000;
  const windowEnd = startDate.getTime() + 3 * 60 * 60 * 1000;

  return periods.filter((period) => {
    const periodStart = new Date(period.startTime).getTime();
    return Number.isFinite(periodStart) && periodStart >= windowStart && periodStart <= windowEnd;
  });
}

function parseParadeStart(date: string, time: string) {
  const normalizedTime = time.toLowerCase() === "noon" ? "12:00 PM" : time;
  const match = normalizedTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (!match) {
    return new Date(`${date}T12:00:00-06:00`);
  }

  const [, hourValue, minuteValue = "00", meridiem] = match;
  let hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (meridiem.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-06:00`);
}

function getMaxRain(periods: HourlyPeriod[]) {
  return Math.max(0, ...periods.map((period) => period.probabilityOfPrecipitation?.value ?? 0));
}

function getMaxWind(periods: HourlyPeriod[]) {
  return Math.max(0, ...periods.map((period) => extractMaxMph(period.windSpeed)));
}

function extractMaxMph(value: string) {
  const matches = value.match(/\d+/g);
  return matches ? Math.max(...matches.map(Number)) : 0;
}

function formatTemperatureRange(periods: HourlyPeriod[]) {
  const temperatures = periods.map((period) => period.temperature).filter(Number.isFinite);

  if (temperatures.length === 0) {
    return "--";
  }

  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);

  return min === max ? `${min}°` : `${min}°-${max}°`;
}

function formatForecastWindow(periods: HourlyPeriod[]) {
  if (periods.length === 0) {
    return "Not available yet";
  }

  const first = periods[0];
  const last = periods[periods.length - 1];
  return `${formatDateTime(first.startTime)} to ${formatDateTime(last.endTime)}`;
}

function compactDateLabel(label: string) {
  return label.replace(/^\w+,\s*/, "").replace("January", "Jan.").replace("February", "Feb.");
}
