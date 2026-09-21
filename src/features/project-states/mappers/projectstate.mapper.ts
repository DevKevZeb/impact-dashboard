import type { ProjectState } from "../types/projectstate.types";

export function mapProjectState(raw: Record<string, unknown>): ProjectState{
    return{
        id: raw.id as number,
        state: raw.state as string
    }
}

export function mapProjectStates(rawList: unknown[]): ProjectState[]{
    return rawList.map((raw) => mapProjectState(raw as Record<string, unknown>))
}
