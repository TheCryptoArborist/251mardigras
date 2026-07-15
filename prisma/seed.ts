import { officialSources, resourceSeeds } from "../src/lib/seed-data";
import { prisma } from "../src/lib/prisma";

async function main() {
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

  await prisma.resource.deleteMany({
    where: { source: "Mardi Gras Mobile Linktree" }
  });

  await prisma.resource.createMany({
    data: resourceSeeds.map((resource) => ({
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

  console.log(`Seeded ${officialSources.length} sources and ${resourceSeeds.length} resources.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
