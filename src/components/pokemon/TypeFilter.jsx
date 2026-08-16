import { cn } from "../../utils/cn";
import { getTypeColors } from "../../utils/typeColors";

const TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function TypeFilter({ selectedType = "all", onTypeChange }) {
  return (
    <div
      className="mb-8"
      role="radiogroup"
      aria-label="Filter Pokémon by type"
    >
      <div className="flex flex-wrap justify-center gap-2">
        {TYPES.map((type) => {
          const isActive = selectedType === type;
          const colors = getTypeColors(type);

          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={type === "all" ? "Show all Pokémon" : `Filter by ${type}`}
              onClick={() => onTypeChange(type)}
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all duration-150 outline-none",
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                type === "all"
                  ? isActive
                    ? "bg-slate-800 text-white focus-visible:ring-slate-400"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:ring-slate-400"
                  : isActive
                    ? cn(colors.bg, colors.text, "shadow-md focus-visible:ring-slate-400")
                    : cn(
                        "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        "focus-visible:ring-slate-400"
                      )
              )}
            >
              {type === "all" ? "All" : type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
