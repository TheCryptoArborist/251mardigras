import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { FoodStopSelector } from "@/components/FoodStopSelector";
import { getResources } from "@/lib/data-access";

export const dynamic = "force-dynamic";

export default async function FoodDrinkPage() {
  const resources = (await getResources()).filter((resource) => resource.category === "Food and Drink");

  return (
    <div>
      <CategoryResourcePage
        eyebrow="Downtown stops"
        title="Food and Drink"
        description="Restaurants, coffee shops, bakeries, breweries, barbecue, dessert stops, and direct map or venue links for people walking or driving downtown during Mardi Gras."
        resources={resources}
        primaryHref={null}
        primaryAction={null}
        resourceActionLabel="Open / navigate"
        officialReminder="Hours, reservations, road access, and parade-day availability can change quickly. Confirm details with the venue and verify road closures or safety instructions with official sources."
        showHeroQuickView={false}
        showResourceSection={false}
      />
      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
        <FoodStopSelector resources={resources} />
      </div>
    </div>
  );
}
