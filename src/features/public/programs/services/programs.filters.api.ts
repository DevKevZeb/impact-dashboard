import { publicApiClient } from "@/shared/lib/axios.public";

export async function fetchProgramStatesForSelect(params: {
  query: string;
  page: number;
  limit: number;
}) {
  const { query, page, limit } = params;
  const { data } = await publicApiClient.get(
    `/program-states?search=${encodeURIComponent(query)}&page=${page}&per_page=${limit}`
  );

  return {
    items: data.data.program_states,
    hasMore: data.data.current_page < data.data.last_page,
  };
}
