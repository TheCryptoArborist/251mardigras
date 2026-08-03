"use client";

import { useState } from "react";
import { ExternalLink, Navigation } from "lucide-react";
import type { ResourceItem } from "@/lib/data-access";

export function FoodStopSelector({ resources }: { resources: ResourceItem[] }) {
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? null;

  if (resources.length === 0) {
    return null;
  }

  return (
    <section className="rounded border border-parade-line bg-white p-5 shadow-civic">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Food and drink navigator</p>
        <h2 className="mt-1 text-2xl font-black text-parade-ink">Choose a downtown stop</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
          Select a restaurant, coffee shop, bakery, brewery, or dessert stop, then open its direct map or venue link.
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="block min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase text-parade-muted">Food or drink stop</span>
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <a
            key={resource.id}
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
        ))}
      </div>
    </section>
  );
}

function initialsFor(title: string) {
  const words = title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase()).join("") || "MG";
}
