import { prisma } from "../lib/prisma";
import { checkWeatherAndStore } from "../services/weather";

checkWeatherAndStore()
  .then((weather) => {
    console.log(`Stored NWS weather snapshot: ${weather.risk.riskLevel} (${weather.risk.riskScore})`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
