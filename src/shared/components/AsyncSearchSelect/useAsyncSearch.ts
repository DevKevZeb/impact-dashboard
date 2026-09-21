import { useEffect, useRef, useState } from "react";
import type { FetchOptions } from "./asyncSearch.type";
import { useSyncOnChange } from "@/shared/hooks/useDidChange";

export function useAsyncSearch<T>( query: string, fetchOptions: FetchOptions<T>, getKey: (item: T) => string | number, getLabel?: (item: T) => string, enabled : boolean = true) {

  const normalizedQuery = query.trim();
  const requestIdRef = useRef(0);

  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchRef = useRef(fetchOptions);
  const getKeyRef = useRef(getKey);

  useEffect(() => {
    fetchRef.current = fetchOptions;
  }, [fetchOptions]);

  useEffect(() => {
    getKeyRef.current = getKey;
  }, [getKey]);
  
  useSyncOnChange(normalizedQuery, () => {
    if (!enabled) return;

    setOptions([]);
    setPage(1);
    setHasMore(true);
  });

  const hasMoreRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    const currentRequestId = ++requestIdRef.current;
    // Intentionally NOT converted to render-time state adjustment like the
    // effect above: this kicks off a real network request (a genuine side
    // effect useEffect exists for), and `setLoading(true)` here just tracks
    // that request's in-flight state - not a pure derivation of changed props.
    // (Deliberately left as the one `react-hooks/set-state-in-effect` warning
    // in this codebase - see README/commit notes. Do NOT "fix" this by
    // wrapping in setTimeout(..., 0): that only delays the synchronous call
    // enough to dodge the linter, it doesn't change the underlying pattern,
    // and it introduces a real race - if the fetch resolves fast (e.g. this
    // app's mocked demo API), the .finally() below can call setLoading(false)
    // before a deferred setLoading(true) ever fires, leaving the spinner
    // stuck on `true`.)
    setLoading(true);

    fetchRef.current({ query: normalizedQuery, page, limit: 10 })
      .then((res) => {
        if (currentRequestId !== requestIdRef.current) return;
        setOptions((prev) => {
          const map = new Map<number | string, T>();
          prev.forEach((item) => map.set(getKeyRef.current(item), item));
          res.items?.forEach((item) => map.set(getKeyRef.current(item), item));
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
