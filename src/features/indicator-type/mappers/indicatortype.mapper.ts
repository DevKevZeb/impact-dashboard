import type { IndicatorType } from "../types/IndicatorTypeType";

export function mapIndicatorType(raw: any): IndicatorType {
    return {
        id: raw.id,
        name: raw.name,
        is_bottom_up: raw.is_bottom_up ?? true,
    }
}

export function mapIndicatorTypes(rawList: any[]): IndicatorType[]{
    return rawList.map(mapIndicatorType);
}