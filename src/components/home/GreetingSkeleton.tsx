export function GreetingSkeleton() {
  return (
    <div className="animate-pulse space-y-2.5">
      <div className="h-3 w-28 rounded-full bg-[var(--surface)]" />
      <div className="h-8 w-52 rounded-full bg-[var(--surface)]" />
    </div>
  );
}
