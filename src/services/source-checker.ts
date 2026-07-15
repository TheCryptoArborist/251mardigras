import { prisma } from "../lib/prisma";
import { officialSources } from "../lib/seed-data";
import { classifyContentChange } from "./change-classifier";
import { hashContent, normalizeHtmlContent, summarizeDiff } from "./content-normalizer";

const DEFAULT_USER_AGENT =
  "Mobile Mardi Gras Tracker Phase 1 (+https://example.com; contact admin@example.com)";

export type SourceCheckResult = {
  source: string;
  url: string;
  ok: boolean;
  statusCode?: number;
  changed?: boolean;
  error?: string;
};

export async function ensureSeedSources() {
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
}

export async function checkAllSources() {
  await ensureSeedSources();

  const sources = await prisma.source.findMany({
    where: { active: true },
    orderBy: { name: "asc" }
  });

  const results: SourceCheckResult[] = [];

  for (const source of sources) {
    results.push(await checkSource(source.id));
  }

  return results;
}

export async function checkSource(sourceId: number): Promise<SourceCheckResult> {
  const source = await prisma.source.findUniqueOrThrow({ where: { id: sourceId } });
  const checkedAt = new Date();

  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": process.env.NWS_USER_AGENT || DEFAULT_USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
      }
    });

    const raw = await response.text();
    const normalizedText = normalizeHtmlContent(raw);
    const contentHash = hashContent(normalizedText);

    const previousSnapshot = await prisma.snapshot.findFirst({
      where: { sourceId: source.id },
      orderBy: { checkedAt: "desc" }
    });

    await prisma.snapshot.create({
      data: {
        sourceId: source.id,
        checkedAt,
        statusCode: response.status,
        contentHash,
        normalizedText,
        rawHtmlOrJson: raw.slice(0, 2_000_000)
      }
    });

    await prisma.source.update({
      where: { id: source.id },
      data: {
        lastCheckedAt: checkedAt,
        lastSuccessAt: response.ok ? checkedAt : source.lastSuccessAt,
        lastError: response.ok ? null : `HTTP ${response.status}`
      }
    });

    const changed = Boolean(previousSnapshot && previousSnapshot.contentHash !== contentHash);

    if (changed && previousSnapshot) {
      const diffText = summarizeDiff(previousSnapshot.normalizedText, normalizedText);
      const classification = classifyContentChange(`${normalizedText} ${diffText}`);

      await prisma.change.create({
        data: {
          sourceId: source.id,
          detectedAt: checkedAt,
          changeType: classification.changeType,
          severity: classification.severity,
          summary: `${source.name} changed. Review the official page before publishing an alert.`,
          oldValue: previousSnapshot.contentHash,
          newValue: contentHash,
          diffText,
          acknowledged: false
        }
      });

      // Phase 2 hook: classify ArcGIS route/schedule changes more precisely and send email alerts.
      // Phase 3 hook: enqueue SMS alerts after human review for high-severity public notices.
    }

    return {
      source: source.name,
      url: source.url,
      ok: response.ok,
      statusCode: response.status,
      changed
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown source check error";

    await prisma.source.update({
      where: { id: source.id },
      data: {
        lastCheckedAt: checkedAt,
        lastError: message
      }
    });

    return {
      source: source.name,
      url: source.url,
      ok: false,
      error: message
    };
  }
}
