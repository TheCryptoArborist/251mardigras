import { prisma } from "../lib/prisma";
import { checkAllSources } from "../services/source-checker";

checkAllSources()
  .then((results) => {
    console.table(results);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
