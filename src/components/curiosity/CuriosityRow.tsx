import { CuriosityDeleteButton } from "./CuriosityDeleteButton";

export interface CuriosityItemData {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export function CuriosityRow({ item }: { item: CuriosityItemData }) {
  return (
    <li className="flex items-start gap-4 py-5">
      {/* Small dot marker */}
      <span
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm text-[var(--text-primary)]">{item.title}</p>
        {item.description && (
          <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
        )}
      </div>

      {/* Delete */}
      <CuriosityDeleteButton id={item.id} />
    </li>
  );
}
