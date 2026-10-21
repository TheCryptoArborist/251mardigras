"use client";

import { Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { CommunityEvent } from "@/lib/community-events";

const CommunityEventShareDialog = dynamic(() => import("@/components/CommunityEventShareDialog").then((module) => module.CommunityEventShareDialog), { ssr: false });

type CommunityEventShareButtonProps = {
  event: CommunityEvent;
  variant?: "light" | "dark" | "compact";
  className?: string;
};

export function CommunityEventShareButton({ event, variant = "light", className = "" }: CommunityEventShareButtonProps) {
  const [open, setOpen] = useState(false);
  const variantStyle = variant === "dark"
    ? "gap-2 rounded-full border-parade-gold/45 bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/20 focus-visible:outline-parade-goldBright"
    : variant === "compact"
      ? "gap-1 rounded-lg border-parade-purple/25 bg-parade-purple/5 px-2 py-1.5 text-[0.65rem] leading-4 text-parade-purpleDark hover:bg-parade-goldSoft focus-visible:outline-parade-purple"
      : "gap-2 rounded-full border-parade-purple/25 bg-parade-goldSoft px-4 py-2.5 text-sm text-parade-purpleDark hover:bg-parade-goldBright focus-visible:outline-parade-purple";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Share ${event.title}`} aria-haspopup="dialog" aria-expanded={open}
        className={`inline-flex min-h-11 max-w-full items-center justify-center border font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantStyle} ${className}`}>
        <Share2 className={`${variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} shrink-0`} aria-hidden="true" />
        <span>Share event</span>
      </button>
      {open ? <CommunityEventShareDialog key={event.id} event={event} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
