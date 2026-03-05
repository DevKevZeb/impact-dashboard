import { useQuery } from "@tanstack/react-query";
import { getOverallData } from "../services/progress.api";

export default function useOverall(){
    return useQuery({
        queryKey: ["overall", 'list'],
        queryFn: () => getOverallData(),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}