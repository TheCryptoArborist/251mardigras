import { prisma } from "../lib/prisma";
import { DOWNTOWN_MOBILE_COORDINATES } from "../lib/seed-data";
import { hashContent } from "./content-normalizer";

type NwsPeriod = {
  name: string;
  startTime: string;
  endTime: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast: string;
  probabilityOfPrecipitation?: {
    value: number | null;
  };
};

type NwsForecast = {
  properties: {
    periods: NwsPeriod[];
  };
};

type NwsPoint = {
  properties: {
    forecast: string;
    forecastHourly: string;
    observationStations: string;
    gridId: string;
    gridX: number;
    gridY: number;
    county?: string;
    forecastZone?: string;
  };
};

type NwsAlertFeature = {
  id: string;
  properties: {
    event: string;
    severity?: string;
    urgency?: string;
    certainty?: string;
    headline?: string;
    description?: string;
    instruction?: string;
    areaDesc?: string;
    effective?: string;
    expires?: string;
    ends?: string | null;
  };
};

type NwsAlerts = {
  features: NwsAlertFeature[];
};

export type WeatherRiskBreakdown = {
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  riskScore: number;
  rainScore: number;
  lightningScore: number;
  windScore: number;
  heatScore: number;
  coldScore: number;
  floodScore: number;
  summary: string;
};

export type WeatherPreview = {
  current: NwsPeriod | null;
  daily: NwsPeriod[];
  hourly: NwsPeriod[];
  alerts: NwsAlertFeature[];
  point: NwsPoint["properties"] | null;
  risk: WeatherRiskBreakdown;
  checkedAt: string;
  sourceUrls: {
    points: string;
    forecast?: string;
    forecastHourly?: string;
    alerts: string;
  };
  isStoredFallback?: boolean;
  refreshError?: string;
};

const NWS_POINTS_URL = `https://api.weather.gov/points/${DOWNTOWN_MOBILE_COORDINATES.latitude},${DOWNTOWN_MOBILE_COORDINATES.longitude}`;
const NWS_ALERTS_URL = `https://api.weather.gov/alerts/active?point=${DOWNTOWN_MOBILE_COORDINATES.latitude},${DOWNTOWN_MOBILE_COORDINATES.longitude}`;

function nwsHeaders() {
  return {
    "User-Agent":
      process.env.NWS_USER_AGENT ||
      "Mobile Mardi Gras Tracker Phase 1 (contact: admin@example.com)",
    Accept: "application/geo+json,application/json"
  };
}

