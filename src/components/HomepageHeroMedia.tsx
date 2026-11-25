"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HomepageHeroMedia({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateEligibility = () => {
      const enabled = desktop.matches && !reducedMotion.matches;
      setCanAnimate(enabled);
      if (!enabled) {
        videoRef.current?.pause();
        setIsPlaying(false);
      }
    };

    updateEligibility();
    desktop.addEventListener("change", updateEligibility);
    reducedMotion.addEventListener("change", updateEligibility);
    return () => {
      desktop.removeEventListener("change", updateEligibility);
      reducedMotion.removeEventListener("change", updateEligibility);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!canAnimate || !video) return;

    let cancelled = false;
    if (!pausedByUser.current) {
      void video.play().catch(() => {
        if (!cancelled) setIsPlaying(false);
      });
    }
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [canAnimate]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByUser.current = false;
      void video.play().catch(() => {
        if (videoRef.current === video) setIsPlaying(false);
      });
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  };

  return (
    <>
      {!canAnimate ? <div className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-70" style={{ backgroundImage: `url("${poster}")` }} aria-hidden="true" /> : null}
      {canAnimate ? (
        <>
          <video
            ref={videoRef}
            id="homepage-background-video"
            className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full object-cover opacity-70 lg:block motion-reduce:hidden"
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setIsPlaying(false)}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 mx-auto hidden max-w-7xl justify-end px-8 lg:flex motion-reduce:hidden">
            <button
              type="button"
              onClick={togglePlayback}
              aria-controls="homepage-background-video"
              aria-label={isPlaying ? "Pause background video" : "Play background video"}
              className="pointer-events-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-parade-gold/50 bg-parade-purpleDeep/90 px-4 py-2 text-xs font-bold text-white transition hover:bg-parade-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright"
            >
              {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              {isPlaying ? "Pause background" : "Play background"}
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
