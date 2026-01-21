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