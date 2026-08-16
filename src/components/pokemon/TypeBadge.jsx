import { cn } from "../../utils/cn";
import { getTypeColors } from "../../utils/typeColors";

export default function TypeBadge({ type = "normal", className }) {
  const colors = getTypeColors(type);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        colors.bg,
        colors.text,
        className
      )}
    >
      {type}
    </span>
  );
}
