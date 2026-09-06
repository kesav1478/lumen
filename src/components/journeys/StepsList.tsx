"use client";

import { useState, useTransition } from "react";
import { markStepDone, markJourneyComplete } from "@/app/actions/journeys";

interface Step {
  id: string;
  title: string;
  position: number;
  completed: boolean;
}

interface StepsListProps {
  steps: Step[];
  journeyId: string;
  journeyStatus: string;
}

export function StepsList({
  steps: initialSteps,
  journeyId,
  journeyStatus: initialStatus,
}: StepsListProps) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [completingJourney, startCompleteTransition] = useTransition();

  const sorted = [...steps].sort((a, b) => a.position - b.position);
  const total = sorted.length;
  const done = sorted.filter((s) => s.completed).length;
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  // First non-completed step is "current"
  const currentStepId = sorted.find((s) => !s.completed)?.id ?? null;
  const isJourneyComplete = status === "completed";

  function handleMarkDone(stepId: string) {
    // Optimistic update
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed: true } : s))
    );
    startTransition(async () => {
      await markStepDone(stepId, journeyId);
      // If all are now done, reflect completed status locally
      setSteps((prev) => {
        const updated = prev.map((s) =>
          s.id === stepId ? { ...s, completed: true } : s
        );
        if (updated.every((s) => s.completed)) setStatus("completed");
        return updated;
      });
    });
  }

  function handleCompleteJourney() {
    setStatus("completed");
    startCompleteTransition(() => markJourneyComplete(journeyId));
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      {total > 0 && (
        <div>
          <div className="mb-1.5 flex justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              {done} of {total} step{total !== 1 ? "s" : ""} complete
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {progressPercent}%
            </span>
          </div>
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-0.5 rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Completion banner */}
      {isJourneyComplete && (
        <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--surface)] px-5 py-4">
          <p className="text-sm text-[var(--accent)]">
            This journey is complete. Well done.
          </p>
        </div>
      )}

      {/* Steps */}
      {total === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No steps yet — steps can be added by editing the journey.
        </p>
      ) : (
        <ul className="space-y-1">
          {sorted.map((step) => {
            const isDone = step.completed;
            const isCurrent = !isDone && step.id === currentStepId && !isJourneyComplete;

            return (
              <li
                key={step.id}
                className="flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--surface)]"
              >
                {/* Status indicator */}
                <span className="shrink-0">
                  {isDone ? (
                    // Checkmark — muted, not loud
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-[var(--accent)]"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    // Gold dot — current
                    <span className="block h-2 w-2 rounded-full bg-[var(--accent)]" />
                  ) : (
                    // Muted dot — upcoming
                    <span className="block h-2 w-2 rounded-full bg-[var(--border)]" />
                  )}
                </span>

                {/* Step title */}
                <span
                  className={[
                    "flex-1 text-sm",
                    isDone
                      ? "text-[var(--text-muted)] line-through"
                      : isCurrent
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)]",
                  ].join(" ")}
                >
                  {step.title}
                </span>

                {/* Mark done button — only on non-completed steps */}
                {!isDone && !isJourneyComplete && (
                  <button
                    onClick={() => handleMarkDone(step.id)}
                    disabled={isPending}
                    className={[
                      "shrink-0 rounded px-2.5 py-1 text-xs transition-colors disabled:opacity-40",
                      isCurrent
                        ? "border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10"
                        : "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]",
                    ].join(" ")}
                  >
                    Done
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Manual "mark journey complete" — visible when all steps done but status not yet updated, or for journeys with 0 steps */}
      {!isJourneyComplete && (allDone || total === 0) && (
        <button
          onClick={handleCompleteJourney}
          disabled={completingJourney}
          className="text-sm text-[var(--text-muted)] underline-offset-2 transition-colors hover:text-[var(--accent)] hover:underline disabled:opacity-50"
        >
          {completingJourney ? "Marking complete…" : "Mark journey complete"}
        </button>
      )}
    </div>
  );
}
