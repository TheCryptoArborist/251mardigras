import { AlertTriangle } from "lucide-react";

type DisclaimerBannerProps = {
  compact?: boolean;
};

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  return (
    <section className="border-b border-amber-200 bg-parade-goldSoft">
      <div className="mx-auto flex max-w-7xl gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-sm font-medium leading-6 text-amber-950">
          <span className="font-black">Unofficial visitor resource.</span>{" "}
          Verify parade schedules, routes, traffic, parking, public safety, weather, and emergency decisions with official sources.
          {compact ? null : " Weather risk does not mean a parade is canceled unless officially announced."}
        </p>
      </div>
    </section>
  );
}
