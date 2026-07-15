import { ExternalLink, Play } from "lucide-react";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_LIVE_EMBED_URL } from "@/lib/seed-data";

export function LiveStreamEmbed() {
  return (
    <section className="rounded border border-parade-line bg-white p-4 shadow-civic">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-parade-ink">Live Parade Coverage</h2>
          <p className="mt-1 text-sm leading-6 text-parade-muted">
            The player works when a public Mobile Mardi Gras livestream is active.
          </p>
        </div>
        <Play className="h-6 w-6 text-parade-purple" aria-hidden="true" />
      </div>
      <div className="aspect-video overflow-hidden rounded border border-parade-line bg-slate-950">
        <iframe
          className="h-full w-full"
          src={YOUTUBE_LIVE_EMBED_URL}
          title="Mobile Mardi Gras live parade coverage"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-parade-muted">This embed is sourced from the public Mobile Mardi Gras YouTube channel.</p>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-4 py-2 font-bold text-white transition hover:bg-parade-purpleDark"
        >
          Open YouTube Channel
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

