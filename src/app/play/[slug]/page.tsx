import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react";
import { ARCADE_GAMES } from "@/lib/arcade";
import { GamePreviewVideo } from "@/components/GamePreviewVideo";
import { createPageMetadata } from "@/lib/seo";
import "../arcade.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARCADE_GAMES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const game = ARCADE_GAMES.find((entry) => entry.slug === slug);
  if (!game) return {};
  return createPageMetadata({ title: game.playUrl ? `${game.title} — Play Now` : `${game.title} — Game Preview`, description: game.description, path: `/play/${game.slug}`, image: game.image, imageAlt: game.imageAlt });
}

export default async function GamePreviewPage({ params }: Props) {
  const { slug } = await params;
  const game = ARCADE_GAMES.find((entry) => entry.slug === slug);
  if (!game) notFound();
  const otherGame = ARCADE_GAMES.find((entry) => entry.slug !== slug)!;

  return (
    <div className="mardi-arcade arcade-preview-page">
      <div className="arcade-wrap">
        <div className="arcade-wayfinding"><Link href="/play"><ArrowLeft size={16} aria-hidden="true" /> Back to Arcade</Link><span>MG251 · MARDI GRAS ARCADE</span></div>
        <header className="arcade-game-heading"><p className="arcade-eyebrow">{game.genre} · CABINET {game.number}</p><h1>{game.title}</h1><p>{game.tagline}</p></header>
        {game.playUrl ? <div className="arcade-hero-actions"><a className="arcade-button" href={game.playUrl}>Play Now <ArrowRight size={17} aria-hidden="true" /></a><p>No account needed. Choose a username to save scores and badges.</p></div> : null}
        <figure className="arcade-preview-image"><GamePreviewVideo title={game.title} src={game.video} poster={game.image} /><figcaption>15 seconds of {game.title} gameplay. {game.playUrl ? "Ready for your next run?" : "Public play is coming soon."}</figcaption></figure>
        <div className="arcade-preview-info">
          <section aria-labelledby="game-about-heading"><p className="arcade-eyebrow">A LITTLE PORT CITY COMPETITION</p><h2 id="game-about-heading">Here&apos;s the game.</h2><p>{game.description}</p><ul>{game.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><h3>Controls</h3><p>{game.controls}</p></section>
          <aside className="arcade-opening-note"><Gamepad2 size={32} strokeWidth={1.5} aria-hidden="true" /><p className="arcade-eyebrow">{game.playUrl ? "READY TO PLAY" : "COMING SOON"}</p><h2>{game.playUrl ? "Let the good times run." : "Getting ready to roll."}</h2><p>{game.playUrl ? "Play in a full game window with keyboard, swipes, or touch controls. This browser remembers your saved scores and badges." : "Public play isn’t open yet. Explore the cabinets and check back here for the launch."}</p>{game.playUrl ? <a className="arcade-button" href={game.playUrl}>Play Now <ArrowRight size={17} aria-hidden="true" /></a> : <Link className="arcade-button" href="/play">Back to Arcade <ArrowRight size={17} aria-hidden="true" /></Link>}</aside>
        </div>
        <div className="arcade-other-game"><p>Another cabinet, another adventure.</p><Link href={`/play/${otherGame.slug}`}>Preview {otherGame.title} <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </div>
  );
}
