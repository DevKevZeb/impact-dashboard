import type { Country } from "../types/country.type";

export function mapCountry(raw: any): Country {
    return {
        id: raw.id,
        name: raw.name
    }
}

export function mapCountries(rawList: any[]): Country[]{
    return rawList.map(mapCountry);
}