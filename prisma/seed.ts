import { createHash } from "node:crypto";
import { LINKTREE_URL, officialSources, resourceSeeds, type ResourceSeed } from "../src/lib/seed-data";
import { prisma } from "../src/lib/prisma";
import { fetchLinktreeLinks, findBestLinktreeMatch, type LinktreeExtractedLink } from "../src/services/linktree";

async function main() {
  const { resources, extractedLinks, matchedCount, skippedTitles } = await resolveResourcesWithDirectLinks();

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

  if (extractedLinks.length > 0) {
    await prisma.resourceSnapshot.create({
      data: {
        sourceUrl: LINKTREE_URL,
        rawText: extractedLinks.map((link) => `${link.title} -> ${link.url}`).join("\n"),
        contentHash: createHash("sha256").update(JSON.stringify(extractedLinks)).digest("hex"),
        extractedJson: JSON.stringify(extractedLinks)
      }
    });
  }

  await prisma.resource.deleteMany({
    where: { source: "Mardi Gras Mobile Linktree" }
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
  console.log(`Extracted ${extractedLinks.length} live Linktree links and matched ${matchedCount} placeholder resources.`);

  if (skippedTitles.length > 0) {
    console.warn(`Skipped ${skippedTitles.length} resources without direct destinations:`);
    skippedTitles.forEach((title) => console.warn(`- ${title}`));
  }
}

async function resolveResourcesWithDirectLinks() {
  let extractedLinks: LinktreeExtractedLink[] = [];

  try {
    extractedLinks = await fetchLinktreeLinks(LINKTREE_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Linktree extraction error";
    console.warn(`Linktree extraction failed: ${message}`);
  }

  let matchedCount = 0;
  const skippedTitles: string[] = [];
  const resources: ResourceSeed[] = [];

  for (const resource of resourceSeeds) {
    const hasDirectUrl = resource.url !== LINKTREE_URL;
    const matchedLink = hasDirectUrl ? null : findBestLinktreeMatch(resource.title, extractedLinks);
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

  return { resources, extractedLinks, matchedCount, skippedTitles };
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
