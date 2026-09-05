"use client";

import { useState, useTransition } from "react";
import { deleteCuriosityItem } from "@/app/actions/curiosity";

export function CuriosityDeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-[var(--text-muted)]">Remove?</span>
        <button
          onClick={() => startTransition(() => deleteCuriosityItem(id))}
          disabled={isPending}
          className="text-xs text-[var(--destructive)] transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          {isPending ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-[var(--text-muted)] transition-opacity hover:opacity-70"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Remove this idea"
      className="shrink-0 p-1 text-[var(--border)] transition-colors hover:text-[var(--text-muted)]"
      aria-label="Remove this idea"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
