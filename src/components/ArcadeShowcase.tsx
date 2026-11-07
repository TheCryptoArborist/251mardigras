import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { ARCADE_GAMES } from "@/lib/arcade";

export function ArcadeShowcase() {
  return (
    <section aria-labelledby="homepage-arcade-heading" className="relative overflow-hidden rounded-3xl border border-parade-gold/40 bg-[#180b2a] p-5 sm:p-7">
      <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright"><Gamepad2 size={18} aria-hidden="true" /> A new way to Mardi Gras</p>
          <h2 id="homepage-arcade-heading" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Mardi Gras Arcade</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-purple-100">The parade doesn&apos;t have to end. Get a first look at our Mobile Mardi Gras games in a retro cabinet lobby.</p>
          <Link href="/play" className="mt-5 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-parade-goldBright px-6 py-3 text-sm font-black text-parade-purpleDark transition hover:bg-parade-goldSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">Enter the Arcade <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {ARCADE_GAMES.map((game) => (
            <Link key={game.slug} href={`/play/${game.slug}`} className="group min-w-0 overflow-hidden rounded-xl border border-parade-gold/30 bg-parade-purpleDark transition hover:border-parade-goldBright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">
              <div className="border-b-4 border-parade-gold/70 p-1.5 pb-0"><Image src={game.image} alt={game.imageAlt} width={1200} height={750} sizes="(max-width: 639px) 42vw, 280px" className="aspect-[8/5] w-full rounded-t-md object-cover" /></div>
              <div className="px-3 py-3"><h3 className="text-sm font-black text-white group-hover:text-parade-goldBright">{game.title}</h3><p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-parade-goldBright">Coming soon · Preview</p></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
