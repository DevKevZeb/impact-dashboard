import type { StrategicOutput } from "../types/StrategicOutput";

export function mapStrategicOutput(raw: any): StrategicOutput {
  return {
    id: raw.id,
    name: raw.name,
    country_kpa_id: raw.id_ck,
    measures_count: raw.measures_count ?? 0,
  }
}

export function mapStrategicOutputs(rawList: any[]): StrategicOutput[] {
  return rawList.map(mapStrategicOutput)
}
