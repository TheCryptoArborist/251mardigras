import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { SITE_BRAND_NAME, SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/watch", label: "Watch" },
  { href: "/events", label: "Events" },
  { href: "/food-drink", label: "Food & Drink" },
  { href: "/parking-access", label: "Parking & Access" },
  { href: "/weather", label: "Weather" },
  { href: "/mardi-gras-gear", label: "Mardi Gras Gear" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-parade-gold/30 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white shadow-lg shadow-purple-950/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-full ring-1 ring-parade-gold/40 transition group-hover:ring-parade-gold sm:h-12 sm:w-12">
            <Image src={SITE_LOGO_PATH} alt={SITE_LOGO_ALT} width={48} height={48} className="h-full w-full object-contain" priority />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black leading-tight tracking-tight sm:text-lg">{SITE_BRAND_NAME}</span>
            <span className="hidden text-xs font-medium text-purple-100 sm:block">Parade schedule, coverage, food, parking, weather, and gear</span>
          </span>
        </Link>

        <details className="group relative shrink-0 xl:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-3 py-2 text-sm font-black text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-parade-gold [&::-webkit-details-marker]:hidden">
            <Menu className="h-4 w-4" aria-hidden="true" /> Menu
          </summary>
          <nav className="absolute right-0 top-full z-50 mt-3 grid w-64 gap-1 rounded-2xl border border-parade-gold/40 bg-parade-purpleDeep/95 p-2 text-sm font-semibold shadow-2xl backdrop-blur" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-purple-50 transition hover:bg-white/10 hover:text-parade-goldBright focus:outline-none focus:ring-2 focus:ring-parade-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>

        <nav className="hidden items-center gap-1 text-sm font-semibold xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-purple-50 transition hover:bg-white/10 hover:text-parade-goldBright focus:outline-none focus:ring-2 focus:ring-parade-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
