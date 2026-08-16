export default function Footer() {
  return (
    <footer className="mb-16 border-t border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)]/60 py-5 backdrop-blur-sm dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-surface)]/60 sm:mb-0">
      <div className="mx-auto w-full max-w-6xl px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-pokedex-text)] dark:border-[var(--color-pokedex-dark-text)]">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-pokeball-red)]" />
            <span className="absolute inset-x-0 top-1/2 h-[1px] bg-[var(--color-pokedex-text)] dark:bg-[var(--color-pokedex-dark-text)]" />
            <span className="absolute inset-0 m-auto h-1 w-1 rounded-full border border-[var(--color-pokedex-text)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-text)] dark:bg-[var(--color-pokedex-dark-surface)]" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
            Data provided by PokéAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
