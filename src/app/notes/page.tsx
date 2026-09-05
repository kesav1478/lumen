import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotesList } from "./_components/NotesList";
import { NoteListSkeleton } from "@/components/notes/NoteListSkeleton";

export const metadata = { title: "Notes — Lumen" };

interface Props {
  searchParams: { filter?: string };
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "favorites", label: "Favourites" },
];

export default async function NotesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const filter = searchParams.filter === "favorites" ? "favorites" : "all";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-8 py-4">
        <Link
          href="/home"
          className="text-lg font-light tracking-widest text-[var(--accent)]"
        >
          Lumen
        </Link>
        <Link
          href="/notes/new"
          className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          New Note
        </Link>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-light text-[var(--text-primary)]">
          Notes
        </h1>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-1 border-b border-[var(--border)]">
          {FILTERS.map(({ key, label }) => (
            <Link
              key={key}
              href={key === "all" ? "/notes" : `/notes?filter=${key}`}
              className={[
                "px-4 py-2 text-sm transition-colors",
                filter === key
                  ? "border-b-2 border-[var(--accent)] text-[var(--accent)] -mb-px"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Notes list */}
        <div className="mt-4">
          <Suspense fallback={<NoteListSkeleton />}>
            <NotesList userId={user.id} filter={filter} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
