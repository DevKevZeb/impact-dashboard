import type { Country } from "../types/CountryType";

export function mapCountry(raw: any): Country {
    return {
        id: raw.id,
        name: raw.name,
        currency: {
            id: raw.currency.id,
            code: raw.currency.code,
        },
        kpas_count: raw.kpas_count,
        strategic_outputs_count: raw.strategic_outputs_count,
        measures_count: raw.measures_count,
        indicators_count: raw.indicators_count
    }
}

export function mapCountries(rawList: any[]): Country[]{
    return rawList.map(mapCountry);
}