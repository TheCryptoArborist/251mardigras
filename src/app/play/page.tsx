import Link from "next/link";
import { ArrowDown, ArrowLeft, Award, Gamepad2, Sparkles, Trophy } from "lucide-react";
import { ArcadeCabinet } from "@/components/ArcadeCabinet";
import { ARCADE_GAMES } from "@/lib/arcade";
import { createPageMetadata } from "@/lib/seo";
import "./arcade.css";

export const metadata = createPageMetadata({
  title: "Mardi Gras Arcade",
  description: "Step into the MG251 retro arcade. Preview MoonPie Run and MoonPie Motorway, two purple and gold games inspired by Mobile Mardi Gras.",
  path: "/play",
  image: "/images/arcade/moonpie-motorway.webp",
  imageAlt: "MoonPie Motorway, a Mobile Mardi Gras arcade racing game"
});

export default function ArcadePage() {
  return (
    <div className="mardi-arcade">
      <div className="arcade-skyline" aria-hidden="true" />
      <div className="arcade-wrap">
        <div className="arcade-wayfinding"><Link href="/"><ArrowLeft size={16} aria-hidden="true" /> MG251 home</Link><span>MOBILE, ALABAMA · GOOD TIMES ALL YEAR</span></div>
        <header className="arcade-hero">
          <p className="arcade-eyebrow"><Sparkles size={15} aria-hidden="true" /> MOBILE MARDI GRAS · RETRO GAMES</p>
          <h1><span>MARDI GRAS</span><strong>ARCADE</strong></h1>
          <p className="arcade-intro">The parade doesn&apos;t have to end.<br className="sm:hidden" /> Pick a game.</p>
          <a className="arcade-floor-link" href="#cabinets">Meet the cabinets <ArrowDown size={16} aria-hidden="true" /></a>
        </header>

        <section className="arcade-floor" id="cabinets" aria-labelledby="arcade-lineup-heading">
          <div className="arcade-section-title"><span>THE FIRST TWO ON THE FLOOR</span><h2 id="arcade-lineup-heading">Choose your next good time.</h2><p>Public play is coming soon. Take a peek inside each game.</p></div>
          <div className="arcade-cabinets">{ARCADE_GAMES.map((game) => <ArcadeCabinet key={game.slug} game={game} />)}</div>
          <div className="arcade-floor-stripe" aria-hidden="true"><span /> MADE FOR MOBILE. MADE FOR FUN. <span /></div>
        </section>

        <section className="arcade-extras" aria-labelledby="arcade-extras-heading">
          <div className="arcade-extras-heading"><Trophy size={26} strokeWidth={1.5} aria-hidden="true" /><div><p className="arcade-eyebrow">MORE THAN ONE GOOD RUN</p><h2 id="arcade-extras-heading">Make your mark.</h2></div><span className="arcade-coming-label">WITH PUBLIC PLAY</span></div>
          <div className="arcade-extras-grid">
            <div><Trophy size={20} aria-hidden="true" /><h3>Chase the high score</h3><p>MoonPie Run&apos;s username leaderboard gives every run something to aim for.</p></div>
            <div><Award size={20} aria-hidden="true" /><h3>Collect Mardi Gras badges</h3><p>Twelve MoonPie Run achievements turn a quick game into a new challenge.</p></div>
            <div><Gamepad2 size={20} aria-hidden="true" /><h3>Play your way</h3><p>Games designed for keyboard and touch controls. Pick up the fun on your screen.</p></div>
          </div>
        </section>
        <p className="arcade-outro">Save your spot on the sidewalk, too. <Link href="/schedule">Find your next parade <span aria-hidden="true">↗</span></Link></p>
      </div>
    </div>
  );
}
