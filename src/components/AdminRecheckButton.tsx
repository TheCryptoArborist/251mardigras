"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function AdminRecheckButton() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");

  async function runCheck() {
    setState("running");

    try {
      const response = await fetch("/api/admin/recheck", { method: "POST" });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <button
      type="button"
      onClick={runCheck}
      disabled={state === "running"}
      className="inline-flex items-center justify-center gap-2 rounded bg-parade-purple px-4 py-2 text-sm font-bold text-white transition hover:bg-parade-purpleDark disabled:cursor-not-allowed disabled:opacity-60"
    >
      <RefreshCw className={`h-4 w-4 ${state === "running" ? "animate-spin" : ""}`} aria-hidden="true" />
      {state === "running" ? "Checking sources..." : state === "done" ? "Check started" : state === "error" ? "Check failed" : "Manual Recheck"}
    </button>
  );
}

