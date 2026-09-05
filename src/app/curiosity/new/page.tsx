import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewCuriosityForm } from "@/components/curiosity/NewCuriosityForm";

export const metadata = { title: "Capture an idea — Lumen" };

export default async function NewCuriosityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
          href="/curiosity"
          className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          ← Back
        </Link>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-[var(--text-primary)]">
            Capture an idea
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Park it here. You can come back to it later.
          </p>
        </div>

        <NewCuriosityForm />
      </main>
    </div>
  );
}
