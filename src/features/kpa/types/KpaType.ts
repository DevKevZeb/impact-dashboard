export interface Kpa{
    id: number,
    name: string,
    implementation: number
}

export interface KpaProject{
    id: number,
    name: string,
    implementation: number,
    strategic_outputs_count: number,
}

export interface CreateKpaDto{
    name: string, 
    implementation:number
}

export interface CreateKpaDto{
    name: string, 
    implementation:number
}

export interface UpdateKpaDto{
    name?: string, 
    implementation?:number
}