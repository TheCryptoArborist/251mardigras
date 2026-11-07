import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flag, VenetianMask } from "lucide-react";
import type { ArcadeGame } from "@/lib/arcade";

export function ArcadeCabinet({ game }: { game: ArcadeGame }) {
  const Emblem = game.theme === "maze" ? VenetianMask : Flag;

  return (
    <article className={`arcade-cabinet arcade-cabinet--${game.theme}`} aria-labelledby={`cabinet-${game.slug}`}>
      <div className="cabinet-topline"><span>MG251 ORIGINAL</span><span>NO. {game.number}</span></div>
      <div className="cabinet-marquee">
        <Emblem size={28} strokeWidth={1.6} aria-hidden="true" />
        <h3 id={`cabinet-${game.slug}`}>
          <span>{game.marquee[0]}</span>
          <strong>{game.marquee[1]}</strong>
        </h3>
        <Emblem size={28} strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="cabinet-monitor">
        <div className="cabinet-screen">
          <Image src={game.image} alt={game.imageAlt} width={1200} height={750} sizes="(max-width: 639px) 85vw, 440px" />
        </div>
        <div className="cabinet-screen-label"><span>{game.genre}</span><span className="cabinet-status">COMING SOON</span></div>
      </div>
      <div className="cabinet-controls" aria-hidden="true">
        <div className="cabinet-joystick"><i /><b /></div>
        <span className="cabinet-player-label">PLAYER {game.number}</span>
        <div className="cabinet-buttons"><i /><i /></div>
      </div>
      <div className="cabinet-front">
        <p>{game.tagline}</p>
        <Link className="arcade-button" href={`/play/${game.slug}`} aria-label={`Preview ${game.title}`}>
          Preview game <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <div className="cabinet-coin-row" aria-hidden="true">
          <span className="cabinet-coin-door"><i /><b /></span>
          <span>LET THE GOOD<br />TIMES PLAY.</span>
          <Emblem size={35} strokeWidth={1.2} />
        </div>
      </div>
      <div className="cabinet-feet" aria-hidden="true"><i /><i /></div>
    </article>
  );
}
