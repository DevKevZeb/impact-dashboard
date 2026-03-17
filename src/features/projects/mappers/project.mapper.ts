import type { Project, ProjectTable } from "../types/project.types";

export function mapProjectTable(raw: any): ProjectTable{
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        project_url: raw.project_url,
        start_date: raw.start_date,
        end_date: raw.end_date,
        progress: raw.progress,
        comments: raw.comments,
        budget: raw.budget,
        weight: raw.weight,
        state: raw.project_state,
        program_id: raw.program_id,
    }
}

export function mapProjectsTable(rawList: any[]): ProjectTable[]{
    return rawList.map(mapProjectTable);
}

export function mapProject(raw: any): Project{
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        project_url: raw.project_url,
        start_date: raw.start_date,
        end_date: raw.end_date,
        progress: raw.progress,
        comments: raw.comments,
        budget: raw.budget,
        weight: raw.weight,
        contact: raw.contact,
        beneficiary: raw.beneficiary,
        project_state: raw.project_state,
        kpa: raw.kpa,
        strategic_output: raw.strategic_output,
        measure: raw.measure,
        donors: raw.donors,
        agencies: raw.agencies,
        program_id: raw.program_id,
        indicators: raw.indicators,
    }
}

export function mapProjects(rawList: any[]): Project[]{
    console.log("Mapping projects from raw data:", rawList);
    return rawList.map(mapProject);
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
