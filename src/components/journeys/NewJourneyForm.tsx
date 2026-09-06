"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createJourney } from "@/app/actions/journeys";

export function NewJourneyForm() {
  const router = useRouter();
  const [steps, setSteps] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateStep(i: number, value: string) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    // Inject steps array as JSON
    formData.set("steps", JSON.stringify(steps));
    startTransition(async () => {
      const result = await createJourney(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm text-[var(--text-muted)]">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          autoFocus
          placeholder="What is this journey about?"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm text-[var(--text-muted)]"
        >
          Description{" "}
          <span className="text-xs opacity-60">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Why does this journey matter to you?"
          className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-[var(--text-muted)]">
          Steps{" "}
          <span className="text-xs opacity-60">(optional — add later if you prefer)</span>
        </p>
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="shrink-0 text-xs text-[var(--text-muted)] w-5 text-right">
              {i + 1}.
            </span>
            <input
              type="text"
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              placeholder={`Step ${i + 1}`}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
            {steps.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="shrink-0 p-1 text-[var(--border)] transition-colors hover:text-[var(--text-muted)]"
                aria-label="Remove step"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="self-start text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
        >
          + Add step
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3.5 py-2.5 text-sm text-[var(--destructive)]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Creating…" : "Start journey"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
