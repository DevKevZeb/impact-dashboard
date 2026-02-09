import type { KPA } from "../types/kpa.type";

export function mapKPA(raw: any): KPA {
    return {
        id: raw.id,
        name: raw.name
    }
}

export function mapKPAs(rawList: any[]): KPA[]{
    return rawList.map(mapKPA);
}