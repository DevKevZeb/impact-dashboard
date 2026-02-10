import type { ProjectCard } from "../types/project.type";

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