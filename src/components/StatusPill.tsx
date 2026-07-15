type StatusPillProps = {
  children: React.ReactNode;
  tone?: "green" | "gold" | "purple" | "red" | "gray";
};

const toneClasses = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  gold: "border-amber-200 bg-amber-50 text-amber-800",
  purple: "border-purple-200 bg-purple-50 text-purple-800",
  red: "border-red-200 bg-red-50 text-red-800",
  gray: "border-slate-200 bg-slate-50 text-slate-700"
};

export function StatusPill({ children, tone = "gray" }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-semibold uppercase tracking-normal ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

