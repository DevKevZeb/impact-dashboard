import type { Measure } from "../types/measureTypes";

export function mapMeasures(rawList: unknown[]): Measure[] {
  return rawList.map((raw) => mapMeasure(raw as Record<string, unknown>))
}


export function mapMeasure(raw: Record<string, unknown>): Measure {
  return {
    id: raw.id as number,
    name: raw.name as string,
    numbering: raw.numbering as string,
    strategic_output_id: raw.strategic_output_id as number,
    indicators_count: (raw.indicators_count as number | undefined) ?? 0
  }
}
