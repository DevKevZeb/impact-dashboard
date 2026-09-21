import type { Project, ProjectTable } from "../types/project.types";

export function mapProjectTable(raw: Record<string, unknown>): ProjectTable{
    return {
        id: raw.id as number,
        name: raw.name as string,
        description: raw.description as string,
        project_url: raw.project_url as string,
        start_date: raw.start_date as Date,
        end_date: raw.end_date as Date,
        progress: raw.progress as number,
        comments: raw.comments as string,
        budget: raw.budget as number,
        weight: raw.weight as number | undefined,
        state: raw.project_state as ProjectTable["state"],
        program_id: raw.program_id as number,
        can_edit: Boolean(raw.can_edit),
    }
}

export function mapProjectsTable(rawList: unknown[]): ProjectTable[]{
    return rawList.map((raw) => mapProjectTable(raw as Record<string, unknown>));
}

export function mapProject(raw: Record<string, unknown>): Project{
    return {
        id: raw.id as number,
        name: raw.name as string,
        description: raw.description as string,
        project_url: raw.project_url as string,
        start_date: raw.start_date as Date,
        end_date: raw.end_date as Date,
        progress: raw.progress as number,
        comments: raw.comments as string,
        budget: raw.budget as number,
        weight: raw.weight as number,
        contact: raw.contact as Project["contact"],
        beneficiary: raw.beneficiary as Project["beneficiary"],
        project_state: raw.project_state as Project["project_state"],
        kpa: raw.kpa as Project["kpa"],
        strategic_output: raw.strategic_output as Project["strategic_output"],
        measure: raw.measure as Project["measure"],
        donors: raw.donors as Project["donors"],
        agencies: raw.agencies as Project["agencies"],
        program_id: raw.program_id as number,
        indicators: raw.indicators as Project["indicators"],
    }
}

export function mapProjects(rawList: unknown[]): Project[]{
    console.log("Mapping projects from raw data:", rawList);
    return rawList.map((raw) => mapProject(raw as Record<string, unknown>));
}

export function mapProjectToForm(project: Project) {
  return {
    name: project.name,
    description: project.description,

    kpa: project.kpa ?? null,
    strategicOutput: project.strategic_output ? {...project.strategic_output, country: project.strategic_output.country_kpa?.country} : null,
    measure: project.measure ?? null,

    indicators: project.indicators ?? [],

    start_date: project.start_date ? new Date(project.start_date) : null,
    end_date: project.end_date ? new Date(project.end_date) : null,

    donors: project.donors?.map(d => ({
      ...d,
      contribution: Number(d.contribution),
    })) ?? [],

    agencies: project.agencies?.map(a => ({
      ...a,
      contribution: Number(a.contribution),
    })) ?? [],

    project_url: project.project_url || "",
    budget: Number(project.budget) || 0,
    weight: Number(project.weight) || 0,

    beneficiary: project.beneficiary ?? null,
    contact: project.contact,
    progress: Number(project.progress),
    project_state: project.project_state ?? null,

    program_id: project.program_id,
    comments: project.comments ?? "",
  };
}
