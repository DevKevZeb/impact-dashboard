import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useEmbedMode(): boolean {
  const [searchParams] = useSearchParams();

  const isEmbedded = useMemo<boolean>(() => {
    return searchParams.get('embed') === 'true';
  }, [searchParams]);

  return isEmbedded;
}