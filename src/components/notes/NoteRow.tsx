import Link from "next/link";
import { TagPills } from "./TagPills";
import { FavoriteButton } from "./FavoriteButton";

export interface NoteRowData {
  id: string;
  title: string | null;
  content: string;
  tags: string[] | null;
  is_favorite: boolean;
  created_at: string;
}

interface NoteRowProps {
  note: NoteRowData;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function NoteRow({ note }: NoteRowProps) {
  const preview = note.content?.slice(0, 100) || "";
  const hasMore = (note.content?.length ?? 0) > 100;

  return (
    <li className="group relative">
      <Link
        href={`/notes/${note.id}`}
        className="flex items-start gap-4 px-1 py-5 transition-colors hover:bg-[var(--surface)] rounded-lg"
      >
        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {note.title || "Untitled"}
          </p>
          {preview && (
            <p className="text-sm text-[var(--text-muted)] line-clamp-2">
              {preview}
              {hasMore && "…"}
            </p>
          )}
          <div className="flex items-center gap-3">
            <TagPills tags={note.tags} />
            <span className="ml-auto shrink-0 text-xs text-[var(--text-muted)]">
              {formatDate(note.created_at)}
            </span>
          </div>
        </div>

        {/* Favourite star — sits outside the main flex so it doesn't shift text */}
        <div className="pt-0.5">
          <FavoriteButton noteId={note.id} isFavorite={note.is_favorite} />
        </div>
      </Link>
    </li>
  );
}
