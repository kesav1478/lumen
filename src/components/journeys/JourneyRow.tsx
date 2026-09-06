interface JourneyRowProps {
  journey: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    progressPercent: number; // computed from steps
  };
}

export function JourneyRow({ journey }: JourneyRowProps) {
  const isCompleted = journey.status === "completed";

  return (
    <div className="space-y-2 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={[
              "text-sm font-medium truncate",
              isCompleted
                ? "text-[var(--text-muted)] line-through"
                : "text-[var(--text-primary)]",
            ].join(" ")}
          >
            {journey.title}
          </p>
          {journey.description && (
            <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
              {journey.description}
            </p>
          )}
        </div>
        {isCompleted && (
          <span className="shrink-0 rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
            done
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-0.5 rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${journey.progressPercent}%` }}
          />
        </div>
        <span className="shrink-0 text-xs text-[var(--text-muted)]">
          {journey.progressPercent}%
        </span>
      </div>
    </div>
  );
}
