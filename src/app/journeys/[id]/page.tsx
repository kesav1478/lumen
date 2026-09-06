import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { StepsList } from "@/components/journeys/StepsList";

export const metadata = { title: "Journey — Lumen" };

interface Props {
  params: { id: string };
}

export default async function JourneyDetailPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: journey } = await supabase
    .from("journeys")
    .select(
      "id, title, description, status, created_at, journey_steps(id, title, position, completed)"
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!journey) redirect("/journeys");

  const steps = (
    (journey.journey_steps as {
      id: string;
      title: string;
      position: number;
      completed: boolean;
    }[]) ?? []
  ).sort((a, b) => a.position - b.position);

  const isCompleted = journey.status === "completed";

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
        {/* Journey header */}
        <div className="mb-10 space-y-2">
          <div className="flex items-start gap-3">
            <h1 className="flex-1 text-2xl font-light text-[var(--text-primary)]">
              {journey.title}
            </h1>
            {isCompleted && (
              <span className="mt-1 shrink-0 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">
                completed
              </span>
            )}
          </div>
          {journey.description && (
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {journey.description}
            </p>
          )}
        </div>

        {/* Interactive steps list */}
        <StepsList
          steps={steps}
          journeyId={journey.id}
          journeyStatus={journey.status}
        />
      </main>
    </div>
  );
}
