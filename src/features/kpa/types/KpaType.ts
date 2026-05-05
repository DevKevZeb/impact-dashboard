export interface Kpa{
    id: number,
    name: string,
    implementation: number,
}

export interface KpaProject{
    id: number,
    name: string,
    strategic_outputs_count: number,
}

export interface CreateKpaDto{
    name: string
}

export interface UpdateKpaDto{
    name?: string
}