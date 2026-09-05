"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/app/actions/notes";

export function NewNoteForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createNote(formData);
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
          placeholder="Untitled"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm text-[var(--text-muted)]">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          placeholder="Start writing…"
          className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-sm text-[var(--text-muted)]">
          Tags{" "}
          <span className="text-xs opacity-60">(comma-separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="e.g. idea, reading, work"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
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
          {isPending ? "Saving…" : "Save note"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
