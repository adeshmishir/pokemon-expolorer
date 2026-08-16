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
      <div className="flex flex-wrap justify-center gap-1.5">
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
                "inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 outline-none active:scale-95 sm:px-3.5 sm:text-xs",
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                type === "all"
                  ? isActive
                    ? "bg-[var(--color-pokedex-text)] text-[var(--color-pokedex-panel)] shadow-md focus-visible:ring-[var(--color-pokedex-muted)] dark:bg-[var(--color-pokedex-dark-text)] dark:text-[var(--color-pokedex-dark-bg)]"
                    : "border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] text-[var(--color-pokedex-muted)] hover:border-[var(--color-pokedex-subtle)] hover:text-[var(--color-pokedex-text)] focus-visible:ring-[var(--color-pokedex-muted)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:border-[var(--color-pokedex-dark-muted)] dark:hover:text-[var(--color-pokedex-dark-text)]"
                  : isActive
                    ? cn(colors.bg, colors.text, "shadow-md focus-visible:ring-[var(--color-pokedex-muted)]")
                    : cn(
                        "border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] text-[var(--color-pokedex-muted)]",
                        "hover:text-[var(--color-pokedex-text)]",
                        "focus-visible:ring-[var(--color-pokedex-muted)]",
                        "dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)] dark:text-[var(--color-pokedex-dark-muted)] dark:hover:text-[var(--color-pokedex-dark-text)]"
                      )
              )}
              style={
                !isActive && type !== "all"
                  ? {
                      borderColor: undefined,
                    }
                  : undefined
              }
            >
              {type === "all" ? "All" : type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
