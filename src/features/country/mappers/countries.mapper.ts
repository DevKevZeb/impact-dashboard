import type { Country } from "../types/CountryType";

export function mapCountry(raw: Record<string, unknown>): Country {
    const currency = raw.currency as Record<string, unknown>;
    return {
        id: raw.id as number,
        name: raw.name as string,
        currency: {
            id: currency.id as number,
            code: currency.code as string,
        },
        kpas_count: raw.kpas_count as number | undefined,
        strategic_outputs_count: raw.strategic_outputs_count as number | undefined,
        measures_count: raw.measures_count as number | undefined,
        indicators_count: raw.indicators_count as number | undefined
    }
}

export function mapCountries(rawList: unknown[]): Country[]{
    return rawList.map((raw) => mapCountry(raw as Record<string, unknown>));
}
