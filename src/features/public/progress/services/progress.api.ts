import { publicApiClient } from "@/shared/lib/axios.public";
import type { ProgressSelectedData } from "../types/progress.selected.type";

export async function getOverallData(countryId?: number) {
    const endpoint = countryId 
        ? `/country-overall-implementation/${countryId}` 
        : "/overall-implementation";
    const { data } = await publicApiClient.get(endpoint);
    return data.data;
}

export async function getAllKPAsImplementation(countryId?: number){
    const endpoint = countryId 
        ? `/country-allkpas-implementation/${countryId}` 
        : "/allkpas-implementation";
    const {data} = await publicApiClient.get(endpoint);
    return data.data;
}

export async function getKpaImplementation(kpaId: number): Promise<ProgressSelectedData> {
    const { data } = await publicApiClient.get(`/kpa-implementation/${kpaId}`);
    return data.data;
}

export async function getStrategicOutputImplementation(strategicOutputId: number): Promise<ProgressSelectedData> {
    const { data } = await publicApiClient.get(`/strategic-output-implementation/${strategicOutputId}`);
    return data.data;
}

export async function getMeasureImplementation(measureId: number): Promise<ProgressSelectedData> {
    const { data } = await publicApiClient.get(`/measure-implementation/${measureId}`);
    return data.data;
}

export async function getCountryOverallImplementation(countryId: number): Promise<ProgressSelectedData> {
    const { data } = await publicApiClient.get(`/country-overall-implementation/${countryId}`);
    return data.data;
}
