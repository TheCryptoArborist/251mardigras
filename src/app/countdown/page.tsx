import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, MapPinned, PlayCircle } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SITE_LOGO_ALT, SITE_LOGO_PATH } from "@/lib/brand";
import { buildCountdownCardUrl, parseCountdownSnapshot, TARGET_EVENT_NAME, TARGET_FULL_DATE_LABEL } from "@/lib/countdown-share";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import paradeSchedule2027 from "../../../data/parade-schedule-2027.json";

export const dynamic = "force-dynamic";

type CountdownPageProps = { searchParams: Promise<{ at?: string | string[] }> };

export async function generateMetadata({ searchParams }: CountdownPageProps): Promise<Metadata> {
  const params = await searchParams;
  const snapshot = parseCountdownSnapshot(typeof params.at === "string" ? params.at : undefined);
  const countdownLabel = snapshot.expired ? "Plan your Mobile Mardi Gras visit" : snapshot.days > 0 ? `${snapshot.days} ${snapshot.days === 1 ? "day" : "days"} until Mobile’s first downtown parade` : "Less than a day until Mobile’s first downtown parade";
  const description = `${TARGET_EVENT_NAME} — ${TARGET_FULL_DATE_LABEL}. Bring your crew and find the live countdown, parade schedule, route maps, and coverage at MG251.xyz. Countdown as of ${snapshot.dateLabel}.`;
  const imageUrl = absoluteUrl(buildCountdownCardUrl(snapshot, "preview"));
  const metadata = createPageMetadata({ title: countdownLabel, description, path: "/countdown", image: imageUrl, imageAlt: countdownLabel });

  return {
    ...metadata,
    title: "Mobile Mardi Gras Countdown 2027",
    openGraph: {
      ...metadata.openGraph,
      // Social previews are snapshots. Give each one its own URL so platforms
      // do not reuse an older day's number when a new countdown is shared.
      url: absoluteUrl(`/countdown?at=${snapshot.at}`),
      images: [{ url: imageUrl, width: 1200, height: 630, type: "image/png", alt: countdownLabel }]
    }
  };
}

export default function CountdownPage() {
  return (
    <div className="bg-parade-purpleMist">
      <section className="relative overflow-hidden border-b border-parade-gold/35 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-parade-gold/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Image src={SITE_LOGO_PATH} alt={SITE_LOGO_ALT} width={64} height={64} className="h-16 w-16 rounded-full border border-parade-gold/50 bg-parade-purpleDeep object-contain" />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright">Mobile, Alabama<br /><span className="mt-1 inline-block text-purple-100">Mardi Gras 2027</span></p>
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl">Bring your crew.<br />Plan your parade day.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-purple-100">Counting down to the first downtown parade? You’re in the right place. Get your dates, pick your spot, and share the excitement.</p>
            <Link href="/schedule" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-parade-goldBright px-6 py-3 text-sm font-black text-parade-purpleDark shadow-glow hover:bg-parade-goldSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><CalendarDays className="h-5 w-5" aria-hidden="true" /> Explore the 2027 parade schedule <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-parade-goldBright">Your live countdown</p>
            <CountdownTimer mardiGrasDay={paradeSchedule2027.mardiGrasDay} />
            <p className="mt-3 px-1 text-xs leading-5 text-purple-200">A shared card captures a moment. The timer here stays current. Tap Share to make a fresh card and caption for your friends.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="countdown-next-heading" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Make a day of it</p>
        <h2 id="countdown-next-heading" className="mt-2 text-2xl font-black leading-tight text-parade-purpleDark sm:text-3xl">Everything you need before the first throw</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/schedule#all-route-maps", title: "Find your parade spot", text: "Open the route maps and see where the parades roll.", action: "See route maps", Icon: MapPinned },
            { href: "/events", title: "Fill your Mardi Gras calendar", text: "Discover balls, fundraisers, socials, and community events.", action: "Explore local events", Icon: CalendarDays },
            { href: "/watch", title: "Follow the celebration", text: "Keep the coverage handy when you can’t make it downtown.", action: "Watch parade coverage", Icon: PlayCircle }
          ].map(({ href, title, text, action, Icon }) => (
            <Link key={href} href={href} className="group flex flex-col rounded-2xl border border-parade-line bg-white p-5 shadow-civic transition hover:border-parade-purple/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-purple">
              <Icon className="h-6 w-6 text-parade-purple" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-black leading-6 text-parade-purpleDark">{title}</h3>
              <p className="mb-4 mt-2 text-sm leading-6 text-parade-muted">{text}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-black text-parade-purple group-hover:underline">{action} <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-parade-gold/30 bg-parade-goldSoft p-4 sm:p-5">
          <p className="text-sm leading-6 text-parade-purpleDark"><span className="font-black">Keep MG251.xyz close.</span> Find food, parking, weather, and more for your visit.</p>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-parade-purpleDark px-5 py-2 text-sm font-black text-white hover:bg-parade-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-purple">Open the visitor guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <p className="mt-4 text-xs leading-5 text-parade-muted">MG251 is an unofficial visitor guide. Confirm parade times and changes with the parade organization or City of Mobile before heading out.</p>
      </section>
    </div>
  );
}
