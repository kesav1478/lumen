interface TagPillsProps {
  tags: string[] | null;
}

export function TagPills({ tags }: TagPillsProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
