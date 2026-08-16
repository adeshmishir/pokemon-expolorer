import { cn } from "../../utils/cn";

export default function LoadingSkeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-shimmer rounded-lg bg-[var(--color-pokedex-border)] dark:bg-[var(--color-pokedex-dark-border)]", className)}
      {...props}
    />
  );
}
