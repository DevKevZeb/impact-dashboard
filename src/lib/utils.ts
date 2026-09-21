import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves an uploaded-file field (e.g. a program's `banner_img`, an SDG's
 * `image`) to a displayable URL. The real backend returns a relative storage
 * path (`sdg_images/foo.png`), which needs `${VITE_API_BASE_URL}/storage/`
 * prefixed - but demo mode's mocked data (and any future direct-URL source)
 * returns an already-absolute URL, which must NOT be re-prefixed or it 404s.
 */
export function resolveStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "")}/storage/${path}`;
}