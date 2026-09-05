"use client";

import { useState, useTransition } from "react";
import { updateNote, toggleFavorite } from "@/app/actions/notes";
import { TagPills } from "./TagPills";

interface EditNoteFormProps {
  note: {
    id: string;
    title: string | null;
    content: string;
    tags: string[] | null;
    is_favorite: boolean;
  };
}

export function EditNoteForm({ note }: EditNoteFormProps) {
  const [isFavorite, setIsFavorite] = useState(note.is_favorite);
  const [saveResult, setSaveResult] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFavPending, startFavTransition] = useTransition();

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveResult("idle");
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateNote(note.id, formData);
      if (result?.error) {
        setSaveResult("error");
        setErrorMsg(result.error);
      } else {
        setSaveResult("saved");
      }
    });
  }

  function handleFavoriteToggle() {
    startFavTransition(async () => {
      await toggleFavorite(note.id, isFavorite);
      setIsFavorite((prev) => !prev);
    });
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Favourite toggle row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleFavoriteToggle}
          disabled={isFavPending}
          className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          {isFavorite ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[var(--accent)]" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 text-[var(--border)]" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          <span className="text-[var(--text-muted)]">
            {isFavorite ? "Favourited" : "Add to favourites"}
          </span>
        </button>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm text-[var(--text-muted)]">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={note.title ?? ""}
          placeholder="Untitled"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm text-[var(--text-muted)]">Content</label>
        <textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={note.content}
          placeholder="Start writing…"
          className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-sm text-[var(--text-muted)]">
          Tags <span className="text-xs opacity-60">(comma-separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={(note.tags ?? []).join(", ")}
          placeholder="e.g. idea, reading, work"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
        />
        {(note.tags ?? []).length > 0 && (
          <div className="pt-1">
            <TagPills tags={note.tags} />
          </div>
        )}
      </div>

      {/* Feedback */}
      {saveResult === "saved" && (
        <p className="text-sm text-[var(--accent)]">Changes saved.</p>
      )}
      {saveResult === "error" && errorMsg && (
        <p className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3.5 py-2.5 text-sm text-[var(--destructive)]">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
