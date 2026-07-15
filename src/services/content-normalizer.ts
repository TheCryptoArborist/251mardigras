import * as cheerio from "cheerio";
import { createHash } from "node:crypto";

const REMOVED_SELECTORS = [
  "script",
  "style",
  "noscript",
  "svg",
  "iframe",
  "nav",
  "footer",
  "header",
  "[aria-hidden='true']",
  ".site-header",
  ".site-footer",
  ".menu",
  ".navigation",
  ".social",
  ".cookie",
  ".newsletter"
];

export function normalizeHtmlContent(html: string) {
  const $ = cheerio.load(html);
  $(REMOVED_SELECTORS.join(",")).remove();

  const text = $("body").text() || $.root().text();

  return normalizeText(text);
}

export function normalizeText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\S\r\n]+/g, " ")
    .trim()
    .toLowerCase();
}

export function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

export function summarizeDiff(previous: string, next: string) {
  const previousWords = new Set(previous.split(" ").filter(Boolean));
  const nextWords = new Set(next.split(" ").filter(Boolean));
  const added = [...nextWords].filter((word) => !previousWords.has(word)).slice(0, 40);
  const removed = [...previousWords].filter((word) => !nextWords.has(word)).slice(0, 40);

  return [
    added.length ? `Added: ${added.join(", ")}` : "",
    removed.length ? `Removed: ${removed.join(", ")}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

