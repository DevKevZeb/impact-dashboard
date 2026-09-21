import type { Country } from "../types/country.type";

export function mapCountry(raw: Record<string, unknown>): Country {
    return {
        id: raw.id as number,
        name: raw.name as string
    }
}

export function mapCountries(rawList: unknown[]): Country[]{
    return rawList.map((raw) => mapCountry(raw as Record<string, unknown>));
}
