import { useEffect, useRef, useState } from "react";
import type { FetchOptions } from "./asyncSearch.type";

export function useAsyncSearch<T>( query: string, fetchOptions: FetchOptions<T>, getKey: (item: T) => string | number, getLabel?: (item: T) => string, enabled : boolean = true) {

  const normalizedQuery = query.trim();
  const requestIdRef = useRef(0);

  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchRef = useRef(fetchOptions);

  useEffect(() => {
    fetchRef.current = fetchOptions;
  }, [fetchOptions]);
  
  useEffect(() => {
    if (!enabled) return;

    setOptions([]);
    setPage(1);
    setHasMore(true);
  }, [normalizedQuery]);

  const hasMoreRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    fetchRef.current({ query: normalizedQuery, page, limit: 10 })
      .then((res) => {
        if (currentRequestId !== requestIdRef.current) return;
        setOptions((prev) => {
          const map = new Map<number | string, T>();
          prev.forEach((item) => map.set(getKey(item), item));
          res.items?.forEach((item) => map.set(getKey(item), item));
          return Array.from(map.values());
        });

        setHasMore(res.hasMore);
      })
      .finally(() => {
        if (currentRequestId === requestIdRef.current) setLoading(false);
      });
  }, [normalizedQuery, page, enabled]);

  const sortedOptions = getLabel ? sortByRelevance(options, normalizedQuery, getLabel) : options;
  return { options: sortedOptions, loading, hasMore, loadMore: () => {if (!loading && hasMoreRef.current) setPage((p) => p + 1);}};
}

function sortByRelevance<T>( items: T[], query: string, getLabel: (item: T) => string ): T[] {
  if (!query) return items;
  const q = query.toLowerCase();

  return [...items].sort((a, b) => {
    const aName = getLabel(a).toLowerCase();
    const bName = getLabel(b).toLowerCase();
    const aStarts = aName.startsWith(q);
    const bStarts = bName.startsWith(q);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    const aIndex = aName.indexOf(q);
    const bIndex = bName.indexOf(q);

    return aIndex - bIndex;
  });
}
