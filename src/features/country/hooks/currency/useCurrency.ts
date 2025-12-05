import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "../../services/currency/currency.api";

export function useCurrencies(){
    return useQuery({
        queryKey: ["currencies"],
        queryFn: () => getCurrencies()
    });
}