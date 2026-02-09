export interface findDTO {
    country?: {
        id: number,
        name: string,
    },
    kpa?:{
        id: number,
        name: string,
    },
    strategic_output?:{
        id: number,
        name: string,
    },
    measure?:{
        id: number,
        name: string,
    },
    project_state?:{
        id: number,
        state: string,
    },
    search?: string,
}