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
  filters: ProgramFindDTO | null
): Promise<PublicProgramsPaginatedResponse> {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("per_page", String(perPage));

  if (filters?.search?.trim()) {
    params.append("search", filters.search.trim());
  }

  params.append("sort", filters?.sort ?? "date_newest");

  const payload: Partial<ProgramFindDTO> = {};

  if (filters?.country) payload.country = filters.country;
  if (filters?.kpa) payload.kpa = filters.kpa;
  if (filters?.strategic_output) payload.strategic_output = filters.strategic_output;
  if (filters?.measure) payload.measure = filters.measure;
  if (filters?.program_state) payload.program_state = filters.program_state;

  const finalPayload = Object.keys(payload).length > 0 ? payload : null;

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

  return {
    id: data.data.id,
    name: data.data.name,
    description: data.data.description,
    banner_img: data.data.banner_img,
    sdgs: data.data.sdgs ?? [],
    program_summary: {
      start_date: summary.start_date ?? null,
      end_date: summary.end_date ?? null,
      geographical_focus: summary.geographical_focus ?? [],
      beneficiaries: summary.beneficiaries ?? [],
      status: summary.status ?? null,
      donors: summary.donors ?? [],
      budget: Number(summary.budget ?? 0),
      implementing_agencies: summary.implementing_agencies ?? [],
      contact_person: {
        id: summary.contact_person?.id ?? null,
        first_name: summary.contact_person?.first_name ?? null,
        last_name: summary.contact_person?.last_name ?? null,
        title: summary.contact_person?.title ?? null,
        email: summary.contact_person?.email ?? null,
        phone: summary.contact_person?.phone ?? null,
      },
    },
  };
}
