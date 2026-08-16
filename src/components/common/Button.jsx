import { cn } from "../../utils/cn";

export default function Button({ className, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-pokeball-red)] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
