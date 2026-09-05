"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/actions/notes";

interface FavoriteButtonProps {
  noteId: string;
  isFavorite: boolean;
}

export function FavoriteButton({ noteId, isFavorite }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // prevent row link navigation
    e.stopPropagation();
    startTransition(() => toggleFavorite(noteId, isFavorite));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isFavorite ? "Remove from favourites" : "Add to favourites"}
      className="shrink-0 p-1 transition-opacity hover:opacity-70 disabled:opacity-40"
      aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
    >
      {isFavorite ? (
        // Filled star — accent gold
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ) : (
        // Outline star — muted
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-[var(--border)]"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </button>
  );
}
