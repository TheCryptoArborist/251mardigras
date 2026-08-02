import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  LINKTREE_URL,
  RESOURCE_DIRECTORY_SOURCE,
  officialSources,
  resourceSeeds,
  type ResourceSeed
} from "../src/lib/seed-data";
import { prisma } from "../src/lib/prisma";
import { fetchLinktreeLinks, findBestLinktreeMatch, type LinktreeExtractedLink } from "../src/services/linktree";

const LEGACY_LINKTREE_SOURCE = "Mardi Gras Mobile Linktree";
const LINKTREE_CACHE_PATH = resolve(process.cwd(), "data", "linktree-links.json");

async function main() {
  const { resources, liveLinks, cachedLinks, matchedCount, skippedTitles } = await resolveResourcesWithDirectLinks();

  for (const source of officialSources) {
    await prisma.source.upsert({
      where: { url: source.url },
      update: {
        name: source.name,
        sourceType: source.sourceType,
        active: true,
        checkIntervalMinutes: source.checkIntervalMinutes
      },
      create: {
        name: source.name,
        url: source.url,
        sourceType: source.sourceType,
        active: true,
        checkIntervalMinutes: source.checkIntervalMinutes
      }
    });
  }

  if (liveLinks.length > 0) {
    await prisma.resourceSnapshot.create({
      data: {
        sourceUrl: LINKTREE_URL,
        rawText: liveLinks.map((link) => `${link.title} -> ${link.url}`).join("\n"),
        contentHash: createHash("sha256").update(JSON.stringify(liveLinks)).digest("hex"),
        extractedJson: JSON.stringify(liveLinks)
      }
    });
  }

  await prisma.resource.deleteMany({
    where: { source: { in: [LEGACY_LINKTREE_SOURCE, RESOURCE_DIRECTORY_SOURCE] } }
  });

  await prisma.resource.createMany({
    data: resources.map((resource) => ({
      title: resource.title,
      url: resource.url,
      category: resource.category,
      description: resource.description,
      source: resource.source,
      sourceUrl: resource.sourceUrl,
      sortOrder: resource.sortOrder,
      active: true,
      lastSeenAt: new Date()
    }))
  });

  console.log(`Seeded ${officialSources.length} sources and ${resources.length} direct resources.`);
  console.log(`Loaded ${cachedLinks.length} cached direct links from ${LINKTREE_CACHE_PATH}.`);
  console.log(`Extracted ${liveLinks.length} live legacy Linktree links and matched ${matchedCount} placeholder resources.`);

  if (skippedTitles.length > 0) {
    console.warn(`Skipped ${skippedTitles.length} resources without direct destinations:`);
    skippedTitles.forEach((title) => console.warn(`- ${title}`));
  }
}

async function resolveResourcesWithDirectLinks() {
  const cachedLinks = await loadCachedLinktreeLinks();
  let liveLinks: LinktreeExtractedLink[] = [];

  try {
    liveLinks = await fetchLinktreeLinks(LINKTREE_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Linktree extraction error";
    console.warn(`Legacy Linktree extraction failed: ${message}`);
  }

  const linkCandidates = dedupeExtractedLinks([...liveLinks, ...cachedLinks]);
  let matchedCount = 0;
  const skippedTitles: string[] = [];
  const resources: ResourceSeed[] = [];

  for (const resource of resourceSeeds) {
    const hasDirectUrl = resource.url !== LINKTREE_URL;
    const matchedLink = hasDirectUrl ? null : findBestLinktreeMatch(resource.title, linkCandidates);
    const directUrl = hasDirectUrl ? resource.url : matchedLink?.url;

    if (!directUrl || directUrl === LINKTREE_URL) {
      skippedTitles.push(resource.title);
      continue;
    }

    if (matchedLink) {
      matchedCount += 1;
    }

    resources.push({ ...resource, url: directUrl });
  }

  return { resources, liveLinks, cachedLinks, matchedCount, skippedTitles };
}

async function loadCachedLinktreeLinks(): Promise<LinktreeExtractedLink[]> {
  if (!existsSync(LINKTREE_CACHE_PATH)) {
    return [];
  }

  try {
    const rawJson = await readFile(LINKTREE_CACHE_PATH, "utf8");
    const parsed: unknown = JSON.parse(rawJson);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCachedLinktreeLink).map((link) => ({
      title: link.title,
      url: link.url,
      source: link.source === "next-data" ? "next-data" : "anchor"
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown cache read error";
    console.warn(`Could not read ${LINKTREE_CACHE_PATH}: ${message}`);
    return [];
  }
}

function isCachedLinktreeLink(value: unknown): value is LinktreeExtractedLink {
  if (!value || typeof value !== "object") {
    return false;
  }

  const link = value as Record<string, unknown>;
  return typeof link.title === "string" && typeof link.url === "string" && /^https?:\/\//i.test(link.url);
}

function dedupeExtractedLinks(links: LinktreeExtractedLink[]) {
  const seen = new Set<string>();
  const uniqueLinks: LinktreeExtractedLink[] = [];

  for (const link of links) {
    const key = `${link.title.toLowerCase()}::${link.url}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLinks.push(link);
    }
  }

  return uniqueLinks;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
