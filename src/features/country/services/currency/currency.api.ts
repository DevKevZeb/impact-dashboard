import { apiClient } from "@/shared/lib/axios";
import { mapCurrencies } from "../../mappers/currencies.mapper";

export async function getCurrencies(){
    const { data } = await apiClient.get('/currencies');

    return {
        currencies: mapCurrencies(data.data.currencies)
    }
}