import { useState, useCallback } from "react";

export default function useCompare() {
  const [selected, setSelected] = useState([]);

  const toggleCompare = useCallback((pokemon) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === pokemon.id);
      if (exists) return prev.filter((p) => p.id !== pokemon.id);
      if (prev.length >= 2) return [prev[1], pokemon];
      return [...prev, pokemon];
    });
  }, []);

  const clearCompare = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (id) => selected.some((p) => p.id === id),
    [selected]
  );

  return { selected, toggleCompare, clearCompare, isSelected };
}
