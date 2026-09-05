import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditNoteForm } from "@/components/notes/EditNoteForm";
import { DeleteButton } from "@/components/notes/DeleteButton";

export const metadata = { title: "Note — Lumen" };

interface Props {
  params: { id: string };
}

export default async function NoteDetailPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: note } = await supabase
    .from("notes")
    .select("id, title, content, tags, is_favorite, created_at")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!note) redirect("/notes");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-8 py-4">
        <Link
          href="/home"
          className="text-lg font-light tracking-widest text-[var(--accent)]"
        >
          Lumen
        </Link>
        <Link
          href="/notes"
          className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          ← Back to notes
        </Link>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <EditNoteForm
          note={{
            id: note.id,
            title: note.title,
            content: note.content,
            tags: note.tags,
            is_favorite: note.is_favorite,
          }}
        />

        {/* Danger zone */}
        <div className="mt-16 border-t border-[var(--border)] pt-8">
          <DeleteButton noteId={note.id} />
        </div>
      </main>
    </div>
  );
}
