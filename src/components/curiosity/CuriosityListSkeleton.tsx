export function CuriosityListSkeleton() {
  return (
    <ul className="animate-pulse space-y-5 pt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--surface)]" />
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3.5 rounded-full bg-[var(--surface)]"
              style={{ width: `${[55, 70, 45, 65, 50][i]}%` }}
            />
            {i % 2 === 0 && (
              <div
                className="h-3 rounded-full bg-[var(--surface)]"
                style={{ width: `${[40, 55, 35][i % 3]}%` }}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
