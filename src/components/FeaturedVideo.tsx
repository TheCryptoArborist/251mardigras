"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

export function FeaturedVideo({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-parade-gold/35 bg-parade-purpleDark shadow-civic">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 grid h-full w-full place-items-center focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-parade-goldBright" aria-label={`Play ${title}`}>
          <Image src="/videos/dragon-home-screen-poster.jpg" alt="" fill sizes="(min-width: 1024px) 640px, 90vw" className="object-cover opacity-75 transition group-hover:opacity-95" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-white/70 bg-parade-goldBright text-parade-purpleDark shadow-xl transition group-hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
          </span>
          <span className="absolute bottom-3 rounded-full bg-parade-purpleDeep/90 px-4 py-1.5 text-xs font-bold text-white">Play video</span>
        </button>
      )}
    </div>
  );
}
