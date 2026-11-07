import Link from "next/link";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { GamePreviewVideo } from "@/components/GamePreviewVideo";
import type { ArcadeGame } from "@/lib/arcade";

export function ArcadeCabinet({ game }: { game: ArcadeGame }) {
  return (
    <article className={`arcade-cabinet arcade-cabinet--${game.theme}`} aria-labelledby={`cabinet-${game.slug}`}>
      <div className="cabinet-artwork">
        <div className="cabinet-topline"><span>{game.genre}</span><span className="cabinet-status">PREVIEW</span></div>
        <GamePreviewVideo title={game.title} src={game.video} poster={game.image} />
      </div>
      <div className="cabinet-details">
        <h3 id={`cabinet-${game.slug}`}>{game.title}</h3>
        <p className="cabinet-description">{game.description}</p>
        <Link className="cabinet-cta" href={`/play/${game.slug}`} aria-label={`Explore ${game.title}`}>
          Game preview <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ComingSoonCabinet({ number }: { number: string }) {
  return (
    <article className="arcade-cabinet arcade-cabinet--soon" aria-labelledby={`cabinet-coming-${number}`}>
      <div className="cabinet-artwork">
        <div className="cabinet-topline"><span>CABINET {number}</span><span className="cabinet-status cabinet-status--soon">COMING SOON</span></div>
        <div className="cabinet-coming-art" aria-hidden="true"><Gamepad2 size={58} strokeWidth={1} /><strong>?</strong><span>NEXT UP</span></div>
      </div>
      <div className="cabinet-details">
        <h3 id={`cabinet-coming-${number}`}>Coming Soon</h3>
        <p className="cabinet-description">The next good time is still under wraps. More Mardi Gras games are on the way.</p>
        <p className="cabinet-soon-note">Watch this cabinet.</p>
      </div>
    </article>
  );
}
