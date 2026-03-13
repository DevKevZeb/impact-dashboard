import { apiClient } from "@/shared/lib/axios";
import { mapKpasProject } from "@/features/kpa/mappers/kpa.mapper";
import { mapStrategicOutputsWithCountry } from "@/features/strategic-output/mappers/strategic-output.mapper";
import { mapMeasures } from "@/features/measures/mappers/measure.mapper";
import { mapIndicators } from "@/features/indicator/mappers/indicator.mapper";

interface FetchParams {
  query: string;
  page: number;
  limit: number;
}

export function fetchProgramKpasForSelect(programId: number) {
  return async ({ query, page, limit }: FetchParams) => {
    const { data } = await apiClient.get(
      `/projects/program/${programId}/kpas`,
      { params: { search: query || undefined, page, per_page: limit } }
    );

    return {
      items: mapKpasProject(data.data.kpas),
      hasMore: data.data.current_page < data.data.last_page,
    };
  };
}

export function fetchProgramStrategicOutputsForSelect(programId: number, kpaId: number) {
  return async ({ query, page, limit }: FetchParams) => {
    const { data } = await apiClient.get(
      `/projects/program/${programId}/kpas/${kpaId}/strategic-outputs`,
      { params: { search: query || undefined, page, per_page: limit } }
    );

    return {
      items: mapStrategicOutputsWithCountry(data.data.strategic_outputs),
      hasMore: data.data.current_page < data.data.last_page,
    };
  };
}

export function fetchProgramMeasuresForSelect(programId: number, strategicOutputId: number) {
  return async ({ query, page, limit }: FetchParams) => {
    const { data } = await apiClient.get(
      `/projects/program/${programId}/strategic-outputs/${strategicOutputId}/measures`,
      { params: { search: query || undefined, page, per_page: limit } }
    );

    return {
      items: mapMeasures(data.data.measures),
      hasMore: data.data.current_page < data.data.last_page,
    };
  };
}

export function fetchProgramIndicatorsForSelect(programId: number, measureId: number, excludedIds: number[] = []) {
  return async ({ query, page, limit }: FetchParams) => {
    const { data } = await apiClient.get(
      `/projects/program/${programId}/measures/${measureId}/indicators`,
      {
        params: {
          search: query || undefined,
          page,
          per_page: limit,
          exclude: excludedIds.length ? excludedIds : undefined,
        },
      }
    );

    return {
      items: mapIndicators(data.data.indicators),
      hasMore: data.data.current_page < data.data.last_page,
    };
  };
}
