export type LinktreeExtractedLink = {
  title: string;
  url: string;
  source: "next-data" | "anchor";
};

type JsonRecord = Record<string, unknown>;

const TITLE_KEYS = ["title", "label", "name", "displayTitle"];
const URL_KEYS = ["url", "linkUrl", "href"];
const STOP_WORDS = new Set(["app", "link", "links", "click", "here", "official"]);

export async function fetchLinktreeLinks(linktreeUrl: string): Promise<LinktreeExtractedLink[]> {
  const response = await fetch(linktreeUrl, {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent": "Mobile Mardi Gras public resource checker (+https://251mardigras.netlify.app/)"
    }
  });

  if (!response.ok) {
    throw new Error(`Linktree request failed with ${response.status}`);
  }

  const html = await response.text();
  const extracted = [...extractLinksFromNextData(html), ...extractLinksFromAnchors(html)];

  return dedupeLinks(extracted)
    .filter((link) => link.title.length > 0)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function findBestLinktreeMatch(title: string, links: LinktreeExtractedLink[]) {
  const normalizedTitle = normalizeLinkTitle(title);
  const titleTokens = tokenizeLinkTitle(title);

  const exact = links.find((link) => normalizeLinkTitle(link.title) === normalizedTitle);
  if (exact) {
    return exact;
  }

  const compactTitle = compactLinkTitle(title);
  const compact = links.find((link) => compactLinkTitle(link.title) === compactTitle);
  if (compact) {
    return compact;
  }

  const tokenMatch = links.find((link) => {
    const linkTokens = new Set(tokenizeLinkTitle(link.title));
    return titleTokens.length > 0 && titleTokens.every((token) => linkTokens.has(token));
  });

  if (tokenMatch) {
    return tokenMatch;
  }

  return links.find((link) => {
    const linkTitle = normalizeLinkTitle(link.title);
    return normalizedTitle.length > 3 && (linkTitle.includes(normalizedTitle) || normalizedTitle.includes(linkTitle));
  });
}

export function normalizeLinkTitle(title: string) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeLinkTitle(title: string) {
  return normalizeLinkTitle(title)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function compactLinkTitle(title: string) {
  return normalizeLinkTitle(title).replace(/\s+/g, "");
}

function extractLinksFromNextData(html: string): LinktreeExtractedLink[] {
  const nextDataMatch = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!nextDataMatch?.[1]) {
    return [];
  }

  try {
    const data: unknown = JSON.parse(decodeHtmlEntities(nextDataMatch[1].trim()));
    const links: LinktreeExtractedLink[] = [];
    walkJsonForLinks(data, links);
    return links;
  } catch {
    return [];
  }
}

function walkJsonForLinks(value: unknown, links: LinktreeExtractedLink[]) {
  if (Array.isArray(value)) {
    value.forEach((item) => walkJsonForLinks(item, links));
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  const title = pickFirstString(value, TITLE_KEYS);
  const url = pickFirstUrl(value, URL_KEYS);

  if (title && url) {
    links.push({ title: cleanText(title), url, source: "next-data" });
  }

  Object.values(value).forEach((item) => walkJsonForLinks(item, links));
}

function extractLinksFromAnchors(html: string): LinktreeExtractedLink[] {
  const links: LinktreeExtractedLink[] = [];
  const anchorPattern = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(html)) !== null) {
    const url = normalizeExternalUrl(match[1]);
    const title = cleanText(stripTags(decodeHtmlEntities(match[2])));

    if (url && title) {
      links.push({ title, url, source: "anchor" });
    }
  }

  return links;
}

function pickFirstString(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && cleanText(value)) {
      return value;
    }
  }

  return null;
}

function pickFirstUrl(record: JsonRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string") {
      const url = normalizeExternalUrl(value);
      if (url) {
        return url;
      }
    }
  }

  return null;
}

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.endsWith("linktr.ee")) {
      const embeddedUrl = url.searchParams.get("url") ?? url.searchParams.get("u");
      if (embeddedUrl && /^https?:\/\//i.test(embeddedUrl)) {
        return new URL(embeddedUrl).toString();
      }

      return null;
    }

    if (/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function dedupeLinks(links: LinktreeExtractedLink[]) {
  const seen = new Set<string>();
  const uniqueLinks: LinktreeExtractedLink[] = [];

  for (const link of links) {
    const key = `${normalizeLinkTitle(link.title)}::${link.url}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLinks.push(link);
    }
  }

  return uniqueLinks;
}

function cleanText(value: string) {
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
