import { publicApiClient } from "@/shared/lib/axios.public";

export async function getOverallData() {
    const { data } = await publicApiClient.get("/overall-implementation");
    console.log(data);
    return data.data;
}