import { publicApiClient } from "@/shared/lib/axios.public";
import { mapCountries } from "../mappers/country.mapper";
import { mapKPAs } from "../mappers/kpa.mapper";
import type { FetchParams } from "../types/params.type";
import { mapStrategicOutputs } from "../mappers/strategic.output.mapper";
import { mapMeasures } from "../mappers/measure.mapper";
import { mapProjectStates } from "../mappers/project.state.mapper";

export async function getCountriesPaginated(search: string, page: number, per_page: number){
    const { data } = await publicApiClient.get(`/countries?search=${encodeURIComponent(search)}&page=${page}&per_page=${per_page}&active=true`);
    return {
        countries: mapCountries(data.data.countries),
        pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total
      }
    }
}

export async function fetchCountriesForSelect(params: { query: string; page: number; limit: number; }){
    const { query, page, limit } = params;
    const res = await getCountriesPaginated(query, page,limit);

    return {
        items: res.countries,
        hasMore: res.pagination.current_page < res.pagination.last_page,
    }
}

export async function getKPAsPaginated(search: string, page: number, per_page: number, id: number){
    const { data } = await publicApiClient.get(`/kpas/${id}?search=${encodeURIComponent(search)}&page=${page}&per_page=${per_page}`);
    return {
        kpas: mapKPAs(data.data.kpas),
        pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total
      }
    }
}

export function fetchKPAsForSelect(id: number){
    return async ({ query, page, limit }: FetchParams) => {
        const { data } = await publicApiClient.get(`/kpas/${id}?search=${encodeURIComponent(query)}&page=${page}&per_page=${limit}`);
        return {
            items: mapKPAs(data.data.kpas),
            hasMore: data.data.current_page < data.data.last_page
        }
    };    
}

export function fetchStrategicOutputsForSelect(id: number){
    return async ({ query, page, limit }: FetchParams) => {
        const { data } = await publicApiClient.get(`/strategic-outputs/${id}?search=${encodeURIComponent(query)}&page=${page}&per_page=${limit}`);
        return {
            items: mapStrategicOutputs(data.data.strategic_outputs),
            hasMore: data.data.current_page < data.data.last_page
        }
    };    
}

export function fetchMeasuresForSelect(id: number){
    return async ({ query, page, limit }: FetchParams) => {
        const { data } = await publicApiClient.get(`/measures/${id}?search=${encodeURIComponent(query)}&page=${page}&per_page=${limit}`);
        return {
            items: mapMeasures(data.data.measures),
            hasMore: data.data.current_page < data.data.last_page
        }
    };    
}

export async function fetchProjectStatesForSelect(params: {query: string; page: number; limit: number; }){
    const { query, page, limit } = params;
    const { data } = await publicApiClient.get(`/project-states?search=${encodeURIComponent(query)}&page=${page}&per_page=${limit}`);
    return {
        items: mapProjectStates(data.data.project_states),
        hasMore: data.data.current_page < data.data.last_page
    }
}