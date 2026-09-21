import { publicApiClient } from "@/shared/lib/axios.public";
import type { StatisticsOverview } from "../types/statistics.types";

export async function getStatisticsOverview(): Promise<StatisticsOverview> {
  const { data } = await publicApiClient.get("/statistics-overview");
  return data.data;
}
