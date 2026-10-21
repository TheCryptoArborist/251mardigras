import Link from "next/link";
import { ArrowLeft, ExternalLink, Landmark } from "lucide-react";
import { MOBILE_CARNIVAL_MUSEUM_URL } from "@/lib/seed-data";

export default function HistoryPage() {
  return (
    <div className="bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-parade-gold/30 px-4 py-2 text-sm font-bold text-purple-100 transition hover:border-parade-goldBright hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          Home
        </Link>

        <article id="mobile-mardi-gras-history" className="scroll-mt-24 pb-4 pt-7 sm:pb-6 sm:pt-9">
          <header className="border-b border-parade-gold/25 pb-6 sm:pb-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">History & culture</p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Mobile Mardi Gras History
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-purple-100">
              A brief introduction to the traditions behind Mobile&apos;s Carnival celebrations.
            </p>
          </header>

          <div className="max-w-3xl space-y-5 py-6 text-base leading-8 text-purple-100 sm:py-8 sm:text-lg sm:leading-8">
            <p>
              Mobile is widely known as the birthplace of American Mardi Gras. The city&apos;s Carnival story is often traced to its early French colonial roots and the well-known 1703 tradition, but like much of Carnival, the story includes both history and myth.
            </p>
            <p>
              The organized mystic society culture, balls, symbolism, and traditions that shaped modern Mobile Mardi Gras developed most clearly in the 1830s and 1840s. Today, Mobile Mardi Gras continues through parades, balls, mystic societies, music, costumes, throws, and community celebrations.
            </p>
          </div>

          <section aria-labelledby="museum-heading" className="border-t border-parade-gold/25 pt-6 sm:pt-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-parade-gold/30 bg-parade-gold/10 text-parade-goldBright" aria-hidden="true">
                <Landmark className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 id="museum-heading" className="text-xl font-bold leading-tight text-white sm:text-2xl">Explore the Mobile Carnival Museum</h2>
                <p className="mt-2 text-sm leading-7 text-purple-100 sm:text-base">
                  Discover Carnival costumes, artifacts, and the traditions behind the celebrations.
                </p>
              </div>
            </div>
            <a
              href={MOBILE_CARNIVAL_MUSEUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-parade-goldBright px-5 py-3 text-sm font-bold text-parade-purpleDark transition hover:bg-parade-goldSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright"
            >
              Visit the museum website
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </section>
        </article>
      </div>
    </div>
  );
}
