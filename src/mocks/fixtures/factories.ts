/**
 * src/mocks/fixtures/factories.ts
 *
 * Small helpers that build response envelopes matching the REAL backend
 * shapes used across the app:
 *   - ApiResponse<T>  => { success, message, data }
 *   - paginated lists => { <listKey>: T[], current_page, last_page, per_page, total }
 */

export interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export function makeApiResponse<T>(data: T, message = "OK"): ApiResponseEnvelope<T> {
  return { success: true, message, data };
}

export function makeErrorResponse(message: string, errors?: Record<string, string[]>) {
  return {
    success: false,
    message,
    ...(errors ? { errors } : { data: [] }),
  };
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export function paginateArray<T>(items: T[], page: number, perPage: number): { pageItems: T[]; pagination: Pagination } {
  const safePerPage = perPage > 0 ? perPage : 10;
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / safePerPage));
  const safePage = Math.min(Math.max(1, page || 1), lastPage);
  const start = (safePage - 1) * safePerPage;
  const pageItems = items.slice(start, start + safePerPage);

  return {
    pageItems,
    pagination: {
      current_page: safePage,
      last_page: lastPage,
      per_page: safePerPage,
      total,
    },
  };
}

/**
 * Builds the flat "{ [listKey]: items[], current_page, last_page, per_page, total }"
 * shape that nearly every list endpoint in this codebase returns inside `data`.
 */
export function makeListPayload<T>(
  listKey: string,
  items: T[],
  page: number,
  perPage: number
): Record<string, unknown> {
  const { pageItems, pagination } = paginateArray(items, page, perPage);
  return {
    [listKey]: pageItems,
    ...pagination,
  };
}

export function makeSelectResult<T>(items: T[], page: number, limit: number): { items: T[]; hasMore: boolean } {
  const { pageItems, pagination } = paginateArray(items, page, limit);
  return {
    items: pageItems,
    hasMore: pagination.current_page < pagination.last_page,
  };
}

let nextFakeId = 100000;

/** Generates a fake, collision-free id for optimistic create responses. */
export function fakeId(): number {
  nextFakeId += 1;
  return nextFakeId;
}

export function matchesSearch(value: string | null | undefined, search: string): boolean {
  if (!search) return true;
  return (value ?? "").toLowerCase().includes(search.toLowerCase());
}

/**
 * Builds the nested-pagination shape used by a handful of endpoints, e.g.
 * `{ indicators: [...], pagination: { current_page, last_page, per_page, total } }`.
 */
export function makeNestedListPayload<T>(
  listKey: string,
  items: T[],
  page: number,
  perPage: number,
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  const { pageItems, pagination } = paginateArray(items, page, perPage);
  return {
    [listKey]: pageItems,
    pagination,
    ...extra,
  };
}

/** Parses `config.url` query string + any axios `params` object into one record of strings. */
export function parseQuery(url: string | undefined, params?: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  if (url) {
    const queryIndex = url.indexOf("?");
    if (queryIndex >= 0) {
      const search = new URLSearchParams(url.slice(queryIndex + 1));
      search.forEach((value, key) => {
        result[key] = value;
      });
    }
  }
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        result[key] = String(value);
      }
    });
  }
  return result;
}

/** Extracts the pathname (no query string) from a possibly-relative axios request url. */
export function pathOf(url: string | undefined): string {
  if (!url) return "";
  const queryIndex = url.indexOf("?");
  return queryIndex >= 0 ? url.slice(0, queryIndex) : url;
}

/** Parses a JSON or FormData request body (axios has already stringified plain objects by the time the mock adapter sees `config.data`). */
export function parseBody<T = Record<string, unknown>>(data: unknown): T {
  if (data == null) return {} as T;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      return {} as T;
    }
  }
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const obj: Record<string, unknown> = {};
    data.forEach((value, key) => {
      obj[key] = value;
    });
    return obj as T;
  }
  return data as T;
}

export function toInt(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
