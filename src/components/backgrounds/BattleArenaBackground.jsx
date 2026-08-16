export default function BattleArenaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Dark arena gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-blue-950/10 dark:from-red-950/20 dark:via-transparent dark:to-blue-950/20" />

      {/* Radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent dark:from-yellow-400/10" />

      {/* Grid floor */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-200/40 to-transparent dark:from-slate-800/30" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
}
