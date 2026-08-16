import { cn } from "../../utils/cn";
import { getTypeColors } from "../../utils/typeColors";

export default function TypeBadge({ type = "normal", className }) {
  const colors = getTypeColors(type);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
        colors.bg,
        colors.text,
        className
      )}
    >
      {type}
    </span>
  );
}
