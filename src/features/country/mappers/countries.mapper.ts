import type { Country } from "../types/CountryType";

export function mapCountry(raw: any): Country {
    return {
        id: raw.id,
        name: raw.name,
        currency: {
            id: raw.currency.id,
            code: raw.currency.code,
        }
    }
}

export function mapCountries(rawList: any[]): Country[]{
    return rawList.map(mapCountry);
}