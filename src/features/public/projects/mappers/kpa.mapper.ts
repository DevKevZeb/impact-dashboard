import type { KPA } from "../types/kpa.type";

export function mapKPA(raw: any): KPA {
    const source = raw?.kpa ?? raw;

    return {
        id: source.id,
        name: source.name
    }
}

export function mapKPAs(rawList: any[]): KPA[]{
    return rawList.map(mapKPA);
}