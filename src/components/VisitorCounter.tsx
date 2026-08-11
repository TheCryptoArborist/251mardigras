"use client";

import { useEffect, useState } from "react";

type VisitorCounterResponse = {
  ok: boolean;
  total: number | null;
  startedAt?: string;
  updatedAt?: string;
};

const SESSION_COUNTED_KEY = "mg251-homepage-visit-counted";

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
    <section className="rounded-[1.25rem] border border-parade-gold/30 bg-white/80 px-4 py-3 text-center shadow-civic sm:px-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-parade-purple">Visitor counter</p>
      <p className="mt-1 text-sm font-semibold text-parade-muted">
        <span className="text-xl font-black text-parade-purpleDark">{counter.total.toLocaleString()}</span>{" "}
        homepage visits counted
      </p>
      <p className="mt-1 text-[0.7rem] font-semibold text-parade-muted">
        Counted once per browser session.
      </p>
    </section>
  );
}
