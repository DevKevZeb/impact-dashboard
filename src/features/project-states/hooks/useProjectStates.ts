import { useQuery } from "@tanstack/react-query";
import { getProjectStatesPaginated } from "../service/projectstate.api";

export function useProjectStates(page: number, perPage:number) {
    return useQuery({
        queryKey: ['project-states', page, perPage],
        queryFn: () => getProjectStatesPaginated(page, perPage)
    })
}