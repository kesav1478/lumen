import { createClient } from "@/lib/supabase/server";
import { CuriosityRow, type CuriosityItemData } from "@/components/curiosity/CuriosityRow";
import Link from "next/link";

export async function CuriosityList({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("curiosity_items")
    .select("id, title, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="py-8 text-sm text-[var(--destructive)]">{error.message}</p>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
          Nothing parked yet — when a stray idea shows up mid-focus, capture it
          here instead of chasing it.
        </p>
        <Link
          href="/curiosity/new"
          className="mt-6 inline-block text-sm text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Capture your first idea
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {(items as CuriosityItemData[]).map((item) => (
        <CuriosityRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
