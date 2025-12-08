import { useQuery } from "@tanstack/react-query";
import { getCountry } from "../../services/country.api";

export function useCountry(id: number){
    return useQuery({
        queryKey: ["agency", id],
        queryFn: () => getCountry(id),
        enabled: !!id
    })

}