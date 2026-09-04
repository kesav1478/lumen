export function JourneyCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Section label */}
      <div className="h-2.5 w-36 rounded-full bg-[var(--surface)]" />

      {/* Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6 space-y-5">
        {/* Title + button row */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-44 rounded-full bg-[var(--background)]" />
          <div className="h-7 w-20 rounded-lg bg-[var(--background)]" />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-2.5 w-28 rounded-full bg-[var(--background)]" />
            <div className="h-2.5 w-7 rounded-full bg-[var(--background)]" />
          </div>
          <div className="h-0.5 w-full rounded-full bg-[var(--background)]" />
        </div>

        {/* Current step */}
        <div className="rounded-lg bg-[var(--background)] px-4 py-3 space-y-2">
          <div className="h-2.5 w-12 rounded-full bg-[var(--surface)]" />
          <div className="h-4 w-40 rounded-full bg-[var(--surface)]" />
        </div>
      </div>
    </div>
  );
}