async function fetchNwsJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: nwsHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`NWS request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function getLiveWeatherPreview(): Promise<WeatherPreview> {
  const point = await fetchNwsJson<NwsPoint>(NWS_POINTS_URL);
  const [daily, hourly, alerts] = await Promise.all([
    fetchNwsJson<NwsForecast>(point.properties.forecast),
    fetchNwsJson<NwsForecast>(point.properties.forecastHourly),
    fetchNwsJson<NwsAlerts>(NWS_ALERTS_URL)
  ]);

  const current = hourly.properties.periods[0] ?? null;
  const nextSixHours = hourly.properties.periods.slice(0, 6);
  const activeAlerts = alerts.features ?? [];

  return {
    current,
    daily: daily.properties.periods.slice(0, 7),
    hourly: nextSixHours,
    alerts: activeAlerts,
    point: point.properties,
    risk: scoreWeatherRisk(nextSixHours, activeAlerts),
    checkedAt: new Date().toISOString(),
    sourceUrls: {
      points: NWS_POINTS_URL,
      forecast: point.properties.forecast,
      forecastHourly: point.properties.forecastHourly,
      alerts: NWS_ALERTS_URL
    }
  };
}

export async function getWeatherPreview(): Promise<WeatherPreview> {
  try {
    return await getLiveWeatherPreview();
  } catch (error) {
    const storedPreview = await getStoredWeatherPreview();

    if (storedPreview) {
      return {
        ...storedPreview,
        isStoredFallback: true,
        refreshError: error instanceof Error ? error.message : "Live NWS refresh failed"
      };
    }

    throw error;
  }
}

export function scoreWeatherRisk(periods: NwsPeriod[], alerts: NwsAlertFeature[]): WeatherRiskBreakdown {
  const maxRain = Math.max(
    0,
    ...periods.map((period) => period.probabilityOfPrecipitation?.value ?? 0)
  );
  const maxWind = Math.max(0, ...periods.map((period) => extractMaxMph(period.windSpeed)));
  const forecastText = periods.map((period) => `${period.shortForecast} ${period.detailedForecast}`).join(" ");
  const alertEvents = alerts.map((alert) => alert.properties.event.toLowerCase());

  const rainScore = maxRain >= 60 ? 3 : maxRain >= 40 ? 2 : maxRain >= 20 ? 1 : 0;
  const lightningScore = alertEvents.some((event) => event.includes("tornado"))
    ? 6
    : alertEvents.some((event) => event.includes("severe thunderstorm"))
      ? 5
      : /thunder|lightning/i.test(forecastText)
        ? 3
        : 0;
  const windScore =
    maxWind >= 40
      ? 5
      : maxWind >= 30
        ? 3
        : maxWind >= 25
          ? 3
          : maxWind >= 20
            ? 2
            : maxWind >= 15
              ? 1
              : 0;
  const floodScore = alertEvents.some((event) => event.includes("flash flood"))
    ? 5
    : alertEvents.some((event) => event.includes("flood"))
      ? 3
      : 0;
  const maxHeat = Math.max(0, ...periods.map((period) => period.temperature));
  const minCold = Math.min(...periods.map((period) => period.temperature).filter(Number.isFinite));
  const heatScore = maxHeat >= 100 ? 3 : maxHeat >= 95 ? 2 : 0;
  const coldScore = minCold < 28 ? 3 : minCold < 35 ? 2 : 0;

  const riskScore = rainScore + lightningScore + windScore + heatScore + coldScore + floodScore;
  const riskLevel = riskScore >= 9 ? "SEVERE" : riskScore >= 6 ? "HIGH" : riskScore >= 3 ? "MODERATE" : "LOW";

  return {
    riskLevel,
    riskScore,
    rainScore,
    lightningScore,
    windScore,
    heatScore,
    coldScore,
    floodScore,
    summary: buildRiskSummary(riskLevel, maxRain, maxWind, alerts)
  };
}

function extractMaxMph(value: string) {
  const matches = value.match(/\d+/g);
  return matches ? Math.max(...matches.map(Number)) : 0;
}

function buildRiskSummary(
  riskLevel: WeatherRiskBreakdown["riskLevel"],
  rainChance: number,
  windMph: number,
  alerts: NwsAlertFeature[]
) {
  if (alerts.length > 0) {
    return `${riskLevel} weather risk based on active NWS alert(s): ${alerts
      .map((alert) => alert.properties.event)
      .slice(0, 3)
      .join(", ")}. Verify details with the National Weather Service.`;
  }

  if (riskLevel === "LOW") {
    return `Low weather risk in the next few hours. Rain chance is ${rainChance}% and listed wind is up to ${windMph} mph.`;
  }

  return `${riskLevel} weather risk in the next few hours. Rain chance is ${rainChance}% and listed wind is up to ${windMph} mph. Weather risk does not mean a parade is canceled unless officially announced.`;
}

export async function checkWeatherAndStore() {
  const preview = await getLiveWeatherPreview();
  const current = preview.current;
  const rawJson = JSON.stringify(preview);
  const contentHash = hashContent(rawJson);

  await prisma.weatherSnapshot.create({
    data: {
      checkedAt: new Date(preview.checkedAt),
      latitude: DOWNTOWN_MOBILE_COORDINATES.latitude,
      longitude: DOWNTOWN_MOBILE_COORDINATES.longitude,
      source: "National Weather Service API",
      temperature: current?.temperature ?? null,
      windSpeed: current?.windSpeed ?? null,
      windDirection: current?.windDirection ?? null,
      precipitationProbability: current?.probabilityOfPrecipitation?.value ?? null,
      shortForecast: current?.shortForecast ?? null,
      detailedForecast: current?.detailedForecast ?? null,
      rawJson,
      contentHash
    }
  });

  for (const alert of preview.alerts) {
    await prisma.weatherAlert.upsert({
      where: { alertId: alert.id },
      update: {
        event: alert.properties.event,
        severity: alert.properties.severity,
        urgency: alert.properties.urgency,
        certainty: alert.properties.certainty,
        headline: alert.properties.headline,
        description: alert.properties.description,
        instruction: alert.properties.instruction,
        areaDesc: alert.properties.areaDesc,
        effective: parseOptionalDate(alert.properties.effective),
        expires: parseOptionalDate(alert.properties.expires),
        ends: parseOptionalDate(alert.properties.ends),
        source: "National Weather Service API",
        rawJson: JSON.stringify(alert),
        lastSeenAt: new Date(),
        active: true
      },
      create: {
        alertId: alert.id,
        event: alert.properties.event,
        severity: alert.properties.severity,
        urgency: alert.properties.urgency,
        certainty: alert.properties.certainty,
        headline: alert.properties.headline,
        description: alert.properties.description,
        instruction: alert.properties.instruction,
        areaDesc: alert.properties.areaDesc,
        effective: parseOptionalDate(alert.properties.effective),
        expires: parseOptionalDate(alert.properties.expires),
        ends: parseOptionalDate(alert.properties.ends),
        source: "National Weather Service API",
        rawJson: JSON.stringify(alert),
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
        active: true
      }
    });
  }

  await prisma.weatherRiskScore.create({
    data: {
      calculatedAt: new Date(preview.checkedAt),
      riskLevel: preview.risk.riskLevel,
      riskScore: preview.risk.riskScore,
      rainScore: preview.risk.rainScore,
      lightningScore: preview.risk.lightningScore,
      windScore: preview.risk.windScore,
      heatScore: preview.risk.heatScore,
      coldScore: preview.risk.coldScore,
      floodScore: preview.risk.floodScore,
      summary: preview.risk.summary,
      recommendedPublicMessage: preview.risk.summary
    }
  });

  return preview;
}

function parseOptionalDate(value?: string | null) {
  return value ? new Date(value) : null;
}

async function getStoredWeatherPreview(): Promise<WeatherPreview | null> {
  const [snapshot, riskScore, activeAlerts] = await Promise.all([
    prisma.weatherSnapshot.findFirst({ orderBy: { checkedAt: "desc" } }),
    prisma.weatherRiskScore.findFirst({ orderBy: { calculatedAt: "desc" } }),
    prisma.weatherAlert.findMany({ where: { active: true }, orderBy: { effective: "desc" } })
  ]);

  if (!snapshot && !riskScore) {
    return null;
  }

  const parsedPreview = parseStoredPreview(snapshot?.rawJson ?? null);
  const storedAlerts: NwsAlertFeature[] = activeAlerts.map((alert) => ({
    id: alert.alertId,
    properties: {
      event: alert.event,
      severity: alert.severity ?? undefined,
      urgency: alert.urgency ?? undefined,
      certainty: alert.certainty ?? undefined,
      headline: alert.headline ?? undefined,
      description: alert.description ?? undefined,
      instruction: alert.instruction ?? undefined,
      areaDesc: alert.areaDesc ?? undefined,
      effective: alert.effective?.toISOString(),
      expires: alert.expires?.toISOString(),
      ends: alert.ends?.toISOString() ?? null
    }
  }));
  const current = parsedPreview?.current ?? buildCurrentPeriodFromSnapshot(snapshot);
  const hourly = parsedPreview?.hourly?.length ? parsedPreview.hourly : current ? [current] : [];
  const alerts = storedAlerts.length ? storedAlerts : parsedPreview?.alerts ?? [];
  const risk =
    riskScore
      ? {
          riskLevel: riskScore.riskLevel as WeatherRiskBreakdown["riskLevel"],
          riskScore: riskScore.riskScore,
          rainScore: riskScore.rainScore,
          lightningScore: riskScore.lightningScore,
          windScore: riskScore.windScore,
          heatScore: riskScore.heatScore,
          coldScore: riskScore.coldScore,
          floodScore: riskScore.floodScore,
          summary: riskScore.summary
        }
      : parsedPreview?.risk ?? scoreWeatherRisk(hourly, alerts);

  return {
    current,
    daily: parsedPreview?.daily ?? [],
    hourly,
    alerts,
    point: parsedPreview?.point ?? null,
    risk,
    checkedAt: snapshot?.checkedAt.toISOString() ?? riskScore?.calculatedAt.toISOString() ?? new Date().toISOString(),
    sourceUrls: parsedPreview?.sourceUrls ?? {
      points: NWS_POINTS_URL,
      alerts: NWS_ALERTS_URL
    },
    isStoredFallback: true
  };
}

function parseStoredPreview(rawJson?: string | null) {
  if (!rawJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawJson) as Partial<WeatherPreview>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function buildCurrentPeriodFromSnapshot(snapshot: Awaited<ReturnType<typeof prisma.weatherSnapshot.findFirst>>) {
  if (!snapshot || (!snapshot.shortForecast && snapshot.temperature === null)) {
    return null;
  }

  return {
    name: "Stored snapshot",
    startTime: snapshot.checkedAt.toISOString(),
    endTime: snapshot.checkedAt.toISOString(),
    temperature: snapshot.temperature ?? 0,
    temperatureUnit: "F",
    windSpeed: snapshot.windSpeed ?? "Not recorded",
    windDirection: snapshot.windDirection ?? "",
    shortForecast: snapshot.shortForecast ?? "Stored weather snapshot",
    detailedForecast: snapshot.detailedForecast ?? snapshot.shortForecast ?? "Stored weather snapshot",
    probabilityOfPrecipitation: {
      value: snapshot.precipitationProbability
    }
  };
}
