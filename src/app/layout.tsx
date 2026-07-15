import type { Metadata } from "next";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Mobile Mardi Gras Tracker",
  description:
    "Unofficial Mobile Mardi Gras public information tracker for official updates, weather risk, live coverage, routes, parking, and resources."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <DisclaimerBanner />
        <main>{children}</main>
        <footer className="border-t border-parade-line bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-parade-muted sm:px-6 lg:px-8">
            <p className="font-bold text-parade-ink">Mobile Mardi Gras Tracker</p>
            <p>
              Unofficial public-source monitor. Verify parade, route, traffic, public safety, emergency, and weather decisions with official agencies.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
