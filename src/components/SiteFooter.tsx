"use client";

import { ExternalLink, HeartHandshake } from "lucide-react";
import { usePathname } from "next/navigation";
import { BUY_ME_COFFEE_URL, PATREON_SUPPORT_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

const FACEBOOK_SUPPORTER_URL =
  "https://www.facebook.com/mardigrasmobileal/support/?surface=page_top_cta_button&entrypoint_surface=page_top_cta_button";

const supportLinks = [
  {
    label: "YouTube",
    href: YOUTUBE_SUPPORTER_URL
  },
  {
    label: "Facebook",
    href: FACEBOOK_SUPPORTER_URL
  },
  {
    label: "Patreon",
    href: PATREON_SUPPORT_URL
  },
  {
    label: "Buy Me a MoonPie",
    href: BUY_ME_COFFEE_URL
  }
];

export function SiteFooter() {
  const pathname = usePathname();
  const showSupportLinks = pathname !== "/";

  return (
    <footer className="border-t border-parade-line bg-gradient-to-r from-white via-parade-cream to-parade-purpleMist">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 text-sm text-parade-muted sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:px-8">
        <div className="min-w-0">
          <p className="font-black text-parade-ink">Mardi Gras - Mobile, AL</p>
          <p className="mt-2 max-w-4xl leading-6">
            Unofficial public-source monitor and visitor hub. Verify parade, route, traffic, public safety, emergency, and weather decisions with official agencies.
          </p>
        </div>

        {showSupportLinks ? (
          <section className="rounded-[1.35rem] border border-parade-gold/35 bg-white/75 p-4 shadow-civic" aria-label="Support Mardi Gras - Mobile, Alabama">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-parade-purple text-parade-goldBright ring-1 ring-parade-gold/35">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Support</p>
                <p className="mt-1 font-black text-parade-purpleDark">Support Mardi Gras - Mobile, Alabama</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {supportLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-parade-gold/35 bg-parade-goldSoft px-3 py-2 text-xs font-black text-parade-purpleDark transition hover:-translate-y-0.5 hover:bg-parade-gold"
                    >
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </footer>
  );
}
