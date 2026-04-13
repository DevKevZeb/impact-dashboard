import { useQuery } from "@tanstack/react-query";
import { getAllKPAsImplementation } from "../services/progress.api";

export default function useAllKpasImplementation(countryId?: number){
    return useQuery({
        queryKey: ["allkpas", 'list', countryId],
        queryFn: () => getAllKPAsImplementation(countryId),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}