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
    <section aria-label="Homepage visitor counter" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-parade-line py-4 text-center text-xs text-parade-muted">
      <p><strong className="text-sm font-black tabular-nums text-parade-purple">{counter.total.toLocaleString()}</strong> homepage visits counted</p>
      <p>Once per browser session. Thanks for following Mobile Mardi Gras.</p>
    </section>
  );
}
