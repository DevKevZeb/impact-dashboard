import { useQuery } from "@tanstack/react-query";
import { getOverallData } from "../services/progress.api";

export default function useOverall(countryId?: number){
    return useQuery({
        queryKey: ["overall", 'list', countryId],
        queryFn: () => getOverallData(countryId),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}