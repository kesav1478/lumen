"use client";

import { useState, useTransition } from "react";
import { deleteNote } from "@/app/actions/notes";

export function DeleteButton({ noteId }: { noteId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--destructive)]"
      >
        Delete note
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[var(--text-muted)]">Delete this note?</span>
      <button
        onClick={() => startTransition(() => deleteNote(noteId))}
        disabled={isPending}
        className="rounded-lg border border-[var(--destructive)]/40 px-3 py-1.5 text-sm text-[var(--destructive)] transition-colors hover:bg-[var(--destructive)]/10 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
