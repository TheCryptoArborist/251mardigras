import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { YOUTUBE_CHANNEL_URL } from "@/lib/seed-data";

export default function WatchPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
            Live coverage
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Watch Mobile Mardi Gras Live
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">
            Live parade coverage appears here when a public stream is active. You can also open the YouTube channel directly or jump to previous parade seasons.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
            >
              Open YouTube Channel <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/replays" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15">
              Watch Parade Replays <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <LiveStreamEmbed />

        <section className="rounded-[1.25rem] border border-amber-200 bg-parade-goldSoft p-4 shadow-civic">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <p className="text-sm font-medium leading-6 text-amber-950">
              <span className="font-black">Unofficial coverage resource.</span>{" "}
              Verify parade schedules, routes, cancellations, road closures, towing, weather impacts, and public-safety instructions with official sources.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
