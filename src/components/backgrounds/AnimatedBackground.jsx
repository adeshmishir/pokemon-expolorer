export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-blue-50/30 to-transparent dark:from-blue-950/20 dark:via-transparent dark:to-transparent" />

      {/* Floating clouds */}
      <svg className="animate-cloud absolute top-[8%] left-0 h-16 w-32 text-sky-200/50 dark:text-blue-800/20" style={{ "--duration": "45s", "--delay": "0s" }} viewBox="0 0 120 40" fill="currentColor">
        <ellipse cx="60" cy="25" rx="50" ry="14" />
        <ellipse cx="35" cy="18" rx="25" ry="16" />
        <ellipse cx="80" cy="20" rx="22" ry="12" />
      </svg>
      <svg className="animate-cloud absolute top-[18%] left-0 h-12 w-24 text-sky-200/40 dark:text-blue-800/15" style={{ "--duration": "55s", "--delay": "12s" }} viewBox="0 0 120 40" fill="currentColor">
        <ellipse cx="60" cy="25" rx="50" ry="14" />
        <ellipse cx="40" cy="18" rx="28" ry="15" />
      </svg>
      <svg className="animate-cloud absolute top-[30%] left-0 h-10 w-20 text-sky-200/30 dark:text-blue-800/10" style={{ "--duration": "65s", "--delay": "25s" }} viewBox="0 0 120 40" fill="currentColor">
        <ellipse cx="60" cy="25" rx="50" ry="14" />
        <ellipse cx="70" cy="17" rx="20" ry="13" />
      </svg>

      {/* Grass / ground gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-green-100/50 to-transparent dark:from-green-900/10" />

      {/* Dot pattern overlay */}
      <div className="pokedex-bg absolute inset-0 opacity-20 dark:opacity-10" />
    </div>
  );
}
