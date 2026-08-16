import LoadingSkeleton from "../ui/LoadingSkeleton";

export default function PokemonSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-pokedex-border)] bg-[var(--color-pokedex-panel)] dark:border-[var(--color-pokedex-dark-border)] dark:bg-[var(--color-pokedex-dark-panel)]">
      <div className="h-1.5 rounded-t-xl bg-[var(--color-pokedex-border)] dark:bg-[var(--color-pokedex-dark-border)]" />

      <div className="p-3 sm:p-4">
        <div className="mb-1 flex items-start justify-between">
          <LoadingSkeleton className="h-3 w-10" />
          <div className="flex gap-0.5">
            <LoadingSkeleton className="h-5 w-5 rounded-md" />
            <LoadingSkeleton className="h-5 w-5 rounded-md" />
          </div>
        </div>

        <div className="relative mx-auto mb-2 h-28 w-28 sm:h-32 sm:w-32">
          <div className="absolute inset-0 rounded-full bg-[var(--color-pokedex-surface)] dark:bg-[var(--color-pokedex-dark-bg)]" />
          <LoadingSkeleton className="relative h-full w-full rounded-full" />
        </div>

        <LoadingSkeleton className="mx-auto h-3.5 w-20" />

        <div className="mt-2 flex justify-center gap-1">
          <LoadingSkeleton className="h-5 w-14 rounded-md" />
          <LoadingSkeleton className="h-5 w-14 rounded-md" />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="text-center">
              <LoadingSkeleton className="mx-auto mb-0.5 h-1 w-full rounded-full" />
              <LoadingSkeleton className="mx-auto h-2 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
