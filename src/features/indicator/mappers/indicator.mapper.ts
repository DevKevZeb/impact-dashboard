import type { Indicator } from "../types/indicatorTypes";

export function mapIndicators(rawList: any[]): Indicator[] {
  return rawList.map(mapIndicator);

}


export function mapIndicator(raw: any): Indicator {
  return {
    id: raw.id, 
    name: raw.name,
    target: raw.target,
    actual_value: raw.actual_value ?? 0,
    measure_id: raw.measure_id,
    type: {
      id: raw.type.id,
      name: raw.type.name,
      is_bottom_up: raw.type.is_bottom_up ?? true,
    }
  }
}