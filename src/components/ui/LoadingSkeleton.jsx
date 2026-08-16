import { cn } from "../../utils/cn";

export default function LoadingSkeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-shimmer rounded-lg bg-slate-200", className)}
      {...props}
    />
  );
}
