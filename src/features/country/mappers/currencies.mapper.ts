import type { Currency } from "../types/CurrencyType";

export function mapCurrency(raw: Record<string, unknown>): Currency {
    return {
        id: raw.id as number,
        code: raw.code as string
    }
}

export function mapCurrencies(rawList: unknown[]): Currency[]{
    return rawList.map((raw) => mapCurrency(raw as Record<string, unknown>));
}
