"use client";

import { ExternalLink, HeartHandshake } from "lucide-react";
import { usePathname } from "next/navigation";
import { BUY_ME_COFFEE_URL, MOBILE_CARNIVAL_MUSEUM_URL, PATREON_SUPPORT_URL, YOUTUBE_SUPPORTER_URL } from "@/lib/seed-data";

const FACEBOOK_SUPPORTER_URL =
  "https://www.facebook.com/mardigrasmobileal/support/?surface=page_top_cta_button&entrypoint_surface=page_top_cta_button";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://m.facebook.com/mardigrasmobileal/"
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mardi_gras_mobile_alabama"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@MobileMardiGras?sub_confirmation=1"
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mobilemardigras"
  },
  {
    label: "X",
    href: "https://x.com/MobMardiGras"
  }
];

const supportLinks = [
  {
    label: "Patreon",
    href: PATREON_SUPPORT_URL
  },
  {
    label: "YouTube",
    href: YOUTUBE_SUPPORTER_URL
  },
  {
    label: "Facebook",
    href: FACEBOOK_SUPPORTER_URL
  },
  {
    label: "One-Time Support",
    href: BUY_ME_COFFEE_URL
  }
];

const dataSources = [
  {
    category: "Parade schedules & route maps",
    description: "MG251 transcribes the published City schedule and displays route maps supplied by City GIS.",
    links: [{ label: "City of Mobile schedule & maps", href: "https://storymaps.arcgis.com/stories/aa1969cf3b68462a8676acdfb4839ad4" }]
  },
  {
    category: "Traffic, parking & public safety",
    description: "City parking guidance and Mobile Police Department parade information.",
    links: [
      { label: "City parking & transportation", href: "https://www.cityofmobile.gov/mardi-gras-parade-parking/" },
      { label: "Mobile Police Department", href: "https://www.mobilepd.org/mardi-gras/" }
    ]
  },
  {
    category: "Weather",
    description: "National Weather Service forecasts and alerts. Parade-weather planning summaries are prepared by MG251.",
    links: [{ label: "NWS Mobile / Pensacola", href: "https://www.weather.gov/mob/" }]
  },
  {
    category: "Community events",
    description: "Host announcements, submitted flyers and details provided by event organizers. Event listings include the available host and ticket links.",
    links: []
  },
  {
    category: "History & visitor resources",
    description: "MG251 editorial content and curated links to the Mobile Carnival Museum, local venues, businesses and service providers.",
    links: [{ label: "Mobile Carnival Museum", href: MOBILE_CARNIVAL_MUSEUM_URL }]
  },
  {
    category: "Parade coverage",
    description: "Videos and live coverage from Mobile Mardi Gras / MG251 and its social channels.",
    links: []
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
            Independent parade coverage, community events, and local information for Mobile Mardi Gras.
          </p>
          <nav className="mt-4 flex flex-wrap gap-2" aria-label="Mardi Gras - Mobile, Alabama social media links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-parade-purple/15 bg-white/70 px-3 py-2 text-xs font-black text-parade-purple transition hover:-translate-y-0.5 hover:bg-parade-purple hover:text-white"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        {showSupportLinks ? (
          <section className="relative overflow-hidden rounded-[1.35rem] border border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-4 text-white shadow-civic" aria-label="Support Mardi Gras - Mobile, Alabama">
            <span className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-parade-gold/20 blur-2xl" aria-hidden="true" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-parade-gold text-parade-purpleDark ring-1 ring-white/20">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Support the coverage</p>
                <p className="mt-1 font-black text-white">Support Mardi Gras - Mobile, Alabama</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {supportLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-parade-gold hover:text-parade-purpleDark"
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

        <section aria-labelledby="footer-disclaimer-heading" className="min-w-0 border-t border-parade-purple/15 pt-4 text-xs leading-5 lg:col-span-2">
          <h2 id="footer-disclaimer-heading" className="font-bold text-parade-ink">Information disclaimer</h2>
          <p className="mt-1 max-w-6xl">
            MG251 is an independent guide to Mobile Mardi Gras. Parade schedules, routes, cancellations and weather-related changes are determined by parade organizers and local authorities. Road closures, parking rules, towing and public-safety instructions are managed by the City of Mobile and responsible agencies. Weather forecasts and alerts are provided by the National Weather Service. Information may change; posted restrictions and directions from officials on site take precedence.
          </p>
          <details id="data-sources" className="mt-2">
            <summary className="min-h-11 w-fit cursor-pointer rounded px-1 py-3 font-bold text-parade-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-purple">
              Data sources
            </summary>
            <dl className="mt-2 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {dataSources.map((source) => (
                <div key={source.category} className="min-w-0">
                  <dt className="font-bold text-parade-ink">{source.category}</dt>
                  <dd className="mt-1">
                    <p>{source.description}</p>
                    {source.links.length > 0 ? (
                      <ul className="mt-1">
                        {source.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded py-2 font-semibold text-parade-purple underline decoration-parade-purple/30 underline-offset-4 hover:decoration-parade-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-purple"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        </section>
      </div>
    </footer>
  );
}
