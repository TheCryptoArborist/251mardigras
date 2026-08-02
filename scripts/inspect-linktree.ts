import { LINKTREE_URL } from "../src/lib/seed-data";
import { fetchLinktreeLinks } from "../src/services/linktree";

async function main() {
  const links = await fetchLinktreeLinks(LINKTREE_URL);

  console.log(`Extracted ${links.length} direct links from ${LINKTREE_URL}\n`);

  for (const link of links) {
    console.log(`${link.title}\n  ${link.url}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
