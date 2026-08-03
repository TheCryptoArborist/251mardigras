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
        resources={[]}
        primaryHref="/resources#food-and-drink-navigator"
        primaryAction="Open full food navigator"
        emptyMessage="Use the selector below to choose a food or drink stop."
        resourceActionLabel="Open / navigate"
        officialReminder="Hours, reservations, road access, and parade-day availability can change quickly. Confirm details with the venue and verify road closures or safety instructions with official sources."
      />
      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 lg:px-8">
        <FoodStopSelector resources={resources} />
      </div>
    </div>
  );
}
