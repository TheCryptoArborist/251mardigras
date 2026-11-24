import { shareMetadata } from "./motorway-share";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Reuse the game's established MG251 page address. The bundle is local: no
// upstream authentication, redirects, or dependency on ChatGPT hosting.
export const MOTORWAY_BASE = "/play/moonpie-motorway";
const ROOT = join(process.cwd(), "games/moonpie-motorway/dist");
const FILES = new Set(["index.html", "game.js", "art.js", "fonts.css", "parades.json", "community.js", "community.css"]);
const TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8", js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8", json: "application/json; charset=utf-8",
  png: "image/png", jpg: "image/jpeg", webp: "image/webp", woff: "font/woff", ttf: "font/ttf", txt: "text/plain; charset=utf-8"
};

export async function serveMotorway(method: string, segments: string[] = [], requestUrl?: string) {
  const resource = segments.length ? segments.join("/") : "index.html";
  if (!FILES.has(resource) && !/^assets\/[a-zA-Z0-9_-]+\.(webp|png|jpg|woff|ttf|txt)$/.test(resource)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    let bytes = await readFile(join(ROOT, resource));
    if (resource === "index.html") {
      const metadata = await shareMetadata(new URL(requestUrl || "https://mg251.xyz/play/moonpie-motorway"));
      bytes = Buffer.from(bytes.toString("utf8").replace("<head>", `<head><base href="${MOTORWAY_BASE}/">${metadata}`));
    }
    const extension = resource.split(".").at(-1)!;
    return new Response(method === "HEAD" ? null : new Uint8Array(bytes), {
      headers: {
        "content-type": TYPES[extension],
        "content-length": String(bytes.length),
        "cache-control": extension === "html" || extension === "json" ? "no-store" : "public, max-age=300",
        "x-content-type-options": "nosniff"
      }
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return new Response("Not found", { status: 404 });
    return new Response("The game is temporarily unavailable. Please try again shortly.", { status: 503 });
  }
}
