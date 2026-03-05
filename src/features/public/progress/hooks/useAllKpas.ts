import { useQuery } from "@tanstack/react-query";
import { getAllKPAsImplementation } from "../services/progress.api";

export default function useAllKpasImplementation(){
    return useQuery({
        queryKey: ["allkpas", 'list'],
        queryFn: () => getAllKPAsImplementation(),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}