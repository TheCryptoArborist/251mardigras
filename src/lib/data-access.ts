import cachedDirectLinks from "../../data/linktree-links.json";
import { prisma } from "./prisma";
import { LINKTREE_URL, officialSources, resourceSeeds } from "./seed-data";
import { findBestLinktreeMatch, normalizeLinkTitle, type LinktreeExtractedLink } from "@/services/linktree";

export type PublicChange = {
  id: string;
  label: string;
  severity: "low" | "medium" | "high" | "info";
  title: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  detectedAt?: string;
};

export type SourceStatus = {
  id: string;
  name: string;
  url: string;
  sourceType: string;
  active: boolean;
  lastCheckedAt: string | null;
  lastSuccessAt: string | null;
  lastError: string | null;
};

export type ResourceItem = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  source: string;
  sourceUrl: string;
};

type ResourceItemWithSort = ResourceItem & {
  sortOrder?: number;
};

type CachedDirectLink = LinktreeExtractedLink;

export type ParadeItem = {
  id: string;
  name: string;
  date: string;
  startTime: string | null;
  routeName: string | null;
  routeUrl: string | null;
  sourceUrl: string;
  status: string;
  lastUpdatedAt: string | null;
};

export async function getPublicChanges(limit = 6): Promise<PublicChange[]> {
  try {
    const changes = await prisma.change.findMany({
      where: {
        acknowledged: false,
        severity: { in: ["high", "medium"] }
      },
      include: { source: true },
      orderBy: { detectedAt: "desc" },
      take: limit
    });

    return changes.map((change) => ({
      id: String(change.id),
      label: labelForChangeType(change.changeType),
      severity: change.severity as PublicChange["severity"],
      title: change.summary,
      summary:
        change.diffText?.slice(0, 240) ||
        "Meaningful source change detected. Review the official source before treating it as public guidance.",
      source: change.source.name,
      sourceUrl: change.source.url,
      detectedAt: change.detectedAt.toISOString()
    }));
  } catch {
    return [];
  }
}

export async function getSourceStatuses(): Promise<SourceStatus[]> {
  try {
    const sources = await prisma.source.findMany({ orderBy: { name: "asc" } });

    if (sources.length > 0) {
      return sources.map((source) => ({
        id: String(source.id),
        name: source.name,
        url: source.url,
        sourceType: source.sourceType,
        active: source.active,
        lastCheckedAt: source.lastCheckedAt?.toISOString() ?? null,
        lastSuccessAt: source.lastSuccessAt?.toISOString() ?? null,
        lastError: source.lastError
      }));
    }
  } catch {
    // Fall back to source seed data when the database has not been migrated yet.
  }

  return officialSources.map((source, index) => ({
    id: `seed-${index}`,
    name: source.name,
    url: source.url,
    sourceType: source.sourceType,
    active: true,
    lastCheckedAt: null,
    lastSuccessAt: null,
    lastError: null
  }));
}

export async function getResources(): Promise<ResourceItem[]> {
  try {
    const resources = await prisma.resource.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }]
    });

    return mergeResourceItems(
      resources.map((resource) => ({
        id: String(resource.id),
        title: resource.title,
        url: resource.url,
        category: resource.category,
        description: resource.description ?? "",
        source: resource.source,
        sourceUrl: resource.sourceUrl,
        sortOrder: resource.sortOrder
      }))
    );
  } catch {
    // Fall back to curated seed data when the database has not been migrated yet.
  }

  return mergeResourceItems([]);
}

export async function getParades(): Promise<ParadeItem[]> {
  try {
    const parades = await prisma.parade.findMany({
      orderBy: [{ date: "asc" }, { startTime: "asc" }]
    });

    return parades.map((parade) => ({
      id: String(parade.id),
      name: parade.name,
      date: parade.date,
      startTime: parade.startTime,
      routeName: parade.routeName,
      routeUrl: parade.routeUrl,
      sourceUrl: parade.sourceUrl,
      status: parade.status,
      lastUpdatedAt: parade.lastUpdatedAt?.toISOString() ?? null
    }));
  } catch {
    return [];
  }
}

export async function getLatestSnapshots(limit = 6) {
  try {
    return prisma.snapshot.findMany({
      include: { source: true },
      orderBy: { checkedAt: "desc" },
      take: limit
    });
  } catch {
    return [];
  }
}

function mergeResourceItems(databaseResources: ResourceItemWithSort[]): ResourceItem[] {
  const merged = new Map<string, ResourceItemWithSort>();

  databaseResources.forEach((resource) => {
    merged.set(resourceKey(resource.title), resource);
  });

  seedResourceItems().forEach((resource) => {
    // Curated seed data is the public source of truth for category placement.
    // This keeps pages stable when a deployed SQLite file is missing entries or has stale categories.
    merged.set(resourceKey(resource.title), resource);
  });

  return [...merged.values()]
    .sort(compareResources)
    .map(({ sortOrder: _sortOrder, ...resource }) => resource);
}

function seedResourceItems(): ResourceItemWithSort[] {
  const cachedLinks = cachedDirectLinks as CachedDirectLink[];

  return resourceSeeds.flatMap((resource, index) => {
    const directUrl = resource.url !== LINKTREE_URL ? resource.url : findBestLinktreeMatch(resource.title, cachedLinks)?.url;

    if (!directUrl || directUrl === LINKTREE_URL) {
      return [];
    }

    return [
      {
        id: `seed-${index}`,
        title: resource.title,
        url: directUrl,
        category: resource.category,
        description: resource.description,
        source: resource.source,
        sourceUrl: resource.sourceUrl,
        sortOrder: resource.sortOrder
      }
    ];
  });
}

function compareResources(a: ResourceItemWithSort, b: ResourceItemWithSort) {
  return (
    categoryOrder(a.category) - categoryOrder(b.category) ||
    a.category.localeCompare(b.category) ||
    (a.sortOrder ?? 999) - (b.sortOrder ?? 999) ||
    a.title.localeCompare(b.title)
  );
}

function categoryOrder(category: string) {
  const order: Record<string, number> = {
    "Live Coverage / Channel Support": 1,
    "Social Media": 2,
    "Downtown Transportation": 3,
    "Mobility-Friendly Access": 4,
    "Food and Drink": 5,
    "Mardi Gras Gear / Throws": 6,
    "Previous Parade Seasons": 7
  };

  return order[category] ?? 99;
}

function resourceKey(title: string) {
  return normalizeLinkTitle(title);
}

function labelForChangeType(changeType: string) {
  const labels: Record<string, string> = {
    route_change: "ROUTE CHANGE",
    schedule_change: "TIME CHANGE",
    parade_cancellation: "CANCELLATION",
    parade_postponement: "TIME CHANGE",
    parking_change: "TOWING / PARKING CHANGE",
    road_closure_change: "ROAD CLOSURE",
    towing_update: "TOWING / PARKING CHANGE",
    safety_update: "PUBLIC SAFETY UPDATE",
    vendor_update: "VENDOR POLICY UPDATE",
    horse_policy_update: "HORSE POLICY UPDATE",
    new_pdf_or_map: "NEW RESOURCE",
    weather_alert: "SEVERE WEATHER",
    weather_risk_change: "SEVERE WEATHER",
    resource_added: "NEW RESOURCE"
  };

  return labels[changeType] ?? "PUBLIC SAFETY UPDATE";
}
