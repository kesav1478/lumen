import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--text-muted)]"
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-[var(--border)] bg-[var(--background)]",
            "px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]",
            "outline-none transition-colors",
            "focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]",
            error && "border-[var(--destructive)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--destructive)]">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
