"use client";

import { useEffect, useState } from "react";

type VisitorCounterResponse = {
  ok: boolean;
  total: number | null;
  startedAt?: string;
  updatedAt?: string;
};

const SESSION_COUNTED_KEY = "mg251-homepage-visit-counted";
const BEAD_TRAIL = Array.from({ length: 22 }, (_, index) => index);

export function VisitorCounter() {
  const [counter, setCounter] = useState<VisitorCounterResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCounter() {
      try {
        const alreadyCounted = window.sessionStorage.getItem(SESSION_COUNTED_KEY) === "true";
        const method = alreadyCounted ? "GET" : "POST";
        const response = await fetch("/api/visitor-count", {
          method,
          cache: "no-store"
        });
        const data = (await response.json()) as VisitorCounterResponse;

        if (!isMounted) {
          return;
        }

        if (data.ok && typeof data.total === "number") {
          window.sessionStorage.setItem(SESSION_COUNTED_KEY, "true");
          setCounter(data);
        }
      } catch {
        if (isMounted) {
          setCounter(null);
        }
      }
    }

    loadCounter();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!counter?.ok || typeof counter.total !== "number") {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-parade-gold/60 bg-gradient-to-br from-parade-purpleDeep via-parade-purple to-parade-purpleDark p-5 text-center text-white shadow-glow">
      <div className="pointer-events-none absolute left-[-3rem] top-[-4rem] h-28 w-28 rounded-full bg-parade-gold/25 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[-4rem] right-[-3rem] h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-4 top-3 flex justify-center gap-1.5" aria-hidden="true">
        {BEAD_TRAIL.map((bead) => (
          <span
            key={bead}
            className={bead % 2 === 0 ? "h-2 w-2 rounded-full bg-parade-gold shadow-glow" : "h-2 w-2 rounded-full bg-white/70"}
          />
        ))}
      </div>
      <div className="relative z-10 pt-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-parade-goldBright">Visitor counter</p>
        <div className="mx-auto mt-3 w-fit rounded-full border border-parade-gold/50 bg-parade-purpleDeep/70 px-6 py-3 shadow-civic backdrop-blur">
          <p className="text-4xl font-black leading-none text-parade-goldBright drop-shadow sm:text-5xl">
            {counter.total.toLocaleString()}
          </p>
        </div>
        <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-white">
          Homepage visits counted
        </p>
        <p className="mt-2 text-xs font-semibold leading-5 text-purple-100">
          Counted once per browser session. Thanks for keeping Mobile Mardi Gras in motion.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
        {BEAD_TRAIL.map((bead) => (
          <span
            key={`bottom-${bead}`}
            className={bead % 2 === 0 ? "h-2 w-2 rounded-full bg-white/70" : "h-2 w-2 rounded-full bg-parade-gold shadow-glow"}
          />
        ))}
      </div>
    </section>
  );
}
