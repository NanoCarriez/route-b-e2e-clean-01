import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 min-h-12 w-full min-w-0 rounded-md border border-border bg-surface px-3 text-center font-medium text-fg tabular-nums",
        "placeholder:text-subtle",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
