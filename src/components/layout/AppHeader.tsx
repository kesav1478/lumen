import Link from "next/link";
import { NudgesBell } from "@/components/ui/NudgesBell";

interface AppHeaderProps {
  /** Optional right-side content (page-specific actions). Bell is always appended last. */
  right?: React.ReactNode;
}

export function AppHeader({ right }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] px-8 py-4">
      <Link
        href="/home"
        className="text-lg font-light tracking-widest text-[var(--accent)]"
      >
        Lumen
      </Link>

      <div className="flex items-center gap-3">
        {right}
        <NudgesBell />
      </div>
    </header>
  );
}
