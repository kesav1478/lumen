import { cn } from "@/lib/utils";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  pending?: boolean;
}

export function SubmitButton({
  children,
  pending,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full rounded-lg bg-[var(--accent)] px-4 py-2.5",
        "text-sm font-medium text-[var(--primary-foreground)]",
        "transition-opacity hover:opacity-90 active:opacity-80",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}
