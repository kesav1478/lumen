import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CuriosityList } from "./_components/CuriosityList";
import { CuriosityListSkeleton } from "@/components/curiosity/CuriosityListSkeleton";

export const metadata = { title: "Curiosity — Lumen" };

export default async function CuriosityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
          href="/curiosity/new"
          className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Capture an idea
        </Link>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-[var(--text-primary)]">
            Curiosity
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            A quiet parking lot for ideas that show up uninvited.
          </p>
        </div>

        <Suspense fallback={<CuriosityListSkeleton />}>
          <CuriosityList userId={user.id} />
        </Suspense>
      </main>
    </div>
  );
}
