import Link from "next/link";
import type { ReactNode } from "react";
import { Archive, ArrowRight, ExternalLink, PlayCircle, ShieldCheck } from "lucide-react";
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

        <section className="grid gap-4 md:grid-cols-2">
          <WatchFallbackCard
            icon={<PlayCircle className="h-5 w-5" aria-hidden="true" />}
            title="No active livestream?"
            body="Open the YouTube channel directly. If coverage is live, YouTube is the fastest way to find the active stream."
            href={YOUTUBE_CHANNEL_URL}
            action="Open YouTube Channel"
            external
          />
          <WatchFallbackCard
            icon={<Archive className="h-5 w-5" aria-hidden="true" />}
            title="Watch previous seasons"
            body="Choose a previous Mobile Mardi Gras parade season and open the direct YouTube playlist."
            href="/replays"
            action="Choose Replay Season"
          />
        </section>

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

function WatchFallbackCard({
  icon,
  title,
  body,
  href,
  action,
  external = false
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href: string;
  action: string;
  external?: boolean;
}) {
  const className = "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist p-5 text-left shadow-card transition hover:-translate-y-1 hover:shadow-glow";
  const content = (
    <>
      <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 grid h-11 w-11 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
        {icon}
      </div>
      <h2 className="relative z-10 mt-4 text-lg font-black text-parade-purpleDark">{title}</h2>
      <p className="relative z-10 mt-2 flex-1 text-sm leading-6 text-parade-muted">{body}</p>
      <span className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white transition group-hover:bg-parade-purpleDark">
        {action}
        {external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
