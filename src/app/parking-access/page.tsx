import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

export default async function ParkingAccessPage() {
  const resources = (await getResources()).filter((resource) =>
    ["Downtown Transportation", "Mobility-Friendly Access"].includes(resource.category)
  );

  return (
    <CategoryResourcePage
      eyebrow="Get downtown"
      title="Parking and Access"
      description="Parking, transportation, downtown access, and mobility-friendly resources for Mobile Mardi Gras visitors. Start here when planning how to get downtown and where to go next."
      resources={resources}
      primaryHref="/resources"
      primaryAction="Open full visitor guide"
      resourceActionLabel="Open link"
      officialReminder="Parking, towing, road closures, public-safety instructions, and parade-day access should be verified through official City and public-safety sources before travel."
    />
  );
}
