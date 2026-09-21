import Link from "next/link";
import type { ReactNode } from "react";
import { prototypeNotice } from "@/lib/mg251-mvp/fictional-data";

const prototypeNavItems = [
  { href: "/prototype/mg251", label: "Overview" },
  { href: "/prototype/mg251/member", label: "Member" },
  { href: "/prototype/mg251/sponsors", label: "Sponsor" },
  { href: "/prototype/mg251/organizations", label: "Organization" },
  { href: "/prototype/mg251/admin", label: "Admin" }
] as const;

export function PrototypeNotice() {
  return (
    <div className="border-b border-parade-gold/40 bg-parade-goldSoft px-4 py-3 text-sm font-semibold text-parade-purpleDeep">
      <div className="mx-auto flex max-w-7xl items-start gap-2">
        <span aria-hidden="true">⚠</span>
        <p className="m-0">{prototypeNotice}</p>
      </div>
    </div>
  );
}

export function PrototypeNav() {
  return (
    <nav className="border-b border-parade-line bg-white" aria-label="MG251 prototype navigation">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {prototypeNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="min-h-11 shrink-0 rounded-full border border-parade-line bg-parade-purpleMist px-4 py-2.5 text-sm font-black text-parade-purpleDeep transition hover:border-parade-gold hover:bg-parade-goldSoft focus:outline-none focus:ring-2 focus:ring-parade-gold"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PrototypePage({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>;
}

export function PageIntro({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-parade-gold/40 bg-gradient-to-br from-parade-purpleDeep via-parade-purpleDark to-parade-purple p-6 text-white shadow-civic sm:p-9">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-parade-goldBright">{eyebrow}</p>
      <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-purple-100 sm:text-lg">{description}</p>
      {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      {eyebrow ? <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-parade-gold">{eyebrow}</p> : null}
      <h2 className="text-2xl font-black tracking-tight text-parade-purpleDeep sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl leading-7 text-parade-muted">{description}</p> : null}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-parade-line bg-white p-5 shadow-card sm:p-6 ${className}`}>{children}</section>;
}

export function StatusPill({ children, tone = "purple" }: { children: ReactNode; tone?: "purple" | "gold" | "neutral" | "danger" }) {
  const toneClass = {
    purple: "border-purple-200 bg-parade-purpleSoft text-parade-purpleDeep",
    gold: "border-parade-gold/40 bg-parade-goldSoft text-parade-purpleDeep",
    neutral: "border-parade-line bg-slate-100 text-slate-700",
    danger: "border-red-200 bg-red-50 text-red-800"
  }[tone];

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${toneClass}`}>{children}</span>;
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-parade-goldBright px-5 py-2.5 text-sm font-black text-parade-purpleDeep shadow-sm transition hover:bg-parade-goldSoft focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-parade-purpleDeep"
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-parade-purple/25 bg-white px-5 py-2.5 text-sm font-black text-parade-purpleDeep transition hover:border-parade-gold hover:bg-parade-goldSoft focus:outline-none focus:ring-2 focus:ring-parade-gold"
    >
      {children}
    </Link>
  );
}

export function DisabledButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-parade-line bg-slate-100 px-5 py-2.5 text-sm font-black text-slate-500"
    >
      {children}
    </button>
  );
}

export function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-b border-parade-line py-3 last:border-b-0">
      <dt className="text-xs font-black uppercase tracking-wide text-parade-muted">{label}</dt>
      <dd className="mt-1 font-bold text-parade-ink">{value}</dd>
    </div>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-parade-line bg-parade-purpleMist p-4">
      <p className="text-sm font-bold text-parade-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-parade-purpleDeep">{value}</p>
      <p className="mt-1 text-sm text-parade-muted">{detail}</p>
    </div>
  );
}

export function CheckRow({ label, complete }: { label: string; complete: boolean }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-parade-line bg-white px-4 py-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          complete ? "bg-parade-goldBright text-parade-purpleDeep" : "bg-slate-100 text-slate-500"
        }`}
        aria-hidden="true"
      >
        {complete ? "✓" : "•"}
      </span>
      <span className="font-bold text-parade-ink">{label}</span>
    </li>
  );
}

export function AdvancedDetails({ children }: { children: ReactNode }) {
  return (
    <details className="rounded-2xl border border-parade-line bg-parade-purpleMist p-4">
      <summary className="cursor-pointer font-black text-parade-purpleDeep">Optional technical details</summary>
      <div className="mt-3 text-sm leading-6 text-parade-muted">{children}</div>
    </details>
  );
}
