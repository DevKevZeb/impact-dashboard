import type { Project, ProjectCard } from "../types/project.type";

export function mapProjectCard(raw: any): ProjectCard {
    return {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        project_url: raw.project_url
    }
}

export function mapProjectCards(rawList: any[]): ProjectCard[]{
    return rawList.map(mapProjectCard);
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