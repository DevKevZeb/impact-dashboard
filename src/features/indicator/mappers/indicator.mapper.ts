import type { Indicator } from "../types/indicatorTypes";

export function mapIndicators(rawList: any[]): Indicator[] {
  return rawList.map(mapIndicator);

}


export function mapIndicator(raw: any): Indicator {
  return {
    id: raw.id, 
    name: raw.name,
    target: raw.target,
    measure_id: raw.measure_id,
    type: {
      id: raw.type.id,
      name: raw.type.name
    }
  }
}