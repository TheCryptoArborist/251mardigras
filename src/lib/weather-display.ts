import type { WeatherPreview } from "../services/weather";

export const NWS_VISITOR_URLS = {
  forecast: "https://forecast.weather.gov/MapClick.php?lat=30.6954&lon=-88.0399",
  hourly: "https://forecast.weather.gov/MapClick.php?FcstType=graphical&lat=30.6954&lg=english&lon=-88.0399&unit=0",
  alerts: "https://www.weather.gov/wwamap/wwatxtget.php?cwa=mob&wwa=all"
} as const;

type AlertPreview = Pick<WeatherPreview, "alerts" | "isStoredFallback">;

export function getWeatherAlertState(weather: AlertPreview | null | undefined) {
  if (!weather) return "unavailable";
  if (weather.isStoredFallback) return "stored";
  return weather.alerts.length > 0 ? "active" : "clear";
}

export function findHourlyPeriodsForParade<T extends { startTime: string }>(periods: T[], startDate: Date) {
  const windowStart = startDate.getTime() - 60 * 60 * 1000;
  const windowEnd = startDate.getTime() + 3 * 60 * 60 * 1000;

  return periods.filter((period) => {
    const periodStart = new Date(period.startTime).getTime();
    return Number.isFinite(periodStart) && periodStart >= windowStart && periodStart <= windowEnd;
  });
}

export function findAlertsForParade<T extends { properties: { effective?: string; expires?: string; ends?: string | null } }>(alerts: T[], startDate: Date) {
  const windowStart = startDate.getTime() - 60 * 60 * 1000;
  const windowEnd = startDate.getTime() + 3 * 60 * 60 * 1000;

  return alerts.filter(({ properties }) => {
    const effective = Date.parse(properties.effective ?? "");
    const expires = Date.parse(properties.ends ?? properties.expires ?? "");
    return Number.isFinite(expires) && expires > windowStart && (!Number.isFinite(effective) || effective <= windowEnd);
  });
}
