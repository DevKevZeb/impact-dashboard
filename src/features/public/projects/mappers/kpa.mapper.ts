import type { KPA } from "../types/kpa.type";

export function mapKPA(raw: Record<string, unknown>): KPA {
    const source = (raw?.kpa ?? raw) as Record<string, unknown>;

    return {
        id: source.id as number,
        name: source.name as string
    }
}

export function mapKPAs(rawList: unknown[]): KPA[]{
    return rawList.map((raw) => mapKPA(raw as Record<string, unknown>));
}
