import type { IndicatorType } from "../types/IndicatorTypeType";

export function mapIndicatorType(raw: Record<string, unknown>): IndicatorType {
    return {
        id: raw.id as number,
        name: raw.name as string,
        is_bottom_up: (raw.is_bottom_up as boolean | undefined) ?? true,
    }
}

export function mapIndicatorTypes(rawList: unknown[]): IndicatorType[]{
    return rawList.map((raw) => mapIndicatorType(raw as Record<string, unknown>));
}
