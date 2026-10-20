import assert from "node:assert/strict";
import test from "node:test";
import { formatDateTime } from "../src/lib/format";
import { prisma } from "../src/lib/prisma";
import { findAlertsForParade, findHourlyPeriodsForParade, getWeatherAlertState } from "../src/lib/weather-display";
import { getWeatherPreview, type WeatherPreview } from "../src/services/weather";

test("weather times remain Central in daylight and standard time, including a date boundary", () => {
  assert.equal(formatDateTime("2026-10-20T14:48:00Z"), "Oct 20, 9:48 AM CT");
  assert.equal(formatDateTime("2027-01-23T00:30:00Z"), "Jan 22, 6:30 PM CT");
  assert.equal(formatDateTime("2027-03-14T08:30:00Z"), "Mar 14, 3:30 AM CT");
  assert.equal(formatDateTime(null), "Not checked yet");
  assert.equal(formatDateTime("invalid"), "Not checked yet");
});

test("a successful NWS refresh retains tomorrow's parade forecast while current risk stays near-term", async (context) => {
  const firstHour = Date.parse("2027-01-21T00:00:00Z");
  const periods: WeatherPreview["hourly"] = Array.from({ length: 72 }, (_, index) => ({
    name: `Hour ${index}`,
    startTime: new Date(firstHour + index * 3600000).toISOString(),
    endTime: new Date(firstHour + (index + 1) * 3600000).toISOString(),
    temperature: 65,
    temperatureUnit: "F",
    windSpeed: index >= 40 ? "45 mph" : "5 mph",
    windDirection: "N",
    shortForecast: index >= 40 ? "Thunderstorms" : "Sunny",
    detailedForecast: index >= 40 ? "Thunderstorms with strong wind." : "Clear skies.",
    probabilityOfPrecipitation: { value: index >= 40 ? 90 : 0 }
  }));
  const point = {
    forecast: "https://api.weather.gov/gridpoints/MOB/1,1/forecast",
    forecastHourly: "https://api.weather.gov/gridpoints/MOB/1,1/forecast/hourly",
    observationStations: "https://api.weather.gov/gridpoints/MOB/1,1/stations",
    gridId: "MOB",
    gridX: 1,
    gridY: 1
  };
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("/points/")) return Response.json({ properties: point });
    if (url === point.forecast || url === point.forecastHourly) return Response.json({ properties: { periods } });
    if (url.includes("/alerts/active")) return Response.json({ features: [] });
    throw new Error(`Unexpected request in weather test: ${url}`);
  });

  const weather = await getWeatherPreview();
  const paradeStart = new Date("2027-01-22T18:30:00-06:00");
  const paradePeriods = findHourlyPeriodsForParade(weather.hourly, paradeStart);

  assert.equal(weather.hourly.length, 72);
  assert.equal(weather.risk.riskLevel, "LOW");
  assert.equal(weather.risk.riskScore, 0);
  assert.equal(paradePeriods.length, 4);
  assert.equal(paradePeriods[0].startTime, "2027-01-23T00:00:00.000Z");
  assert.equal(paradePeriods.at(-1)?.startTime, "2027-01-23T03:00:00.000Z");
});

test("unavailable or saved alert checks cannot be presented as a fresh all-clear", () => {
  assert.equal(getWeatherAlertState(null), "unavailable");
  assert.equal(getWeatherAlertState({ alerts: [], isStoredFallback: true }), "stored");
  assert.equal(getWeatherAlertState({ alerts: [] }), "clear");
  assert.equal(getWeatherAlertState({ alerts: [{ id: "active", properties: { event: "Wind Advisory" } }] }), "active");
});

test("a current warning that expires before a later parade does not affect that parade's forecast", () => {
  const paradeStart = new Date("2027-01-23T00:30:00Z");
  const alerts = [
    { id: "expired-before-parade", properties: { effective: "2027-01-21T00:00:00Z", expires: "2027-01-21T12:00:00Z" } },
    { id: "overlaps-parade", properties: { effective: "2027-01-22T20:00:00Z", expires: "2027-01-23T06:00:00Z" } },
    { id: "ends-before-parade", properties: { effective: "2027-01-22T00:00:00Z", expires: "2027-01-23T06:00:00Z", ends: "2027-01-22T21:00:00Z" } },
    { id: "unknown-validity", properties: {} }
  ];

  assert.deepEqual(findAlertsForParade(alerts, paradeStart).map((alert) => alert.id), ["overlaps-parade"]);
});

test("a saved-alert fallback keeps its actual check time instead of manufacturing a new refresh", async (context) => {
  const storedAt = new Date("2026-10-19T15:20:00Z");
  context.mock.method(globalThis, "fetch", async () => { throw new Error("NWS unavailable in test"); });
  const originalFindSnapshot = prisma.weatherSnapshot.findFirst;
  const originalFindAlerts = prisma.weatherAlert.findMany;
  context.after(() => {
    prisma.weatherSnapshot.findFirst = originalFindSnapshot;
    prisma.weatherAlert.findMany = originalFindAlerts;
  });
  prisma.weatherSnapshot.findFirst = (async () => null) as typeof originalFindSnapshot;
  prisma.weatherAlert.findMany = (async () => [{
    id: 1,
    alertId: "stored-alert",
    event: "Wind Advisory",
    severity: null,
    urgency: null,
    certainty: null,
    headline: null,
    description: null,
    instruction: null,
    areaDesc: null,
    effective: storedAt,
    expires: new Date("2026-10-19T20:00:00Z"),
    ends: null,
    source: "National Weather Service API",
    rawJson: null,
    firstSeenAt: storedAt,
    lastSeenAt: storedAt,
    active: true
  }]) as unknown as typeof originalFindAlerts;

  const weather = await getWeatherPreview();
  assert.equal(weather.isStoredFallback, true);
  assert.equal(weather.checkedAt, storedAt.toISOString());
  assert.equal(getWeatherAlertState(weather), "stored");
});
