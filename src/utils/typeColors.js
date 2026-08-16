const TYPE_COLORS = {
  normal:   { bg: "bg-stone-400",   text: "text-white",      border: "border-stone-300",   hex: "#a8a878" },
  fire:     { bg: "bg-orange-500",  text: "text-white",      border: "border-orange-300",  hex: "#f08030" },
  water:    { bg: "bg-blue-500",    text: "text-white",      border: "border-blue-300",    hex: "#6890f0" },
  electric: { bg: "bg-yellow-400",  text: "text-yellow-900", border: "border-yellow-300",  hex: "#f8d030" },
  grass:    { bg: "bg-green-500",   text: "text-white",      border: "border-green-300",   hex: "#78c850" },
  ice:      { bg: "bg-cyan-300",    text: "text-cyan-900",   border: "border-cyan-200",    hex: "#98d8d8" },
  fighting: { bg: "bg-red-600",     text: "text-white",      border: "border-red-300",     hex: "#c03028" },
  poison:   { bg: "bg-purple-500",  text: "text-white",      border: "border-purple-300",  hex: "#a040a0" },
  ground:   { bg: "bg-amber-600",   text: "text-white",      border: "border-amber-300",   hex: "#e0c068" },
  flying:   { bg: "bg-indigo-400",  text: "text-white",      border: "border-indigo-300",  hex: "#a890f0" },
  psychic:  { bg: "bg-pink-500",    text: "text-white",      border: "border-pink-300",    hex: "#f85888" },
  bug:      { bg: "bg-lime-500",    text: "text-white",      border: "border-lime-300",    hex: "#a8b820" },
  rock:     { bg: "bg-yellow-700",  text: "text-white",      border: "border-yellow-500",  hex: "#b8a038" },
  ghost:    { bg: "bg-purple-700",  text: "text-white",      border: "border-purple-400",  hex: "#705898" },
  dragon:   { bg: "bg-indigo-600",  text: "text-white",      border: "border-indigo-400",  hex: "#7038f8" },
  dark:     { bg: "bg-slate-700",   text: "text-white",      border: "border-slate-500",   hex: "#705848" },
  steel:    { bg: "bg-slate-400",   text: "text-white",      border: "border-slate-300",   hex: "#b8b8d0" },
  fairy:    { bg: "bg-pink-300",    text: "text-pink-900",   border: "border-pink-200",    hex: "#ee99ac" },
};

const DEFAULT_COLORS = { bg: "bg-slate-200", text: "text-slate-700", border: "border-slate-100", hex: "#a8a878" };

export function getTypeColors(type) {
  return TYPE_COLORS[type] || DEFAULT_COLORS;
}

// Type effectiveness chart: TYPE_CHART[attacking][defending] = multiplier
export const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};
