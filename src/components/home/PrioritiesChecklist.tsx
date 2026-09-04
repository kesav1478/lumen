"use client";

import { useState } from "react";

const PLACEHOLDER_ITEMS = [
  { id: "1", label: "Review your active journey" },
  { id: "2", label: "Write a reflection note" },
  { id: "3", label: "Capture a curiosity idea" },
];

export function PrioritiesChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section>
      <p className="mb-4 text-xs uppercase tracking-widest text-[var(--text-muted)]">
        Today&apos;s priorities
      </p>

      <ul className="space-y-1">
        {PLACEHOLDER_ITEMS.map((item) => {
          const done = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[var(--surface)]"
              >
                {/* Checkbox */}
                <span
                  className={[
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                    done
                      ? "border-[var(--accent)] bg-[var(--accent)]"
                      : "border-[var(--border)]",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {done && (
                    <svg
                      className="h-2.5 w-2.5 text-[var(--primary-foreground)]"
                      viewBox="0 0 10 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 4L3.5 6.5L9 1" />
                    </svg>
                  )}
                </span>

                {/* Label */}
                <span
                  className={[
                    "text-sm transition-colors",
                    done
                      ? "text-[var(--text-muted)] line-through"
                      : "text-[var(--text-primary)]",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
