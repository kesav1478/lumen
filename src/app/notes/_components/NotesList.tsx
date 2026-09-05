import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NoteRow, type NoteRowData } from "@/components/notes/NoteRow";

interface Props {
  userId: string;
  filter: string;
}

export async function NotesList({ userId, filter }: Props) {
  const supabase = await createClient();

  let query = supabase
    .from("notes")
    .select("id, title, content, tags, is_favorite, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filter === "favorites") {
    query = query.eq("is_favorite", true);
  }

  const { data: notes, error } = await query;

  if (error) {
    return (
      <p className="py-8 text-sm text-[var(--destructive)]">{error.message}</p>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          {filter === "favorites"
            ? "No favourited notes yet."
            : "No notes yet."}
        </p>
        {filter !== "favorites" && (
          <Link
            href="/notes/new"
            className="mt-4 inline-block text-sm text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Write your first note
          </Link>
        )}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {(notes as NoteRowData[]).map((note) => (
        <NoteRow key={note.id} note={note} />
      ))}
    </ul>
  );
}

// Re-export so page.tsx can import from one place
export { redirect };
