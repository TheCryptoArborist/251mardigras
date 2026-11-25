import assert from "node:assert/strict";
import { test } from "node:test";
import { GET, HEAD } from "../src/app/play/moonpie-motorway/[[...path]]/route";
const context = (path: string[] = []) => ({ params: Promise.resolve({ path }) });
const request = new Request("https://mg251.xyz/play/moonpie-motorway");
test("existing MG251 address serves a local playable document with same-origin asset base", async () => {
  const response = await GET(request, context());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  const html = await response.text();
  assert(html.includes('<base href="/play/moonpie-motorway/">'));
  assert(html.includes('<script src="game.js"></script>'));
  assert(!html.includes("chatgpt.site"));
});
test("all required runtime files and fonts are served with correct types", async () => {
  for (const [path, type] of [["assets/trophy-gold.svg", "image/svg+xml"], ["assets/trophy-silver.svg", "image/svg+xml"], ["assets/trophy-bronze.svg", "image/svg+xml"], ["assets/share-race-square.jpg", "image/jpeg"], ["assets/share-race-wide.jpg", "image/jpeg"], ["assets/mg251-logo.png", "image/png"], ["tilt.js", "text/javascript"], ["community.js", "text/javascript"], ["community.css", "text/css"], ["game.js", "text/javascript"], ["art.js", "text/javascript"], ["parades.json", "application/json"], ["fonts.css", "text/css"], ["assets/race-cars-v3.webp", "image/webp"], ["assets/font-7cHpv4kjgoGqM7EPCw.woff", "font/woff"]]) {
    const response = await GET(request, context(path.split("/")));
    assert.equal(response.status, 200, path);
    assert(response.headers.get("content-type")?.startsWith(type), path);
    assert((await response.arrayBuffer()).byteLength > 0);
  }
});
test("HEAD matches GET metadata without sending a body", async () => {
  const get = await GET(request, context());
  const head = await HEAD(request, context());
  assert.equal(head.headers.get("content-length"), get.headers.get("content-length"));
  assert.equal(await head.text(), "");
});
test("unknown resources, private files, and traversal are rejected", async () => {
  for (const path of [["..", "README.md"], ["assets", "..", "index.html"], [".openai", "hosting.json"], ["assets", "missing.webp"], ["game.js", "extra"]]) {
    assert.equal((await GET(request, context(path))).status, 404);
  }
});

test("social crawlers receive MG251 metadata and a real PNG card", async () => {
 const response=await GET(request,context());const html=await response.text();
 assert(html.includes('property="og:image"'));assert(html.includes('https://mg251.xyz/play/moonpie-motorway/share.png'));
 const image=await GET(request,context(["share.png"]));assert.equal(image.status,200);assert.equal(image.headers.get("content-type"),"image/png");
 const bytes=new Uint8Array(await image.arrayBuffer());assert.deepEqual([...bytes.slice(0,8)],[137,80,78,71,13,10,26,10]);
});
