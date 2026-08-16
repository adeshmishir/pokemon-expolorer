import { cn } from "../../utils/cn";

export default function TypeBadge({ type = "normal", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium capitalize text-slate-700",
        className
      )}
    >
      {type}
    </span>
  );
}
