import { cn } from "../../utils/cn";

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div
      role="status"
      className="animate-fade-in flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)]/50 p-12 text-center dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]/50"
    >
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]">
          <Icon className="h-7 w-7 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" aria-hidden="true" />
        </div>
      )}
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">{title}</p>
        {description && <p className="mt-1.5 text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">{description}</p>}
      </div>
    </div>
  );
}
