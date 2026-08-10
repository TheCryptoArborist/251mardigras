import type { Metadata } from "next";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Mardi Gras - Mobile, AL",
  description:
    "Unofficial Mobile Mardi Gras visitor hub for live parade coverage, replays, food and drink, parking, weather, gear, and public-source reminders."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        <DisclaimerBanner />
        <main>{children}</main>
        <footer className="border-t border-parade-line bg-gradient-to-r from-white via-parade-cream to-parade-purpleMist">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-parade-muted sm:px-6 lg:px-8">
            <p className="font-black text-parade-ink">Mardi Gras - Mobile, AL</p>
            <p>
              Unofficial public-source monitor and visitor hub. Verify parade, route, traffic, public safety, emergency, and weather decisions with official agencies.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
