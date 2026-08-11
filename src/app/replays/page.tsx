import Link from "next/link";
import { ArrowLeft, Archive, ExternalLink, PlayCircle } from "lucide-react";
import {
  MARDI_GRAS_2023_PLAYLIST_URL,
  MARDI_GRAS_2024_PLAYLIST_URL,
  MARDI_GRAS_2025_PLAYLIST_URL,
  MARDI_GRAS_2026_PLAYLIST_URL,
  YOUTUBE_CHANNEL_URL
} from "@/lib/seed-data";

const replaySeasons = [
  {
    year: "2026",
    title: "Mardi Gras 2026 Playlist",
    description: "Watch the 2026 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2026_PLAYLIST_URL,
    featured: true
  },
  {
    year: "2025",
    title: "Mardi Gras 2025 Playlist",
    description: "Watch the 2025 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2025_PLAYLIST_URL,
    featured: false
  },
  {
    year: "2024",
    title: "Mardi Gras 2024 Playlist",
    description: "Watch the 2024 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2024_PLAYLIST_URL,
    featured: false
  },
  {
    year: "2023",
    title: "Mardi Gras 2023 Playlist",
    description: "Watch the 2023 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2023_PLAYLIST_URL,
    featured: false
  }
];

export default function ReplaysPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-parade-gold/30 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div className="absolute left-[-7rem] top-[-8rem] h-72 w-72 rounded-full bg-parade-gold/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <div className="relative z-10 mt-7 flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark shadow-glow">
              <Archive className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-parade-goldBright">Parade replays</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">Choose a parade season</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">
                Select the Mobile Mardi Gras season you want to watch. Each button opens the direct YouTube playlist for that year.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2">
          {replaySeasons.map((season) => (
            <a
              key={season.year}
              href={season.href}
              target="_blank"
              rel="noreferrer"
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border p-5 transition hover:-translate-y-1 ${
                season.featured
                  ? "border-parade-gold/70 bg-gradient-to-br from-parade-goldSoft via-white to-parade-purpleMist shadow-glow"
                  : "border-parade-gold/35 bg-gradient-to-br from-white via-parade-cream to-parade-purpleMist shadow-card hover:shadow-glow"
              }`}
            >
              <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex rounded-full border border-parade-gold/35 bg-white/75 px-3 py-1 text-xs font-black uppercase text-parade-purple">Season</p>
                  <h2 className="mt-3 text-4xl font-black text-parade-purpleDark">{season.year}</h2>
                </div>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/40">
                  <PlayCircle className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
              <h3 className="relative z-10 mt-4 text-lg font-black text-parade-purpleDark">{season.title}</h3>
              <p className="relative z-10 mt-2 flex-1 text-sm leading-6 text-parade-muted">{season.description}</p>
              <span className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-parade-purple px-4 py-2 text-sm font-black text-white transition group-hover:bg-parade-purpleDark">
                Open YouTube playlist <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          ))}
        </section>

        <section className="rounded-[1.5rem] border border-parade-gold/35 bg-gradient-to-br from-parade-cream via-white to-parade-purpleMist p-5 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-parade-purpleDark">Looking for more videos?</h2>
              <p className="mt-2 text-sm leading-6 text-parade-muted">Open the main YouTube channel for livestreams, shorts, and additional Mobile Mardi Gras coverage.</p>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark shadow-glow transition hover:-translate-y-0.5 hover:bg-parade-goldBright"
            >
              Open YouTube Channel <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
