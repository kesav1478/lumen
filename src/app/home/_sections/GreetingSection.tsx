import { createClient } from "@/lib/supabase/server";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface Props {
  userId: string;
}

export async function GreetingSection({ userId }: Props) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  const name =
    (profile as { display_name?: string | null } | null)?.display_name?.trim() ||
    "Traveller";

  const greeting = getGreeting();

  return (
    <div>
      <p className="text-sm text-[var(--text-muted)]">{greeting},</p>
      <h1 className="mt-1 text-3xl font-light tracking-wide text-[var(--text-primary)]">
        {name}
      </h1>
    </div>
  );
}
