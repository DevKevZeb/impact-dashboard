import { publicApiClient } from "@/shared/lib/axios.public";
import type { ProgressSelectedData } from "../types/progress.selected.type";

export async function getOverallData() {
    const { data } = await publicApiClient.get("/overall-implementation");
    return data.data;
}

export async function getAllKPAsImplementation(){
    const {data} = await publicApiClient.get("/allkpas-implementation");
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