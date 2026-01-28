export interface Measure {
    id: number, 
    name: string,
    strategic_output_id?: number, 
    indicators_count: number
}

export interface CreateMeasureDTO {
    name: string,
    strategic_output_id: number, 
}

export interface UpdateMeasureDTO {
    id: number, 
    name: string,
    strategic_output_id: number, 
}