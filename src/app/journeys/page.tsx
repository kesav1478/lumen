import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { JourneyList } from "./_components/JourneyList";
import { JourneyListSkeleton } from "@/components/journeys/JourneyListSkeleton";

export const metadata = { title: "Journeys — Lumen" };

export default async function JourneysPage() {
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
            href="/journeys/new"
            className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            New Journey
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-light text-[var(--text-primary)]">
          Journeys
        </h1>

        <div className="mt-8">
          <Suspense fallback={<JourneyListSkeleton />}>
            <JourneyList userId={user.id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
