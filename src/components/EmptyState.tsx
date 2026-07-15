type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded border border-dashed border-parade-line bg-white p-6 text-center">
      <h3 className="text-base font-bold text-parade-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-parade-muted">{message}</p>
    </div>
  );
}

