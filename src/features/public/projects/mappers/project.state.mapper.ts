import type { ProjectState } from "../types/project.state.type";

export function mapProjectState(raw: any): ProjectState {
    return {
        id: raw.id,
        state: raw.state
    }
}

export function mapProjectStates(rawList: any[]): ProjectState[]{
    return rawList.map(mapProjectState);
}