import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JourneyRow } from "@/components/journeys/JourneyRow";

interface StepMinimal {
  completed: boolean;
}

interface JourneyWithSteps {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  journey_steps: StepMinimal[];
}

export async function JourneyList({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journeys")
    .select("id, title, description, status, created_at, journey_steps(completed)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="py-8 text-sm text-[var(--destructive)]">{error.message}</p>
    );
  }

  const journeys = (data ?? []) as JourneyWithSteps[];

  if (journeys.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
          No journeys yet. A journey is a set of steps toward something that
          matters to you.
        </p>
        <Link
          href="/journeys/new"
          className="mt-6 inline-block text-sm text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Start your first journey
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {journeys.map((j) => {
        const steps = j.journey_steps ?? [];
        const total = steps.length;
        const done = steps.filter((s) => s.completed).length;
        const progressPercent =
          total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <li key={j.id}>
            <Link href={`/journeys/${j.id}`} className="block rounded-lg px-1 transition-colors hover:bg-[var(--surface)]">
              <JourneyRow
                journey={{
                  id: j.id,
                  title: j.title,
                  description: j.description,
                  status: j.status,
                  progressPercent,
                }}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
