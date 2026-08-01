import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { LINKTREE_URL } from "../src/lib/seed-data";
import { fetchLinktreeLinks } from "../src/services/linktree";

const CACHE_PATH = resolve(process.cwd(), "data", "linktree-links.json");

async function main() {
  const links = await fetchLinktreeLinks(LINKTREE_URL);

  await mkdir(dirname(CACHE_PATH), { recursive: true });
  await writeFile(CACHE_PATH, `${JSON.stringify(links, null, 2)}\n`, "utf8");

  console.log(`Wrote ${links.length} direct links to ${CACHE_PATH}`);
  console.log("Commit this file after review so the website no longer depends on Linktree being available later.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
