import type { Measure } from "../types/measure.type";

export function mapMeasure(raw: Record<string, unknown>): Measure {
    return {
        id: raw.id as number,
        name: raw.name as string
    }
}

export function mapMeasures(rawList: unknown[]): Measure[]{
    return rawList.map((raw) => mapMeasure(raw as Record<string, unknown>));
}
