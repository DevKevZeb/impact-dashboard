import type { Measure } from "../types/measure.type";

export function mapMeasure(raw: any): Measure {
    return {
        id: raw.id,
        name: raw.name
    }
}

export function mapMeasures(rawList: any[]): Measure[]{
    return rawList.map(mapMeasure);
}