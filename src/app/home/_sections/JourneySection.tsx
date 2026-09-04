import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface JourneyStep {
  id: string;
  title: string;
  completed: boolean;
  position: number;
}

interface Journey {
  id: string;
  title: string;
  journey_steps: JourneyStep[];
}

interface Props {
  userId: string;
}

export async function JourneySection({ userId }: Props) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("journeys")
    .select("id, title, journey_steps(id, title, completed, position)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const journey = data as Journey | null;

  // ── Empty state ───────────────────────────────────────────
  if (!journey) {
    return (
      <section>
        <p className="mb-4 text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Continue your journey
        </p>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No journey started yet.
          </p>
          <Link
            href="/journeys/new"
            className="mt-5 inline-block rounded-lg border border-[var(--accent)] px-5 py-2 text-sm text-[var(--accent)] transition-opacity hover:opacity-75"
          >
            Start your first journey
          </Link>
        </div>
      </section>
    );
  }

  // ── Compute progress from steps ───────────────────────────
  const steps = journey.journey_steps ?? [];
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercent =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const currentStep = steps
    .filter((s) => !s.completed)
    .sort((a, b) => a.position - b.position)[0] ?? null;

  return (
    <section>
      <p className="mb-4 text-xs uppercase tracking-widest text-[var(--text-muted)]">
        Continue your journey
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6">
        {/* Title + CTA */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-medium text-[var(--text-primary)]">
            {journey.title}
          </h2>
          <Link
            href={`/journeys/${journey.id}`}
            className="shrink-0 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-85"
          >
            Continue
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              {completedSteps} of {totalSteps} step{totalSteps !== 1 ? "s" : ""} complete
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {progressPercent}%
            </span>
          </div>
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-[var(--background)]">
            <div
              className="h-0.5 rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Current step */}
        {currentStep && (
          <div className="mt-4 rounded-lg bg-[var(--background)] px-4 py-3">
            <p className="mb-0.5 text-xs text-[var(--text-muted)]">Up next</p>
            <p className="text-sm text-[var(--text-primary)]">
              {currentStep.title}
            </p>
          </div>
        )}

        {/* All steps complete */}
        {totalSteps > 0 && completedSteps === totalSteps && (
          <div className="mt-4 rounded-lg bg-[var(--accent-soft)] px-4 py-3">
            <p className="text-sm text-[var(--accent)]">
              All steps complete — great work.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
