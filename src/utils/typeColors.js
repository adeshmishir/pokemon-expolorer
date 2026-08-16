const TYPE_COLORS = {
  normal:   { bg: "bg-stone-400",   text: "text-white",      border: "border-stone-300" },
  fire:     { bg: "bg-orange-500",  text: "text-white",      border: "border-orange-300" },
  water:    { bg: "bg-blue-500",    text: "text-white",      border: "border-blue-300" },
  electric: { bg: "bg-yellow-400",  text: "text-yellow-900", border: "border-yellow-300" },
  grass:    { bg: "bg-green-500",   text: "text-white",      border: "border-green-300" },
  ice:      { bg: "bg-cyan-300",    text: "text-cyan-900",   border: "border-cyan-200" },
  fighting: { bg: "bg-red-600",     text: "text-white",      border: "border-red-300" },
  poison:   { bg: "bg-purple-500",  text: "text-white",      border: "border-purple-300" },
  ground:   { bg: "bg-amber-600",   text: "text-white",      border: "border-amber-300" },
  flying:   { bg: "bg-indigo-400",  text: "text-white",      border: "border-indigo-300" },
  psychic:  { bg: "bg-pink-500",    text: "text-white",      border: "border-pink-300" },
  bug:      { bg: "bg-lime-500",    text: "text-white",      border: "border-lime-300" },
  rock:     { bg: "bg-yellow-700",  text: "text-white",      border: "border-yellow-500" },
  ghost:    { bg: "bg-purple-700",  text: "text-white",      border: "border-purple-400" },
  dragon:   { bg: "bg-indigo-600",  text: "text-white",      border: "border-indigo-400" },
  dark:     { bg: "bg-slate-700",   text: "text-white",      border: "border-slate-500" },
  steel:    { bg: "bg-slate-400",   text: "text-white",      border: "border-slate-300" },
  fairy:    { bg: "bg-pink-300",    text: "text-pink-900",   border: "border-pink-200" },
};

const DEFAULT_COLORS = { bg: "bg-slate-200", text: "text-slate-700", border: "border-slate-100" };

export function getTypeColors(type) {
  return TYPE_COLORS[type] || DEFAULT_COLORS;
}
