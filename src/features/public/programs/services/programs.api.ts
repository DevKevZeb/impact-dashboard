import { publicApiClient } from "@/shared/lib/axios.public";
import type {
  ProgramFindDTO,
  PublicProgramCard,
  PublicProgramDetails,
  PublicProgramsPaginatedResponse,
} from "../types/findDTO";

export async function getPaginatedPrograms(
  page: number,
  perPage: number,
  filters: ProgramFindDTO
): Promise<PublicProgramsPaginatedResponse> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("per_page", String(perPage));

  if (filters.search.trim()) {
    params.append("search", filters.search.trim());
  }

  params.append("sort", filters.sort);

  const payload: Partial<ProgramFindDTO> = {};

  if (filters.country.id > 0) payload.country = filters.country;
  if (filters.kpa.id > 0) payload.kpa = filters.kpa;
  if (filters.strategic_output.id > 0) payload.strategic_output = filters.strategic_output;
  if (filters.measure.id > 0) payload.measure = filters.measure;
  if (filters.program_state.id > 0) payload.program_state = filters.program_state;

  const finalPayload = Object.keys(payload).length > 0 ? payload : {};

  const { data } = await publicApiClient.post(`/programs?${params.toString()}`, finalPayload);

  const programs: PublicProgramCard[] = data.data.programs.map((program: PublicProgramCard) => ({
    id: program.id,
    name: program.name,
    description: program.description,
    banner_img: program.banner_img,
    program_url: program.program_url,
    projects_count: program.projects_count,
  }));

  return {
    programs,
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total,
    },
  };
}

export async function getProgramById(programId: number): Promise<PublicProgramDetails> {
  const { data } = await publicApiClient.get(`/programs/${programId}`);
  const summary = data.data.program_summary ?? {};
  
  console.log("API Response for Program Details:", data); // Debug log to inspect the API response structure

  return {
    id: data.data.id,
    name: data.data.name,
    description: data.data.description,
    banner_img: data.data.banner_img ?? "",
    sdgs: data.data.sdgs ?? [],
    program_summary: {
      start_date: summary.start_date ?? "",
      end_date: summary.end_date ?? "",
      geographical_focus: summary.geographical_focus ?? [],
      beneficiaries: summary.beneficiaries ?? [],
      status: summary.status ?? "",
      donors: summary.donors ?? [],
      budget: Number(summary.budget ?? 0),
      implementing_agencies: summary.implementing_agencies ?? [],
      contact_person: {
        id: summary.contact_person?.id ?? 0,
        first_name: summary.contact_person?.first_name ?? "",
        last_name: summary.contact_person?.last_name ?? "",
        title: summary.contact_person?.title ?? "",
        email: summary.contact_person?.email ?? "",
        phone: summary.contact_person?.phone ?? "",
      },
    },
  };
}
