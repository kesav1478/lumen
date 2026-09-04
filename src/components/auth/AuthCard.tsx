import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className={cn(
          "w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] px-8 py-10",
          className
        )}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-widest text-[var(--accent)]">
            Lumen
          </h1>
          <h2 className="mt-4 text-lg font-medium text-[var(--text-primary)]">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
