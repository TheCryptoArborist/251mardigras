import { ExternalLink, PlayCircle } from "lucide-react";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_LIVE_EMBED_URL } from "@/lib/seed-data";

export function LiveStreamEmbed() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-parade-gold/45 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple shadow-card">
      <div className="relative overflow-hidden border-b border-parade-gold/30 px-5 py-6 text-white sm:px-6 lg:px-7">
        <span className="pointer-events-none absolute left-[-3rem] top-[-4rem] h-28 w-28 rounded-full bg-parade-gold/25 blur-2xl" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-[-3rem] right-[-3rem] h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <span className="pointer-events-none absolute right-8 top-8 h-2 w-2 rounded-full bg-parade-goldBright shadow-glow" aria-hidden="true" />
        <span className="pointer-events-none absolute right-20 top-16 h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-8 left-14 h-1.5 w-1.5 rounded-full bg-parade-gold/80" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-parade-gold/45 bg-parade-gold/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-parade-goldBright shadow-glow">
              Live Player
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
              Watch Live Parade Coverage
            </h2>
            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-purple-100 sm:text-lg">
              When a live Mobile Mardi Gras stream is active, it will play here. No stream right now? Open the YouTube channel or watch previous parade replays.
            </p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow ring-1 ring-white/25">
            <PlayCircle className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-4 sm:p-5 lg:p-6">
        <div className="aspect-video overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-slate-950 shadow-civic">
          <iframe
            className="h-full w-full"
            src={YOUTUBE_LIVE_EMBED_URL}
            title="Mobile Mardi Gras live parade coverage"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-parade-gold/35 bg-parade-goldSoft p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold leading-6 text-amber-950">
            No active livestream? YouTube may show the player as unavailable until a public stream is live.
          </p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-purple px-4 py-2 font-black text-white transition hover:-translate-y-0.5 hover:bg-parade-purpleDark"
          >
            Open YouTube Channel
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
