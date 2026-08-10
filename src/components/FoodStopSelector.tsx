"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Navigation, Search, X } from "lucide-react";
import type { ResourceItem } from "@/lib/data-access";

const stopFilters = [
  { id: "all", label: "All stops" },
  { id: "coffee", label: "Coffee" },
  { id: "bakery", label: "Bakery / Sweets" },
  { id: "restaurant", label: "Restaurants" },
  { id: "brewery", label: "Brewery / Drinks" }
] as const;

type StopFilterId = (typeof stopFilters)[number]["id"];

export function FoodStopSelector({ resources }: { resources: ResourceItem[] }) {
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StopFilterId>("all");
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? null;

  const filteredResources = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return resources.filter((resource) => {
      const matchesQuery = normalizedQuery
        ? normalizeSearch(`${resource.title} ${resource.description}`).includes(normalizedQuery)
        : true;
      const matchesType = activeFilter === "all" || stopTypeFor(resource.title) === activeFilter;

      return matchesQuery && matchesType;
    });
  }, [activeFilter, query, resources]);

  if (resources.length === 0) {
    return null;
  }

  function clearFilters() {
    setQuery("");
    setActiveFilter("all");
  }

  const hasActiveFilters = Boolean(query.trim()) || activeFilter !== "all";

  return (
    <section className="overflow-hidden rounded border border-parade-line bg-white shadow-civic">
      <div className="border-b border-parade-line bg-parade-purpleSoft p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Food and drink navigator</p>
            <h2 className="mt-1 text-2xl font-black text-parade-ink">Find a downtown stop fast</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
              Choose a restaurant, coffee shop, bakery, brewery, barbecue stop, dessert stop, or direct venue link while you are walking downtown or planning your parade day.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center lg:min-w-72">
            <FoodStat label="Stops" value={String(resources.length)} />
            <FoodStat label="Links" value="Direct" />
            <FoodStat label="Use" value="Mobile" />
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-bold uppercase text-parade-muted">Choose a food or drink stop</span>
            <select
              value={selectedResourceId}
              onChange={(event) => setSelectedResourceId(event.target.value)}
              className="w-full rounded border border-parade-line bg-white px-3 py-3 text-sm font-bold text-parade-ink outline-none transition focus:border-parade-purple focus:ring-2 focus:ring-parade-purpleSoft"
            >
              <option value="">Select a downtown stop...</option>
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
              Open map / directions
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

        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block min-w-0">
            <span className="sr-only">Search food and drink stops</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parade-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search coffee, bakery, BBQ, brewery, restaurant..."
              className="w-full rounded border border-parade-line bg-white py-3 pl-10 pr-3 text-sm font-semibold text-parade-ink outline-none transition placeholder:text-parade-muted focus:border-parade-purple focus:ring-2 focus:ring-parade-purpleSoft"
            />
          </label>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center justify-center gap-2 rounded border border-parade-line px-4 py-3 text-sm font-bold text-parade-purple transition hover:bg-parade-purpleSoft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {stopFilters.map((filter) => {
            const selected = filter.id === activeFilter;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-3 py-2 text-xs font-bold uppercase transition ${
                  selected
                    ? "border-parade-purple bg-parade-purple text-white"
                    : "border-parade-line bg-white text-parade-purple hover:bg-parade-purpleSoft"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 text-sm font-bold text-parade-muted">
          <span>{filteredResources.length} stops shown</span>
          <span className="hidden sm:inline">Tap a card to open its direct map or venue link</span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="rounded border border-dashed border-parade-line bg-parade-purpleSoft p-5 text-sm leading-6 text-parade-muted">
            No food or drink stops matched that search. Try a broader term like coffee, bakery, BBQ, brewery, restaurant, or downtown.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <FoodStopCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FoodStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/80 bg-white/80 px-3 py-2">
      <p className="text-lg font-black text-parade-purple">{value}</p>
      <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-parade-muted">{label}</p>
    </div>
  );
}

function FoodStopCard({ resource }: { resource: ResourceItem }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 items-center gap-3 rounded border border-parade-line bg-white p-3 text-left transition hover:-translate-y-0.5 hover:bg-parade-purpleSoft hover:shadow-civic"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-parade-gold/40 bg-parade-goldSoft text-sm font-black text-parade-purple" aria-hidden="true">
        {initialsFor(resource.title)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black text-parade-ink">{resource.title}</span>
        <span className="mt-1 block text-xs font-bold uppercase text-parade-muted">{labelForStop(resource.title)}</span>
        <span className="mt-1 flex items-center gap-1 text-xs font-bold uppercase text-parade-purple group-hover:underline">
          Open map / directions
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

function stopTypeFor(title: string): Exclude<StopFilterId, "all"> {
  const normalizedTitle = normalizeSearch(title);

  if (/coffee|latte|serda/.test(normalizedTitle)) {
    return "coffee";
  }

  if (/bakery|bake|ice cream|gluten|cammie|guncle|ellenjay/.test(normalizedTitle)) {
    return "bakery";
  }

  if (/bier|brewing|elixir|post/.test(normalizedTitle)) {
    return "brewery";
  }

  return "restaurant";
}

function labelForStop(title: string) {
  const labels: Record<Exclude<StopFilterId, "all">, string> = {
    coffee: "Coffee / cafe",
    bakery: "Bakery / sweets",
    brewery: "Brewery / drinks",
    restaurant: "Restaurant / food"
  };

  return labels[stopTypeFor(title)];
}

function initialsFor(title: string) {
  const words = normalizeSearch(title)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "MG";
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
