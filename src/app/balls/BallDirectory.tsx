"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Search, VenetianMask } from "lucide-react";
import societies from "@/data/ball-societies.json";
import artwork from "../profile-studio/societies.json";

const formUrl = "https://form.jotform.com/263255927154058";
const normalize = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, "");
const societyArtwork = new Map(artwork.map(({ name, src }) => [normalize(name), src]));

export default function BallDirectory() {
  const [search, setSearch] = useState("");
  const matches = societies.filter((name) => normalize(name).includes(normalize(search.trim())));

  return (
    <section id="ball-directory" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="font-serif text-4xl font-bold text-parade-purpleDark">Find your society</h2>
      <p className="mt-2 text-parade-muted">Society representatives can submit a ball date or correct an existing listing.</p>
      <label className="mt-6 block max-w-md text-sm font-bold text-parade-purpleDark">
        Search societies
        <span className="mt-2 flex items-center gap-3 rounded-xl border border-parade-line bg-white px-4 focus-within:ring-2 focus-within:ring-parade-gold">
          <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
          <input type="search" className="min-h-12 w-full bg-transparent outline-none" value={search} onChange={(event) => setSearch(event.target.value)} />
        </span>
      </label>
      <p className="my-4 text-sm text-parade-muted" aria-live="polite">{matches.length} {matches.length === 1 ? "society" : "societies"} found</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((name) => {
          const src = societyArtwork.get(normalize(name));
          return (
            <li key={name}>
              <a href={formUrl + "?q3_textbox1=" + encodeURIComponent(name)} aria-label={`Submit ball details for ${name}`} className="group flex min-h-24 items-center gap-4 rounded-xl border border-parade-line border-l-4 border-l-parade-gold bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-parade-purple">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-parade-goldSoft">
                  {src ? <Image src={src} alt="" width={48} height={48} className="h-12 w-12 object-contain" /> : <VenetianMask className="h-7 w-7 text-parade-purple" aria-hidden="true" />}
                </span>
                <span className="flex-1 font-bold leading-tight text-parade-purpleDark">{name}</span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-parade-purple group-hover:text-parade-purpleDeep" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-7 rounded-xl border border-parade-line bg-parade-purpleMist p-5 text-sm text-parade-purpleDark">
        Don’t see your society? <a className="font-bold underline" href={formUrl}>Submit it for review</a>.
      </p>
    </section>
  );
}
