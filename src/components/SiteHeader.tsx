import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/watch", label: "Watch" },
  { href: "/food-drink", label: "Food & Drink" },
  { href: "/parking-access", label: "Parking & Access" },
  { href: "/weather", label: "Weather" },
  { href: "/mardi-gras-gear", label: "Mardi Gras Gear" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-parade-purpleDark text-white shadow-lg shadow-purple-950/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded bg-parade-gold text-lg font-black text-parade-purpleDark">
            MG
          </span>
          <span>
            <span className="block text-lg font-black leading-tight">Mardi Gras - Mobile, AL</span>
            <span className="block text-xs font-medium text-purple-100">Parade coverage, food, parking, weather, and gear</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-purple-50 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-parade-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
