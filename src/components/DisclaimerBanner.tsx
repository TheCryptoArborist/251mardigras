import { AlertTriangle } from "lucide-react";
import { publicDisclaimers } from "@/lib/seed-data";

type DisclaimerBannerProps = {
  compact?: boolean;
};

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  const displayed = compact ? publicDisclaimers.slice(0, 2) : publicDisclaimers;

  return (
    <section className="border-y border-amber-200 bg-parade-goldSoft">
      <div className="mx-auto flex max-w-7xl gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div className="space-y-1 text-sm font-medium leading-6 text-amber-950">
          {displayed.map((disclaimer) => (
            <p key={disclaimer}>{disclaimer}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

