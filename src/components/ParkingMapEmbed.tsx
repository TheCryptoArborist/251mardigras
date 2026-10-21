"use client";

import { useState } from "react";
import { ExternalLink, RotateCw } from "lucide-react";

const PARKING_APPLICATION_URL =
  "https://experience.arcgis.com/experience/f88d505ba3894e7ab1115d162d62839b/?locale=en-us&disable_window_focus=true";

export function ParkingMapEmbed() {
  const [reloadCount, setReloadCount] = useState(0);

  return (
    <div className="border-t border-parade-gold/25 bg-white p-2">
      <iframe
        key={reloadCount}
        id="downtown-parking-map"
        src={PARKING_APPLICATION_URL}
        title="Official City of Mobile downtown public parking application"
        className="block h-[44rem] w-full rounded-[1.15rem] border-0 lg:h-[48rem]"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        allow="geolocation https://experience.arcgis.com; fullscreen https://experience.arcgis.com"
        allowFullScreen
      />
      <div className="flex flex-col items-stretch justify-center gap-2 px-2 pb-2 pt-4 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={() => setReloadCount((count) => count + 1)}
          aria-controls="downtown-parking-map"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-parade-purple/25 px-5 py-3 text-sm font-bold text-parade-purple transition hover:bg-parade-purpleSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-purple"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Reload map
        </button>
        <a
          href={PARKING_APPLICATION_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-sm transition hover:-translate-y-0.5 hover:bg-parade-goldBright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-purple"
        >
          Open Full Parking Map
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
