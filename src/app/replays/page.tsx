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
    href: MARDI_GRAS_2026_PLAYLIST_URL
  },
  {
    year: "2025",
    title: "Mardi Gras 2025 Playlist",
    description: "Watch the 2025 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2025_PLAYLIST_URL
  },
  {
    year: "2024",
    title: "Mardi Gras 2024 Playlist",
    description: "Watch the 2024 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2024_PLAYLIST_URL
  },
  {
    year: "2023",
    title: "Mardi Gras 2023 Playlist",
    description: "Watch the 2023 Mobile Mardi Gras parade coverage playlist.",
    href: MARDI_GRAS_2023_PLAYLIST_URL
  }
];

export default function ReplaysPage() {
  return (
    <div>
      <section className="border-b border-parade-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-parade-purple hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-parade-goldSoft text-parade-gold">
              <Archive className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-parade-purple">Parade replays</p>
              <h1 className="mt-1 text-4xl font-black tracking-normal text-parade-ink sm:text-5xl">Choose a parade season</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-parade-muted sm:text-lg">
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
              className="flex min-w-0 flex-col rounded border border-parade-line bg-white p-5 shadow-civic transition hover:-translate-y-0.5 hover:bg-parade-purpleSoft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase text-parade-purple">Season</p>
                  <h2 className="mt-1 text-3xl font-black text-parade-ink">{season.year}</h2>
                </div>
                <PlayCircle className="h-6 w-6 shrink-0 text-parade-purple" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-black text-parade-ink">{season.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-parade-muted">{season.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-parade-purple">
                Open YouTube playlist <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
          ))}
        </section>

        <section className="rounded border border-parade-line bg-white p-5 shadow-civic">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-parade-ink">Looking for more videos?</h2>
              <p className="mt-2 text-sm leading-6 text-parade-muted">Open the main YouTube channel for livestreams, shorts, and additional Mobile Mardi Gras coverage.</p>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-5 py-3 text-sm font-bold text-white hover:bg-parade-purpleDark"
            >
              Open YouTube Channel <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
