import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/home/LogoutButton";

export const metadata = { title: "Home — Lumen" };

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-8 py-4">
        <span className="text-lg font-light tracking-widest text-[var(--accent)]">
          Lumen
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-muted)]">{user.email}</span>
          <LogoutButton />
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center">
        <h1 className="text-3xl font-light text-[var(--text-primary)]">
          Welcome to Lumen
        </h1>
      </main>
    </div>
  );
}
