"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, type SyntheticEvent } from "react";
import { SITE_BRAND_NAME, SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";

const primaryItems = [
  { href: "/schedule", label: "Schedule", mobileLabel: "Parade Schedule" },
  { href: "/events", label: "Events", mobileLabel: "Community Events" },
  { href: "/balls", label: "Balls", mobileLabel: "Mardi Gras Balls" },
  { href: "/watch", label: "Watch", mobileLabel: "Watch Parades" }
];

const navigationGroups = [
  {
    id: "play",
    label: "Play & Create",
    items: [
      { href: "/play", label: "Mardi Gras Arcade" },
      { href: "/play#daily-check-in", label: "Daily Check-In" },
      { href: "/profile-studio", label: "Profile Studio" }
    ]
  },
  {
    id: "visit",
    label: "Plan Your Visit",
    items: [
      { href: "/schedule#all-route-maps", label: "Route Maps" },
      { href: "/parking-access", label: "Parking" },
      { href: "/food-drink", label: "Food & Drink" },
      { href: "/weather", label: "Weather" },
      { href: "/mardi-gras-gear", label: "Mardi Gras Gear" }
    ]
  }
];

const panelClasses = "z-50 max-h-[calc(100vh-var(--site-header-height)-1.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-parade-gold/40 bg-parade-purpleDeep p-2 text-sm font-semibold shadow-2xl supports-[height:100dvh]:max-h-[calc(100dvh-var(--site-header-height)-1.5rem)]";
const panelLinkClasses = "flex min-h-11 items-center rounded-xl px-3 py-2.5 text-purple-50 transition hover:bg-white/10 hover:text-parade-goldBright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-parade-gold";
const desktopLinkClasses = "flex min-h-11 items-center whitespace-nowrap rounded-full px-3 py-2 text-purple-50 transition hover:bg-white/10 hover:text-parade-goldBright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parade-gold";

function closeDisclosure(menu: HTMLDetailsElement | null, restoreFocus = false) {
  if (!menu?.open) return;
  menu.open = false;
  if (restoreFocus) menu.querySelector<HTMLElement>("summary")?.focus();
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const homeLinkRef = useRef<HTMLAnchorElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const menusRef = useRef<Record<string, HTMLDetailsElement | null>>({});

  function closeMenus() {
    Object.values(menusRef.current).forEach((menu) => closeDisclosure(menu));
  }

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    const openedMenu = event.currentTarget;
    if (!openedMenu.open) return;
    Object.values(menusRef.current).forEach((menu) => {
      if (menu !== openedMenu) closeDisclosure(menu);
    });
  }

  useEffect(() => {
    function closeOutsideMenus(event: PointerEvent | FocusEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      Object.values(menusRef.current).forEach((menu) => {
        if (menu && !menu.contains(target)) closeDisclosure(menu);
      });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        Object.values(menusRef.current).forEach((menu) => closeDisclosure(menu, true));
      }
    }

    // Keep the available panel height accurate when branding or text size changes.
    const header = headerRef.current;
    function updateHeaderHeight() {
      if (header) header.style.setProperty("--site-header-height", `${header.getBoundingClientRect().height}px`);
    }
    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (header) resizeObserver.observe(header);

    const desktopBreakpoint = window.matchMedia("(min-width: 1280px)");
    function handleBreakpointChange(event: MediaQueryListEvent) {
      const focusedElement = document.activeElement;
      const mobileMenu = menusRef.current.mobile;
      const focusWillBeHidden = event.matches
        ? mobileMenu?.contains(focusedElement)
        : desktopNavRef.current?.contains(focusedElement);

      Object.values(menusRef.current).forEach((menu) => closeDisclosure(menu));
      if (focusWillBeHidden) {
        if (event.matches) homeLinkRef.current?.focus();
        else mobileMenu?.querySelector<HTMLElement>("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOutsideMenus);
    document.addEventListener("focusin", closeOutsideMenus);
    document.addEventListener("keydown", handleKeyDown);
    desktopBreakpoint.addEventListener("change", handleBreakpointChange);
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener("pointerdown", closeOutsideMenus);
      document.removeEventListener("focusin", closeOutsideMenus);
      document.removeEventListener("keydown", handleKeyDown);
      desktopBreakpoint.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-30 border-b border-parade-gold/30 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white shadow-lg shadow-purple-950/20 [--site-header-height:4.5rem]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
        <Link ref={homeLinkRef} href="/" aria-label={`${SITE_BRAND_NAME} home`} onClick={closeMenus} className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parade-gold">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-full ring-1 ring-parade-gold/40 transition group-hover:ring-parade-gold sm:h-12 sm:w-12">
            <Image src={SITE_LOGO_PATH} alt={SITE_LOGO_ALT} width={48} height={48} className="h-full w-full object-contain" priority />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black leading-tight tracking-tight sm:text-lg">{SITE_BRAND_NAME}</span>
            <span className="hidden truncate text-xs font-medium text-purple-100 sm:block">Your guide to Mobile Mardi Gras</span>
          </span>
        </Link>

        <details ref={(node) => { menusRef.current.mobile = node; }} onToggle={handleToggle} className="group/mobile-menu shrink-0 xl:hidden">
          <summary aria-controls="mobile-site-navigation" className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-parade-gold/40 bg-white/10 px-3 py-2 text-sm font-black text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parade-gold [&::-webkit-details-marker]:hidden">
            <Menu className="h-4 w-4 group-open/mobile-menu:hidden" aria-hidden="true" />
            <X className="hidden h-4 w-4 group-open/mobile-menu:block" aria-hidden="true" />
            Menu
          </summary>
          <nav id="mobile-site-navigation" className={`absolute inset-x-4 top-full ml-auto mt-2 max-w-sm ${panelClasses}`} aria-label="Mobile navigation">
            <div className="grid gap-1">
              {primaryItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenus} className={panelLinkClasses}>
                  {item.mobileLabel}
                </Link>
              ))}
            </div>
            {navigationGroups.map((group) => (
              <div key={group.id} role="group" aria-labelledby={`mobile-${group.id}-heading`} className="mt-2 border-t border-parade-gold/20 pt-2">
                <p id={`mobile-${group.id}-heading`} className="px-3 py-2 text-xs font-black uppercase tracking-wider text-parade-gold">{group.label}</p>
                <div className="grid gap-1">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenus} className={panelLinkClasses}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </details>

        <nav ref={desktopNavRef} className="hidden shrink-0 items-center gap-1 text-sm font-semibold xl:flex" aria-label="Primary navigation">
          {primaryItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenus} className={desktopLinkClasses}>
              {item.label}
            </Link>
          ))}
          {navigationGroups.map((group) => (
            <details key={group.id} ref={(node) => { menusRef.current[group.id] = node; }} onToggle={handleToggle} className="group/disclosure relative">
              <summary aria-controls={`desktop-${group.id}-navigation`} className={`${desktopLinkClasses} cursor-pointer list-none gap-1.5 [&::-webkit-details-marker]:hidden`}>
                {group.label}
                <ChevronDown className="h-4 w-4 transition-transform group-open/disclosure:rotate-180" aria-hidden="true" />
              </summary>
              <ul id={`desktop-${group.id}-navigation`} className={`absolute right-0 top-full mt-3 grid w-64 gap-1 ${panelClasses}`}>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={closeMenus} className={panelLinkClasses}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
      </div>
    </header>
  );
}
