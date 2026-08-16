export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div
      role="status"
      className="animate-fade-in flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] p-10 text-center dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]"
    >
      {Icon && <Icon className="h-8 w-8 text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]" aria-hidden="true" />}
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">{title}</p>
        {description && <p className="mt-1 text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">{description}</p>}
      </div>
    </div>
  );
}
