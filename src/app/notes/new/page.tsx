import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { NewNoteForm } from "@/components/notes/NewNoteForm";

export const metadata = { title: "New Note — Lumen" };

export default async function NewNotePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <AppHeader
        right={
          <Link
            href="/notes"
            className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            ← Back to notes
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <h1 className="mb-8 text-2xl font-light text-[var(--text-primary)]">New Note</h1>
        <NewNoteForm />
      </main>
    </div>
  );
}
