export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] py-5 dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-surface)]">
      <div className="mx-auto w-full max-w-6xl px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-pokedex-subtle)] dark:text-[var(--color-pokedex-dark-muted)]">
          Data provided by PokéAPI
        </p>
      </div>
    </footer>
  );
}
