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
    }
}

export function mapCountries(rawList: any[]): Country[]{
    return rawList.map(mapCountry);
}