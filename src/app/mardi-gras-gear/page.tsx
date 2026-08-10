import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const gearResourceLogoPaths: Record<string, string> = {
  "Port City Throws": "/images/food-stops/port-city-throws.png",
  "Pop's Midtown": "/images/food-stops/pops-midtown.jpg",
  "Lemon T's": "/images/food-stops/lemon-ts.jpg"
};

export default async function MardiGrasGearPage() {
  const resources = (await getResources()).filter((resource) => resource.category === "Mardi Gras Gear / Throws");

  return (
    <CategoryResourcePage
      eyebrow="Throws, gear, and shopping"
      title="Mardi Gras Gear"
      description="Selected Mardi Gras gear, throws, drink holders, and Mobile Mardi Gras shopping resources. This section should stay focused on useful Mardi Gras visitor resources, not unrelated deals."
      resources={resources}
      primaryHref="/resources"
      primaryAction="Open full resource guide"
      resourceActionLabel="Open shop"
      officialReminder="Shopping links are visitor convenience resources. Product availability, pricing, hours, and fulfillment are controlled by each vendor."
      resourceLogoPaths={gearResourceLogoPaths}
    />
  );
}
