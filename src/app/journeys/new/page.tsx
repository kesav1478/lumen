import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { NewJourneyForm } from "@/components/journeys/NewJourneyForm";

export const metadata = { title: "New Journey — Lumen" };

export default async function NewJourneyPage() {
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
            href="/journeys"
            className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            ← Back to journeys
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-[var(--text-primary)]">
            New Journey
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            A journey is a set of steps toward something that matters.
          </p>
        </div>

        <NewJourneyForm />
      </main>
    </div>
  );
}
