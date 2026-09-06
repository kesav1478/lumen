import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { LogoutButton } from "@/components/home/LogoutButton";
import { GreetingSection } from "./_sections/GreetingSection";
import { JourneySection } from "./_sections/JourneySection";
import { GreetingSkeleton } from "@/components/home/GreetingSkeleton";
import { JourneyCardSkeleton } from "@/components/home/JourneyCardSkeleton";
import { PrioritiesChecklist } from "@/components/home/PrioritiesChecklist";
import { QuickActions } from "@/components/home/QuickActions";

export const metadata = { title: "Home — Lumen" };

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <AppHeader
        right={
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-muted)]">{user.email}</span>
            <LogoutButton />
          </div>
        }
      />

      {/* Main — narrow centered column */}
      <main className="mx-auto w-full max-w-xl flex-1 space-y-12 px-6 py-14">
        <Suspense fallback={<GreetingSkeleton />}>
          <GreetingSection userId={user.id} />
        </Suspense>

        <Suspense fallback={<JourneyCardSkeleton />}>
          <JourneySection userId={user.id} />
        </Suspense>

        <PrioritiesChecklist />

        <QuickActions />
      </main>
    </div>
  );
}
