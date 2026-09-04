"use client";

import { useTransition } from "react";
import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Log out"}
    </button>
  );
}
