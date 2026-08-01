import Link from "next/link";
import { ArrowRight, ExternalLink, PlayCircle, ShieldCheck, Video } from "lucide-react";
import { LiveStreamEmbed } from "@/components/LiveStreamEmbed";
import { SectionHeader } from "@/components/SectionHeader";
import { YOUTUBE_CHANNEL_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

const watchLinks = [
  {
    title: "Open the YouTube channel",
    description: "Use the main Mobile Mardi Gras channel for live parade coverage, shorts, replays, and previous season videos.",
    href: YOUTUBE_CHANNEL_URL,
    action: "Open YouTube",
    external: true
  },
  {
    title: "Become a channel supporter",
    description: "Support the channel directly through the public YouTube membership link.",
    href: YOUTUBE_SUPPORTER_URL,
    action: "Support the channel",
    external: true
  },
  {
    title: "Browse previous parade seasons",
    description: "Find prior-year video resources and playlists in the full Mardi Gras resource directory.",
    href: "/resources#all-resources",
    action: "Open resources",
    external: false
  },
  {
    title: "Find visitor links",
    description: "Use the website resource directory for social, food, access, gear, transportation, and video links without bouncing through a separate quick-link page.",
    href: "/resources#all-resources",
    action: "Open directory",
    external: false
  }
];

const viewerNotes = [
  "The live player works when a public Mobile Mardi Gras livestream is active on the YouTube channel.",
  "Subscribe on YouTube and turn on notifications so the stream is easier to find when live coverage begins.",
  "Previous parade videos and season playlists remain available through the channel and resource directory.",
  "This website helps viewers find coverage, but official parade, route, closure, and safety decisions still need to be verified with official public sources."
];

export default function WatchPage() {
  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Live coverage hub</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">
              Watch Mobile Mardi Gras Live
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-parade-muted">
              Find the current livestream, open the YouTube channel, support the channel, and jump back into previous parade-season coverage from one public-facing page.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark"
              >
                Open YouTube Channel <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={YOUTUBE_SUPPORTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded border border-parade-line bg-white px-5 py-3 text-sm font-bold text-parade-purple hover:bg-parade-purpleSoft"
              >
                Become a Supporter <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <article className="rounded border border-parade-line bg-parade-purpleSoft p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded bg-white text-parade-purple">
                <PlayCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-parade-ink">Where to start</h2>
                <p className="mt-2 text-sm leading-6 text-parade-muted">
                  During parade season, start here to find the live player and the main YouTube channel. When no public stream is active, use the channel and archives to catch up on previous coverage.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <LiveStreamEmbed />

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

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded border border-parade-line bg-white p-5 shadow-civic">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-parade-goldSoft text-parade-gold">
                <Video className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-parade-ink">Viewer notes</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-parade-muted">
                  {viewerNotes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-parade-purple" aria-hidden="true" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded border border-amber-200 bg-parade-goldSoft p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black text-amber-950">Official-source reminder</h2>
                <p className="mt-2 text-sm leading-6 text-amber-950">
                  Live coverage and visitor resources do not replace official guidance. Parade schedules, routes, cancellations, road closures, public-safety instructions, and weather impacts should be verified through official City, public-safety, parade organization, and National Weather Service sources.
                </p>
                <Link href="/resources" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-950 hover:underline">
                  Browse visitor resources <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </section>
      </div>
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
  };
}) {
  const className = "flex h-full min-w-0 flex-col rounded border border-parade-line bg-white p-5 shadow-civic hover:bg-parade-purpleSoft";
  const content = (
    <>
      <h3 className="text-lg font-black text-parade-ink">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{item.description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-parade-purple">
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
