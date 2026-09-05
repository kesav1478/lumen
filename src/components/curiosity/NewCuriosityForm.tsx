"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCuriosityItem } from "@/app/actions/curiosity";

export function NewCuriosityForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCuriosityItem(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title — autofocused so you can type immediately */}
      <input
        name="title"
        type="text"
        autoFocus
        required
        placeholder="What caught your attention?"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
      />

      {/* Optional note */}
      <textarea
        name="description"
        rows={3}
        placeholder="A quick thought (optional)…"
        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
      />

      {error && (
        <p className="text-sm text-[var(--destructive)]">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Parking…" : "Capture it"}
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
