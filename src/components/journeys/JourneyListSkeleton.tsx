export function JourneyListSkeleton() {
  return (
    <ul className="animate-pulse divide-y divide-[var(--border)]">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="space-y-3 py-5">
          <div
            className="h-4 rounded-full bg-[var(--surface)]"
            style={{ width: `${[55, 70, 45][i]}%` }}
          />
          <div className="flex items-center gap-3">
            <div className="h-0.5 flex-1 rounded-full bg-[var(--surface)]" />
            <div className="h-3 w-8 rounded-full bg-[var(--surface)]" />
          </div>
        </li>
      ))}
    </ul>
  );
}
