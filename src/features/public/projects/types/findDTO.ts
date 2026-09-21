export interface findDTO {
    country?: {
        id: number,
        name: string,
    } | null,
    kpa?:{
        id: number,
        name: string,
    } | null,
    strategic_output?:{
        id: number,
        name: string,
    } | null,
    measure?:{
        id: number,
        name: string,
    } | null,
    project_state?:{
        id: number,
        state: string,
    } | null,
    search?: string | null,
    sort?: string,
}