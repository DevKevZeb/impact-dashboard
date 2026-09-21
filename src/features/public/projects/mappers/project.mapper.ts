import type { Project, ProjectCard } from "../types/project.type";

export function mapProjectCard(raw: Record<string, unknown>): ProjectCard {
    return {
        id: raw.id as number,
        name: raw.name as string,
        description: raw.description as string,
        project_url: raw.project_url as string
    }
}

export function mapProjectCards(rawList: unknown[]): ProjectCard[]{
    return rawList.map((raw) => mapProjectCard(raw as Record<string, unknown>));
}

export function mapProject(raw: Record<string, unknown>): Project{
    return {
        id: raw.id as number,
        name: raw.name as string,
        description: raw.description as string,
        project_url: raw.project_url as string,
        start_date: raw.start_date as Project["start_date"],
        end_date: raw.end_date as Project["end_date"],
        progress: raw.progress as number,
        comments: raw.comments as string,
        budget: raw.budget as number,
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
