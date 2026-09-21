import type { StrategicOutput, StrategicOutputCountry } from "../types/StrategicOutput";

export function mapStrategicOutput(raw: Record<string, unknown>): StrategicOutput {
  return {
    id: raw.id as number,
    name: raw.name as string,
    numbering: raw.numbering as string,
    country_kpa_id: raw.id_ck as number,
    measures_count: (raw.measures_count as number | undefined) ?? 0,
  }
}

export function mapStrategicOutputs(rawList: unknown[]): StrategicOutput[] {
  return rawList.map((raw) => mapStrategicOutput(raw as Record<string, unknown>));
}

export function mapStrategicOutputWithCountry(raw: Record<string, unknown>): StrategicOutputCountry{
  const countryKpa = raw.country_kpa as Record<string, unknown>;
  const country = countryKpa.country as Record<string, unknown>;

  return{
    id: raw.id as number,
    name: raw.name as string,
    numbering: raw.numbering as string,
    country: {
      id: country.id as number,
      name: country.name as string,
    },
    measures_count: (raw.measures_count as number | undefined) ?? 0
  }
}

export function mapStrategicOutputsWithCountry(rawList: unknown[]): StrategicOutputCountry[]{
  return rawList.map((raw) => mapStrategicOutputWithCountry(raw as Record<string, unknown>));
}
