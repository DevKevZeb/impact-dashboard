export interface PaginatedResult<T>{
    items: T[];
    hasMore: boolean;
}

export type FetchOptions<T> = (params: {  query: string;  page: number;  limit: number;}) => Promise<PaginatedResult<T>>;

export interface AsyncSearchSelectProps<T>{
    value: T | null;
    onChange: (value: T | null) => void;
    fetchOptions: FetchOptions<T>;
    getOptionLabel: (option: T) => string;
    getOptionKey: (option: T) => string | number;
    placeholder?: string;
    emptyMessage?: string;
    disable?: boolean;
}

