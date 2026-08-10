import Image from "next/image";
import Link from "next/link";
import { SITE_BRAND_NAME, SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";

const navItems = [
  { href: "/", label: "Home" },
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
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-visible rounded-full ring-1 ring-parade-gold/40 transition group-hover:ring-parade-gold">
            <Image src={SITE_LOGO_PATH} alt={SITE_LOGO_ALT} width={48} height={48} className="h-full w-full object-contain" priority />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-tight tracking-tight">{SITE_BRAND_NAME}</span>
            <span className="block text-xs font-medium text-purple-100">Parade coverage, food, parking, weather, and gear</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold" aria-label="Primary navigation">
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
