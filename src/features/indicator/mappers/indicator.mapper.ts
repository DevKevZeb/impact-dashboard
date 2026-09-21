import type { Indicator } from "../types/indicatorTypes";

export function mapIndicators(rawList: unknown[]): Indicator[] {
  return rawList.map((raw) => mapIndicator(raw as Record<string, unknown>));

}


export function mapIndicator(raw: Record<string, unknown>): Indicator {
  const type = raw.type as Record<string, unknown>;
  return {
    id: raw.id as number,
    name: raw.name as string,
    target: raw.target as number,
    actual_value: (raw.actual_value as number | undefined) ?? 0,
    measure_id: raw.measure_id as number,
    type: {
      id: type.id as number,
      name: type.name as string,
      is_bottom_up: (type.is_bottom_up as boolean | undefined) ?? true,
    }
  }
}
