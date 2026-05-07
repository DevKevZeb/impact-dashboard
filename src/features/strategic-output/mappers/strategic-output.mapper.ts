import type { StrategicOutput, StrategicOutputCountry } from "../types/StrategicOutput";

export function mapStrategicOutput(raw: any): StrategicOutput {
  return {
    id: raw.id,
    name: raw.name,
    numbering: raw.numbering,
    country_kpa_id: raw.id_ck,
    measures_count: raw.measures_count ?? 0,
  }
}

export function mapStrategicOutputs(rawList: any[]): StrategicOutput[] {
  return rawList.map(mapStrategicOutput);
}

export function mapStrategicOutputWithCountry(raw: any): StrategicOutputCountry{

  return{
    id: raw.id,
    name: raw.name,
    numbering: raw.numbering,
    country: {
      id: raw.country_kpa.country.id,
      name: raw.country_kpa.country.name,
    },
    measures_count: raw.measures_count ?? 0
  }
}

export function mapStrategicOutputsWithCountry(rawList: any[]): StrategicOutputCountry[]{
  return rawList.map(mapStrategicOutputWithCountry);
}
