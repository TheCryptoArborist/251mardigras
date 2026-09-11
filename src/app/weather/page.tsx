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
const allScheduledParades = schedule.days.flatMap((day) => day.parades.map((parade) => ({ ...parade, day })));
const firstScheduledParade = allScheduledParades[0];

export default async function WeatherPage() {
  const weatherResult = await getWeatherPreview()
    .then((weather) => ({ weather, error: null }))
    .catch((error) => ({
      weather: null,
      error: error instanceof Error ? error.message : "Weather refresh failed"
    }));

  const weather = weatherResult.weather;
  const paradeOutlooks = buildParadeWeatherOutlooks(schedule, weather, 8);
  const forecastRange = getForecastRangeLabel(weather?.hourly ?? []);

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

          <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-parade-goldBright shadow-glow backdrop-blur">
                <CloudSun className="h-4 w-4" aria-hidden="true" />
                Parade weather center
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl">
                Weather for Mobile Mardi Gras
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-purple-100 sm:text-lg">
                Downtown Mobile conditions, NWS alerts, and parade-weather planning tied to the posted 2027 parade schedule.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link href="#parade-weather-outlook" className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright">
                  Parade Outlooks <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="#downtown-forecast" className="inline-flex items-center justify-center gap-2 rounded-full border border-parade-gold/45 bg-white/10 px-5 py-3 text-sm font-black text-white shadow-civic backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                  Downtown Forecast <CloudSun className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/schedule" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white shadow-civic backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
                  Parade Schedule <MapPinned className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <WeatherHeroStat label="Current focus" value="Downtown Mobile" />
              <WeatherHeroStat label="First parade" value={firstScheduledParade ? `${compactDateLabel(firstScheduledParade.day.label)} • ${firstScheduledParade.time}` : "Posted"} />
              <WeatherHeroStat label="Forecast range" value={forecastRange} />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <WeatherRiskCard weather={weather} error={weatherResult.error} />
          <ActiveAlertsCard weather={weather} />
        </section>

        <ParadeWeatherRiskPanel weather={weather} error={weatherResult.error} outlooks={paradeOutlooks} />

        <ForecastWindow weather={weather} error={weatherResult.error} />

        <section>
          <SectionTitle
            title="What the risk score looks at"
            description="These are planning signals only. They do not replace official weather alerts or public-safety announcements."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <RiskDetail title="Wind" icon={<Wind className="h-5 w-5" aria-hidden="true" />} value={weather?.risk.windScore ?? 0} />
            <RiskDetail title="Rain and storms" icon={<Umbrella className="h-5 w-5" aria-hidden="true" />} value={(weather?.risk.rainScore ?? 0) + (weather?.risk.lightningScore ?? 0)} />
            <RiskDetail title="Warm weather" icon={<Thermometer className="h-5 w-5" aria-hidden="true" />} value={weather?.risk.heatScore ?? 0} />
            <RiskDetail title="Cold weather" icon={<Thermometer className="h-5 w-5" aria-hidden="true" />} value={weather?.risk.coldScore ?? 0} />
          </div>
        </section>

        <WeatherPlanningChecklist />

        <OfficialWeatherSources weather={weather} />

        <section className="rounded-[1.35rem] border border-parade-gold/45 bg-parade-goldSoft p-5 text-amber-950 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Unofficial weather planning resource.</span>{" "}
              Weather risk does not mean a parade is delayed, changed, or canceled unless an official source announces it.
            </p>
          </div>
        </section>
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
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark ring-1 ring-white/20 shadow-glow">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
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
  weather,
  error,
  outlooks
}: {
  weather: WeatherPreview | null;
  error: string | null;
  outlooks: ParadeWeatherOutlook[];
}) {
  return (
    <section id="parade-weather-outlook" className="scroll-mt-28 relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-card backdrop-blur">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark ring-1 ring-white/20 shadow-glow">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Parade weather outlook</p>
            <h2 className="mt-1 text-2xl font-black text-white">Weather tied to the 2027 schedule</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-purple-100">
              Upcoming parade cards are pulled from the posted schedule. Weather details appear when the parade falls inside the available forecast data.
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

      <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <WeatherHeroStat label="Schedule range" value={schedule.displayDateRange} />
        <WeatherHeroStat label="Mardi Gras Day" value={schedule.mardiGrasDay} />
        <WeatherHeroStat label="Next listed" value={outlooks[0] ? `${compactDateLabel(outlooks[0].day.label)} • ${outlooks[0].parade.time}` : "Posted"} />
        <WeatherHeroStat label="NWS refresh" value={formatDateTime(weather?.checkedAt)} />
      </div>

      <div className="relative z-10 mt-5 grid gap-3 lg:grid-cols-2">
        {outlooks.map((outlook) => (
          <ParadeWeatherCard key={`${outlook.day.date}-${outlook.parade.id}`} outlook={outlook} />
        ))}
      </div>
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
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
    <article className="relative overflow-hidden rounded-2xl border border-parade-gold/30 bg-white/10 p-3 text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-civic">
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

function RiskDetail({ title, icon, value }: { title: string; icon: ReactNode; value: number }) {
  return (
    <article className="rounded-[1.25rem] border border-parade-gold/30 bg-white/10 p-4 text-white shadow-sm backdrop-blur">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-parade-gold text-parade-purpleDark ring-1 ring-white/20 shadow-glow">
        {icon}
      </div>
      <h3 className="mt-3 text-base font-black text-white">{title}</h3>
      <p className="mt-2 text-sm font-semibold text-purple-100">Score contribution: {value}</p>
    </article>
  );
}

function WeatherPlanningChecklist() {
  const items = [
    "Check active NWS alerts before leaving for downtown.",
    "Treat thunder, lightning, and strong wind as high-priority planning signals.",
    "Bring rain protection only when it will not block views or create a crowd hazard.",
    "Verify any route, road, parking, or parade-status changes with official sources."
  ];

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-card backdrop-blur">
      <span className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark ring-1 ring-white/20 shadow-glow">
          <Umbrella className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Parade-day checklist</p>
          <h2 className="mt-1 text-2xl font-black text-white">Weather planning before heading downtown</h2>
        </div>
      </div>
      <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-parade-gold/25 bg-parade-purpleDeep/55 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-parade-goldBright" aria-hidden="true" />
            <p className="text-sm font-semibold leading-6 text-purple-100">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OfficialWeatherSources({ weather }: { weather: WeatherPreview | null }) {
  return (
    <section className="rounded-[1.5rem] border border-parade-gold/35 bg-white/10 p-5 text-white shadow-card backdrop-blur">
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

function WeatherHeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-sm backdrop-blur">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-parade-goldBright">{label}</p>
      <p className="mt-1 text-sm font-black leading-tight text-white sm:text-base">{value}</p>
    </div>
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

function getForecastRangeLabel(periods: HourlyPeriod[]) {
  if (periods.length === 0) {
    return "NWS pending";
  }

  const first = periods[0];
  const last = periods[periods.length - 1];
  return `${formatDateTime(first.startTime)}-${formatDateTime(last.startTime)}`;
}

function compactDateLabel(label: string) {
  return label.replace(/^\w+,\s*/, "").replace("January", "Jan.").replace("February", "Feb.");
}
