import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShoppingBag } from "lucide-react";
import { CategoryResourcePage } from "@/components/CategoryResourcePage";
import { getResources, type ResourceItem } from "@/lib/data-access";

export const dynamic = "force-dynamic";

const gearResourceDetails: Record<
  string,
  {
    logoPath: string;
    description: string;
    actionLabel: string;
  }
> = {
  "Port City Throws": {
    logoPath: "/images/food-stops/port-city-throws.png",
    description: "Throws and parade supplies for Mobile Mardi Gras season.",
    actionLabel: "Shop throws"
  },
  "Pop's Midtown": {
    logoPath: "/images/food-stops/pops-midtown.jpg",
    description: "Mardi Gras apparel, local gear, and seasonal shop resources.",
    actionLabel: "Visit shop"
  },
  "Lemon T's": {
    logoPath: "/images/food-stops/lemon-ts.jpg",
    description: "Custom shirts, apparel, and Mardi Gras-ready designs.",
    actionLabel: "Shop shirts"
  },
  "Toomey's Mardi Gras": {
    logoPath: "/images/food-stops/toomeys-mardi-gras.png",
    description: "Throws, costumes, party supplies, and Mardi Gras gear.",
    actionLabel: "Visit store"
  }
};

export default async function MardiGrasGearPage() {
  const resources = (await getResources()).filter((resource) => resource.category === "Mardi Gras Gear / Throws");

  return (
    <CategoryResourcePage
      eyebrow="Gear & throws"
      title="Mardi Gras Gear"
      description="Find selected sources for throws, shirts, drink holders, and Mobile Mardi Gras supplies. Confirm availability, pricing, hours, and pickup or shipping details with each shop before making plans."
      resources={resources}
      primaryHref={null}
      primaryAction={null}
      showHeroQuickView={false}
      showResourceSection={false}
      showOfficialReminder={false}
    >
      <section className="space-y-4">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-black text-parade-purple transition hover:text-parade-purpleDark hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to full resource guide
        </Link>

        {resources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <GearResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 text-sm leading-6 text-parade-muted shadow-card">
            No Mardi Gras gear resources are currently published. Check the full resource guide for the latest available links.
          </div>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-parade-gold/35 bg-parade-goldSoft p-5 shadow-civic">
        <div className="flex items-start gap-3">
          <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
          <p className="text-sm font-medium leading-6 text-amber-950">
            <span className="font-black">Visitor convenience resource.</span>{" "}
            Resource links are provided for visitor planning. Confirm current hours, inventory, pricing, pickup, shipping, and fulfillment details directly with each business.
          </p>
        </div>
      </section>
    </CategoryResourcePage>
  );
}

function GearResourceCard({ resource }: { resource: ResourceItem }) {
  const details = gearResourceDetails[resource.title];
  const logoPath = details?.logoPath;
  const description = details?.description ?? resource.description;
  const actionLabel = details?.actionLabel ?? "Open shop";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 shadow-card transition hover:-translate-y-1 hover:shadow-glow"
    >
      <span className="pointer-events-none absolute right-[-2.5rem] top-[-2.5rem] h-28 w-28 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-[-2rem] left-[-2rem] h-24 w-24 rounded-full bg-parade-purple/10 blur-2xl" aria-hidden="true" />

      <span className="relative z-10 flex items-start gap-4">
        <GearLogo title={resource.title} logoPath={logoPath} />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black leading-tight text-parade-purpleDark">{resource.title}</span>
          <span className="mt-2 block text-sm leading-6 text-parade-muted">{description}</span>
        </span>
      </span>

      <span className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white shadow-sm transition group-hover:bg-parade-purpleDark">
        {actionLabel}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}

function GearLogo({ title, logoPath }: { title: string; logoPath?: string }) {
  if (logoPath) {
    return (
      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-parade-gold/35 bg-white p-2 shadow-sm" aria-hidden="true">
        <Image src={logoPath} alt={`${title} logo`} width={56} height={56} className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-parade-gold/40 bg-parade-goldSoft text-sm font-black text-parade-purple" aria-hidden="true">
      MG
    </span>
  );
}
