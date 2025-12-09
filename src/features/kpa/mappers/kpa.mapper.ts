import type { Kpa } from "../types/KpaType";

export function mapKpa(raw: any): Kpa {
    return {
        id: raw.id,
        name: raw.name,
        implementation: raw.implementation
    }
}

export function mapKpas(rawList: any[]): Kpa[]{
    return rawList.map(mapKpa)
}