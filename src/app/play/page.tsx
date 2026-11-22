import Link from "next/link";
import Image from "next/image";
import { ArrowDown, Gamepad2 } from "lucide-react";
import { ArcadeCabinet, ComingSoonCabinet } from "@/components/ArcadeCabinet";
import { ArcadeCheckIn } from "@/components/ArcadeCheckIn";
import paradeSchedule from "../../../data/parade-schedule-2027.json";
import { ARCADE_GAMES } from "@/lib/arcade";
import { createPageMetadata } from "@/lib/seo";
import "./arcade.css";

export const metadata = createPageMetadata({
  title: "Mardi Gras Arcade",
  description: "Play MoonPie Run, preview MoonPie Motorway, and explore six MG251 arcade cabinets with four more games coming soon.",
  path: "/play",
  image: "/images/arcade/moonpie-motorway-poster.webp",
  imageAlt: "MoonPie Motorway, a Mobile Mardi Gras arcade racing game"
});

export default function ArcadePage() {
  const firstParadeDay = paradeSchedule.days[0];
  return (
    <div className="mardi-arcade">
      <div className="arcade-skyline" aria-hidden="true" />
      <div className="arcade-wrap">
        <header className="arcade-hero">
          <div className="arcade-hero-art" aria-hidden="true"><Image src="/images/arcade/mobile-skyline.webp" alt="" fill sizes="320px" priority /><div><Gamepad2 size={42} strokeWidth={1.4} /><strong>MARDI GRAS<br /><span>ARCADE</span></strong><small>MG251 · MOBILE, ALABAMA</small></div></div>
          <div className="arcade-hero-copy">
            <p className="arcade-eyebrow">MOBILE MARDI GRAS · RETRO GAMES</p>
            <h1><span>Mardi Gras</span> Arcade</h1>
            <p className="arcade-intro">The parade doesn&apos;t have to end. Pick your next good time.</p>
            <div className="arcade-hero-actions"><a className="arcade-button" href="#cabinets">Choose a game <ArrowDown size={15} aria-hidden="true" /></a><Link href="/schedule" className="arcade-secondary-link">Parade schedule</Link></div>
          </div>
        </header>
        <ArcadeCheckIn paradeDay={firstParadeDay.date} paradeName={firstParadeDay.parades[0].name} />
        <section className="arcade-floor" id="cabinets" aria-labelledby="arcade-lineup-heading">
          <div className="arcade-section-title"><div><p className="arcade-eyebrow">THE GAME LINEUP</p><h2 id="arcade-lineup-heading">Choose your game.</h2></div><p>1 ready to play · 1 preview · 4 coming soon</p></div>
          <p className="arcade-launch-note">MoonPie Run is ready to play—no account needed. Watch our gameplay previews and explore the next cabinets.</p>
          <div className="arcade-cabinets">
            {ARCADE_GAMES.map((game) => <ArcadeCabinet key={game.slug} game={game} />)}
            {["03", "04", "05", "06"].map((number) => <ComingSoonCabinet key={number} number={number} />)}
          </div>
        </section>
        <p className="arcade-outro">Save your spot on the sidewalk, too. <Link href="/schedule">Find your next parade <span aria-hidden="true">↗</span></Link></p>
      </div>
    </div>
  );
}
