"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

type EventFlyerImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fullSize?: boolean;
};

export function EventFlyerImage({ src, alt, sizes, className, priority = false, fullSize = false }: EventFlyerImageProps) {
  const [unavailableSource, setUnavailableSource] = useState<string | null>(null);

  if (unavailableSource === src) {
    return (
      <div role="status" className={`${fullSize ? "min-h-48 rounded-[1rem]" : "absolute inset-0"} flex flex-col items-center justify-center gap-2 bg-parade-purpleDeep px-5 py-6 text-center text-white`}>
        <span className="sr-only">{alt}.</span>
        <ImageOff className="h-7 w-7 text-parade-goldBright" aria-hidden="true" />
        <p className="text-sm font-black text-parade-goldBright">Flyer temporarily unavailable</p>
        <p className="max-w-xs text-xs leading-5 text-purple-100">Event details are available below.</p>
      </div>
    );
  }

  const image = (
    <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} onError={() => setUnavailableSource(src)} />
  );

  return fullSize
    ? <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] bg-white sm:aspect-[3/4]">{image}</div>
    : image;
}
