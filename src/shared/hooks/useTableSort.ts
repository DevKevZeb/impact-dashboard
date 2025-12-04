import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export function useTableSort<T>(data: T[], initialKey?: keyof T) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialKey || null,
    direction: initialKey ? "asc" : null, // Si hay key inicial, ordenar ascendente
  });

  const sortedData = useMemo(() => {
    // Si no hay datos, retornar array vacío
    if (!data || data.length === 0) {
      return [];
    }

    // Si no hay configuración de sorting, retornar datos originales
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare values
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key: direction ? key : null, direction });
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
  };
}
