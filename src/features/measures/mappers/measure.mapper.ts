import type { Measure } from "../types/measureTypes";

export function mapMeasures(rawList: any[]): Measure[] {
  return rawList.map(mapMeasure)
}


export function mapMeasure(raw: any): Measure {
  return {
    id: raw.id,
    name: raw.name,
    strategic_output_id: raw.strategic_output_id,
    indicators_count: raw.indicators_count ?? 0
  }
}
