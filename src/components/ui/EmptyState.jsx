export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div
      role="status"
      className="animate-fade-in flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800"
    >
      {Icon && <Icon className="h-10 w-10 text-slate-300 dark:text-slate-500" aria-hidden="true" />}
      <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}
