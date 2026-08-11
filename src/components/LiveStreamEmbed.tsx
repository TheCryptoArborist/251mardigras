import { ExternalLink, PlayCircle } from "lucide-react";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_LIVE_EMBED_URL } from "@/lib/seed-data";

export function LiveStreamEmbed() {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-white p-4 shadow-card">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Live player</p>
          <h2 className="mt-1 text-2xl font-black text-parade-purpleDark">Live Parade Coverage</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-parade-muted">
            When a public Mobile Mardi Gras livestream is active, it will play here. If no stream is active, open the YouTube channel directly or watch previous parade seasons.
          </p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/35">
          <PlayCircle className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="aspect-video overflow-hidden rounded-[1.25rem] border border-parade-gold/30 bg-slate-950 shadow-civic">
        <iframe
          className="h-full w-full"
          src={YOUTUBE_LIVE_EMBED_URL}
          title="Mobile Mardi Gras live parade coverage"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-parade-gold/30 bg-parade-goldSoft p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
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
    </section>
  );
}
