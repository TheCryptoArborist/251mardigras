import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2, UserRound } from "lucide-react";
import { ARCADE_GAMES } from "@/lib/arcade";
import { achievementArtwork, checkInStart, mobileDate } from "@/lib/arcade-achievements";
import paradeSchedule from "../../data/parade-schedule-2027.json";

const checkInOpeningLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC", month: "long", day: "numeric"
}).format(new Date(checkInStart));

export function getHomepageCheckInMessage(today: string, paradeDay: string) {
  if (today < checkInStart) return `Daily check-ins begin ${checkInOpeningLabel}.`;
  if (today > paradeDay) return "This season’s daily check-ins have ended.";
  return "Check in today and earn Mardi Gras badges.";
}

export function ArcadeShowcase() {
  const checkInMessage = getHomepageCheckInMessage(mobileDate(), paradeSchedule.days[0].date);

  return (
    <section aria-labelledby="homepage-arcade-heading" className="relative overflow-hidden rounded-3xl border border-parade-gold/40 bg-[#180b2a] p-5 sm:p-7">
      <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-parade-goldBright"><Gamepad2 size={18} aria-hidden="true" /> A new way to Mardi Gras</p>
          <h2 id="homepage-arcade-heading" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Play &amp; Create</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-purple-100">Visit the Mardi Gras Arcade, collect check-in badges, and create a profile picture for Carnival.</p>
          {/* The standalone game serves a complete HTML document and needs a full navigation. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/arcade/moonpie-run" className="mt-5 mr-3 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-parade-goldBright px-6 py-3 text-sm font-black text-parade-purpleDark hover:bg-parade-goldSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">Play MoonPie Run <ArrowRight size={18} aria-hidden="true" /></a>
          <Link href="/play" className="mt-5 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-parade-goldBright px-6 py-3 text-sm font-black text-parade-purpleDark transition hover:bg-parade-goldSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">Enter the Arcade <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {ARCADE_GAMES.map((game) => (
            <a key={game.slug} href={game.playUrl} className="group min-w-0 overflow-hidden rounded-xl border border-parade-gold/30 bg-parade-purpleDark transition hover:border-parade-goldBright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright">
              <div className="border-b-4 border-parade-gold/70 p-1.5 pb-0"><Image src={game.image} alt={game.imageAlt} width={1200} height={750} sizes="(max-width: 639px) 42vw, 280px" className="aspect-[8/5] w-full rounded-t-md object-cover" /></div>
              <div className="px-3 py-3"><h3 className="text-sm font-black text-white group-hover:text-parade-goldBright">{game.title}</h3><p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-parade-goldBright">{game.playUrl ? "Play now · No account needed" : "Coming soon · Preview"}</p></div>
            </a>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/profile-studio" className="group flex min-w-0 items-center gap-3 rounded-2xl border border-parade-gold/35 bg-parade-purpleDark p-3 transition hover:border-parade-goldBright hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright sm:p-4">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center sm:h-16 sm:w-16" aria-hidden="true">
            <UserRound className="h-5 w-5 text-parade-goldBright sm:h-7 sm:w-7" />
            <Image src="/images/profile-studio/frames/royal-v2.webp" alt="" width={64} height={64} sizes="(min-width: 640px) 64px, 48px" className="absolute inset-0 h-full w-full object-contain" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-parade-goldBright">Profile Studio</p>
            <h3 className="mt-1 text-base font-black leading-5 text-white group-hover:underline">Make a Mardi Gras profile picture</h3>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-parade-goldBright" aria-hidden="true" />
        </Link>
        <Link href="/play#daily-check-in" className="group flex min-w-0 items-center gap-3 rounded-2xl border border-parade-gold/35 bg-parade-purpleDark p-3 transition hover:border-parade-goldBright hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-parade-goldBright sm:p-4">
          <Image src={achievementArtwork("first-throw")} alt="" width={64} height={64} sizes="(min-width: 640px) 64px, 48px" className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-parade-goldBright">Road to the First Throw</p>
            <h3 className="mt-1 text-base font-black leading-5 text-white group-hover:underline">Daily Check-In</h3>
            <p className="mt-2 text-sm leading-5 text-purple-100">{checkInMessage}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-parade-goldBright" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
