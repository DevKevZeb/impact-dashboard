export interface StrategicOutput {
    id: number,
    name: string,
    country_kpa_id: number
    measures_count: number
}

export interface  CreateStrategicOutputDTO {
    name: string,
    country_kpa_id: number
}


export interface  UpdateStrategicOutputDTO {
    id: number,
    name: string,
    country_kpa_id: number
}