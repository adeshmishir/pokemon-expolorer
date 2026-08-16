export default function PokedexScanBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Dark scanner tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 via-transparent to-slate-900/5 dark:from-slate-900/15 dark:via-transparent dark:to-slate-900/15" />

      {/* Horizontal scan lines */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      }} />

      {/* Moving scan line */}
      <div className="animate-scan-line absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 h-8 w-8 border-l-2 border-t-2 border-green-500/30 dark:border-green-400/40" />
      <div className="absolute top-4 right-4 h-8 w-8 border-r-2 border-t-2 border-green-500/30 dark:border-green-400/40" />
      <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-green-500/30 dark:border-green-400/40" />
      <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-green-500/30 dark:border-green-400/40" />
    </div>
  );
}
