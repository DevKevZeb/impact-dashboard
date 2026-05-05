import type { Kpa, KpaProject } from "../types/KpaType";

export function mapKpa(raw: any): Kpa {
    return {
        id: raw.id,
        name: raw.name,
        implementation: raw.implementation,
    }
}

export function mapKpas(rawList: any[]): Kpa[]{
    return rawList.map(mapKpa)
}

export function mapKpaProject(raw: any): KpaProject {
    return {
        id: raw.id,
        name: raw.name,
        numbering: raw.numbering,
        strategic_outputs_count: raw.strategic_outputs_count
    }
}

export function mapKpasProject(rawList: any[]): KpaProject[]{
    return rawList.map(mapKpaProject)
}