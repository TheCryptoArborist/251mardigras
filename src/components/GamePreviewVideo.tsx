"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function GamePreviewVideo({ title, src, poster }: { title: string; src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  async function playPreview() {
    setFailed(false);
    setStarted(true);
    try {
      const video = videoRef.current;
      if (!video) return;
      if (video.ended) video.currentTime = 0;
      await video.play();
    } catch {
      setPlaying(false);
      setFailed(true);
    }
  }

  return (
    <div className={`game-preview-video${playing ? " is-playing" : ""}`}>
      <video ref={videoRef} aria-label={`${title}: 15-second gameplay preview`} poster={poster} preload="none" playsInline muted controls={started} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setFailed(true); }}>
        <source src={src} type="video/mp4" />
      </video>
      {!playing && <button className="game-preview-play" type="button" onClick={playPreview} aria-label={`Play 15-second ${title} gameplay preview`}><span><Play size={20} fill="currentColor" aria-hidden="true" /></span><strong>{started ? "PLAY PREVIEW" : "WATCH PREVIEW"}</strong></button>}
      {!playing && !started && <span className="game-preview-duration">15 SEC GAMEPLAY</span>}
      {failed && <p className="game-preview-error" role="status">Preview couldn&apos;t load. Try again.</p>}
    </div>
  );
}
