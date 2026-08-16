import LoadingSkeleton from "../ui/LoadingSkeleton";

export default function PokemonSkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="h-1.5 rounded-t-2xl bg-slate-100 dark:bg-slate-700" />

      <div className="p-4">
        <div className="relative mx-auto mb-3 h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-slate-50 dark:bg-slate-700" />
          <LoadingSkeleton className="relative h-full w-full rounded-full" />
        </div>

        <LoadingSkeleton className="mx-auto h-3 w-12" />
        <LoadingSkeleton className="mx-auto mt-2 h-5 w-20" />

        <div className="mt-2.5 flex justify-center gap-1.5">
          <LoadingSkeleton className="h-6 w-14 rounded-full" />
          <LoadingSkeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}
