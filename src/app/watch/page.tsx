import Link from "next/link";
import { ArrowRight, ExternalLink, PlayCircle, Video } from "lucide-react";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { SectionHeader } from "@/components/SectionHeader";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

const watchLinks = [
  {
    title: "Open the YouTube channel",
    description: "Use the main Mobile Mardi Gras channel for live parade coverage, shorts, replays, and previous season videos.",
    href: YOUTUBE_CHANNEL_URL,
    action: "Open YouTube",
    external: true,
    featured: true
  },
  {
    title: "Become a channel supporter",
    description: "Support the channel directly through the public YouTube membership link.",
    href: YOUTUBE_SUPPORTER_URL,
    action: "Support the channel",
    external: true,
    featured: true
  },
  {
    title: "Browse previous parade seasons",
    description: "Choose a previous Mobile Mardi Gras parade season and open the direct YouTube playlist.",
    href: "/replays",
    action: "Choose replays",
    external: false,
    featured: false
  },
  {
    title: "Find visitor links",
    description: "Use the website resource directory for social, food, access, gear, transportation, and video links.",
    href: "/resources#all-resources",
    action: "Open directory",
    external: false,
    featured: false
  }
];

const viewerNotes = [
  "The live player works when a public Mobile Mardi Gras livestream is active on the YouTube channel.",
  "Subscribe on YouTube and turn on notifications so the stream is easier to find when live coverage begins.",
  "Previous parade videos and season playlists remain available through the channel and resource directory."
];

export default function WatchPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-12">
          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-parade-gold/40 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-parade-goldBright shadow-glow">
              Live coverage hub
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              Watch Mobile Mardi Gras Live
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-purple-100">
              Find the current livestream, open the YouTube channel, support the channel, and jump back into previous parade-season coverage from one public-facing page.
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
              <a
                href={YOUTUBE_SUPPORTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Become a Supporter <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <article className="relative z-10 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
                <PlayCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Where to start</h2>
                <p className="mt-2 text-sm leading-6 text-purple-100">
                  During parade season, start here to find the live player and the main YouTube channel. When no public stream is active, use the channel and archives to catch up on previous coverage.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <HeroMetric label="Primary" value="Live" />
              <HeroMetric label="Archive" value="Replays" />
            </div>
          </article>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-3 shadow-card">
          <LiveStreamEmbed />
        </section>

        <section>
          <SectionHeader
            title="Find the Coverage"
            description="Fast paths for live video, previous coverage, channel support, and the website resource directory."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {watchLinks.map((item) => (
              <WatchActionCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section className="max-w-3xl">
          <article className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright shadow-sm ring-1 ring-parade-gold/35">
                <Video className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-parade-purpleDark">Viewer notes</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-parade-muted">
                  {viewerNotes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-parade-gold" aria-hidden="true" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/90 px-3 py-3">
      <p className="text-xl font-black text-parade-purpleDark">{value}</p>
      <p className="mt-1 text-[0.65rem] font-black uppercase tracking-wide text-parade-muted">{label}</p>
    </div>
  );
}

function WatchActionCard({
  item
}: {
  item: {
    title: string;
    description: string;
    href: string;
    action: string;
    external: boolean;
    featured: boolean;
  };
}) {
  const className = `group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border p-5 text-left transition hover:-translate-y-1 ${
    item.featured
      ? "border-parade-gold/60 bg-gradient-to-br from-parade-goldSoft via-white to-parade-purpleMist shadow-glow"
      : "border-parade-gold/30 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist shadow-card hover:shadow-glow"
  }`;
  const content = (
    <>
      <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
      <div className="relative z-10 grid h-11 w-11 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
        <PlayCircle className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="relative z-10 mt-4 text-lg font-black text-parade-purpleDark">{item.title}</h3>
      <p className="relative z-10 mt-2 flex-1 text-sm leading-6 text-parade-muted">{item.description}</p>
      <span className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white transition group-hover:bg-parade-purpleDark">
        {item.action}
        {item.external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </span>
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}
