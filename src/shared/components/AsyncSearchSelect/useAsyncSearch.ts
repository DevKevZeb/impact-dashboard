import { useEffect, useRef, useState } from "react";
import type { FetchOptions } from "./asyncSearch.type";

export function useAsyncSearch<T extends { id: number | string; name?: string }>(query: string,fetchOptions: FetchOptions<T>) {
  const normalizedQuery = query.trim();
  const requestIdRef = useRef(0);

  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOptions([]);
    setPage(1);
    setHasMore(true);
  }, [normalizedQuery]);

  useEffect(() => {
    if (!hasMore) return;
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    fetchOptions({ query: normalizedQuery, page, limit: 10 })
      .then((res) => {
        if (currentRequestId !== requestIdRef.current) return;
        setOptions((prev) => {
          const map = new Map<number | string, T>();
          prev.forEach((item) => map.set(item.id, item));
          res.items.forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });

        setHasMore(res.hasMore);
      })
      .finally(() => {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      });
  }, [normalizedQuery, page, fetchOptions, hasMore]);

  const sortedOptions = sortByRelevance(options, normalizedQuery);
  return { options: sortedOptions, loading, hasMore, loadMore: () => {if (!loading && hasMore) setPage((p) => p + 1);}};
}

function sortByRelevance<T extends { name?: string }>( items: T[], query: string ): T[] {
  if (!query) return items;
  const q = query.toLowerCase();

  return [...items].sort((a, b) => {
    const aName = (a.name ?? "").toLowerCase();
    const bName = (b.name ?? "").toLowerCase();
    const aStarts = aName.startsWith(q);
    const bStarts = bName.startsWith(q);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    const aIndex = aName.indexOf(q);
    const bIndex = bName.indexOf(q);

    return aIndex - bIndex;
  });
}
