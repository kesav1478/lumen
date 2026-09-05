export function NoteListSkeleton() {
  return (
    <ul className="animate-pulse divide-y divide-[var(--border)]">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="py-5 space-y-2">
          <div className="h-4 w-48 rounded-full bg-[var(--surface)]" />
          <div className="h-3 w-full rounded-full bg-[var(--surface)]" />
          <div className="h-3 w-2/3 rounded-full bg-[var(--surface)]" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-14 rounded-full bg-[var(--surface)]" />
            <div className="h-5 w-10 rounded-full bg-[var(--surface)]" />
          </div>
        </li>
      ))}
    </ul>
  );
}
