import type { Currency } from "../types/CurrencyType";

export function mapCurrency(raw: any): Currency {
    return {
        id: raw.id,
        code: raw.code
    }
}

export function mapCurrencies(rawList: any[]): Currency[]{
    return rawList.map(mapCurrency);
}