import { publicApiClient } from "@/shared/lib/axios.public";
import { mapKPAs } from "../../projects/mappers/kpa.mapper";
import type { FetchParams } from "../../projects/types/params.type";

export function fetchKPAsForSelect(){
    return async ({ query, page, limit }: FetchParams) => {
        const { data } = await publicApiClient.get(`/kpas?search=${encodeURIComponent(query)}&page=${page}&per_page=${limit}`);
        return {
            items: mapKPAs(data.data.kpas),
            hasMore: data.data.current_page < data.data.last_page
        }
    };    
}

