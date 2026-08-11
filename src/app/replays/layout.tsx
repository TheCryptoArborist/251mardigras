import type { ReactNode } from "react";
import { breadcrumbJsonLd, createPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Watch Mobile Mardi Gras Parade Replays",
  description: "Choose previous Mobile Mardi Gras parade seasons and open direct YouTube replay playlists for 2026, 2025, 2024, and 2023.",
  path: "/replays"
});

export default function ReplaysLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Replays", path: "/replays" }]))} />
      {children}
    </>
  );
}
