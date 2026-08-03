"use client";

import { useMemo, useState } from "react";
import {
  Accessibility,
  Archive,
  Car,
  ExternalLink,
  MapPin,
  Navigation,
  PlayCircle,
  Search,
  Share2,
  ShoppingBag,
  Utensils,
  X
} from "lucide-react";
import type { ResourceItem } from "@/lib/data-access";

const ALL_CATEGORIES = "All";
const FOOD_AND_DRINK_CATEGORY = "Food and Drink";

const categoryOrder = [
  "Social Media",
  "Live Coverage / Channel Support",
  "Downtown Transportation",
  "Mobility-Friendly Access",
  FOOD_AND_DRINK_CATEGORY,
  "Mardi Gras Gear / Throws",
  "Previous Parade Seasons"
];

const categoryDescriptions: Record<string, string> = {
  "Social Media": "Direct public social channel destinations maintained in the website resource directory.",
  "Live Coverage / Channel Support": "YouTube livestream, archive, and channel-support links for Mobile Mardi Gras coverage.",
  "Downtown Transportation": "Parking app, downtown parking, and City parking resources. Verify traffic, towing, and closures with official sources before travel.",
  "Mobility-Friendly Access": "Third-party access-support resources. These are convenience links and do not replace official parade or public-safety guidance.",
  "Food and Drink": "Downtown food and drink stops for parade visitors. Hours and parade-day access can change quickly.",
  "Mardi Gras Gear / Throws": "Throws, gear, and shopping resources selected for visitor planning.",
  "Previous Parade Seasons": "Past parade-season video resources and playlists from the Mobile Mardi Gras channel."
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Social Media": <Share2 className="h-5 w-5" aria-hidden="true" />,
  "Live Coverage / Channel Support": <PlayCircle className="h-5 w-5" aria-hidden="true" />,
  "Downtown Transportation": <Car className="h-5 w-5" aria-hidden="true" />,
  "Mobility-Friendly Access": <Accessibility className="h-5 w-5" aria-hidden="true" />,
  "Food and Drink": <Utensils className="h-5 w-5" aria-hidden="true" />,
  "Mardi Gras Gear / Throws": <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
  "Previous Parade Seasons": <Archive className="h-5 w-5" aria-hidden="true" />
};

