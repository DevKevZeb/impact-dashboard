import { useQuery } from "@tanstack/react-query";
import { getProjectStatesPaginated } from "../service/projectstate.api";

export function useProjectStates(page: number, perPage:number, search: string) {
    return useQuery({
        queryKey: ['project-states', page, perPage, search],
        queryFn: () => getProjectStatesPaginated(page, perPage, search),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}