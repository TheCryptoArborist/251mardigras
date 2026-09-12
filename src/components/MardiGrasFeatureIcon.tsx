import type { ReactNode } from "react";

type MardiGrasFeatureIconProps = {
  artwork: "jester" | "king" | "logo";
  badge: ReactNode;
};

const artworkSources = {
  jester: "/images/schedule/mardi-gras-jester-icon.webp",
  king: "/images/schedule/mardi-gras-king-icon.webp",
  logo: "/images/mardi-gras-mobile-logo.png"
} as const;

export function MardiGrasFeatureIcon({ artwork, badge }: MardiGrasFeatureIconProps) {
  return (
    <span
      className="relative block h-14 w-14 shrink-0 rounded-full border-[3px] border-[#fff2b5] bg-[#2b0645] bg-cover bg-center bg-no-repeat shadow-[0_0_22px_rgba(255,212,90,0.42)] ring-2 ring-[#d69b16]/35"
      style={{ backgroundImage: `url('${artworkSources[artwork]}')` }}
      aria-hidden="true"
    >
      <span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-[#fff2b5] bg-parade-gold text-parade-purpleDark shadow-sm">
        {badge}
      </span>
    </span>
  );
}