export function ResourceDirectoryBrowser({ resources }: { resources: ResourceItem[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [selectedFoodResourceId, setSelectedFoodResourceId] = useState("");

  const foodAndDrinkResources = useMemo(() => {
    return resources.filter((resource) => resource.category === FOOD_AND_DRINK_CATEGORY);
  }, [resources]);

  const availableCategories = useMemo(() => {
    const presentCategories = new Set(resources.map((resource) => resource.category));
    const ordered = categoryOrder.filter((category) => presentCategories.has(category));
    const extras = [...presentCategories].filter((category) => !categoryOrder.includes(category)).sort();

    return [ALL_CATEGORIES, ...ordered, ...extras];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return resources.filter((resource) => {
      const categoryMatches = activeCategory === ALL_CATEGORIES || resource.category === activeCategory;
      if (!categoryMatches) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = normalizeSearch([
        resource.title,
        resource.description,
        resource.category,
        resource.source
      ].join(" "));

      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, query, resources]);

  const groupedResources = useMemo(() => {
    return filteredResources.reduce<Record<string, ResourceItem[]>>((groups, resource) => {
      groups[resource.category] = [...(groups[resource.category] ?? []), resource];
      return groups;
    }, {});
  }, [filteredResources]);

  const displayedCategories = useMemo(() => {
    const presentCategories = new Set(filteredResources.map((resource) => resource.category));
    const ordered = categoryOrder.filter((category) => presentCategories.has(category));
    const extras = [...presentCategories].filter((category) => !categoryOrder.includes(category)).sort();

    return [...ordered, ...extras];
  }, [filteredResources]);

  const hasActiveFilters = Boolean(query.trim()) || activeCategory !== ALL_CATEGORIES;

  function clearFilters() {
    setQuery("");
    setActiveCategory(ALL_CATEGORIES);
  }

  return (
    <div className="space-y-6">
      {foodAndDrinkResources.length > 0 ? (
        <FoodAndDrinkNavigator
          resources={foodAndDrinkResources}
          selectedResourceId={selectedFoodResourceId}
          onSelect={setSelectedFoodResourceId}
        />
      ) : null}

      <div className="rounded border border-parade-line bg-white p-5 shadow-civic">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Find what you need</p>
            <h2 className="mt-1 text-2xl font-black text-parade-ink">Search the Full Directory</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
              Use search for the full visitor directory. Food and drink links are also pulled forward above because they are often needed while walking or driving downtown.
            </p>
          </div>
          <div className="text-sm font-bold text-parade-muted">
            {filteredResources.length} of {resources.length} links shown
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="relative block min-w-0">
            <span className="sr-only">Search resources</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parade-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search live, parking, food, throws, mobility..."
              className="w-full rounded border border-parade-line bg-white py-3 pl-10 pr-3 text-sm font-semibold text-parade-ink outline-none transition placeholder:text-parade-muted focus:border-parade-purple focus:ring-2 focus:ring-parade-purpleSoft"
            />
          </label>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center justify-center gap-2 rounded border border-parade-line px-4 py-3 text-sm font-bold text-parade-purple transition hover:bg-parade-purpleSoft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear filters <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {availableCategories.map((category) => {
            const selected = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3 py-2 text-xs font-bold uppercase transition ${
                  selected
                    ? "border-parade-purple bg-parade-purple text-white"
                    : "border-parade-line bg-white text-parade-purple hover:bg-parade-purpleSoft"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filteredResources.length === 0 ? (
          <div className="mt-5 rounded border border-dashed border-parade-line bg-parade-purpleSoft p-5 text-sm leading-6 text-parade-muted">
            No resources matched that search. Try a broader term like parking, food, live, throws, mobility, YouTube, or downtown.
          </div>
        ) : null}
      </div>

      {displayedCategories.map((category) => (
        <ResourceCategorySection
          key={category}
          category={category}
          description={categoryDescriptions[category] ?? "Direct visitor resources maintained in the website directory."}
          resources={groupedResources[category] ?? []}
        />
      ))}
    </div>
  );
}

function FoodAndDrinkNavigator({
  resources,
  selectedResourceId,
  onSelect
}: {
  resources: ResourceItem[];
  selectedResourceId: string;
  onSelect: (resourceId: string) => void;
}) {
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? null;

  return (
    <section className="rounded border border-parade-line bg-white p-5 shadow-civic" id="food-and-drink-navigator">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded bg-parade-goldSoft text-parade-gold">
              <Utensils className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Food and drink navigator</p>
              <h2 className="text-2xl font-black text-parade-ink">Find a downtown stop fast</h2>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-parade-muted">
            Pick a restaurant, coffee shop, bakery, brewery, or dessert stop and open its direct map or website link. This is designed for people already walking downtown or driving in during Mardi Gras.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded border border-parade-line px-3 py-1 text-xs font-bold uppercase text-parade-muted">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {resources.length} stops
        </span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="block min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase text-parade-muted">Choose a food or drink stop</span>
          <select
            value={selectedResourceId}
            onChange={(event) => onSelect(event.target.value)}
            className="w-full rounded border border-parade-line bg-white px-3 py-3 text-sm font-bold text-parade-ink outline-none transition focus:border-parade-purple focus:ring-2 focus:ring-parade-purpleSoft"
          >
            <option value="">Select a restaurant, bakery, coffee shop, brewery, or dessert stop...</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.title}
              </option>
            ))}
          </select>
        </label>

        {selectedResource ? (
          <a
            href={selectedResource.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark lg:self-end"
          >
            Navigate to {selectedResource.title}
            <Navigation className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded border border-parade-line px-5 py-3 text-sm font-bold text-parade-muted opacity-70 lg:self-end"
          >
            Select a stop first
            <Navigation className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <RestaurantQuickLink key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}

function RestaurantQuickLink({ resource }: { resource: ResourceItem }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center gap-3 rounded border border-parade-line bg-white p-3 text-left transition hover:bg-parade-purpleSoft hover:shadow-civic"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-parade-purple text-sm font-black text-white" aria-hidden="true">
        {initialsFor(resource.title)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black text-parade-ink">{resource.title}</span>
        <span className="mt-1 flex items-center gap-1 text-xs font-bold uppercase text-parade-purple">
          Open / navigate
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

function ResourceCategorySection({
  category,
  description,
  resources
}: {
  category: string;
  description: string;
  resources: ResourceItem[];
}) {
  const compactList = resources.length > 9;

  return (
    <section className="min-w-0 rounded border border-parade-line bg-white p-5 shadow-civic">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-parade-purpleSoft text-parade-purple">
            {categoryIcons[category] ?? <ExternalLink className="h-5 w-5" aria-hidden="true" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black text-parade-ink">{category}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-parade-muted">{description}</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded border border-parade-line px-3 py-1 text-xs font-bold uppercase text-parade-muted">
          {resources.length} links
        </span>
      </div>

      {compactList ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <CompactResourceLink key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceLinkCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </section>
  );
}

function CompactResourceLink({ resource }: { resource: ResourceItem }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center justify-between gap-3 rounded border border-parade-line px-3 py-2 text-sm font-semibold text-parade-ink hover:bg-parade-purpleSoft"
    >
      <span className="min-w-0 truncate">{resource.title}</span>
      <ExternalLink className="h-4 w-4 shrink-0 text-parade-purple" aria-hidden="true" />
    </a>
  );
}

function ResourceLinkCard({ resource }: { resource: ResourceItem }) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded border border-parade-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-civic">
      <h3 className="text-base font-bold text-parade-ink">{resource.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{resource.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs font-semibold uppercase text-parade-muted">{resource.source}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-parade-purple hover:underline"
        >
          Open <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function initialsFor(title: string) {
  const words = normalizeSearch(title)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "MG";
}
