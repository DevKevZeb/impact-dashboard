import type { Kpa, KpaProject } from "../types/KpaType";

export function mapKpa(raw: Record<string, unknown>): Kpa {
    return {
        id: raw.id as number,
        name: raw.name as string,
        implementation: raw.implementation as number,
    }
}

export function mapKpas(rawList: unknown[]): Kpa[]{
    return rawList.map((raw) => mapKpa(raw as Record<string, unknown>))
}

export function mapKpaProject(raw: Record<string, unknown>): KpaProject {
    return {
        id: raw.id as number,
        name: raw.name as string,
        numbering: raw.numbering as string,
        strategic_outputs_count: raw.strategic_outputs_count as number
    }
}

export function mapKpasProject(rawList: unknown[]): KpaProject[]{
    return rawList.map((raw) => mapKpaProject(raw as Record<string, unknown>))
}
