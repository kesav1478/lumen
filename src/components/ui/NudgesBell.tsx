"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { markNudgeSeen, markAllNudgesSeen } from "@/app/actions/nudges";

interface Nudge {
  id: string;
  message: string;
  dismissed: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function NudgesBell() {
  const [open, setOpen] = useState(false);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch nudges on mount
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("nudges")
        .select("id, message, dismissed, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      setNudges(data ?? []);
      setLoaded(true);
    }
    load();
  }, []);

  // Close panel on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  const hasUnseen = loaded && nudges.some((n) => !n.dismissed);

  function handleNudgeClick(id: string, dismissed: boolean) {
    if (dismissed) return;
    // Optimistic update
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
    );
    startTransition(() => markNudgeSeen(id));
  }

  function handleClearAll() {
    setNudges((prev) => prev.map((n) => ({ ...n, dismissed: true })));
    startTransition(() => markAllNudgesSeen());
  }

  const anyUnseen = nudges.some((n) => !n.dismissed);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Nudges"
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
      >
        {/* Bell icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4.5 w-4.5 h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unseen dot — accent gold, not red */}
        {hasUnseen && (
          <span
            className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg shadow-black/30">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Whispers
            </span>
            {anyUnseen && (
              <button
                onClick={handleClearAll}
                className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Nudge list */}
          <div className="max-h-80 overflow-y-auto">
            {!loaded ? (
              // Loading skeleton
              <div className="animate-pulse space-y-3 px-4 py-4">
                {[60, 80, 50].map((w, i) => (
                  <div key={i} className="space-y-1.5">
                    <div
                      className="h-3 rounded-full bg-[var(--background)]"
                      style={{ width: `${w}%` }}
                    />
                    <div className="h-2.5 w-12 rounded-full bg-[var(--background)]" />
                  </div>
                ))}
              </div>
            ) : nudges.length === 0 ? (
              // Empty state
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--text-muted)]">
                  Nothing to whisper about right now.
                </p>
              </div>
            ) : (
              <ul>
                {nudges.map((nudge) => (
                  <li key={nudge.id}>
                    <button
                      onClick={() =>
                        handleNudgeClick(nudge.id, nudge.dismissed)
                      }
                      className={[
                        "w-full px-4 py-3.5 text-left transition-colors",
                        nudge.dismissed
                          ? "opacity-40"
                          : "hover:bg-[var(--background)]",
                      ].join(" ")}
                    >
                      <p className="text-sm leading-snug text-[var(--text-primary)]">
                        {nudge.message}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {timeAgo(nudge.created_at)}
                      </p>
                    </button>
                    <div className="mx-4 border-b border-[var(--border)] last:border-0" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
